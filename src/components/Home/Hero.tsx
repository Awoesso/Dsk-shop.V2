import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductImage } from '../Common/ProductImage';
import { formatPrice } from '../../utils/currency';

export const Hero: React.FC = () => {
  const { products, navigateTo, openProduct, setFilters } = useShop();

  // Curated hero product and secondary subordinate product
  const mainProduct: Product =
    products.find((p) => p.id === 'dsk-headphone-pro') || products[0];
  const secondaryProduct: Product =
    products.find((p) => p.id === 'dsk-mouse-ergonomic') || products[1];

  const handleDiscover = () => {
    setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
    navigateTo('shop');
  };

  const handleViewCategories = () => {
    const heroEl = document.getElementById('hero-section');
    if (heroEl && heroEl.nextElementSibling) {
      heroEl.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    } else {
      setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
      navigateTo('shop');
    }
  };

  return (
    <section
      id="hero-section"
      className="w-full bg-[#F3FAF4] border-b border-[#DDE8DE] relative overflow-hidden text-[#172017]"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-0 lg:min-h-[520px] lg:max-h-[580px] xl:min-h-[540px] xl:max-h-[600px] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* ========================================================= */}
        {/* GAUCHE — ZONE ÉDITORIALE COMPACTE (38–42% sur desktop)    */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[40%] flex flex-col justify-center text-center lg:text-left z-10 space-y-4 sm:space-y-5">
          {/* 1. Label Eyebrow discret */}
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#DCFCE7]/85 text-[#166534] text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] font-primary">
              DSK-Shop Essentials
            </span>
          </div>

          {/* 2. Titre audacieux 52–64px en Manrope (4 mots, leading 1.02) */}
          <h1
            className="text-[34px] sm:text-[42px] md:text-5xl lg:text-[54px] xl:text-[60px] font-extrabold text-[#172017] tracking-tight leading-[1.02] font-primary"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Mieux équipé.
            <br />
            <span className="text-[#166534]">Chaque jour.</span>
          </h1>

          {/* 3. Courte description précise en DM Sans */}
          <p className="text-base sm:text-[17px] text-[#647064] leading-relaxed font-secondary max-w-md mx-auto lg:mx-0">
            Des produits utiles, soigneusement sélectionnés pour votre quotidien.
          </p>

          {/* 4. Bouton CTA primaire vert #16A34A + lien secondaire discret */}
          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 font-secondary">
            <button
              id="hero-primary-cta"
              onClick={handleDiscover}
              className="group h-[48px] px-6 sm:px-7 bg-[#16A34A] hover:bg-[#166534] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] w-full sm:w-auto"
            >
              <span>Découvrir les produits</span>
              <ArrowRight
                size={15}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>

            <button
              onClick={handleViewCategories}
              className="text-xs font-semibold text-[#166534] hover:text-[#16A34A] transition-colors inline-flex items-center gap-1 cursor-pointer font-primary py-1"
            >
              <span>Voir les catégories</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* DROITE — SCÈNE PRODUIT ART-DIRIGÉE (58–62% sur desktop)   */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[60%] relative flex items-center justify-center py-2 sm:py-4 lg:py-6">
          {/* Forme organique verte signature DSK-Shop en arrière-plan */}
          <div
            className="absolute inset-0 m-auto w-[92%] sm:w-[88%] lg:w-[94%] h-[88%] sm:h-[90%] lg:h-[92%] rounded-[40px] sm:rounded-[56px] lg:rounded-[72px] bg-gradient-to-br from-[#DCFCE7] via-[#E8F7EC] to-[#DCFCE7]/75 border border-[#D5EDD8] pointer-events-none -rotate-1"
            aria-hidden="true"
          />

          {/* Composition produit cohérente et intégrée */}
          <div className="relative z-10 w-full h-[320px] sm:h-[380px] lg:h-[440px] xl:h-[470px] flex items-center justify-center">
            {/* Produit Principal (Casque Studio ANC) */}
            {mainProduct && (
              <div
                onClick={() => openProduct(mainProduct)}
                className="relative z-10 w-[240px] sm:w-[290px] md:w-[330px] lg:w-[340px] xl:w-[370px] aspect-square rounded-3xl overflow-hidden cursor-pointer group/main transition-transform duration-300 hover:scale-[1.02]"
                title={mainProduct.name}
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-[0_20px_45px_-18px_rgba(20,83,45,0.22)] bg-[#F8FCF8]/40 border border-[#DCFCE7]/70 p-2 sm:p-3 flex items-center justify-center">
                  <ProductImage
                    src={mainProduct.images[0]}
                    alt={mainProduct.name}
                    containerClassName="w-full h-full rounded-2xl overflow-hidden"
                    className="w-full h-full object-cover object-center group-hover/main:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Étiquette produit subtile en pilule discrète */}
                <div className="absolute bottom-4 left-4 sm:left-6 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#DDE8DE] shadow-xs pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                  <span className="text-xs font-semibold text-[#172017] font-secondary">
                    {mainProduct.name.split(' ')[0]} {mainProduct.name.split(' ')[1]} Pro
                  </span>
                  <span className="text-xs font-bold text-[#166534] font-primary font-mono">
                    {formatPrice(mainProduct.price)}
                  </span>
                </div>
              </div>
            )}

            {/* Produit Secondaire Subordonné (Souris Ergonomique) */}
            {secondaryProduct && (
              <div
                onClick={() => openProduct(secondaryProduct)}
                className="absolute bottom-1 sm:bottom-3 right-1 sm:right-4 lg:right-2 xl:right-6 z-20 w-[125px] sm:w-[150px] lg:w-[160px] aspect-square rounded-2xl bg-white/95 backdrop-blur-xs border border-[#DDE8DE] p-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group/sec"
                title={secondaryProduct.name}
              >
                <div className="w-full h-full rounded-xl bg-[#FAFCFA] flex items-center justify-center p-2 overflow-hidden">
                  <ProductImage
                    src={secondaryProduct.images[0]}
                    alt={secondaryProduct.name}
                    containerClassName="w-full h-full"
                    className="object-contain group-hover/sec:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2.5 py-0.5 rounded-full border border-[#DDE8DE] shadow-2xs text-[10px] font-semibold text-[#172017]">
                  <span>{secondaryProduct.name.split(' ')[0]}</span> ·{' '}
                  <span className="text-[#166534] font-bold">{formatPrice(secondaryProduct.price)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
