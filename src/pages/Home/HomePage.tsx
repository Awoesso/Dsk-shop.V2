import React from 'react';
import {
  ArrowRight,
  Truck,
  RotateCcw,
  Headphones,
  Laptop,
  Shirt,
  BookOpen,
  Home as HomeIcon,
  Sparkles,
  Package,
  Layers,
  Sparkle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Clock,
  HelpCircle,
  Cpu,
  ShieldCheck,
  Zap,
  Check,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Hero } from '../../components/Home/Hero';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { SEO } from '../../components/SEO/SEO';
import { ProductCategory } from '../../types';
import { getCategoryProductCounts, filterActiveCategories } from '../../utils/categoryUtils';

interface CategoryItem {
  id: ProductCategory;
  name: string;
  countLabel: string;
  description: string;
  icon: React.ElementType;
}

const HOME_CATEGORIES: CategoryItem[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    countLabel: 'Tech & Accessoires',
    description: 'Smartphones, audio haute fidélité, matériel informatique et accessoires connectés.',
    icon: Laptop,
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    countLabel: 'Vêtements & Style',
    description: 'Sélection textile tendance, prêt-à-porter urbain et pièces élégantes pour Lomé.',
    icon: Shirt,
  },
  {
    id: 'Books',
    name: 'E-books',
    countLabel: 'Lectures & Formats',
    description: 'Guides pratiques, e-books professionnels et lectures inspirantes en format digital.',
    icon: BookOpen,
  },
  {
    id: 'Home',
    name: 'Home',
    countLabel: 'Maison & Confort',
    description: 'Objets du quotidien, petits électroménagers et accessoires décoratifs durables.',
    icon: HomeIcon,
  },
  {
    id: 'Beauty',
    name: 'Beauty',
    countLabel: 'Soins & Bien-être',
    description: 'Soins corporels, rituels bien-être et cosmétiques adaptés à notre climat.',
    icon: Sparkles,
  },
  {
    id: 'Accessories',
    name: 'Other & Accessories',
    countLabel: 'Accessoires & Divers',
    description: 'Maroquinerie, montres, câbles renforcés et indispensables du quotidien.',
    icon: Package,
  },
];

export const HomePage: React.FC = () => {
  const { products, navigateTo, setFilters } = useShop();

  // 1. Produits populaires: priorise les articles mis en avant / plus consultés (5 sur desktop, 2 par ligne sur mobile)
  const popularProducts = React.useMemo(() => {
    if (products.length <= 5) return products;
    const featured = products.filter((p) => p.isFeatured || p.isBestSeller);
    if (featured.length >= 5) return featured.slice(0, 5);
    const remaining = products.filter((p) => !featured.some((f) => f.id === p.id));
    return [...featured, ...remaining].slice(0, 5);
  }, [products]);

  // 2. Nouveautés: articles récents (5 sur desktop, 2 par ligne sur mobile)
  const newProducts = React.useMemo(() => {
    if (products.length <= 5) return products;
    const news = products.filter((p) => p.isNew);
    if (news.length >= 5) return news.slice(0, 5);
    const candidateList = [...products].reverse();
    return candidateList.slice(0, 5);
  }, [products]);

  // Dynamically calculate product counts per category
  const categoryCounts = React.useMemo(() => {
    return getCategoryProductCounts(products);
  }, [products]);

  // Only keep categories that have at least 1 product (hide if 0, null, or empty)
  const activeCategories = React.useMemo(() => {
    return filterActiveCategories(HOME_CATEGORIES, categoryCounts);
  }, [categoryCounts]);

  // Handle category navigation
  const handleCategoryClick = (categoryId: ProductCategory) => {
    setFilters({ category: categoryId, searchQuery: '', sortBy: 'featured' });
    navigateTo('shop', { category: categoryId });
  };

  const handleSeeAll = (sortBy: 'featured' | 'newest' = 'featured') => {
    setFilters({ category: 'all', searchQuery: '', sortBy });
    navigateTo('shop');
  };

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-24 pb-28 sm:pb-20 font-secondary text-on-surface">
      {/* Dynamic SEO Meta Tags with Rich Descriptions & Keywords */}
      <SEO
        title="DSK Shop Lomé · E-commerce de confiance, High-Tech & Essentiels au Togo"
        description="Achetez juste, recevez vite. DSK Shop est la plateforme e-commerce de référence à Lomé, Togo : produits vérifiés en stock réel, livraison express sous 24h, paiement sécurisé par T-Money, Flooz ou à la livraison."
        type="website"
        breadcrumbs={[{ name: 'Accueil', url: '/' }]}
        keywords={[
          'DSK Shop',
          'DSK-Shop Lomé',
          'e-commerce Lomé Togo',
          'achat en ligne Lomé',
          'boutique high-tech Togo',
          'livraison rapide Lomé',
          'paiement T-Money Flooz Togo',
          'informatique Lomé',
          'accessoires smartphone Togo',
          'articles garantis Lomé',
        ]}
      />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Catégories Section (Cachée si aucune catégorie n'a de produits, et affiche uniquement les catégories ayant au moins 1 produit) */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider font-primary mb-1.5">
                Rayons & Collections
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
                Explorez nos univers de produits à Lomé
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
                Articles certifiés et immédiatement disponibles en stock pour livraison sur tout le Grand Lomé.
              </p>
            </div>
            <button
              onClick={() => handleSeeAll('featured')}
              className="text-xs sm:text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 font-primary cursor-pointer shrink-0 self-start sm:self-auto min-h-[36px]"
            >
              <span>Explorer tout le catalogue</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Grille de catégories actives (valeur > 0 uniquement) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-5">
            {activeCategories.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="group p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-surface-variant/70 hover:border-primary/60 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    {/* Protected icon container: ensures clear visibility on any device */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-container-low group-hover:bg-primary-fixed text-primary border border-surface-variant/60 flex items-center justify-center transition-colors mb-2.5 sm:mb-3">
                      <Icon size={19} className="sm:w-[22px] sm:h-[22px] stroke-[2]" />
                    </div>
                    <h3 className="text-xs sm:text-base font-bold text-on-surface font-primary group-hover:text-primary transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-primary mt-0.5 block">
                      {count} {count > 1 ? 'articles' : 'article'}
                    </span>
                    <p className="text-[10px] sm:text-[11px] text-on-surface-variant mt-1 line-clamp-2 leading-relaxed hidden min-[360px]:block opacity-85">
                      {cat.description}
                    </p>
                  </div>
                  {/* Subtle separator */}
                  <div className="mt-2.5 sm:mt-3 pt-2 border-t border-surface-variant/50 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform font-primary">
                    <span>Explorer</span>
                    <ArrowRight size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Produits populaires Section (données de Supabase) */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider font-primary mb-1.5">
              <Sparkle size={12} className="text-surface-tint" /> Les plus demandés à Lomé
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Produits populaires & meilleures ventes
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Articles testés et vérifiés avant expédition pour garantir un fonctionnement immédiat.
            </p>
          </div>
          <button
            onClick={() => handleSeeAll('featured')}
            className="text-xs sm:text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 font-primary cursor-pointer shrink-0 self-start sm:self-auto min-h-[36px]"
          >
            <span>Voir tous les populaires</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {popularProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-surface-variant p-6">
            <p className="text-sm text-on-surface-variant">
              Les produits enregistrés apparaîtront ici automatiquement.
            </p>
          </div>
        )}
      </section>

      {/* 5. Bannière / Collection mise en avant avec texte descriptif */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-primary text-white p-5 sm:p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 border border-primary-container shadow-md">
          <div
            className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-surface-tint/25 blur-2xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-16 -bottom-16 w-60 h-60 rounded-full bg-primary-container/40 blur-xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl text-center lg:text-left space-y-3 sm:space-y-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container border border-on-primary-fixed-variant text-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
              <Layers size={13} /> Sélection exclusive DSK Shop Lomé
            </span>
            <h2 className="text-xl min-[400px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-primary leading-tight">
              Découvrez notre collection phare du moment
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-primary-fixed/90 leading-relaxed font-secondary">
              Équipements de pointe et accessoires du quotidien sélectionnés pour leur robustesse et leur tarif accessible sans frais cachés.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-xs text-primary-fixed-dim">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary-fixed" /> Stocks réels et vérifiés
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary-fixed" /> Tarifs clairs en Francs CFA
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-primary-fixed" /> Remise en main propre
              </span>
            </div>
          </div>

          <div className="relative z-10 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleSeeAll('featured')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-surface-container-low text-primary text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-primary active:scale-98 min-h-[46px]"
            >
              <span>Explorer toute la collection</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Nouveautés Section */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed text-[11px] font-bold uppercase tracking-wider font-primary mb-1.5">
              <Sparkles size={12} className="text-surface-tint" /> Derniers arrivages
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Nouveautés fraîchement arrivées en rayon
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Dernières innovations technologiques et accessoires tendance en direct de nos magasins partenaires.
            </p>
          </div>
          <button
            onClick={() => handleSeeAll('newest')}
            className="text-xs sm:text-sm font-bold text-primary hover:text-primary-container flex items-center gap-1 font-primary cursor-pointer shrink-0 self-start sm:self-auto min-h-[36px]"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {newProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-2.5 sm:gap-4 xl:gap-5">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-surface-variant p-6">
            <p className="text-sm text-on-surface-variant">
              Les nouveautés apparaîtront ici dès leur enregistrement.
            </p>
          </div>
        )}
      </section>

      {/* SECTION ÉDITORIALE SEO : Proposition de valeur unique & Mission à Lomé */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-gradient-to-b from-surface-container-low to-white rounded-3xl border border-surface-variant p-6 sm:p-10 lg:p-12 shadow-xs space-y-8">
          
          {/* Header de la section éditoriale */}
          <div className="max-w-3xl space-y-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
              <Zap size={14} className="text-surface-tint" /> Notre Vision & Engagement
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface tracking-tight font-primary leading-tight">
              La promesse DSK-Shop : réinventer l&apos;e-commerce de confiance à Lomé
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Une expérience d&apos;achat fluide, transparente et 100% pensée pour le quotidien togolais.
            </p>
          </div>

          {/* 3 Blocs piliers : Proposition de valeur, Mission locale, Engagement technologique */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* Pilier 1 : Proposition de valeur unique */}
            <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <ShieldCheck size={26} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                  Une proposition de valeur sans compromis
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Tous les articles sont en stock réel à Lomé et contrôlés avant expédition.
                </p>
              </div>
              <ul className="space-y-2 pt-3 border-t border-surface-variant text-xs text-on-surface font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Transparence absolue des prix en FCFA</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Zéro frais d&apos;importation caché</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Droit d&apos;inspection à la livraison</span>
                </li>
              </ul>
            </div>

            {/* Pilier 2 : Mission à Lomé */}
            <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <MapPin size={26} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                  Notre mission ancrée à Lomé & au Togo
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Livraison express et remise en main propre rapide à Agoè, Tokoin, Hédzranawoé, Baguida ou Bè.
                </p>
              </div>
              <ul className="space-y-2 pt-3 border-t border-surface-variant text-xs text-on-surface font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Livraison express en moins de 24h</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Paiements mobiles T-Money & Flooz</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Équipe support locale basée au Togo</span>
                </li>
              </ul>
            </div>

            {/* Pilier 3 : Engagement technologique */}
            <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <Cpu size={26} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                  Notre engagement technologique & qualité
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Matériel certifié, batteries fiables et fiches techniques détaillées pour chaque modèle.
                </p>
              </div>
              <ul className="space-y-2 pt-3 border-t border-surface-variant text-xs text-on-surface font-medium">
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Composants fiables & testés</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Fiches techniques précises & claires</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-surface-tint shrink-0" />
                  <span>Garantie d&apos;échange sans tracasseries</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Paragraphe conclusif pour le SEO */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-surface-variant text-xs text-on-surface-variant leading-relaxed space-y-1.5">
            <p>
              <strong className="text-on-surface font-semibold">Faire confiance à DSK-Shop Lomé</strong>, c&apos;est choisir un commerçant de proximité qui met la technologie et le service client au cœur de son fonctionnement. Commandez en quelques clics sans inscription obligatoire et suivez votre commande jusqu&apos;à votre porte.
            </p>
            <p>
              Besoin d&apos;un conseil sur la compatibilité d&apos;un équipement ? Notre équipe togolais est disponible via WhatsApp pour vous assister directement.
            </p>
          </div>

        </div>
      </section>

      {/* 7. Pourquoi DSK Shop ? (Détaillé avec paragraphes explicatifs scannables) */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-surface-variant p-5 sm:p-10 lg:p-12 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary mb-2">
              Confiance & Sécurité
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-on-surface font-primary tracking-tight">
              Pourquoi choisir DSK Shop ?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
              Une expérience d&apos;achat fluide, transparente et adaptée à votre quotidien au Togo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Avantage 1: Livraison rapide */}
            <div className="flex flex-col p-6 rounded-2xl bg-surface-container-low border border-surface-variant/80 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-4">
                <Truck size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                Livraison rapide & fiable
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5 font-primary">
                Sous 24h ouvrées à Lomé
              </p>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Articles disponibles en stock local. Réception le jour même ou sous 24h à domicile ou au bureau.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-variant text-[11px] text-primary font-semibold flex items-center gap-1">
                <MapPin size={13} /> Couverture complète de la capitale togolaise
              </div>
            </div>

            {/* Avantage 2: Paiement sécurisé */}
            <div className="flex flex-col p-6 rounded-2xl bg-surface-container-low border border-surface-variant/80 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-4">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                Paiement flexible & sécurisé
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5 font-primary">
                T-Money, Flooz ou à la livraison
              </p>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Réglez en Mobile Money ou en espèces au coursier après vérification de votre colis.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-variant text-[11px] text-primary font-semibold flex items-center gap-1">
                <CreditCard size={13} /> Zéro mauvaise surprise, reçus clairs
              </div>
            </div>

            {/* Avantage 3: Support réactif */}
            <div className="flex flex-col p-6 rounded-2xl bg-surface-container-low border border-surface-variant/80 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-4">
                <Headphones size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-on-surface font-primary">
                Assistance locale & réactive
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5 font-primary">
                Équipe basée à Lomé, joignable 7j/7
              </p>
              <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                Échangez directement avec des conseillers locaux pour vos questions ou un échange rapide.
              </p>
              <div className="mt-4 pt-3 border-t border-surface-variant text-[11px] text-primary font-semibold flex items-center gap-1">
                <Clock size={13} /> Réponse garantie en moins d&apos;une heure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section explicative : Comment ça marche ? */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-variant p-5 sm:p-10 lg:p-12">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Commander sur DSK Shop en 3 étapes faciles
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
              Un parcours pensé pour vous simplifier la vie, du choix de l&apos;article jusqu&apos;à la réception.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-surface-variant flex flex-col items-center text-center">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold flex items-center justify-center font-primary text-sm mb-2.5 sm:mb-3">
                1
              </span>
              <h3 className="font-bold text-sm sm:text-base text-on-surface font-primary">
                Sélectionnez vos articles
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 sm:mt-2 leading-relaxed">
                Naviguez par catégories, comparez les prix en Francs CFA et ajoutez vos coups de cœur au panier.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-surface-variant flex flex-col items-center text-center">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold flex items-center justify-center font-primary text-sm mb-2.5 sm:mb-3">
                2
              </span>
              <h3 className="font-bold text-sm sm:text-base text-on-surface font-primary">
                Validez votre livraison
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 sm:mt-2 leading-relaxed">
                Renseignez votre quartier à Lomé et contact. Notre équipe vous contacte pour convenir du créneau.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-xl sm:rounded-2xl border border-surface-variant flex flex-col items-center text-center">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-fixed text-on-primary-fixed font-extrabold flex items-center justify-center font-primary text-sm mb-2.5 sm:mb-3">
                3
              </span>
              <h3 className="font-bold text-base text-on-surface font-primary">
                Recevez et profitez
              </h3>
              <p className="text-xs text-on-surface-variant mt-1.5 sm:mt-2 leading-relaxed">
                Vérifiez votre colis en main propre à la remise et réglez en toute tranquillité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ / Questions fréquentes */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-surface-variant p-5 sm:p-10 lg:p-12 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
                <HelpCircle size={14} /> Questions fréquentes
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
                Tout ce que vous devez savoir avant de commander
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant">
                Les réponses claires aux interrogations les plus courantes de nos clients à Lomé.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface-container-low border border-surface-variant">
                <h3 className="font-bold text-sm sm:text-base text-on-surface font-primary">
                  Combien de temps prend la livraison à Lomé ?
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Toute commande confirmée avant 14h est généralement livrée le jour même ou sous 24h maximum dans tous les quartiers de Lomé (Agoè, Tokoin, Bè, Hédzranawoé, Baguida, etc.).
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface-container-low border border-surface-variant">
                <h3 className="font-bold text-sm sm:text-base text-on-surface font-primary">
                  Puis-je payer en espèces à la livraison ?
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Oui, tout à fait. Vous pouvez régler par T-Money, Flooz ou payer en liquide directement au livreur une fois votre colis inspecté.
                </p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-surface-container-low border border-surface-variant">
                <h3 className="font-bold text-sm sm:text-base text-on-surface font-primary">
                  Que faire si un article ne me convient pas ?
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Nous appliquons une politique de garantie et de retour simplifiée. Si l&apos;article présente une non-conformité, contactez simplement notre service client via WhatsApp pour un échange sans complications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA final engageant */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="rounded-2xl sm:rounded-3xl bg-surface-container-low border border-surface-variant p-6 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
            Catalogue complet en ligne
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
            Prêt à trouver ce qu&apos;il vous faut aujourd&apos;hui ?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Rejoignez des centaines de clients satisfaits à Lomé. Parcourez notre boutique, filtrez par prix ou par rayon et faites-vous livrer en toute tranquillité.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => handleSeeAll('featured')}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary hover:bg-primary-container text-white text-sm font-extrabold rounded-xl transition-all shadow-xs cursor-pointer font-primary active:scale-98 w-full sm:w-auto min-h-[46px]"
            >
              <span>Explorer la boutique</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-surface text-on-surface hover:text-primary border border-surface-variant text-sm font-bold rounded-xl transition-all shadow-xs cursor-pointer font-primary active:scale-98 w-full sm:w-auto min-h-[46px]"
            >
              <span>Besoin d&apos;aide ? Contactez-nous</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
