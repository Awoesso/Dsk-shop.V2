import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductGrid } from '../../components/ProductGrid/ProductGrid';
import { ProductImage } from '../../components/Common/ProductImage';
import { CATEGORIES } from '../../data/products';
import { Hero } from '../../components/Home/Hero';

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
      {/* Modern Split-Screen Hero Section */}
      <Hero />

      {/* Featured Categories Grid (2 cols on mobile, 4 on desktop) */}
      <section className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8 font-secondary">
        <div className="flex items-end justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">
              Curated Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#647064] mt-0.5 sm:mt-1">
              Engineered hardware categories crafted for everyday productivity.
            </p>
          </div>
          <button
            onClick={() => {
              setFilters({ category: 'all', searchQuery: '' });
              navigateTo('shop');
            }}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#166534] hover:text-[#16A34A] font-primary transition-colors"
          >
            <span>View All</span>
            <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleExploreCategory(cat.id)}
              className="group relative h-40 sm:h-56 md:h-64 rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-md border border-[#DDE8DE] transition-all duration-300"
            >
              <ProductImage
                src={cat.image}
                alt={cat.name}
                containerClassName="w-full h-full"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14532D]/90 via-[#172017]/40 to-transparent" />

              <div className="absolute inset-x-2.5 sm:inset-x-4 bottom-2.5 sm:bottom-4 flex items-end justify-between font-primary">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#DCFCE7] bg-[#14532D]/80 backdrop-blur-xs px-2 py-0.5 rounded border border-[#DCFCE7]/20">
                    {cat.itemCount} Items
                  </span>
                  <h3 className="text-xs sm:text-base md:text-lg font-bold text-white group-hover:text-[#DCFCE7] transition-colors mt-1 truncate">
                    {cat.name}
                  </h3>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center group-hover:bg-[#16A34A] group-hover:text-white transition-colors shadow-xs flex-shrink-0">
                  <ArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section (2 on mobile, 5 on desktop) */}
      <section className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <ProductGrid
          products={featuredProducts}
          title="Featured In Store"
          subtitle="Hand-selected flagship releases with acclaimed build quality and customer satisfaction."
          showToolbar={false}
        />
        <div className="mt-6 sm:mt-8 text-center">
          <button
            onClick={() => {
              setFilters({ category: 'all', searchQuery: '' });
              navigateTo('shop');
            }}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs font-primary rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
          >
            <span>Explore All {products.length} Products</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </section>

      {/* Visual Campaign Poster / Affiche Bannière */}
      <section className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <div
          id="campaign-poster-banner"
          onClick={() => {
            setFilters({ category: 'all', searchQuery: '' });
            navigateTo('shop');
          }}
          className="group relative w-full h-44 sm:h-60 md:h-76 lg:h-[340px] xl:h-[380px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDE8DE] bg-[#F3FAF4] shadow-xs cursor-pointer transition-all duration-300 hover:shadow-md"
        >
          <ProductImage
            src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1800&auto=format&fit=crop&q=85"
            alt="DSK-Shop Campaign Poster"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        </div>
      </section>

      {/* Best Sellers Section (2 on mobile, 5 on desktop) */}
      <section className="max-w-[1600px] mx-auto px-2.5 sm:px-6 lg:px-8">
        <ProductGrid
          products={bestSellers}
          title="Community Favorites"
          subtitle="The highest-rated daily essentials chosen by developers, creators, and audiophiles."
          showToolbar={false}
        />
      </section>
    </div>
  );
};
