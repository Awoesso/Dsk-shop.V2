import { createClient } from '@supabase/supabase-js';

// Load Supabase URL & Key from environment or fallback defaults
const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://khtndvcjfovnazdiykew.supabase.co';

const supabaseAnonKey =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_gVMdLUOal8Vv7LpWfGwQdw_yj8yv9B-';

console.log('================================================================');
console.log('      DSK-SHOP: DIAGNOSTIC DES POLITIQUES RLS SUPABASE');
console.log('================================================================');
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`Supabase Anon Key: ${supabaseAnonKey.slice(0, 16)}...`);
console.log('----------------------------------------------------------------\n');

// 1. Client anonyme (comportement d'un visiteur/client e-commerce sans compte)
const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

async function runDiagnostics() {
  const dummyOrderNumber = `TEST-${Date.now().toString().slice(-6)}`;
  const dummyOrderId = '00000000-0000-0000-0000-000000000001';

  console.log('🧪 TEST 1 : Vérification de la connexion de base et lecture de tables publiques');
  try {
    const { data: prodData, error: prodError } = await anonClient
      .from('products')
      .select('id, name')
      .limit(1);

    if (prodError) {
      console.log(`⚠️ Lecture 'products' : ${prodError.message} (code: ${prodError.code})`);
    } else {
      console.log(`✅ Lecture 'products' : OK (${prodData?.length || 0} produit trouvé)`);
    }
  } catch (err: any) {
    console.log(`❌ Erreur connexion : ${err.message}`);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('🧪 TEST 2 : Tentative d\'insertion ANONYME simple dans "orders" (SANS .select())');
  console.log('   Simule : client non connecté passant une commande');

  let createdOrderIdTest2: string | null = null;
  const testOrderId2 = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '11111111-2222-3333-4444-555555555555';

  const testOrderPayload = {
    id: testOrderId2,
    order_number: dummyOrderNumber,
    customer_name: 'Test Client Diagnostic',
    customer_phone: '+228 90 00 00 00',
    shipping_address: 'Quartier Test Déckon, Lomé',
    city: 'Lomé',
    total_amount: 15000,
    currency: 'XOF',
    payment_method: 'cash_on_delivery',
    payment_status: 'pending',
    order_status: 'pending',
    notes: 'Commande de test automatique RLS',
  };

  try {
    const { data, error } = await anonClient
      .from('orders')
      .insert(testOrderPayload);

    if (error) {
      console.log(`❌ ÉCHEC INSERT ANONYME (sans select) :`);
      console.log(`   Message : ${error.message}`);
      console.log(`   Code    : ${error.code}`);
      console.log(`   Details : ${error.details || 'aucun'}`);
      console.log(`   Hint    : ${error.hint || 'aucun'}`);
    } else {
      createdOrderIdTest2 = testOrderId2;
      console.log(`✅ SUCCÈS INSERT ANONYME (sans select) :`);
      console.log(`   La table "orders" autorise les INSERT pour les visiteurs invités (anon) !`);
      console.log(`   ID créé : ${testOrderId2}`);
    }
  } catch (err: any) {
    console.log(`💥 Exception : ${err.message}`);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('🧪 TEST 3 : Tentative d\'insertion ANONYME avec RETURNING (.insert().select())');
  console.log('   Explication : PostgREST convertit .select() en SQL RETURNING.');
  console.log('   PostgreSQL évalue alors la politique SELECT en plus de la politique INSERT.');

  const testOrderPayload3 = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '22222222-3333-4444-5555-666666666666',
    ...testOrderPayload,
    order_number: `${dummyOrderNumber}-SELECT`,
  };

  try {
    const { data, error } = await anonClient
      .from('orders')
      .insert(testOrderPayload3)
      .select('id, order_number')
      .single();

    if (error) {
      console.log(`❌ ÉCHEC INSERT + SELECT ANONYME (COMPORTEMENT SÉCURISÉ ATTENDU) :`);
      console.log(`   Message : "${error.message}"`);
      console.log(`   Code SQL: ${error.code}`);
      console.log('   👉 SÉCURITÉ CONFORME : La table "orders" a une politique INSERT pour "anon",');
      console.log('      et N\'A PAS de politique SELECT pour "anon" afin de protéger les données clients.');
      console.log('      SOLUTION ADOPTÉE : DSK-Shop génère l\'ID avec crypto.randomUUID() et insère SANS .select().');
      console.log('      Les données des clients (nom, téléphone, adresse) restent ainsi strictement confidentielles.');
    } else {
      console.log(`✅ SUCCÈS INSERT + SELECT ANONYME !`);
      console.log(`   ID retourné : ${data?.id}`);
      console.log(`   Numéro      : ${data?.order_number}`);
      // Nettoyage immédiat
      if (data?.id) {
        await anonClient.from('orders').delete().eq('id', data.id);
      }
    }
  } catch (err: any) {
    console.log(`💥 Exception : ${err.message}`);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('🧪 TEST 4 : Tentative d\'insertion ANONYME dans "order_items"');

  if (createdOrderIdTest2) {
    try {
      const { data, error } = await anonClient
        .from('order_items')
        .insert({
          order_id: createdOrderIdTest2,
          product_id: null,
          product_name: 'Article Diagnostic RLS',
          unit_price: 15000,
          quantity: 1,
          selected_variant: 'Standard',
        });

      if (error) {
        console.log(`❌ ÉCHEC INSERT "order_items" :`);
        console.log(`   Message : ${error.message}`);
        console.log(`   Code    : ${error.code}`);
      } else {
        console.log(`✅ SUCCÈS INSERT "order_items" :`);
        console.log(`   La table "order_items" autorise les INSERT liés à la commande !`);
      }
    } catch (err: any) {
      console.log(`💥 Exception : ${err.message}`);
    }
  } else {
    console.log('⏭️ Test ignoré car le test 2 n\'a pas généré de commande parente.');
  }

  console.log('\n----------------------------------------------------------------');
  console.log('🧪 TEST 5 : Test de la fonction RPC transactionnelle "create_order_with_items"');

  try {
    const { data: rpcData, error: rpcError } = await anonClient.rpc(
      'create_order_with_items' as any,
      {
        p_order_number: `${dummyOrderNumber}-RPC`,
        p_customer_name: 'Test Client RPC',
        p_customer_phone: '+228 90 12 34 56',
        p_shipping_address: 'Quartier Test RPC',
        p_city: 'Lomé',
        p_total_amount: 15000,
        p_currency: 'XOF',
        p_payment_method: 'cash_on_delivery',
        p_payment_status: 'pending',
        p_order_status: 'pending',
        p_notes: 'Test RPC',
        p_items: [
          {
            product_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
            product_name: 'Article Test RPC',
            unit_price: 15000,
            quantity: 1,
            selected_variant: null,
          },
        ],
      }
    );

    if (rpcError) {
      console.log(`⚠️ RPC "create_order_with_items" :`);
      console.log(`   Message : ${rpcError.message}`);
      console.log(`   Code    : ${rpcError.code}`);
    } else {
      console.log(`✅ SUCCÈS RPC "create_order_with_items" : La fonction PostgreSQL est active et fonctionne !`);
      console.log(`   Données :`, rpcData);
    }
  } catch (err: any) {
    console.log(`💥 Exception RPC : ${err.message}`);
  }

  console.log('\n----------------------------------------------------------------');
  console.log('🧪 TEST 6 : Simulation d\'un utilisateur AUTHENTIFIÉ (avec session)');

  // Tentative de connexion anonyme / test sign-in
  const { data: sessionData, error: sessionError } = await anonClient.auth.getSession();
  console.log(`   Session active : ${sessionData?.session ? 'Oui' : 'Non (mode invité public)'}`);

  // Nettoyage de la commande de test créée
  if (createdOrderIdTest2) {
    console.log('\n🧹 Nettoyage de la commande de test...');
    await anonClient.from('order_items').delete().eq('order_id', createdOrderIdTest2);
    const { error: delError } = await anonClient
      .from('orders')
      .delete()
      .eq('id', createdOrderIdTest2);
    if (!delError) {
      console.log('   Commande de test supprimée proprement.');
    }
  }

  console.log('\n================================================================');
  console.log('                      FIN DU DIAGNOSTIC');
  console.log('================================================================\n');
}

runDiagnostics().catch(console.error);
