import React from 'react';
import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';
import { ProductImage } from '../Common/ProductImage';
import { formatPrice } from '../../utils/currency';

export const Hero: React.FC = () => {
  const { products, navigateTo, openProduct, setFilters } = useShop();

  // Use only real products from Supabase database
  const mainProduct: Product | undefined = products[0];
  const secondaryProduct: Product | undefined = products[1];

  const handleOrderNow = () => {
    if (mainProduct) {
      openProduct(mainProduct);
    } else {
      setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
      navigateTo('shop');
    }
  };

  const handleViewCatalog = () => {
    setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
    navigateTo('shop');
  };

  return (
    <section
      id="hero-section"
      className="w-full bg-[#F3FAF4] border-b border-[#DDE8DE] relative overflow-hidden text-[#172017]"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-10 lg:gap-14">
        
        {/* ========================================================= */}
        {/* GAUCHE — ZONE ÉDITORIALE DSK-SHOP                         */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center text-center lg:text-left z-10 space-y-3.5 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#DCFCE7] text-[#166534] text-xs font-bold uppercase tracking-wider font-primary">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              DSK-Shop · Lomé
            </span>
          </motion.div>

          {/* Titre : fade + translateY(15px), 0ms, 450ms */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-[#172017] tracking-tight leading-[1.18] font-primary"
          >
            Achetez juste.
            <br />
            <span className="text-[#166534]">Recevez vite.</span>
          </motion.h1>

          {/* Description : fade + translateY(15px), 80ms, 500ms */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="text-xs sm:text-base md:text-lg text-[#647064] leading-relaxed font-secondary max-w-lg mx-auto lg:mx-0"
          >
            L&apos;essentiel du quotidien livré rapidement à Lomé. Retrouvez vos articles préférés avec paiement simplifié et livraison directe à votre porte.
          </motion.p>

          {/* Boutons : fade + translateY(15px), 160ms, 500ms */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
            className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 font-secondary"
          >
            <button
              id="hero-order-cta"
              onClick={handleOrderNow}
              className="h-[46px] sm:h-[48px] px-6 sm:px-7 bg-[#166534] hover:bg-[#16A34A] text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 w-full sm:w-auto font-primary"
            >
              <ShoppingBag size={17} />
              <span>Commander maintenant</span>
            </button>
            <button
              id="hero-catalog-cta"
              onClick={handleViewCatalog}
              className="h-[46px] sm:h-[48px] px-5 sm:px-6 bg-white hover:bg-slate-50 text-[#172017] hover:text-[#166534] border border-[#DDE8DE] text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 w-full sm:w-auto font-primary"
            >
              <span>Voir le catalogue</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
            className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 text-[11px] sm:text-xs text-[#647064]"
          >
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#16A34A]" /> Livraison express Lomé
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#16A34A]" /> T-Money, Flooz & Espèces
            </span>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* DROITE — PRODUITS RÉELS DE LA BOUTIQUE                    */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[48%] relative flex items-center justify-center py-2 sm:py-4">
          <div
            className="absolute inset-0 m-auto w-[94%] h-[94%] rounded-3xl bg-gradient-to-br from-[#DCFCE7] via-[#E8F7EC] to-[#DCFCE7]/60 border border-[#D5EDD8] pointer-events-none"
            aria-hidden="true"
          />

          {/* Image : fade + scale(0.97) -> 1, 100ms, 600ms */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="relative z-10 w-full flex items-center justify-center gap-2.5 sm:gap-4 p-2 sm:p-4"
          >
            {/* Produit Réel 1 */}
            {mainProduct ? (
              <div
                onClick={() => openProduct(mainProduct)}
                className="w-1/2 sm:w-[58%] aspect-square max-w-[280px] sm:max-w-[320px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-white p-2 sm:p-3 border border-[#DDE8DE] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                title={mainProduct.name}
              >
                <div className="w-full flex-1 rounded-lg sm:rounded-xl overflow-hidden bg-[#F3FAF4] flex items-center justify-center p-1.5 sm:p-2 min-h-0">
                  <ProductImage
                    src={mainProduct.images?.[0] || mainProduct.primaryImage || ''}
                    alt={mainProduct.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200 ease-out"
                  />
                </div>
                <div className="pt-1.5 sm:pt-2 px-0.5 sm:px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <span className="font-bold text-xs sm:text-sm text-[#172017] font-primary truncate">
                    {mainProduct.name}
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-[#166534] font-primary whitespace-nowrap">
                    {formatPrice(mainProduct.price)}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Produit Réel 2 (si existant) */}
            {secondaryProduct ? (
              <div
                onClick={() => openProduct(secondaryProduct)}
                className="w-1/2 sm:w-[42%] aspect-square max-w-[220px] sm:max-w-[240px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer bg-white p-2 sm:p-3 border border-[#DDE8DE] shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                title={secondaryProduct.name}
              >
                <div className="w-full flex-1 rounded-lg sm:rounded-xl overflow-hidden bg-[#F3FAF4] flex items-center justify-center p-1.5 sm:p-2 min-h-0">
                  <ProductImage
                    src={secondaryProduct.images?.[0] || secondaryProduct.primaryImage || ''}
                    alt={secondaryProduct.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200 ease-out"
                  />
                </div>
                <div className="pt-1.5 sm:pt-2 px-0.5 sm:px-1 flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                  <span className="font-bold text-xs text-[#172017] font-primary truncate">
                    {secondaryProduct.name}
                  </span>
                  <span className="text-[11px] sm:text-xs font-black text-[#166534] font-primary whitespace-nowrap">
                    {formatPrice(secondaryProduct.price)}
                  </span>
                </div>
              </div>
            ) : null}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
