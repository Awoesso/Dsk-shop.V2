# Décisions Techniques & Architecture du Système

---

Ce document consigne l'ensemble des **décisions d'architecture technique validées** régissant le moteur e-commerce multi-boutiques DSK-Shop et son intégration à la plateforme Nexa.

---

## 1. Routage & Résolution des Boutiques

### A. Routeur sans Dépendance Externe (`RouterContext`)
- **Décision** : Le projet utilise un système de routage sur-mesure basé sur l'API native `window.history` (`pushState`, `popState`, `replaceState`).
- **Motivation** : Éviter l'alourdissement du bundle et les conflits d'historique dans un environnement en iframe ou prévisualisation dynamique.
- **Règles d'URL** :
  - `GET /` : Portail d'accueil Nexa (Hub).
  - `GET /templates` : Galerie globale des modèles de vitrine.
  - `GET /editeur/:slug` : Atelier de personnalisation de la boutique.
  - `GET /boutique/:slug` : Page d'accueil de la boutique.
  - `GET /boutique/:slug/produits` : Catalogue filtré de la boutique.
  - `GET /boutique/:slug/produit/:productSlug` : Fiche produit détaillée.
  - `GET /boutique/:slug/panier` : Vue complète du panier isolé.
  - `GET /boutique/:slug/commande` : Tunnel de finalisation de commande.

### B. Résolution Stricte par Slug (`StoreResolver`)
- **Pas de repli silencieux vers de fausses données** : Un slug inconnu dans la base PostgreSQL produit une véritable page 404 (`notFound: true`). Le moteur ne substitue jamais une fausse boutique en cas d'erreur de base de données.
- **Barrière de Publication (Statuts)** :
  - Seules les boutiques ayant le statut `active` ou `published` sont visibles par le grand public.
  - Les boutiques ayant le statut `draft`, `suspended` ou `archived` renvoient un écran sécurisé `Boutique non publique` pour les visiteurs non autorisés, tout en restant accessibles à leur propriétaire sur l'éditeur `/editeur/:slug`.
- **Résolution des boutiques de démonstration** : Un registre local sécurisé (`DEMO_STORES`) est maintenu uniquement pour les slugs de test officiels prédéfinis (`dsk-official`, `lome-elegance`, `tech-horizon`, `cyber-lome`) lorsque la base distante est inaccessible en environnement de développement local.

---

## 2. Moteur de Rendu de Templates (`TemplateRegistry` & `TemplateRenderer`)

### A. Registre Centralisé Immuable (`TemplateRegistry`)
- Les templates sont déclarés avec des identifiants stables (`general`, `fashion`, `tech`).
- Le registre instancie les métadonnées, les schémas de couleurs par défaut, les polices de caractères et le composant React de rendu.
- En cas de template inconnu ou corrompu, le registre applique un repli sécurisé sur le template standard `general` sans provoquer de plantage d'application.
- Le registre est extensible à chaud sans refactorisation de la logique mère (`registerTemplate`).

### B. Isolation Visuelle Dynamique (`StoreThemeScope`)
- **Problème résolu** : Plusieurs boutiques ouvertes ou visualisées simultanément risquaient de partager ou d'écraser leurs règles CSS.
- **Solution validée** : Le composant `StoreThemeScope` injecte des variables CSS natives directement sur le nœud conteneur racine de la boutique (`--store-primary`, `--store-secondary`, `--store-bg`, `--store-btn-radius`, `--store-heading-font`).
- **Sécurisation des couleurs** : Une fonction d'assainissement (`sanitizeColor`) valide les formats hexadécimaux et RVB pour prévenir toute injection CSS.

### C. Prévisualisation en Temps Réel (`StoreEditorPage`)
- L'atelier fusionne les modifications non enregistrées (`themeOverride`) avec le thème de base par une fusion profonde (`DeepPartial<StoreTheme>`).
- L'iframe ou conteneur de prévisualisation affiche les changements de couleurs et polices instantanément sans nécessiter d'appel réseau préalable.

---

## 3. Isolation du Panier & Contexte React (`StoreCartContext`)

### A. Clé de Stockage Dédiée par Boutique
- **Format de clé** : `nexa_cart_${storeId}` dans `localStorage`.
- **Règle absolue** : Le véritable UUID de la boutique (`storeId`) sert d'identifiant d'isolation. Le slug d'URL n'est jamais utilisé comme clé de stockage (le slug pouvant théoriquement changer ou être personnalisé).
- **Protection de l'existant** : L'ancien panier historique `dsk_cart` est préservé intact sans écrasement pour garantir une compatibilité ascendante.

### B. Éradication du Bug React 19 `setState-in-render`
- **Cause racine résolue** : L'utilisation de `useSyncExternalStore` avec une fonction inline non mémorisée provoquait des courses de souscription et déclenchait des `forceUpdate` sur `StoreHeader` pendant que `StoreHomeView` ou `StoreProductDetailView` était en cours de rendu.
- **Architecture adoptée** :
  - Création de `StoreCartContext` et `StoreCartProvider` (`src/context/StoreCartContext.tsx`).
  - `StoreResolver` enveloppe automatiquement tous les composants de la boutique dans `<StoreCartProvider storeId={storeId}>`.
  - `StoreHeader`, `StoreHomeView`, `StoreProductsView`, `StoreProductDetailView` et `StoreCartView` consomment le même contexte React.
  - La propagation des mises à jour s'effectue selon le cycle de rendu standard de React (phase de commit), éliminant définitivement tout warning ou plantage `setState-in-render`.
  - `useStoreCart(storeId?: string)` s'abonne au contexte lorsqu'il est présent, avec un repli autonome sécurisé hors-contexte.

---

## 4. Sécurité, RLS & Contrôle d'Accès

### A. Verrouillage de l'Éditeur au Propriétaire
- Dans `StoreEditorPage.tsx`, si la boutique possède un `owner_id`, le système vérifie :
  ```ts
  const isOwner = Boolean(
    store?.owner_id
      ? currentUser && currentUser.id === store.owner_id
      : true
  );
  ```
- Tout utilisateur non connecté ou dont l'UID ne correspond pas exactement à `store.owner_id` est bloqué par un écran d'accès restreint. Les opérations de mise à jour de thèmes (`StoresService.updateStoreSettings`) et de changement de statut de publication sont interdites aux non-propriétaires.

### B. Flux de Commande Transactionnel & Calcul des Prix Côté Serveur
- **Rejet des politiques `WITH CHECK (true)`** : Aucun droit d'insertion direct laxiste n'est octroyé au rôle `anon` sur les tables `orders` et `order_items`.
- **Fonction RPC PostgreSQL `SECURITY DEFINER` (`create_store_order`)** :
  1. Vérifie l'existence et l'état actif/publié de la boutique (`p_store_id`).
  2. Vérifie la validité des coordonnées clients.
  3. Parcourt chaque article du panier et interroge la table `products` en base de données.
  4. **Contrôle d'étanchéité multi-vendeurs** : Vérifie que `product.store_id === p_store_id`. Tout produit étranger provoque un rejet immédiat.
  5. **Calcul serveur des montants** : Le montant unitaire et le montant total sont calculés exclusivement à partir du champ `products.price` en base, ignorant toute valeur arbitraire fournie par le navigateur.
  6. Insère atomiquement l'en-tête dans `orders` et les lignes dans `order_items`.
  7. Émet une notification vendeur dans `notifications`.
- **Droits d'accès** : Seule l'exécution de la fonction est permise (`GRANT EXECUTE ON FUNCTION public.create_store_order TO anon, authenticated`).

---

## 5. Modélisation des Données & Traçabilité des Commandes

```text
┌─────────────────────────┐          ┌─────────────────────────┐
│         stores          │          │     store_settings      │
├─────────────────────────┤          ├─────────────────────────┤
│ id (PK, UUID)           │◄────┐    │ id (PK, UUID)           │
│ owner_id (UUID)         │     │    │ store_id (FK, Unique)   │───► stores(id)
│ name (TEXT)             │     │    │ template_id (TEXT)      │
│ slug (TEXT, Unique)     │     │    │ primary_color (TEXT)    │
│ status (TEXT)           │     │    │ font_family (TEXT)      │
│ created_at (TIMESTAMPTZ)│     │    │ social_links (JSONB)    │
└─────────────────────────┘     │    └─────────────────────────┘
             ▲                  │
             │ 1                │ 1
             │                  │
             │ N                │ N
┌────────────┴────────────┐     │    ┌─────────────────────────┐
│        products         │     └─── │         orders          │
├─────────────────────────┤          ├─────────────────────────┤
│ id (PK, UUID)           │          │ id (PK, UUID)           │
│ store_id (FK)           │          │ store_id (FK, RESTRICT) │
│ name (TEXT)             │          │ order_number (TEXT, UQ) │
│ price (NUMERIC)         │          │ customer_name (TEXT)    │
│ stock_count (INT)       │          │ customer_phone (TEXT)   │
│ is_published (BOOLEAN)  │          │ total_amount (NUMERIC)  │
└─────────────────────────┘          │ payment_status (TEXT)   │
             ▲                       └─────────────────────────┘
             │                                    ▲
             │ 1                                  │ 1
             │                                    │
             │ N                                  │ N
┌────────────┴────────────────────────────────────┴────────────┐
│                         order_items                          │
├──────────────────────────────────────────────────────────────┤
│ id (PK, UUID)                                                │
│ order_id (FK, CASCADE vers orders)                          │
│ store_id (FK, RESTRICT vers stores)                          │
│ product_id (FK vers products)                                │
│ product_name (TEXT)                                          │
│ unit_price (NUMERIC)                                         │
│ quantity (INT)                                               │
└──────────────────────────────────────────────────────────────┘
```

### Contrainte `ON DELETE RESTRICT` & Archivage
- **Décision** : La suppression en cascade (`ON DELETE CASCADE`) est formellement bannie entre `stores` et `orders`.
- **Règle métier** : Si une boutique possède des commandes enregistrées, la suppression physique en base est bloquée par la contrainte `RESTRICT`. Pour fermer une boutique, le vendeur ou l'administrateur Nexa bascule son statut à `'archived'` ou `'suspended'`.
- **Bénéfice** : Traçabilité comptable, fiscale et légale permanente des achats réalisés par les clients.

---

## 6. Stratégie de Tests et Non-Régression

Chaque composant critique est adossé à une suite de tests automatisée exécutable via `npm run test:*` :

1. `npm run test:engine` (`scripts/test-template-engine.ts`) :
   - Enregistrement des modèles, résolution par défaut, isolation des thèmes entre deux boutiques, extensibilité dynamique (ajout du modèle Beauty).
2. `npm run test:phase3` (`scripts/test-phase3-routing.ts`) :
   - Analyseur d'URL, extraction de slug, détection de routes, étanchéité de navigation entre deux boutiques différentes, rejets 404 sans repli fictif.
3. `npm run test:phase4` (`scripts/test-phase4-cart.ts`) :
   - Isolation stricte des paniers sous `nexa_cart_${storeId}`, préservation de `dsk_cart`, intégrité financière et rejets des articles tiers au checkout.
4. `npm run test:regression` (`scripts/test-cart-regression.ts`) :
   - Rendu conjoint parent-enfant (`StoreHomeView` / `StoreHeader`), capture et vérification de l'absence totale de warnings React `setState-in-render`.
5. `npm run lint` (`tsc --noEmit`) :
   - Vérification de l'intégrité globale des types TypeScript sur l'intégralité du projet.
