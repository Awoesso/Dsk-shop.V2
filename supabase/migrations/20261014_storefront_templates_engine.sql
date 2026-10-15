-- ==============================================================================
-- DSK-SHOP & NEXA: MIGRATION - MOTEUR DE TEMPLATES STOREFRONT MULTI-VENDEUR
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- (https://app.supabase.com/project/_/sql)
--
-- Cette migration implémente de façon idempotente et sécurisée :
-- 1. Table 'stores' : Profil, coordonnées et statut de publication de chaque boutique
-- 2. Table 'storefront_configs' : Association boutique <-> template et réglages de thème (JSONB)
-- 3. Liaison 'products' et 'order_items' avec 'store_id' (compatibilité multi-vendeur)
-- 4. Politiques RLS granulaires (séparation stricte par vendeur, lecture publique des boutiques publiées)
-- 5. Publication Realtime pour synchronisation instantanée avec Nexa
-- 6. Données de départ par défaut pour la boutique officielle DSK-Shop
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRÉATION DE LA TABLE 'stores' (Boutiques des vendeurs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID, -- référence optionnelle vers auth.users(id)
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT DEFAULT 'Lomé',
    country TEXT DEFAULT 'Togo',
    currency TEXT DEFAULT 'FCFA',
    social_links JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide par slug ou par propriétaire
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_published ON public.stores(is_published);

-- ------------------------------------------------------------------------------
-- 2. CRÉATION DE LA TABLE 'storefront_configs' (Configurations & Thèmes)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.storefront_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    template_id TEXT NOT NULL DEFAULT 'general',
    theme_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    version INT4 NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_storefront_configs_store_id UNIQUE(store_id)
);

CREATE INDEX IF NOT EXISTS idx_storefront_configs_store_id ON public.storefront_configs(store_id);
CREATE INDEX IF NOT EXISTS idx_storefront_configs_template_id ON public.storefront_configs(template_id);

-- ------------------------------------------------------------------------------
-- 3. ÉVOLUTION DU SCHÉMA 'products' ET 'order_items' POUR LE MULTI-VENDEUR
-- ------------------------------------------------------------------------------
-- Ajout non-bloquant de la colonne 'store_id' sur 'products' si elle n'existe pas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'products' 
      AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.products ADD COLUMN store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
  END IF;
END $$;

-- Ajout non-bloquant de la colonne 'store_id' sur 'order_items'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'order_items' 
      AND column_name = 'store_id'
  ) THEN
    ALTER TABLE public.order_items ADD COLUMN store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS idx_order_items_store_id ON public.order_items(store_id);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. TRIGGER AUTOMATIQUE 'updated_at'
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_stores_updated_at ON public.stores;
CREATE TRIGGER trigger_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_storefront_configs_updated_at ON public.storefront_configs;
CREATE TRIGGER trigger_storefront_configs_updated_at
BEFORE UPDATE ON public.storefront_configs
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 5. POLITIQUES DE SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storefront_configs ENABLE ROW LEVEL SECURITY;

-- STORES POLICIES
-- Lecture publique : Tout le monde (anon + authenticated) peut lire les boutiques publiées
DROP POLICY IF EXISTS "stores_select_public" ON public.stores;
CREATE POLICY "stores_select_public"
ON public.stores FOR SELECT
USING (is_published = true OR (auth.uid() IS NOT NULL AND auth.uid() = owner_id));

-- Modification : Seul le propriétaire authentifié peut modifier sa boutique
DROP POLICY IF EXISTS "stores_update_owner" ON public.stores;
CREATE POLICY "stores_update_owner"
ON public.stores FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Insertion : Les utilisateurs authentifiés créent leur propre boutique
DROP POLICY IF EXISTS "stores_insert_owner" ON public.stores;
CREATE POLICY "stores_insert_owner"
ON public.stores FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- STOREFRONT_CONFIGS POLICIES
-- Lecture publique : Tout le monde peut lire la config d'une boutique publiée
DROP POLICY IF EXISTS "storefront_configs_select_public" ON public.storefront_configs;
CREATE POLICY "storefront_configs_select_public"
ON public.storefront_configs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = storefront_configs.store_id 
      AND (stores.is_published = true OR (auth.uid() IS NOT NULL AND auth.uid() = stores.owner_id))
  )
);

-- Modification : Seul le propriétaire de la boutique peut mettre à jour ses réglages de thème
DROP POLICY IF EXISTS "storefront_configs_modify_owner" ON public.storefront_configs;
CREATE POLICY "storefront_configs_modify_owner"
ON public.storefront_configs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = storefront_configs.store_id 
      AND stores.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores 
    WHERE stores.id = storefront_configs.store_id 
      AND stores.owner_id = auth.uid()
  )
);

-- ------------------------------------------------------------------------------
-- 6. AJOUT À LA PUBLICATION REALTIME SUPABASE
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'stores'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stores;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'storefront_configs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.storefront_configs;
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 7. DONNÉES INITIALES (SEED DE SECOURS SÉCURISÉ)
-- ------------------------------------------------------------------------------
INSERT INTO public.stores (
  id,
  name,
  slug,
  tagline,
  description,
  banner_url,
  phone,
  email,
  address,
  city,
  country,
  currency,
  is_published
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'DSK-Shop Officiel',
  'dsk-official',
  'Votre référence shopping éco-responsable à Lomé',
  'DSK-Shop propose une vaste sélection de produits de haute qualité avec livraison rapide à domicile et paiement à la réception partout à Lomé.',
  '/Harmonie.png',
  '+228 90 00 00 00',
  'contact@dskshop.tg',
  'Boulevard du 13 Janvier, Déckon',
  'Lomé',
  'Togo',
  'FCFA',
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.storefront_configs (
  store_id,
  template_id,
  theme_settings,
  version
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'general',
  '{
    "templateId": "general",
    "colors": {
      "primary": "#012d1d",
      "secondary": "#1b4332",
      "accent": "#c1ecd4",
      "background": "#f4fafd",
      "surface": "#ffffff",
      "text": "#161d1f",
      "muted": "#717973",
      "border": "#dde4e6"
    },
    "typography": {
      "headingFont": "Montserrat",
      "bodyFont": "Inter"
    },
    "shape": {
      "buttonRadius": "md",
      "cardRadius": "xl"
    },
    "layout": {
      "contentWidth": "standard",
      "spacing": "comfortable",
      "productCardStyle": "standard",
      "productGridColumns": 4,
      "productLayout": "grid"
    },
    "sections": {
      "showHeroBanner": true,
      "showBrandStory": true,
      "showFeaturedGrid": true,
      "showCategoryPills": true,
      "showPromoBanner": true,
      "showNewsletter": true,
      "showTrustBadges": true,
      "showContactCta": true
    }
  }'::jsonb,
  1
) ON CONFLICT (store_id) DO NOTHING;
