/**
 * Test Suite: DSK-Shop Storefront Template Engine
 * Verifies template registration, fallback mechanisms, theme isolation,
 * and storefront service contract compliance.
 *
 * Run with: npx tsx scripts/test-template-engine.ts
 */

import { templateRegistry } from '../src/templates/storefront/registry/templateRegistry';
import { StorefrontService, DEMO_STORES } from '../src/services/storefrontService';
import { StoreTheme } from '../src/types/storefront';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('   DSK-SHOP & NEXA: STOREFRONT TEMPLATE ENGINE TEST SUITE');
  console.log('================================================================\n');

  // TEST 1: Template Registry Built-ins
  console.log('🧪 TEST 1 : Vérification de l’enregistrement des templates initiaux');
  const allTemplates = templateRegistry.getAllTemplates();
  assert(allTemplates.length >= 3, `Au moins 3 templates sont enregistrés (${allTemplates.length} trouvés)`);

  const fashion = templateRegistry.getTemplate('fashion');
  assert(fashion.id === 'fashion' && fashion.category === 'fashion', 'Template "fashion" correctement enregistré avec sa catégorie');

  const tech = templateRegistry.getTemplate('tech');
  assert(tech.id === 'tech' && tech.category === 'tech', 'Template "tech" correctement enregistré avec sa catégorie');

  const general = templateRegistry.getTemplate('general');
  assert(general.id === 'general' && general.category === 'general', 'Template "general" correctement enregistré avec sa catégorie');

  // TEST 2: Fallback on unknown or invalid template ID
  console.log('\n🧪 TEST 2 : Comportement de repli sécurisé (Unknown Template ID)');
  const unknownTemplate = templateRegistry.getTemplate('non-existent-template-id');
  assert(unknownTemplate !== null && unknownTemplate !== undefined, 'Le template inconnu ne renvoie pas null ou undefined');
  assert(unknownTemplate.id === 'general', 'Le template inconnu se replie de façon prévisible sur le template par défaut "general"');

  const nullTemplate = templateRegistry.getTemplate(null);
  assert(nullTemplate.id === 'general', 'Un identifiant null se replie de façon prévisible sur "general"');

  // TEST 3: Theme Validation and Default Properties
  console.log('\n🧪 TEST 3 : Validation des paramètres de thèmes par défaut');
  const fashionTheme = templateRegistry.getDefaultThemeForTemplate('fashion');
  assert(fashionTheme.colors.primary.startsWith('#'), 'La couleur primaire de fashion est un code hexadécimal valide');
  assert(fashionTheme.typography.headingFont === 'Playfair Display', 'La typographie de fashion utilise Playfair Display');
  assert(fashionTheme.layout.productGridColumns === 3, 'La grille fashion est configurée en 3 colonnes');

  const techTheme = templateRegistry.getDefaultThemeForTemplate('tech');
  assert(techTheme.typography.headingFont === 'Space Grotesk', 'La typographie de tech utilise Space Grotesk');
  assert(techTheme.layout.productGridColumns === 4, 'La grille tech est configurée en 4 colonnes');
  assert(techTheme.sections.showPromoBanner === true, 'Le bandeau promo est activé par défaut sur tech');

  // TEST 4: Multi-Store Configuration Isolation
  console.log('\n🧪 TEST 4 : Isolation stricte des thèmes entre deux boutiques');
  const storeA = DEMO_STORES['lome-elegance'];
  const storeB = DEMO_STORES['cyber-lome'];

  assert(storeA.identity.slug !== storeB.identity.slug, 'Les deux boutiques ont des slugs distincts');
  assert(storeA.theme.templateId === 'fashion', 'La boutique A utilise le template fashion');
  assert(storeB.theme.templateId === 'tech', 'La boutique B utilise le template tech');
  assert(storeA.theme.colors.primary !== storeB.theme.colors.primary, 'Les couleurs primaires des deux boutiques sont totalement isolées');

  // Modifying store A's theme must not affect store B
  const clonedThemeA: StoreTheme = JSON.parse(JSON.stringify(storeA.theme));
  clonedThemeA.colors.primary = '#ff0000';
  assert(storeB.theme.colors.primary !== '#ff0000', 'La modification de la boutique A n’altère aucunement la boutique B');

  // TEST 5: StorefrontService Resolution & Fallbacks
  console.log('\n🧪 TEST 5 : Résolution par le StorefrontService');
  const resOfficial = await StorefrontService.getStorefrontBySlug('dsk-official');
  assert(resOfficial.data !== null, 'DSK Officiel est résolu sans erreur');
  assert(resOfficial.data?.identity.name === 'DSK-Shop Officiel', 'Le nom de DSK Officiel correspond aux données');

  const resFashion = await StorefrontService.getStorefrontBySlug('lome-elegance');
  assert(resFashion.data !== null && resFashion.data?.theme.templateId === 'fashion', 'Lomé Élégance est résolu avec le template fashion');

  const resUnknown = await StorefrontService.getStorefrontBySlug('unknown-store-slug');
  assert(resUnknown.data !== null, 'Une boutique inconnue se replie gracieusement sur la boutique de démonstration par défaut');

  // TEST 6: Adding a New Template (Extensibility Demonstration)
  console.log('\n🧪 TEST 6 : Extensibilité - Enregistrement dynamique d’un 4ème template');
  const MockBeautyComponent: any = () => null;
  templateRegistry.registerTemplate({
    id: 'beauty',
    name: 'Atelier Cosmétique & Beauté',
    slug: 'beauty',
    description: 'Design doux aux teintes pastel pour soins, parfums et cosmétiques.',
    category: 'beauty',
    version: '1.0.0',
    author: 'Nexa Community',
    previewImage: '/Harmonie.png',
    component: MockBeautyComponent,
    defaultTheme: {
      ...general.defaultTheme,
      templateId: 'beauty',
      colors: {
        ...general.defaultTheme.colors,
        primary: '#be185d',
        accent: '#fbcfe8',
      },
    },
    supportedFeatures: ['Nuancier teintes', 'Routine beauté'],
    isAvailable: true,
  });

  const beauty = templateRegistry.getTemplate('beauty');
  assert(beauty.id === 'beauty', 'Le 4ème template "beauty" a été enregistré et récupéré avec succès');
  assert(beauty.category === 'beauty', 'La catégorie "beauty" est prise en compte sans altérer les autres templates');

  // FINAL RECAP
  console.log('\n================================================================');
  console.log(`RÉSULTAT FINAL DU TEST : ${passed} passés, ${failed} échoués`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Erreur inattendue dans la suite de tests :', err);
  process.exit(1);
});
