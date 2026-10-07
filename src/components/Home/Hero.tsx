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
      className="w-full bg-surface border-b border-surface-variant relative overflow-hidden text-on-surface"
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary-fixed text-on-primary-fixed text-xs font-bold uppercase tracking-wider font-primary">
              <span className="w-2 h-2 rounded-full bg-surface-tint animate-pulse" />
              DSK-Shop · Lomé
            </span>
          </motion.div>

          {/* Titre : fade + translateY(15px), 0ms, 450ms */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-2xl min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-on-surface tracking-tight leading-[1.18] font-primary"
          >
            Achetez juste.
            <br />
            <span className="text-primary">Recevez vite.</span>
          </motion.h1>

          {/* Description : fade + translateY(15px), 80ms, 500ms */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="text-xs sm:text-base md:text-lg text-on-surface-variant leading-relaxed font-secondary max-w-lg mx-auto lg:mx-0 px-1 sm:px-0"
          >
            L&apos;essentiel du quotidien livré rapidement à Lomé. Retrouvez vos articles préférés avec paiement simplifié et livraison directe à votre porte.
          </motion.p>

          {/* Boutons : fade + translateY(15px), 160ms, 500ms */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
            className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3.5 font-secondary w-full sm:w-auto"
          >
            <button
              id="hero-order-cta"
              onClick={handleOrderNow}
              className="h-[48px] px-6 sm:px-7 bg-primary hover:bg-primary-container text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 w-full sm:w-auto font-primary"
            >
              <ShoppingBag size={17} />
              <span>Commander maintenant</span>
            </button>
            <button
              id="hero-catalog-cta"
              onClick={handleViewCatalog}
              className="h-[48px] px-5 sm:px-6 bg-white hover:bg-surface-container-low text-on-surface hover:text-primary border border-surface-variant text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98 w-full sm:w-auto font-primary"
            >
              <span>Voir le catalogue</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.22, ease: 'easeOut' }}
            className="pt-1 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-on-surface-variant"
          >
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-surface-tint" /> Livraison express Lomé
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-surface-tint" /> T-Money, Flooz & Espèces
            </span>
          </motion.div>
        </div>

        {/* ========================================================= */}
        {/* DROITE — PRODUITS RÉELS DE LA BOUTIQUE                    */}
        {/* ========================================================= */}
        <div className="w-full lg:w-[48%] relative flex items-center justify-center py-2 sm:py-4">
          <div
            className="absolute inset-0 m-auto w-[94%] h-[94%] rounded-3xl bg-gradient-to-br from-primary-fixed/60 via-surface-container-low to-secondary-container/50 border border-surface-variant pointer-events-none"
            aria-hidden="true"
          />

          {/* Image : fade + scale(0.97) -> 1, 100ms, 600ms */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="relative z-10 w-full flex items-center justify-center gap-3 sm:gap-4 p-2 sm:p-4"
          >
            {/* Produit Réel 1 */}
            {mainProduct ? (
              <div
                onClick={() => openProduct(mainProduct)}
                className="w-full max-w-[260px] sm:max-w-[320px] sm:w-[58%] aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white p-2.5 sm:p-3 border border-surface-variant shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
                title={mainProduct.name}
              >
                <div className="w-full flex-1 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center p-2 min-h-0">
                  <ProductImage
                    src={mainProduct.images?.[0] || mainProduct.primaryImage || ''}
                    alt={mainProduct.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200 ease-out"
                  />
                </div>
                <div className="pt-2 px-1 flex items-center justify-between gap-1">
                  <span className="font-bold text-xs sm:text-sm text-on-surface font-primary truncate">
                    {mainProduct.name}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-primary font-primary whitespace-nowrap">
                    {formatPrice(mainProduct.price)}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Produit Réel 2 (affiché sur tablette/desktop pour un rendu aéré) */}
            {secondaryProduct ? (
              <div
                onClick={() => openProduct(secondaryProduct)}
                className="hidden sm:flex sm:w-[42%] aspect-square max-w-[240px] rounded-2xl overflow-hidden cursor-pointer bg-white p-2.5 sm:p-3 border border-surface-variant shadow-xs hover:shadow-md transition-all group flex-col justify-between"
                title={secondaryProduct.name}
              >
                <div className="w-full flex-1 rounded-xl overflow-hidden bg-surface-container-low flex items-center justify-center p-2 min-h-0">
                  <ProductImage
                    src={secondaryProduct.images?.[0] || secondaryProduct.primaryImage || ''}
                    alt={secondaryProduct.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-200 ease-out"
                  />
                </div>
                <div className="pt-2 px-1 flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-on-surface font-primary truncate">
                    {secondaryProduct.name}
                  </span>
                  <span className="text-xs font-black text-primary font-primary whitespace-nowrap">
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
