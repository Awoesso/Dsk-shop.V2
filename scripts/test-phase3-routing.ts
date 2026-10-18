/**
 * ==============================================================================
 * DSK-SHOP & NEXA — SUITE DE TESTS AUTOMATISÉS : PHASE 3 (ROUTAGE ET CONTEXTE)
 * ==============================================================================
 * Exécution : npx tsx scripts/test-phase3-routing.ts
 */

import { parseRoute, normalizePathname, routes } from '../src/router/routes';
import { StoresService, mapDbStoreToStorefront } from '../src/services/stores.service';
import { ProductsService } from '../src/services/products.service';
import { DEMO_STORES } from '../src/services/storefrontService';
import { templateRegistry } from '../src/templates/storefront/registry/templateRegistry';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('   NEXA & DSK-SHOP : TEST SUITE PHASE 3 — ROUTAGE & CONTEXTE');
  console.log('================================================================\n');

  // ----------------------------------------------------------------------------
  // TEST 1 : ROUTING — Normalisation et extraction des paramètres d'URL
  // ----------------------------------------------------------------------------
  console.log('🧪 TEST 1 : Analyseur de routes (URL parser) & Accès direct');
  {
    // Racine / Hub
    const rRoot = parseRoute('/');
    assert(rRoot.type === 'hub', 'Accès direct à "/" résout la route hub (Nexa Hub)');

    // Templates
    const rTemplates = parseRoute('/templates');
    assert(rTemplates.type === 'templates', 'Accès direct à "/templates" résout la route templates');

    // Boutique Accueil
    const rStore = parseRoute('/boutique/lome-elegance');
    assert(rStore.type === 'store-home', 'Accès direct à "/boutique/lome-elegance" détecte store-home');
    assert(rStore.slug === 'lome-elegance', 'Le slug extrait est bien "lome-elegance"');

    // Boutique Produits
    const rProducts = parseRoute('/boutique/lome-elegance/produits');
    assert(rProducts.type === 'store-products', 'Accès direct à "/boutique/lome-elegance/produits" détecte store-products');
    assert(rProducts.slug === 'lome-elegance', 'Le slug extrait pour les produits est "lome-elegance"');

    // Boutique Produit Détail
    const rDetail = parseRoute('/boutique/lome-elegance/produit/robe-soie-wax');
    assert(rDetail.type === 'store-product-detail', 'Accès direct à "/boutique/:slug/produit/:id" détecte store-product-detail');
    assert(rDetail.slug === 'lome-elegance', 'Slug boutique extrait : "lome-elegance"');
    assert(rDetail.productSlug === 'robe-soie-wax', 'Slug produit extrait : "robe-soie-wax"');

    // Panier de la boutique
    const rCart = parseRoute('/boutique/tech-horizon/panier');
    assert(rCart.type === 'store-cart' && rCart.slug === 'tech-horizon', 'Route panier "/boutique/tech-horizon/panier" correctement analysée');

    // Tunnel de commande de la boutique
    const rCheckout = parseRoute('/boutique/tech-horizon/commande');
    assert(rCheckout.type === 'store-checkout' && rCheckout.slug === 'tech-horizon', 'Route commande "/boutique/tech-horizon/commande" correctement analysée');

    // Éditeur protégé de la boutique
    const rEditor = parseRoute('/editeur/dsk-official');
    assert(rEditor.type === 'store-editor' && rEditor.slug === 'dsk-official', 'Route éditeur "/editeur/dsk-official" correctement analysée');

    // Rechargement avec trailing slashes
    const rTrailing = parseRoute('/boutique/dsk-official/');
    assert(rTrailing.type === 'store-home' && rTrailing.slug === 'dsk-official', 'Rechargement avec slash final normalisé sans erreur');

    // Route inconnue -> 404
    const rUnknown = parseRoute('/page-inconnue-qui-nexiste-pas');
    assert(rUnknown.type === 'not-found', 'Route aléatoire "/page-inconnue..." renvoie la route not-found');
  }

  // ----------------------------------------------------------------------------
  // TEST 2 : RÉSOLUTION DE DEUX BOUTIQUES DIFFÉRENTES
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 2 : Deux slugs résolvent deux boutiques différentes');
  {
    const storeA = DEMO_STORES['lome-elegance'];
    const storeB = DEMO_STORES['tech-horizon'];

    assert(storeA !== undefined, 'Boutique A (lome-elegance) est définie');
    assert(storeB !== undefined, 'Boutique B (tech-horizon) est définie');
    assert(storeA.identity.slug !== storeB.identity.slug, 'Les slugs sont strictement différents');
    assert(storeA.identity.id !== storeB.identity.id, 'Les identifiants stables sont distincts');
    assert(storeA.identity.name !== storeB.identity.name, 'Les noms commerciaux sont distincts');
    assert(storeA.theme.templateId === 'fashion', 'Boutique A utilise le modèle "fashion"');
    assert(storeB.theme.templateId === 'tech', 'Boutique B utilise le modèle "tech"');
  }

  // ----------------------------------------------------------------------------
  // TEST 3 : SLUG INCONNU — GESTION STRICTE DU 404 (PAS DE FALLBACK SILENCIEUX)
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 3 : Slug inconnu affiche page introuvable sans fallback fictif');
  {
    const unknownSlug = 'boutique-inexistante-xyz-999';
    const result = await StoresService.getStoreBySlug(unknownSlug);

    assert(result.data === null, 'La recherche du slug inconnu en base renvoie bien data: null');
    assert(result.error === null, 'Pas d\'erreur réseau anormale pour un slug simplement inexistant');
    assert(DEMO_STORES[unknownSlug] === undefined, 'Le slug inconnu n\'est pas dans le registre de démonstration');

    // Vérification de la logique du résolveur
    const notFoundTriggered = result.data === null && DEMO_STORES[unknownSlug] === undefined;
    assert(notFoundTriggered === true, 'Le résolveur déclenche notFound: true sans substituer de fausse boutique');
  }

  // ----------------------------------------------------------------------------
  // TEST 4 : ERREUR BASE DE DONNÉES SANS REPLI FICTIF
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 4 : Erreur base de données sans repli vers une boutique fictive');
  {
    // Tentative avec slug malicieux ou vide
    const invalidResult = await StoresService.getStoreBySlug('');
    assert(invalidResult.data === null, 'Recherche invalide renvoie data: null');
    assert(invalidResult.error !== null, 'Recherche invalide signale une erreur explicite');

    // Vérification qu'aucune donnée de démo n'est injectée sur erreur
    const fallbackAvoided = invalidResult.data === null && invalidResult.error !== null;
    assert(fallbackAvoided === true, 'Aucun repli vers une boutique de démonstration en cas d\'erreur');
  }

  // ----------------------------------------------------------------------------
  // TEST 5 : SÉLECTION DU BON TEMPLATE PAR BOUTIQUE DANS LE MAPPING
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 5 : Sélection dynamique et persistante du modèle pour chaque boutique');
  {
    // Simuler un enregistrement stores + store_settings avec template fashion
    const mockStoreFashion = {
      id: '11111111-1111-1111-1111-111111111111',
      name: 'Haute Couture Lomé',
      slug: 'haute-couture',
      status: 'active',
      store_settings: {
        template_id: 'fashion',
        primary_color: '#9333ea',
        font_family: 'Playfair Display',
      },
    };

    const storefrontFashion = mapDbStoreToStorefront(mockStoreFashion);
    assert(storefrontFashion.theme.templateId === 'fashion', 'Le mapping applique le template "fashion"');
    assert(storefrontFashion.theme.colors.primary === '#9333ea', 'La couleur personnalisée "#9333ea" est conservée');
    assert(storefrontFashion.theme.typography.headingFont === 'Playfair Display', 'La typographie "Playfair Display" est appliquée');

    // Simuler un enregistrement stores + store_settings avec template tech
    const mockStoreTech = {
      id: '22222222-2222-2222-2222-222222222222',
      name: 'Cyber Hardware',
      slug: 'cyber-hardware',
      status: 'active',
      store_settings: {
        template_id: 'tech',
        primary_color: '#06b6d4',
        font_family: 'Space Grotesk',
      },
    };

    const storefrontTech = mapDbStoreToStorefront(mockStoreTech);
    assert(storefrontTech.theme.templateId === 'tech', 'Le mapping applique le template "tech"');
    assert(storefrontTech.theme.colors.primary === '#06b6d4', 'La couleur tech "#06b6d4" est appliquée');
    assert(storefrontTech.theme.layout.productGridColumns === 4, 'La grille tech utilise 4 colonnes');
  }

  // ----------------------------------------------------------------------------
  // TEST 6 : ABSENCE DE FUITE DU CONTEXTE ENTRE DEUX BOUTIQUES
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 6 : Absence de fuite de contexte et d\'isolation entre deux boutiques');
  {
    const store1 = mapDbStoreToStorefront({
      id: 'aaaa-1111',
      name: 'Store Alpha',
      slug: 'store-alpha',
      status: 'active',
      store_settings: {
        template_id: 'fashion',
        primary_color: '#ff0000',
      },
    });

    const store2 = mapDbStoreToStorefront({
      id: 'bbbb-2222',
      name: 'Store Beta',
      slug: 'store-beta',
      status: 'active',
      store_settings: {
        template_id: 'tech',
        primary_color: '#0000ff',
      },
    });

    assert(store1.identity.id !== store2.identity.id, 'IDs isolés sans collision');
    assert(store1.theme.templateId !== store2.theme.templateId, 'Templates isolés');
    assert(store1.theme.colors.primary === '#ff0000', 'Store Alpha conserve sa couleur propre (#ff0000)');
    assert(store2.theme.colors.primary === '#0000ff', 'Store Beta conserve sa couleur propre (#0000ff)');

    // Vérification que les options ProductsService n'autorisent pas le croisement
    const safeCallWithoutStore = await ProductsService.getProductsByStore('');
    assert(safeCallWithoutStore.data.length === 0, 'Appel getProductsByStore avec ID vide rejeté sans fuite');
    assert(safeCallWithoutStore.error !== null, 'Message de rejet explicite renvoyé');
  }

  // ----------------------------------------------------------------------------
  // BILAN FINAL
  // ----------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`RÉSULTAT DU TEST PHASE 3 : ${passedTests} passés, ${failedTests} échoués`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
