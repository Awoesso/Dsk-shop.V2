import React from 'react';
import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useShop } from '../../context/ShopContext';

export const Hero: React.FC = () => {
  const { navigateTo, setFilters } = useShop();

  const openCatalog = () => {
    setFilters({ category: 'all', search: '' });
    navigateTo('shop');
  };

  return (
    <section
      id="hero-section"
      className="relative isolate flex min-h-[160px] w-full items-center overflow-hidden bg-surface text-white sm:min-h-140"
    >
      <img
        src="/Harmonie.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/15"
      />

      <div className="mx-auto w-full max-w-[1600px] px-5 py-6 sm:px-8 sm:py-20 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-2xl"
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 sm:mb-4 sm:text-sm">
            DSK-Shop · Lomé
          </p>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Achetez juste.
            <br />
            <span className="text-white/75">Recevez vite.</span>
          </h1>

          <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:block sm:text-lg">
            L’essentiel du quotidien livré rapidement à Lomé. Retrouvez vos
            articles préférés avec un paiement simplifié et une livraison
            directement à votre porte.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:gap-3">
            <button
              id="hero-order-cta"
              onClick={openCatalog}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white transition hover:bg-primary-container sm:h-12 sm:text-sm"
            >
              <ShoppingBag size={17} />
              Commander maintenant
            </button>

            <button
              id="hero-catalog-cta"
              onClick={openCatalog}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/10 px-6 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:h-12 sm:text-sm"
            >
              Voir le catalogue
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-3 hidden flex-wrap gap-x-5 gap-y-2 text-xs text-white/85 sm:mt-7 sm:flex sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              Livraison express à Lomé
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              T-Money, Flooz & espèces
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;