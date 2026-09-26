-- ==============================================================================
-- DSK-SHOP: SUPABASE MIGRATION - ORDERS, ORDER_ITEMS, NOTIFICATIONS & REALTIME
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- (https://app.supabase.com/project/_/sql)
--
-- Ce script implémente de façon idempotente et sécurisée :
-- 1. Les tables orders, order_items et notifications selon le schéma exact requis
-- 2. La fonction PostgreSQL et le trigger AFTER INSERT sur orders pour générer automatiquement la notification
-- 3. La fonction RPC create_order_with_items pour garantir l'atomicité lors de la commande
-- 4. Les règles RLS (Row Level Security) sécurisées
-- 5. L'ajout des tables orders et notifications à la publication supabase_realtime
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRÉATION / AJUSTEMENT DE LA TABLE 'orders'
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    city TEXT DEFAULT 'Lomé',
    total_amount NUMERIC NOT NULL DEFAULT 0,
    currency TEXT DEFAULT 'XOF',
    payment_method TEXT DEFAULT 'cash_on_delivery',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);

-- ------------------------------------------------------------------------------
-- 2. CRÉATION / AJUSTEMENT DE LA TABLE 'order_items'
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    quantity INT4 NOT NULL DEFAULT 1,
    selected_variant TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index de relation
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ------------------------------------------------------------------------------
-- 3. CRÉATION / AJUSTEMENT DE LA TABLE 'notifications'
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'new_order',
    is_read BOOLEAN NOT NULL DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Si la table existait déjà avec une ancienne colonne 'read', migration sécurisée vers 'is_read'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'notifications' 
      AND column_name = 'read'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'notifications' 
      AND column_name = 'is_read'
  ) THEN
    ALTER TABLE public.notifications RENAME COLUMN read TO is_read;
  END IF;
END $$;

-- Index sur notifications
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- ------------------------------------------------------------------------------
-- 4. FONCTION POSTGRESQL & TRIGGER : NOTIFICATION AUTOMATIQUE SUR NOUVELLE COMMANDE
-- ------------------------------------------------------------------------------
-- Se déclenche UNIQUEMENT lors d'un INSERT sur 'orders' (jamais sur UPDATE)
CREATE OR REPLACE FUNCTION public.handle_new_order_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Éviter toute duplication de notification pour la même commande
  IF NOT EXISTS (
    SELECT 1 FROM public.notifications 
    WHERE (metadata->>'order_id')::text = NEW.id::text 
       OR (metadata->>'order_number')::text = NEW.order_number
  ) THEN
    INSERT INTO public.notifications (
      title,
      message,
      type,
      is_read,
      metadata,
      created_at
    ) VALUES (
      'Nouvelle commande',
      'Une nouvelle commande vient d''être reçue.',
      'new_order',
      false,
      jsonb_build_object(
        'order_id', NEW.id,
        'order_number', NEW.order_number,
        'customer_name', NEW.customer_name,
        'customer_phone', NEW.customer_phone,
        'total_amount', NEW.total_amount,
        'currency', NEW.currency,
        'payment_method', NEW.payment_method,
        'order_status', NEW.order_status
      ),
      NOW()
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Recréation propre et idempotente du trigger
DROP TRIGGER IF EXISTS trigger_notify_on_new_order ON public.orders;

CREATE TRIGGER trigger_notify_on_new_order
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_order_notification();

-- ------------------------------------------------------------------------------
-- 5. FONCTION RPC ATOMIQUE : CRÉATION DE COMMANDE AVEC SES ARTICLES (TRANSACTIONNEL)
-- ------------------------------------------------------------------------------
-- Empêche le problème d'une commande enregistrée sans ses articles.
-- Si l'insertion d'un article échoue, toute la transaction est annulée.
CREATE OR REPLACE FUNCTION public.create_order_with_items(
  p_order_number TEXT,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_shipping_address TEXT,
  p_city TEXT DEFAULT 'Lomé',
  p_total_amount NUMERIC DEFAULT 0,
  p_currency TEXT DEFAULT 'XOF',
  p_payment_method TEXT DEFAULT 'cash_on_delivery',
  p_payment_status TEXT DEFAULT 'pending',
  p_order_status TEXT DEFAULT 'pending',
  p_notes TEXT DEFAULT NULL,
  p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- 1. Validation de base
  IF p_customer_name IS NULL OR trim(p_customer_name) = '' THEN
    RAISE EXCEPTION 'Le nom du client est requis.';
  END IF;

  IF p_customer_phone IS NULL OR trim(p_customer_phone) = '' THEN
    RAISE EXCEPTION 'Le numéro de téléphone du client est requis.';
  END IF;

  IF p_shipping_address IS NULL OR trim(p_shipping_address) = '' THEN
    RAISE EXCEPTION 'L''adresse de livraison est requise.';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'La commande doit comporter au moins un article.';
  END IF;

  -- 2. Insertion dans 'orders'
  INSERT INTO public.orders (
    order_number,
    customer_name,
    customer_phone,
    shipping_address,
    city,
    total_amount,
    currency,
    payment_method,
    payment_status,
    order_status,
    notes
  ) VALUES (
    p_order_number,
    p_customer_name,
    p_customer_phone,
    p_shipping_address,
    COALESCE(p_city, 'Lomé'),
    p_total_amount,
    COALESCE(p_currency, 'XOF'),
    COALESCE(p_payment_method, 'cash_on_delivery'),
    COALESCE(p_payment_status, 'pending'),
    COALESCE(p_order_status, 'pending'),
    p_notes
  )
  RETURNING id INTO v_order_id;

  -- 3. Insertion des lignes dans 'order_items'
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    INSERT INTO public.order_items (
      order_id,
      product_id,
      product_name,
      unit_price,
      quantity,
      selected_variant
    ) VALUES (
      v_order_id,
      CASE 
        WHEN (v_item->>'product_id') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
        THEN (v_item->>'product_id')::uuid 
        ELSE gen_random_uuid() 
      END,
      v_item->>'product_name',
      COALESCE((v_item->>'unit_price')::numeric, 0),
      COALESCE((v_item->>'quantity')::int4, 1),
      v_item->>'selected_variant'
    );
  END LOOP;

  -- 4. Retour des informations au frontend
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', p_order_number
  );
EXCEPTION WHEN OTHERS THEN
  -- En cas d'erreur, rollback automatique de toute l'opération
  RAISE EXCEPTION 'Erreur transactionnelle create_order_with_items: %', SQLERRM;
END;
$$;

-- ------------------------------------------------------------------------------
-- 6. SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
-- RÈGLE DE SÉCURITÉ STRICTE :
-- 1. Les tables 'orders' et 'order_items' autorisent l'INSERT pour 'anon' et 'authenticated'.
-- 2. JAMAIS de SELECT public pour 'anon' : les commandes contiennent des données personnelles
--    (nom, téléphone, adresse, notes).
-- 3. Le frontend DSK-Shop génère l'UUID côté client avec crypto.randomUUID() et insère sans .select().
-- 4. Seuls les utilisateurs authentifiés (administrateurs / tableau de bord Nexa) peuvent lire les commandes.
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour 'orders'
-- Note : Si la policy INSERT existe déjà dans le projet, ne pas la recréer
DROP POLICY IF EXISTS "orders_select_policy" ON public.orders;
CREATE POLICY "orders_select_policy"
ON public.orders FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "orders_update_policy" ON public.orders;
CREATE POLICY "orders_update_policy"
ON public.orders FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Politiques pour 'order_items'
DROP POLICY IF EXISTS "order_items_select_policy" ON public.order_items;
CREATE POLICY "order_items_select_policy"
ON public.order_items FOR SELECT
TO authenticated
USING (true);

-- Politiques pour 'notifications'
DROP POLICY IF EXISTS "notifications_select_policy" ON public.notifications;
CREATE POLICY "notifications_select_policy"
ON public.notifications FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "notifications_update_policy" ON public.notifications;
CREATE POLICY "notifications_update_policy"
ON public.notifications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 7. CONFIGURATION DU REALTIME SUPABASE
-- ------------------------------------------------------------------------------
-- Ajout idempotent des tables à la publication 'supabase_realtime' sans écraser les autres tables
DO $$
BEGIN
  -- Ajout de 'orders'
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  -- Ajout de 'notifications'
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  END IF;
END $$;
