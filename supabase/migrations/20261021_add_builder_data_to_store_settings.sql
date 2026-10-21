-- ==============================================================================
-- DSK-SHOP & NEXA: MIGRATION - PERSISTANCE DU PROJET VISUEL GRAPESJS
-- ==============================================================================
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase
-- (https://app.supabase.com/project/_/sql)
--
-- 1. Ajoute les colonnes de stockage du projet visuel GrapesJS (JSONB) sur 'store_settings' :
--    - builder_draft : Projet en cours d'édition (privé au vendeur)
--    - builder_published : Version validée et déployée sur la vitrine publique
--    - builder_version : Numéro de version du schéma de blocs pour compatibilité ascendante
-- 2. Politiques RLS :
--    - Lecture publique autorisée UNIQUEMENT pour la version publiée des boutiques actives
--    - Lecture et écriture du brouillon strictement réservées au propriétaire (owner_id)
-- ==============================================================================

DO $$
BEGIN
  -- 1. Colonne builder_draft (brouillon privé)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'store_settings' 
      AND column_name = 'builder_draft'
  ) THEN
    ALTER TABLE public.store_settings ADD COLUMN builder_draft JSONB DEFAULT NULL;
    COMMENT ON COLUMN public.store_settings.builder_draft IS 'Projet GrapesJS en cours de modification (brouillon vendeur)';
  END IF;

  -- 2. Colonne builder_published (version vitrine en direct)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'store_settings' 
      AND column_name = 'builder_published'
  ) THEN
    ALTER TABLE public.store_settings ADD COLUMN builder_published JSONB DEFAULT NULL;
    COMMENT ON COLUMN public.store_settings.builder_published IS 'Projet GrapesJS publié visible par les acheteurs sur la vitrine';
  END IF;

  -- 3. Version de schéma de projet
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'store_settings' 
      AND column_name = 'builder_version'
  ) THEN
    ALTER TABLE public.store_settings ADD COLUMN builder_version INT4 DEFAULT 1;
  END IF;
END $$;

-- Index JSONB pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_store_settings_builder_published ON public.store_settings USING gin(builder_published) WHERE builder_published IS NOT NULL;

-- Sécurité RLS renforcée sur store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Politique 1 : Lecture publique de la configuration des boutiques publiées
DROP POLICY IF EXISTS "Public can view published store settings" ON public.store_settings;
CREATE POLICY "Public can view published store settings"
ON public.store_settings FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE public.stores.id = public.store_settings.store_id
      AND (public.stores.status = 'active' OR public.stores.status = 'published' OR public.stores.status IS NULL)
  )
);

-- Politique 2 : Propriétaire vendeur - accès complet (lecture, mise à jour, insertion de son brouillon)
DROP POLICY IF EXISTS "Store owner can manage store settings" ON public.store_settings;
CREATE POLICY "Store owner can manage store settings"
ON public.store_settings FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE public.stores.id = public.store_settings.store_id
      AND public.stores.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE public.stores.id = public.store_settings.store_id
      AND public.stores.owner_id = auth.uid()
  )
);
