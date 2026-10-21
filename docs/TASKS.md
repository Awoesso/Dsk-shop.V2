# Suivi des Tâches : Nexa & DSK-Shop

Ce document détaille l'état d'avancement des développements, répertoriant les **tâches terminées**, **en cours** et **à venir** pour la plateforme Nexa et son moteur DSK-Shop Core.

---

## Tableau de Bord d'Avancement Global

| Domaine | Statut | Tests de Validation |
| :--- | :---: | :--- |
| **Moteur de Templates (Phase 1)** | ✅ Terminé | `npm run test:engine` (24/24) |
| **Routage Multi-Boutiques (Phase 3)** | ✅ Terminé | `npm run test:phase3` (40/40) |
| **Isolation du Panier (Phase 4.1)** | ✅ Terminé | `npm run test:phase4` (26/26) |
| **Correction Bug React StoreHeader (Phase 4.2)** | ✅ Terminé | `npm run test:regression` (10/10) |
| **Sécurité Éditeur & Propriété (Phase 4.3)** | ✅ Terminé | Vérifié dans `StoreEditorPage.tsx` |
| **Flux de Commande Sécurisé (Phase 4.4)** | ✅ Terminé (Code & SQL) | Script de diagnostic & migration préparée |
| **Intégration GrapesJS Lab (Phase 5.1)** | ✅ Terminé (Sandbox) | `npm run test:grapes` (16/16) |
| **Documentation Centralisée** | ✅ Terminé | Dossier `docs/` à jour |
| **Dashboard Vendeur des Commandes** | ⚪ À faire | Backlog prioritaire |
| **Passerelles de Paiement (Mobile Money)** | ⚪ À faire | Spécification Flooz / T-Money |

---

## 1. Tâches Terminées (Done)

### Phase 0 : Audit Technique & Cartographie
- [x] Audit exhaustif du code hérité et des dépendances entre `ShopContext` et le multi-boutiques.
- [x] Diagnostic de connexion et d'autorisations RLS sur l'instance Supabase distante (`scripts/diagnose-orders-rls.ts`).
- [x] Vérification des colonnes réelles : mise en évidence de la présence de `store_id` sur `order_items` et de son absence sur `orders`.

### Phase 1 : Moteur de Templates E-Commerce Multi-Vendeurs
- [x] Création des contrats TypeScript stricts (`src/types/storefront.ts`).
- [x] Implémentation du registre singleton extensible `TemplateRegistry` avec repli prévisible sur `general`.
- [x] Développement des trois templates initiaux :
  - `GeneralTemplate.tsx` (Commerce polyvalent).
  - `FashionTemplate.tsx` (Mode & lookbook éditorial).
  - `TechTemplate.tsx` (High-tech & ventes flash).
- [x] Scoping des styles CSS dynamiques via `StoreThemeScope` (`--store-primary`, etc.).
- [x] Développement de l'Atelier de Thème (`ThemeEditor.tsx`) et de la Prévisualisation multi-écrans (`StorePreview.tsx`).
- [x] Suite de tests automatisée `test:engine` validant 24 critères d'intégrité et d'isolation.

### Phase 2 & 3 : Routage Multi-Boutiques & Barrière de Publication
- [x] Développement du routeur historique léger `RouterContext.tsx` et de l'analyseur de routes `routes.ts`.
- [x] Implémentation du composant de résolution de boutique `StoreResolver.tsx`.
- [x] Résolution stricte par slug sans repli fictif en cas de slug inexistant ou d'erreur réseau (404 explicite).
- [x] Barrière de publication : blocage des boutiques en brouillon (`draft`), suspendues ou archivées pour les visiteurs publics.
- [x] Pages dédiées par boutique :
  - `StoreHomeView.tsx` (Accueil vitrine).
  - `StoreProductsView.tsx` (Catalogue complet filtré).
  - `StoreProductDetailView.tsx` (Fiche produit avec SEO dynamique).
- [x] Suite de tests `test:phase3` validant 40 assertions de routage et d'étanchéité.

### Phase 4.1 : Isolation du Panier par Boutique
- [x] Abandon du stockage partagé `dsk_cart` pour les boutiques Nexa.
- [x] Implémentation de la clé de stockage dédiée `nexa_cart_${storeId}`.
- [x] Cloisonnement strict des articles et des sous-totaux par boutique.
- [x] Contrôle d'intégrité au checkout : rejet de tout article n'appartenant pas au `storeId` actif.
- [x] Préservation de l'ancien panier historique `dsk_cart` pour compatibilité.
- [x] Suite de tests `test:phase4` validant 26 assertions d'isolation et de résilience.

### Phase 4.2 : Éradication du Bug React `StoreHeader` & `useStoreCart`
- [x] Identification de la cause racine : boucle de souscription `useSyncExternalStore` non mémorisée déclenchant des `forceUpdate` pendant le rendu des vues parentes.
- [x] Création de `StoreCartContext.tsx` et `StoreCartProvider` fournissant un état de panier synchronisé.
- [x] Intégration de `StoreCartProvider` dans `StoreResolver.tsx` pour envelopper toutes les sous-vues.
- [x] Refonte de `useStoreCart.ts` pour consommer le contexte sans course de rendu, avec repli sécurisé hors-contexte.
- [x] Création de la suite de tests de non-régression `test:regression` (`scripts/test-cart-regression.ts`) validant 10 assertions et l'absence totale d'erreurs `setState-in-render`.

### Phase 4.3 : Sécurisation de l'Atelier / Éditeur
- [x] Verrouillage strict de `StoreEditorPage.tsx` : vérification que `currentUser.id === store.owner_id`.
- [x] Blocage des visiteurs anonymes et des utilisateurs non propriétaires avec écran d'accès restreint.
- [x] Sécurisation des actions de publication/dépublication et de sauvegarde des réglages visuels.

### Phase 4.4 : Architecture de Commande Sécurisée & Traçabilité
- [x] Exclusion des politiques SQL `WITH CHECK (true)` pour le rôle `anon`.
- [x] Rédaction de la migration SQL transactionnelle `supabase/migrations/20261018_secure_multi_store_orders.sql` :
  - Fonction RPC `create_store_order` en `SECURITY DEFINER`.
  - Recalcul obligatoire des prix sur le serveur via la table `products`.
  - Contrôle d'appartenance `product.store_id === p_store_id`.
  - Ajout de la contrainte `ON DELETE RESTRICT` pour interdire la suppression physique d'une boutique ayant des commandes.
- [x] Mise à jour de `OrdersService.createOrder` pour invoquer la RPC `create_store_order` en priorité et propager `store_id` sur les articles.

---

## 2. Tâches En Cours (In Progress)

- [ ] **Centralisation de la Documentation Technique** :
  - `docs/PROJECT_CONTEXT.md` (terminé).
  - `docs/ARCHITECTURE.md` (terminé).
  - `docs/TASKS.md` (en cours de finalisation).
- [ ] **Déploiement SQL Supabase** :
  - Exécution du script `20261018_secure_multi_store_orders.sql` dans l'éditeur SQL du projet Supabase pour appliquer la colonne `orders.store_id` et la fonction RPC `create_store_order`.
- [ ] **Nettoyage Progressif du Système Mono-Boutique Historique** :
  - Migration progressive des composants résiduels (`WishlistPage`, `ProductDetailPage` mono-boutique) vers leurs équivalents multi-boutiques sans casser les redirections existantes.

---

## 3. Tâches À Venir (To Do / Backlog Prioritaire)

### Priorité Haute (P1)
- [ ] **Dashboard Vendeur Nexa — Commandes** :
  - Page de consultation et de filtrage des commandes reçues par un vendeur pour sa boutique.
  - Politiques RLS actives garantissant qu'un vendeur ne peut voir que les commandes portant son `store_id`.
  - Changement d'état de commande (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).
- [ ] **Passerelles de Paiement Automatisées** :
  - Intégration de paiements Mobile Money (Flooz Moov Africa & T-Money Togocom) via API ou webhook sécurisé.
  - Validation du statut de paiement avant confirmation définitive de la commande.

### Priorité Moyenne (P2)
- [ ] **Gestion Automatisée des Stocks** :
  - Décrémentation atomique de `stock_count` dans la RPC `create_store_order`.
  - Détection automatique et blocage de commande en cas de rupture de stock.
- [ ] **Notifications Temps Réel Vendeur & Client** :
  - Envoi automatique d'une confirmation par email (Resend / SendGrid) et par message WhatsApp (via API Cloud WhatsApp ou Supabase Edge Functions).
- [ ] **Module de Gestion des Variantes & Tailles** :
  - Interface vendeur dans Nexa pour définir les déclinaisons (Pointures, Couleurs, Tailles) et leurs suppléments de prix.

### Priorité Basse (P3)
- [ ] **Import / Export Catalogue** :
  - Importation en masse de produits via fichier CSV ou Excel pour les commerçants ayant de gros inventaires.
- [ ] **Domaines Personnalisés** :
  - Possibilité pour une boutique d'associer un nom de domaine propre (`boutique-perso.com`) résolvant son slug Nexa.
