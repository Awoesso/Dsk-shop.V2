import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductImage } from '../../components/Common/ProductImage';
import { CATEGORIES } from '../../data/products';
import { Hero } from '../../components/Home/Hero';
import { SEO } from '../../components/SEO/SEO';

export const HomePage: React.FC = () => {
  const { products, navigateTo, setFilters, openProduct } = useShop();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 10);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 10);

  const handleExploreCategory = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
  };

  return (
    <div className="space-y-8 sm:space-y-14 lg:space-y-18 pb-16 font-secondary">
      {/* Dynamic SEO Meta Tags & Store JSON-LD */}
      <SEO
        title="DSK-Shop | High-Tech, Audio & Everyday Gear à Lomé"
        description="Boutique en ligne DSK-Shop à Lomé. Téléphones, casques audio, coques de protection, accessoires PC et mode avec livraison offerte à Lomé."
        type="website"
        breadcrumbs={[{ name: 'Accueil', url: '/' }]}
        keywords={[
          'DSK-Shop',
          'Lomé',
          'Togo',
          'e-commerce Lomé',
          'habits et chaussures Lomé',
          'coques téléphone',
          'accessoires PC',
          'livraison gratuite Lomé',
        ]}
      />

      {/* Modern Split-Screen Hero Section */}
      <Hero />

      {/* Featured Categories Grid (2 cols on mobile, 4 on desktop, 4 on 2xl) */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-2.5 sm:px-6 lg:px-8 2xl:px-12 font-secondary">
        <div className="flex items-end justify-between mb-4 sm:mb-6 2xl:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-extrabold text-[#172017] tracking-tight font-primary">
              Collections à la Une
            </h2>
            <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-0.5 sm:mt-1">
              Nos sélections phares d'accessoires et d'équipements pour votre quotidien.
            </p>
          </div>
          <button
            onClick={() => {
              setFilters({ category: 'all', searchQuery: '' });
              navigateTo('shop');
            }}
            className="flex items-center gap-1 text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#166534] hover:text-[#16A34A] font-primary transition-colors cursor-pointer"
          >
            <span>Tout voir</span>
            <ChevronRight size={13} className="2xl:w-4 2xl:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 2xl:gap-8">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleExploreCategory(cat.id)}
              className="group relative h-40 sm:h-56 md:h-64 2xl:h-76 rounded-xl sm:rounded-2xl 2xl:rounded-3xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md border border-[#DDE8DE] transition-all duration-300"
            >
              <ProductImage
                src={cat.image}
                alt={cat.name}
                containerClassName="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14532D]/90 via-[#172017]/40 to-transparent" />

              <div className="absolute inset-x-2.5 sm:inset-x-4 2xl:inset-x-6 bottom-2.5 sm:bottom-4 2xl:bottom-6 flex items-end justify-between font-primary">
                <div>
                  <span className="text-[9px] sm:text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-[#DCFCE7] bg-[#14532D]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-[#DCFCE7]/20">
                    {cat.itemCount} Articles
                  </span>
                  <h3 className="text-xs sm:text-base md:text-lg 2xl:text-xl font-bold text-white group-hover:text-[#DCFCE7] transition-colors mt-1 truncate">
                    {cat.name}
                  </h3>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-2.5 sm:px-6 lg:px-8 2xl:px-12">
        <ProductGrid
          products={featuredProducts}
          title="Produits en Vedette"
          subtitle="Notre sélection d'articles haute performance plébiscités par nos clients à Lomé."
          showToolbar={false}
        />
        <div className="mt-6 sm:mt-8 2xl:mt-10 text-center">
          <button
            onClick={() => {
              setFilters({ category: 'all', searchQuery: '' });
              navigateTo('shop');
            }}
            className="px-5 py-2.5 sm:px-6 sm:py-3 2xl:px-8 2xl:py-4 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs 2xl:text-sm font-primary rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Découvrir les {products.length} produits</span>
            <ArrowRight size={13} className="2xl:w-4 2xl:h-4" />
          </button>
        </div>
      </section>

      {/* Visual Campaign Poster / Affiche Bannière */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-2.5 sm:px-6 lg:px-8 2xl:px-12">
        <div
          id="campaign-poster-banner"
          onClick={() => {
            setFilters({ category: 'all', searchQuery: '' });
            navigateTo('shop');
          }}
          className="group relative w-full h-44 sm:h-60 md:h-76 lg:h-[340px] xl:h-[380px] 2xl:h-[440px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDE8DE] bg-[#F3FAF4] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md"
        >
          <ProductImage
            src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1800&auto=format&fit=crop&q=85"
            alt="DSK-Shop Campaign Poster"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-2.5 sm:px-6 lg:px-8 2xl:px-12">
        <ProductGrid
          products={bestSellers}
          title="Les Coups de Cœur de la Communauté"
          subtitle="Les articles les plus populaires et les mieux notés par notre communauté au Togo."
          showToolbar={false}
        />
      </section>
    </div>
  );
};
