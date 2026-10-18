/**
 * ==============================================================================
 * DSK-SHOP & NEXA — SUITE DE TESTS AUTOMATISÉS : PHASE 4.1 (PANIER ISOLÉ)
 * ==============================================================================
 * Exécution : npx tsx scripts/test-phase4-cart.ts
 */

import { Product, CartItem } from '../src/types';

// Setup Mock localStorage for Node test environment
class MockStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
}

const mockStorage = new MockStorage();
(globalThis as any).localStorage = mockStorage;
(globalThis as any).window = globalThis;

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

// Helper simulation of readStoreCartFromStorage
function readStoreCart(storeId: string): CartItem[] {
  if (!storeId || typeof storeId !== 'string') return [];
  try {
    const raw = mockStorage.getItem(`nexa_cart_${storeId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item: any) => item && item.product && typeof item.product.id === 'string' && typeof item.quantity === 'number')
      .map((item: CartItem) => ({
        ...item,
        store_id: storeId,
        product: { ...item.product, store_id: storeId },
      }));
  } catch {
    return [];
  }
}

// Helper simulation of writeStoreCartToStorage
function writeStoreCart(storeId: string, items: CartItem[]): void {
  if (!storeId || typeof storeId !== 'string') return;
  mockStorage.setItem(`nexa_cart_${storeId}`, JSON.stringify(items));
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('   NEXA & DSK-SHOP : TEST SUITE PHASE 4.1 — ISOLATION DU PANIER');
  console.log('================================================================\n');

  const STORE_A = '11111111-1111-1111-1111-111111111111'; // Lomé Élégance
  const STORE_B = '22222222-2222-2222-2222-222222222222'; // Tech Horizon

  const productA: Product = {
    id: 'prod-fashion-01',
    name: 'Robe Soie Wax',
    slug: 'robe-soie-wax',
    brand: 'Lomé Élégance',
    price: 45000,
    category: 'Fashion',
    inStock: true,
    stockCount: 15,
    description: 'Robe artisanale',
    features: [],
    specs: {},
    images: [],
    tags: [],
    store_id: STORE_A,
  };

  const productB: Product = {
    id: 'prod-tech-01',
    name: 'Clavier Mécanique RGB',
    slug: 'clavier-mecanique-rgb',
    brand: 'Tech Horizon',
    price: 32000,
    category: 'Electronics',
    inStock: true,
    stockCount: 8,
    description: 'Switches tactiles',
    features: [],
    specs: {},
    images: [],
    tags: [],
    store_id: STORE_B,
  };

  // ----------------------------------------------------------------------------
  // TEST 1 : DEUX BOUTIQUES ONT DEUX PANIERS INDÉPENDANTS
  // ----------------------------------------------------------------------------
  console.log('🧪 TEST 1 : Deux boutiques ont deux paniers strictement indépendants');
  {
    mockStorage.clear();

    // Maintien d'un ancien panier legacy sous dsk_cart pour vérifier la non-régression
    mockStorage.setItem('dsk_cart', JSON.stringify([{ product: { id: 'legacy-prod', name: 'Legacy' }, quantity: 1 }]));

    // Ajouter article A dans Store A
    const cartA: CartItem[] = [{ product: productA, quantity: 2, store_id: STORE_A }];
    writeStoreCart(STORE_A, cartA);

    // Ajouter article B dans Store B
    const cartB: CartItem[] = [{ product: productB, quantity: 1, store_id: STORE_B }];
    writeStoreCart(STORE_B, cartB);

    const loadedA = readStoreCart(STORE_A);
    const loadedB = readStoreCart(STORE_B);

    assert(loadedA.length === 1, 'Panier Boutique A contient exactement 1 article');
    assert(loadedA[0].product.id === 'prod-fashion-01', 'Article de A est bien la Robe Soie Wax');
    assert(loadedA[0].quantity === 2, 'Quantité de A est 2');
    assert(loadedA[0].store_id === STORE_A, 'Le store_id de l’article dans A est STORE_A');

    assert(loadedB.length === 1, 'Panier Boutique B contient exactement 1 article');
    assert(loadedB[0].product.id === 'prod-tech-01', 'Article de B est bien le Clavier Mécanique');
    assert(loadedB[0].quantity === 1, 'Quantité de B est 1');
    assert(loadedB[0].store_id === STORE_B, 'Le store_id de l’article dans B est STORE_B');

    // Vérifier les clés physiques distinctes
    assert(mockStorage.getItem(`nexa_cart_${STORE_A}`) !== null, 'Clé de stockage nexa_cart_STORE_A créée');
    assert(mockStorage.getItem(`nexa_cart_${STORE_B}`) !== null, 'Clé de stockage nexa_cart_STORE_B créée');

    // Vérifier que dsk_cart historique n'a pas été effacé
    const legacyCart = mockStorage.getItem('dsk_cart');
    assert(legacyCart !== null && legacyCart.includes('legacy-prod'), 'L’ancien panier dsk_cart historique est préservé intact');
  }

  // ----------------------------------------------------------------------------
  // TEST 2 : VIDER LE PANIER A NE MODIFIE PAS LE PANIER B
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 2 : Vider le panier A n’altère aucunement le panier B');
  {
    // Vider panier A
    writeStoreCart(STORE_A, []);

    const loadedAAfterClear = readStoreCart(STORE_A);
    const loadedBAfterClear = readStoreCart(STORE_B);

    assert(loadedAAfterClear.length === 0, 'Panier A est désormais complètement vide');
    assert(loadedBAfterClear.length === 1, 'Panier B contient toujours son article intact');
    assert(loadedBAfterClear[0].product.id === 'prod-tech-01', 'L’article du panier B est toujours le Clavier Mécanique');
    assert(loadedBAfterClear[0].quantity === 1, 'La quantité dans B n’a pas bougé');
  }

  // ----------------------------------------------------------------------------
  // TEST 3 : MODIFIER UNE QUANTITÉ DANS B NE MODIFIE PAS A
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 3 : Modifier une quantité dans B ne modifie pas les autres boutiques');
  {
    // Réinjecter un article dans A
    writeStoreCart(STORE_A, [{ product: productA, quantity: 1, store_id: STORE_A }]);

    // Modifier quantité dans B : passer de 1 à 4
    const currentB = readStoreCart(STORE_B);
    currentB[0].quantity = 4;
    writeStoreCart(STORE_B, currentB);

    const reloadedA = readStoreCart(STORE_A);
    const reloadedB = readStoreCart(STORE_B);

    assert(reloadedB[0].quantity === 4, 'Quantité dans B mise à jour à 4');
    assert(reloadedA[0].quantity === 1, 'Quantité dans A reste inchangée à 1');
  }

  // ----------------------------------------------------------------------------
  // TEST 4 : RECHARGEMENT ET PERSISTANCE ÉTANCHE
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 4 : Rechargement et persistance étanche');
  {
    // Simuler un rechargement complet de l'application
    const rehydratedA = readStoreCart(STORE_A);
    const rehydratedB = readStoreCart(STORE_B);

    const totalSubtotalA = rehydratedA.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalSubtotalB = rehydratedB.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    assert(totalSubtotalA === 45000, 'Sous-total calculé pour A est 45 000 FCFA');
    assert(totalSubtotalB === 32000 * 4, 'Sous-total calculé pour B est 128 000 FCFA');
    assert(totalSubtotalA !== totalSubtotalB, 'Les sous-totaux financiers sont complètement cloisonnés');
  }

  // ----------------------------------------------------------------------------
  // TEST 5 : CONTRÔLE D'INTÉGRITÉ DU CHECKOUT (PAS DE PRODUITS TIERS)
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 5 : Contrôle d’intégrité du tunnel de commande');
  {
    // Simuler une tentative d'injection d'un article tiers
    const compromisedCart: CartItem[] = [
      { product: productA, quantity: 1, store_id: STORE_A },
      { product: productB, quantity: 2, store_id: STORE_B }, // Article de la boutique B !
    ];

    // Le filtrage strict du checkout pour STORE_A
    const checkoutItemsForStoreA = compromisedCart.filter(
      (item) => (item.store_id || item.product.store_id) === STORE_A
    );

    assert(checkoutItemsForStoreA.length === 1, 'Seul 1 article sur les 2 est accepté pour le checkout de A');
    assert(checkoutItemsForStoreA[0].product.id === 'prod-fashion-01', 'L’article tiers de la boutique B a été rejeté du checkout');
  }

  // ----------------------------------------------------------------------------
  // TEST 6 : CAS LIMITES & RÉSILIENCE
  // ----------------------------------------------------------------------------
  console.log('\n🧪 TEST 6 : Cas limites, robustesse et erreurs de stockage');
  {
    // 1. storeId manquant ou vide
    const emptyStoreCall = readStoreCart('');
    assert(emptyStoreCall.length === 0, 'storeId vide renvoie un panier vide sans crash');

    // 2. JSON corrompu en stockage
    mockStorage.setItem(`nexa_cart_corrupted_id`, '{"invalid-json::');
    const corruptedResult = readStoreCart('corrupted_id');
    assert(corruptedResult.length === 0, 'JSON corrompu renvoie un panier vide avec repli gracieux');

    // 3. Données mal formées (non-tableau)
    mockStorage.setItem(`nexa_cart_object_id`, JSON.stringify({ notAnArray: true }));
    const objectResult = readStoreCart('object_id');
    assert(objectResult.length === 0, 'Donnée non-tableau en stockage renvoie un tableau vide');

    // 4. Articles sans produit valide
    mockStorage.setItem(`nexa_cart_bad_items`, JSON.stringify([{ badField: 123 }, null]));
    const badItemsResult = readStoreCart('bad_items');
    assert(badItemsResult.length === 0, 'Articles invalides filtrés et rejetés proprement');
  }

  // ----------------------------------------------------------------------------
  // BILAN FINAL
  // ----------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`RÉSULTAT DU TEST PHASE 4.1 : ${passedTests} passés, ${failedTests} échoués`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
