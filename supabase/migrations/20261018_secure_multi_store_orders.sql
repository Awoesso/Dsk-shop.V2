-- ==============================================================================
-- NEXA & DSK-SHOP: SECURE MULTI-TENANT ORDERS & HISTORICAL TRACEABILITY
-- Migration: 20261018_secure_multi_store_orders.sql
-- ==============================================================================
-- 1. Ajout de store_id avec contrainte ON DELETE RESTRICT pour garantir la
--    traçabilité permanente des commandes même en cas de tentative de suppression
-- 2. Fonction RPC transactionnelle SECURITY DEFINER avec validation serveur
--    stricte des produits et recalcul côté serveur des prix
-- 3. Aucun privilège laxiste WITH CHECK (true) pour le rôle public/anon
-- ==============================================================================

-- 1. Sécurisation et liaison multi-boutiques sur 'orders'
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id) ON DELETE RESTRICT;

-- Index pour accélérer les requêtes du tableau de bord vendeur Nexa
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_created ON public.orders(store_id, created_at DESC);

-- 2. Liaison multi-boutiques sur 'order_items'
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES public.stores(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS idx_order_items_store_id ON public.order_items(store_id);

-- 3. Fonction Transactionnelle Sécurisée : create_store_order
-- S'exécute en SECURITY DEFINER pour éviter d'exposer des droits d'insertion ouverts
-- au public tout en garantissant le calcul des prix et la validation en base.
CREATE OR REPLACE FUNCTION public.create_store_order(
    p_store_id UUID,
    p_customer_name TEXT,
    p_customer_phone TEXT,
    p_shipping_address TEXT,
    p_city TEXT DEFAULT 'Lomé',
    p_payment_method TEXT DEFAULT 'cash_on_delivery',
    p_notes TEXT DEFAULT NULL,
    p_items JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id UUID := gen_random_uuid();
    v_order_number TEXT;
    v_computed_total NUMERIC := 0;
    v_currency TEXT := 'XOF';
    v_store_status TEXT;
    v_store_name TEXT;
    v_item RECORD;
    v_product_db RECORD;
    v_item_qty INT4;
    v_item_subtotal NUMERIC;
BEGIN
    -- Validation 1 : Vérifier l'existence et l'état de la boutique
    SELECT status, name INTO v_store_status, v_store_name
    FROM public.stores
    WHERE id = p_store_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Boutique introuvable ou inexistante.';
    END IF;

    IF lower(v_store_status) NOT IN ('active', 'published') THEN
        RAISE EXCEPTION 'Cette boutique est actuellement fermée ou archivée. Les commandes ne sont pas autorisées.';
    END IF;

    -- Validation 2 : Vérifier les coordonnées client
    IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
        RAISE EXCEPTION 'Le nom du client est obligatoire (minimum 2 caractères).';
    END IF;

    IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) < 6 THEN
        RAISE EXCEPTION 'Le numéro de téléphone du client est obligatoire.';
    END IF;

    IF p_shipping_address IS NULL OR length(trim(p_shipping_address)) < 3 THEN
        RAISE EXCEPTION 'L''adresse de livraison est obligatoire.';
    END IF;

    -- Validation 3 : Vérifier le panier d'articles
    IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Le panier de commande est vide.';
    END IF;

    -- Génération d'un numéro de commande robuste et unique
    v_order_number := 'NX-' || to_char(NOW(), 'YYMMDD') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));

    -- Validation 4 & Calcul serveur des prix pour chaque article
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id UUID,
        quantity INT,
        selected_variant TEXT
    )
    LOOP
        v_item_qty := COALESCE(v_item.quantity, 1);
        IF v_item_qty <= 0 THEN
            RAISE EXCEPTION 'Quantité invalide pour l''article %', v_item.product_id;
        END IF;

        -- Lecture de la source de vérité en base de données (table products)
        SELECT id, name, price, store_id, in_stock, stock_count
        INTO v_product_db
        FROM public.products
        WHERE id = v_item.product_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Le produit ID % n''existe pas dans le catalogue.', v_item.product_id;
        END IF;

        -- Contrôle d'étanchéité multi-boutique : le produit doit appartenir à cette boutique
        IF v_product_db.store_id IS NOT NULL AND v_product_db.store_id <> p_store_id THEN
            RAISE EXCEPTION 'Le produit "%" (%) n''appartient pas à la boutique active.', v_product_db.name, v_product_db.id;
        END IF;

        -- Calcul strict côté serveur basé sur le prix stocké en base
        v_item_subtotal := round(v_product_db.price * v_item_qty);
        v_computed_total := v_computed_total + v_item_subtotal;
    END LOOP;

    -- Insertion atomique de l'en-tête de commande
    INSERT INTO public.orders (
        id,
        store_id,
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
        notes,
        created_at
    ) VALUES (
        v_order_id,
        p_store_id,
        v_order_number,
        trim(p_customer_name),
        trim(p_customer_phone),
        trim(p_shipping_address),
        COALESCE(trim(p_city), 'Lomé'),
        v_computed_total,
        v_currency,
        COALESCE(p_payment_method, 'cash_on_delivery'),
        'pending',
        'pending',
        trim(p_notes),
        NOW()
    );

    -- Insertion atomique des lignes d'articles
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
        product_id UUID,
        quantity INT,
        selected_variant TEXT
    )
    LOOP
        SELECT id, name, price, store_id INTO v_product_db
        FROM public.products
        WHERE id = v_item.product_id;

        INSERT INTO public.order_items (
            id,
            order_id,
            store_id,
            product_id,
            product_name,
            unit_price,
            quantity,
            selected_variant,
            created_at
        ) VALUES (
            gen_random_uuid(),
            v_order_id,
            p_store_id,
            v_product_db.id,
            v_product_db.name,
            v_product_db.price,
            COALESCE(v_item.quantity, 1),
            v_item.selected_variant,
            NOW()
        );
    END LOOP;

    -- Notification vendeur Nexa
    INSERT INTO public.notifications (
        id,
        title,
        message,
        type,
        is_read,
        metadata,
        created_at
    ) VALUES (
        gen_random_uuid(),
        'Nouvelle commande ' || v_order_number,
        'Une nouvelle commande de ' || v_computed_total::TEXT || ' ' || v_currency || ' a été reçue pour ' || v_store_name || '.',
        'new_order',
        false,
        jsonb_build_object(
            'store_id', p_store_id,
            'order_id', v_order_id,
            'order_number', v_order_number,
            'total_amount', v_computed_total
        ),
        NOW()
    );

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'total_amount', v_computed_total,
        'currency', v_currency
    );
END;
$$;

-- 4. Attribution des droits sur la fonction RPC aux rôles public (anon) et connecté (authenticated)
GRANT EXECUTE ON FUNCTION public.create_store_order TO anon, authenticated;

-- 5. Politiques RLS rigoureuses (Row Level Security)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Les vendeurs peuvent lire UNIQUEMENT les commandes de leur propre boutique
DROP POLICY IF EXISTS "Vendors can view their store orders" ON public.orders;
CREATE POLICY "Vendors can view their store orders" ON public.orders
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.stores s
        WHERE s.id = orders.store_id
        AND s.owner_id = auth.uid()
    )
);

-- Les vendeurs peuvent lire UNIQUEMENT les articles de leur propre boutique
DROP POLICY IF EXISTS "Vendors can view their store order items" ON public.order_items;
CREATE POLICY "Vendors can view their store order items" ON public.order_items
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.stores s
        WHERE s.id = order_items.store_id
        AND s.owner_id = auth.uid()
    )
);
