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
  icon: React.ElementType;
}

const HOME_CATEGORIES: CategoryItem[] = [
  {
    id: 'Electronics',
    name: 'Electronics',
    countLabel: 'Tech & Accessoires',
    icon: Laptop,
  },
  {
    id: 'Fashion',
    name: 'Fashion',
    countLabel: 'Vêtements & Style',
    icon: Shirt,
  },
  {
    id: 'Books',
    name: 'E-books',
    countLabel: 'Lectures & Formats',
    icon: BookOpen,
  },
  {
    id: 'Home',
    name: 'Home',
    countLabel: 'Maison & Confort',
    icon: HomeIcon,
  },
  {
    id: 'Beauty',
    name: 'Beauty',
    countLabel: 'Soins & Bien-être',
    icon: Sparkles,
  },
  {
    id: 'Accessories',
    name: 'Other & Accessories',
    countLabel: 'Accessoires & Divers',
    icon: Package,
  },
];

export const HomePage: React.FC = () => {
  const { products, navigateTo, setFilters } = useShop();

  // 1. Produits populaires
  const popularProducts = React.useMemo(() => {
    if (products.length <= 5) return products;
    const featured = products.filter((p) => p.isFeatured || p.isBestSeller);
    if (featured.length >= 5) return featured.slice(0, 5);
    const remaining = products.filter((p) => !featured.some((f) => f.id === p.id));
    return [...featured, ...remaining].slice(0, 5);
  }, [products]);

  // 2. Nouveautés
  const newProducts = React.useMemo(() => {
    if (products.length <= 5) return products;
    const news = products.filter((p) => p.isNew);
    if (news.length >= 5) return news.slice(0, 5);
    const candidateList = [...products].reverse();
    return candidateList.slice(0, 5);
  }, [products]);

  // Compte dynamique des produits par catégorie
  const categoryCounts = React.useMemo(() => {
    return getCategoryProductCounts(products);
  }, [products]);

  // Filtre les catégories ayant au moins 1 produit
  const activeCategories = React.useMemo(() => {
    return filterActiveCategories(HOME_CATEGORIES, categoryCounts);
  }, [categoryCounts]);

  const handleCategoryClick = (categoryId: ProductCategory) => {
    setFilters({ category: categoryId, searchQuery: '', sortBy: 'featured' });
    navigateTo('shop', { category: categoryId });
  };

  const handleSeeAll = (sortBy: 'featured' | 'newest' = 'featured') => {
    setFilters({ category: 'all', searchQuery: '', sortBy });
    navigateTo('shop');
  };

  return (
    <div className="space-y-10 sm:space-y-16 lg:space-y-24 pb-28 sm:pb-20 font-secondary text-on-surface overflow-x-hidden">
      {/* SEO */}
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

      {/* Hero Section */}
      <Hero />

      {/* Catégories Section */}
      {activeCategories.length > 0 && (
        <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
                Explorez nos univers de produits à Lomé
              </h2>
              <p className="text-[10px] sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
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

          {/* Container Mobile Horizontal Scroll (3 visibles) / Grille Desktop */}
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4 lg:gap-5 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-2 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4 sm:mx-0 sm:px-0">
            {activeCategories.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.id] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="snap-start shrink-0 w-[calc((100vw-32px-16px)/3)] sm:w-auto group p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-surface-variant/70 hover:border-primary/60 shadow-xs hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-surface-container-low group-hover:bg-primary-fixed text-primary border border-surface-variant/60 flex items-center justify-center transition-colors mb-2 sm:mb-3">
                      <Icon size={18} className="sm:w-[22px] sm:h-[22px] stroke-[2]" />
                    </div>
                    <h3 className="text-xs sm:text-base font-bold text-on-surface font-primary group-hover:text-primary transition-colors truncate">
                      {cat.name}
                    </h3>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-primary mt-0.5 block truncate">
                      {count} {count > 1 ? 'articles' : 'article'}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-3 pt-2 border-t border-surface-variant/50 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-primary group-hover:translate-x-0.5 transition-transform font-primary">
                    <span>Explorer</span>
                    <ArrowRight size={12} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Produits populaires Section */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Produits populaires & meilleures ventes
            </h2>
            <p className="text-[10px] sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
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

      {/* Bannière / Collection mise en avant */}
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
            <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold tracking-tight font-primary leading-tight">
              Découvrez notre collection phare du moment
            </h2>
            <p className="text-[10px] sm:text-sm text-primary-fixed/90 leading-relaxed font-secondary">
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

      {/* Nouveautés Section */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Nouveautés fraîchement arrivées en rayon
            </h2>
            <p className="text-[10px] sm:text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
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

      {/* SECTION ÉDITORIALE SEO */}
    
      {/* Pourquoi DSK Shop ? */}
   

      {/* Comment ça marche ? */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-surface-container-low rounded-2xl sm:rounded-3xl border border-surface-variant p-5 sm:p-10 lg:p-12">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
            <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
              Commander sur DSK Shop en 3 étapes faciles
            </h2>
            <p className="text-[10px] sm:text-sm text-on-surface-variant mt-1.5">
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

      {/* FAQ */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-surface-variant p-5 sm:p-10 lg:p-12 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-6 sm:mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
                <HelpCircle size={14} /> Questions fréquentes
              </span>
              <h2 className="text-sm sm:text-xl lg:text-3xl font-extrabold text-on-surface font-primary tracking-tight">
                Tout ce que vous devez savoir avant de commander
              </h2>
              <p className="text-[10px] sm:text-sm text-on-surface-variant">
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
                  Si le produit présente un problème ou ne correspond pas à la fiche technique, vous disposez d&apos;un droit de retour ou d&apos;échange rapide sous 48h en contactant directement notre support client via WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};