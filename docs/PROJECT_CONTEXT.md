# Contexte du Projet : Nexa & DSK-Shop

---

## 1. Vision et Mission

**Nexa** est une plateforme SaaS e-commerce multi-vendeurs conçue pour le marché d'Afrique de l'Ouest (notamment le Togo et la zone UEMOA). Elle permet à des commerçants, créateurs et entreprises de créer, configurer, personnaliser et exploiter leur propre boutique en ligne sans compétences techniques.

**DSK-Shop Core** est le moteur e-commerce headless, modulaire et privé intégré au cœur de Nexa. DSK-Shop n'est pas une boutique publique concurrente ni une vitrine autonome ; c'est le moteur technique qui alimente l'affichage des vitrines, le routage dynamique, l'isolation des données, le panier d'achat et le tunnel de commande.

---

## 2. Rôles et Frontières de Responsabilité

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 NEXA SAAS                                   │
│                     (Portail & Back-Office Vendeur)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Authentification des vendeurs (Supabase Auth)                            │
│  • Création et gestion des boutiques (Slug, Nom, Devises, Statuts)          │
│  • Gestion du catalogue (Produits, Variantes, Stocks, Catégories)           │
│  • Tableau de bord des ventes et suivi des commandes                        │
│  • Personnalisation visuelle via l'Atelier de Thème (/editeur/:slug)         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                        Fournit les données & permissions
                                       │
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                              DSK-SHOP CORE                                  │
│                 (Moteur E-Commerce & Vitrines Publiques)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  • Résolution stricte de boutique par slug (/boutique/:slug)                │
│  • Moteur de templates dynamique (Fashion, Tech, General, etc.)             │
│  • Scoping visuel et variables CSS isolées (StoreThemeScope)                │
│  • Panier indépendant étanche par boutique (nexa_cart_${storeId})           │
│  • Tunnel d'achat & validation des commandes avec calcul serveur            │
│  • Gestion de l'étanchéité multi-vendeurs et résilience hors-ligne          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### A. Nexa — Interface Vendeur
- **Portail Hub (`/`)** : point d'entrée pour la sélection et l'accès rapide aux boutiques configurées.
- **Galerie de Thèmes (`/templates`)** : catalogue des modèles disponibles pour inspirer ou orienter les vendeurs.
- **Atelier de Personnalisation (`/editeur/:slug`)** : interface WYSIWYG permettant aux vendeurs de modifier leur identité de marque, couleurs, typographies, espacements et sections avec prévisualisation multi-écrans en temps réel.
- **Sécurité** : accessible exclusivement au propriétaire authentifié de la boutique (`owner_id === currentUser.id`).

### B. DSK-Shop Core — Vitrines Marchandes Publiques
- **Accueil Boutique (`/boutique/:slug`)** : vitrine publique personnalisée rendue selon le template actif de la boutique.
- **Catalogue Boutique (`/boutique/:slug/produits`)** : catalogue de produits filtré strictement sur l'identifiant unique de la boutique (`storeId`).
- **Fiche Produit (`/boutique/:slug/produit/:id`)** : vue détaillée avec sélection de variantes, galeries d'images et métadonnées SEO Schema.org.
- **Panier Isolé (`/boutique/:slug/panier`)** : panier d'achat dédié à la boutique active, interdisant le mélange avec d'autres enseignes.
- **Tunnel de Commande (`/boutique/:slug/commande`)** : validation d'adresse, sélection du mode de paiement (Espèces à la livraison, Mobile Money Flooz / T-Money) et transmission sécurisée.

---

## 3. Parcours Utilisateurs Principaux

### Parcours Client (Acheteur)
1. **Accès Vitrine** : le client accède à l'URL `https://nexa.shop/boutique/{slug}`.
2. **Résolution Stricte** : `StoreResolver` interroge Supabase. Si la boutique est introuvable, une page 404 explicite s'affiche. Si elle est en brouillon ou archivée, un écran de boutique non publique informe le visiteur.
3. **Navigation dans le Catalogue** : les produits et catégories affichés proviennent uniquement de cette boutique.
4. **Ajout au Panier** : les articles sont sauvegardés dans `localStorage` sous la clé `nexa_cart_${storeId}`. La quantité et le sous-total sont recalculés en temps réel.
5. **Validation de Commande** : le client saisit son nom, téléphone et adresse à Lomé. La commande est envoyée au serveur qui recalcule les prix officiels et insère la commande atomiquement.

### Parcours Vendeur (Commerçant)
1. **Connexion** : le vendeur s'authentifie sur Nexa via Supabase Auth.
2. **Gestion de sa Boutique** : il accède à `/editeur/{slug}`. Le système vérifie qu'il est bien le propriétaire de `owner_id`.
3. **Personnalisation** : il sélectionne un modèle (Fashion, Tech ou General), ajuste la palette de couleurs et la typographie. Le rendu s'actualise instantanément dans l'iframe de prévisualisation responsive.
4. **Publication** : il bascule le statut de `draft` à `active`. La boutique devient instantanément consultable par le public.
5. **Gestion des Commandes** : les commandes passées par ses clients lui sont accessibles grâce aux politiques RLS restreintes à son `store_id`.

---

## 4. Stack Technique et Choix d'Infrastructure

| Couche | Technologie | Justification |
| :--- | :--- | :--- |
| **Framework Frontend** | React 19 + TypeScript | Typage strict, composants fonctionnels, hooks optimisés, React Context. |
| **Build & Tooling** | Vite 6 + tsx | Compilation instantanée, environnement de test performant, zéro dépendance lourde. |
| **Styling** | Tailwind CSS v4 + Variables CSS | Design moderne, ultra-rapide, variables CSS scopées dynamiquement par boutique. |
| **Base de Données & Auth** | Supabase (PostgreSQL 15) | Authentification JWT, Row-Level Security (RLS), triggers et fonctions RPC PL/pgSQL. |
| **Routage** | Custom Router (`RouterContext`) | Basé sur l'API History (`pushState`, `popState`), sans dépendance tierce fragile. |
| **SEO & Réassurance** | React Helmet Async + Schema.org | JSON-LD dynamique pour les produits, OpenGraph et cartes de partage social. |
