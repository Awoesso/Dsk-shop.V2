/**
 * ==============================================================================
 * DSK-SHOP & NEXA — TEST DE NON-RÉGRESSION : STOREHEADER & USESTORECART
 * ==============================================================================
 * Vérifie l’absence d'erreurs "setState-in-render" entre StoreHeader et
 * StoreHomeView / StoreProductDetailView, ainsi que l'étanchéité des paniers.
 *
 * Exécution : npx tsx scripts/test-cart-regression.ts
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { Product, CartItem } from '../src/types';
import {
  StoreCartProvider,
  getStoreCartStorageKey,
  readStoreCartFromStorage,
  writeStoreCartToStorage,
  useStoreCartContext,
} from '../src/context/StoreCartContext';
import { useStoreCart } from '../src/hooks/useStoreCart';

// 1. Mock LocalStorage in Node environment
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

// Intercept console.error to catch any "Cannot update a component while rendering a different component"
let reactErrorsLogged: string[] = [];
const originalConsoleError = console.error;

function captureConsoleErrors() {
  reactErrorsLogged = [];
  console.error = (...args: any[]) => {
    const msg = args.join(' ');
    if (msg.includes('Cannot update a component') || msg.includes('bad setState()')) {
      reactErrorsLogged.push(msg);
    }
    originalConsoleError(...args);
  };
}

function restoreConsoleErrors() {
  console.error = originalConsoleError;
}

const productAlpha: Product = {
  id: 'prod-wax-01',
  name: 'Tissu Wax Premium',
  slug: 'tissu-wax-premium',
  brand: 'Lomé Élégance',
  price: 25000,
  category: 'Fashion',
  inStock: true,
  stockCount: 10,
  description: '100% Coton',
  features: [],
  specs: {},
  images: [],
  tags: [],
  store_id: 'store_alpha',
};

const productBeta: Product = {
  id: 'prod-mac-01',
  name: 'Station d’accueil USB-C',
  slug: 'station-usb-c',
  brand: 'Tech Horizon',
  price: 65000,
  category: 'Electronics',
  inStock: true,
  stockCount: 5,
  description: '10-en-1',
  features: [],
  specs: {},
  images: [],
  tags: [],
  store_id: 'store_beta',
};

async function runRegressionTests() {
  console.log('================================================================');
  console.log('   NEXA & DSK-SHOP : TEST DE NON-RÉGRESSION STOREHEADER & CART');
  console.log('================================================================\n');

  // ----------------------------------------------------------------------------
  // TEST 1 : Absence de warnings setState-in-render lors du rendu conjoint
  // ----------------------------------------------------------------------------
  console.log('🧪 TEST 1 : Rendu sans warning "setState-in-render"');
  {
    captureConsoleErrors();
    mockStorage.clear();

    // Composant StoreHeader simulé
    const DummyHeader: React.FC = () => {
      const { cartItemCount } = useStoreCart('store_alpha');
      return React.createElement('div', { id: 'header-cart' }, `Count: ${cartItemCount}`);
    };

    // Composant StoreHomeView simulé qui contient le Header et useStoreCart
    const DummyHomeView: React.FC = () => {
      const { addToCart } = useStoreCart('store_alpha');
      return React.createElement(
        'div',
        { id: 'home-view' },
        React.createElement(DummyHeader, null),
        React.createElement('button', { onClick: () => addToCart(productAlpha, 1) }, 'Add')
      );
    };

    // Rendu sous StoreCartProvider
    const AppTree: React.FC = () => {
      return React.createElement(
        StoreCartProvider,
        { storeId: 'store_alpha' },
        React.createElement(DummyHomeView, null)
      );
    };

    const rendered = renderToString(React.createElement(AppTree, null));

    restoreConsoleErrors();

    assert(rendered.includes('Count: 0'), 'StoreHeader rend avec count initial 0');
    assert(
      reactErrorsLogged.length === 0,
      'Zéro erreur React "Cannot update a component while rendering a different component"'
    );
  }

  // ----------------------------------------------------------------------------
  // TEST 2 : Manipulation du panier isolé Store A
  // ----------------------------------------------------------------------------
  console.log('🧪 TEST 2 : Ajout et persistance étanche dans store_alpha');
  {
    mockStorage.clear();
    mockStorage.setItem('dsk_cart', JSON.stringify([{ legacy: true }]));

    const items: CartItem[] = [{ product: productAlpha, quantity: 3, store_id: 'store_alpha' }];
    writeStoreCartToStorage('store_alpha', items);

    const loadedAlpha = readStoreCartFromStorage('store_alpha');
    assert(loadedAlpha.length === 1, 'store_alpha contient exactement 1 ligne');
    assert(loadedAlpha[0].quantity === 3, 'Quantité dans store_alpha est 3');
    assert(loadedAlpha[0].store_id === 'store_alpha', 'store_id est bien "store_alpha"');

    // Vérifier que store_beta est vide
    const loadedBeta = readStoreCartFromStorage('store_beta');
    assert(loadedBeta.length === 0, 'store_beta est totalement vide');

    // Vérifier que dsk_cart legacy est intact
    const legacyRaw = mockStorage.getItem('dsk_cart');
    assert(legacyRaw !== null && legacyRaw.includes('legacy'), 'Panier legacy dsk_cart préservé intact');
  }

  // ----------------------------------------------------------------------------
  // TEST 3 : Calcul correct des sous-totaux par boutique
  // ----------------------------------------------------------------------------
  console.log('🧪 TEST 3 : Calculs financiers cloisonnés');
  {
    const itemsBeta: CartItem[] = [{ product: productBeta, quantity: 2, store_id: 'store_beta' }];
    writeStoreCartToStorage('store_beta', itemsBeta);

    const loadedAlpha = readStoreCartFromStorage('store_alpha');
    const loadedBeta = readStoreCartFromStorage('store_beta');

    const subtotalAlpha = loadedAlpha.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const subtotalBeta = loadedBeta.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    assert(subtotalAlpha === 75000, 'Sous-total Alpha calculé à 75 000 FCFA (3 x 25 000)');
    assert(subtotalBeta === 130000, 'Sous-total Beta calculé à 130 000 FCFA (2 x 65 000)');
    assert(subtotalAlpha !== subtotalBeta, 'Isolation financière stricte entre les deux boutiques');
  }

  console.log('\n================================================================');
  console.log(`RÉSULTAT DU TEST DE NON-RÉGRESSION : ${passedTests} passés, ${failedTests} échoués`);
  console.log('================================================================');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runRegressionTests().catch((err) => {
  console.error('Erreur inattendue dans la suite de tests :', err);
  process.exit(1);
});
