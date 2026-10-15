# Moteur de Templates E-Commerce Multi-Vendeur DSK-Shop & Nexa

Ce document décrit l'architecture, l'utilisation, l'extensibilité et le raccordement du moteur de templates e-commerce développé pour **DSK-Shop** et connectable au tableau de bord multi-vendeur **Nexa** via Supabase.

---

## 1. Vue d'Ensemble & Architecture

Le moteur de templates sépare rigoureusement la logique métier, la persistance des données et le rendu visuel. Il permet à chaque vendeur hébergé sur Nexa de sélectionner un modèle graphique distinct et de personnaliser ses couleurs, typographies, espacements, rayons de bordure et sections sans modifier une seule ligne de code source.

### Arborescence Technique

```text
src/
  types/
    storefront.ts               # Contrats TypeScript stricts (Storefront, StoreTheme, TemplateDefinition, etc.)
  templates/
    storefront/
      registry/
        templateRegistry.ts     # Registre centralisé, lookup sécurisé et repli prévisible (fallback)
        templateTypes.ts        # Exports réutilisables des types
      renderer/
        TemplateRenderer.tsx    # Moteur de rendu dynamique et gestionnaire des états publiés / non publiés
      shared/
        StoreThemeScope.tsx     # Injection dynamique des variables CSS scoped (--store-primary, etc.)
        StoreHeader.tsx         # En-tête de boutique responsive (Recherche, Catégories, WhatsApp, Panier)
        StoreFooter.tsx         # Pied de page (Garanties, Moyens de paiement, Réseaux, Copyright)
        StoreProductCard.tsx    # Carte produit adaptable (Grille / Liste, badges promos, stock)
        StoreProductGrid.tsx    # Grille responsive supportant 2, 3 ou 4 colonnes
        StoreCategoryMenu.tsx   # Menu de filtres par catégories standardisées
        StoreSearchBar.tsx      # Champ de recherche instantané
        StoreEmptyState.tsx     # État vide accessible avec action de réinitialisation
        StoreHeroBanner.tsx     # Bannière d'accueil configurable
        StoreTrustBadges.tsx    # Badges de réassurance (Livraison, SAV, Espèces/Mobile Money)
      fashion/
        FashionTemplate.tsx     # Template Mode & Lookbook éditorial
        fashion.css             # Styles spécifiques scoped au template Fashion
      tech/
        TechTemplate.tsx        # Template High-Tech, Électronique & Ventes Flash
        tech.css                # Styles spécifiques scoped au template Tech
      general/
        GeneralTemplate.tsx     # Template Commerce Généraliste polyvalent
        general.css             # Styles spécifiques scoped au template General
  components/
    store-editor/
      TemplateGallery.tsx       # Galerie de sélection visuelle des modèles
      ThemeEditor.tsx           # Atelier interactif de personnalisation des réglages
      StorePreview.tsx          # Prévisualisation responsive (Mobile 390px, Tablette 768px, Écran large)
  services/
    storefrontService.ts        # Service de lecture/écriture (Supabase + localStorage de secours)
  hooks/
    useStorefront.ts            # Hook réactif avec gestion des modifications non enregistrées
  pages/
    Templates/
      TemplateGalleryPage.tsx   # Page catalogue des modèles
    StoreEditor/
      StoreEditorPage.tsx       # Page atelier de personnalisation visuelle
    Storefront/
      StorefrontPage.tsx        # Page d'affichage de la boutique sélectionnée
```

---

## 2. Fonctionnement du Registre (`TemplateRegistry`)

Le registre est géré par la classe singleton `TemplateRegistry` dans `src/templates/storefront/registry/templateRegistry.ts`.

### Caractéristiques majeures :
1. **Identifiants stables :** Chaque template possède un ID immuable (`fashion`, `tech`, `general`, etc.).
2. **Tolérance aux pannes et sécurité :**
   * Aucun code arbitraire (`eval` ou `new Function`) n'est exécuté. Les composants React sont compilés dans l'application.
   * Si l'identifiant demandé est inconnu, manquant ou désactivé, le registre se replie gracieusement sur `general`. L'application ne plante jamais.
3. **Isolation des styles :** Chaque boutique est enveloppée dans `StoreThemeScope` qui génère dynamiquement les variables CSS (`--store-primary`, `--store-btn-radius`, `--store-heading-font`...) sur le conteneur racine de la boutique. Deux boutiques sur le même écran ou des onglets différents n'interfèrent pas entre elles.

---

## 3. Tutoriel : Créer un Quatrième Template nommé "Beauty"

Pour ajouter un nouveau modèle sans réécrire l'architecture, suivez ces 4 étapes simples :

### Étape 1 : Créer le fichier CSS scoped
Créez `src/templates/storefront/beauty/beauty.css` :
```css
/* Beauty Template Scoped Styles */
.beauty-storefront {
  --beauty-glow: rgba(244, 114, 182, 0.2);
}

.beauty-storefront .beauty-card {
  transition: all 0.3s ease;
}

.beauty-storefront .beauty-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -6px var(--beauty-glow);
}
```
Importez-le dans `src/index.css` :
```css
@import "./templates/storefront/beauty/beauty.css";
```

### Étape 2 : Créer le composant React
Créez `src/templates/storefront/beauty/BeautyTemplate.tsx` :
```tsx
import React, { useState, useMemo } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { TemplateProps } from '../../../types/storefront';
import { StoreHeader } from '../shared/StoreHeader';
import { StoreFooter } from '../shared/StoreFooter';
import { StoreProductGrid } from '../shared/StoreProductGrid';
import { StoreCategoryMenu } from '../shared/StoreCategoryMenu';
import { StoreEmptyState } from '../shared/StoreEmptyState';
import { StoreTrustBadges } from '../shared/StoreTrustBadges';

export const BeautyTemplate: React.FC<TemplateProps> = ({
  storefront,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onSelectProduct,
  onSearch,
  onSelectCategory,
  selectedCategory = 'all',
  searchQuery = '',
}) => {
  const { identity, theme, categories, products } = storefront;
  const [activeCategory, setActiveCategory] = useState(selectedCategory);

  const displayProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'all') {
        if ((p.category || '').toLowerCase() !== activeCategory.toLowerCase()) return false;
      }
      return true;
    });
  }, [products, activeCategory]);

  return (
    <div className="beauty-storefront flex flex-col min-h-screen">
      <StoreHeader
        identity={identity}
        categories={categories}
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <main className="flex-1 mx-auto w-full max-w-[var(--store-content-max-w)] px-4 py-8">
        <section className="p-8 mb-8 text-center rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
          <span className="text-xs uppercase tracking-widest font-bold text-pink-600">Cosmétiques & Rituels</span>
          <h1 className="text-3xl sm:text-5xl font-black mt-2" style={{ fontFamily: 'var(--store-heading-font)' }}>
            {identity.name}
          </h1>
          <p className="text-sm mt-2 max-w-lg mx-auto text-[var(--store-muted)]">
            {identity.tagline || 'Soins naturels, parfums délicats et beauté éclatante.'}
          </p>
        </section>

        <StoreProductGrid
          products={displayProducts}
          columns={theme.layout.productGridColumns}
          onAddToCart={onAddToCart}
          currency={identity.currency}
        />
        <StoreTrustBadges />
      </main>
      <StoreFooter identity={identity} />
    </div>
  );
};
```

### Étape 3 : Enregistrer le template dans le registre
Dans `src/templates/storefront/registry/templateRegistry.ts` :
```typescript
import { BeautyTemplate } from '../beauty/BeautyTemplate';

templateRegistry.registerTemplate({
  id: 'beauty',
  name: 'Atelier Cosmétique & Beauté',
  slug: 'beauty',
  description: 'Design doux aux teintes pastel idéal pour soins, parfums et cosmétiques naturels.',
  category: 'beauty',
  version: '1.0.0',
  author: 'Nexa & DSK Team',
  previewImage: '/Harmonie.png',
  component: BeautyTemplate,
  defaultTheme: {
    templateId: 'beauty',
    colors: {
      primary: '#be185d',
      secondary: '#9d174d',
      accent: '#fbcfe8',
      background: '#fff1f2',
      surface: '#ffffff',
      text: '#831843',
      muted: '#9f1239',
      border: '#fecdd3',
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
    },
    shape: {
      buttonRadius: 'full',
      cardRadius: '2xl',
    },
    layout: {
      contentWidth: 'standard',
      spacing: 'comfortable',
      productCardStyle: 'elevated',
      productGridColumns: 3,
      productLayout: 'grid',
    },
    sections: {
      showHeroBanner: true,
      showBrandStory: true,
      showFeaturedGrid: true,
      showCategoryPills: true,
      showPromoBanner: false,
      showNewsletter: true,
      showTrustBadges: true,
      showContactCta: true,
    },
  },
  supportedFeatures: ['Nuancier cosmétique', 'Rituels beauté', 'Lookbook pastel'],
  isAvailable: true,
});
```

### Étape 4 : Tester le nouveau template
Exécutez :
```bash
npm run test:engine
```
Le test unitaire `TEST 6` valide automatiquement que le template `beauty` est reconnu, accessible dans la galerie et compatible avec le moteur.

---

## 4. Connexion avec Nexa via Supabase

### Schéma de Base de Données
Le fichier de migration `supabase/migrations/20261014_storefront_templates_engine.sql` crée les structures requises :
* **`public.stores` :** Informations de la boutique, propriétaire (`owner_id`), coordonnées, statut de publication.
* **`public.storefront_configs` :** Réglages de personnalisation stockés sous forme JSONB (`theme_settings`) rattachés à `store_id`.
* **Clés étrangères :** Colonne `store_id` ajoutée sur `products` et `order_items`.

### RLS (Row Level Security)
* Les visiteurs non connectés (`anon`) peuvent uniquement lire (`SELECT`) les boutiques dont `is_published = true`.
* Les vendeurs connectés sur **Nexa** peuvent modifier (`UPDATE`, `INSERT`) uniquement la configuration où `stores.owner_id = auth.uid()`.

### Variables d'environnement requises
Dans `.env` :
```env
VITE_SUPABASE_URL=https://<votre-projet>.supabase.co
VITE_SUPABASE_ANON_KEY=<votre-cle-publishable>
```

---

## 5. Commandes Utiles

* **Lancer l'application en développement :**
  ```bash
  npm run dev
  ```
* **Vérification TypeScript :**
  ```bash
  npm run lint
  ```
* **Suite de tests du moteur de templates :**
  ```bash
  npm run test:engine
  ```
* **Compilation de production :**
  ```bash
  npm run build
  ```
