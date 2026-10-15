import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { StoreIdentity } from '../../../types/storefront';

interface StoreHeroBannerProps {
  identity: StoreIdentity;
  onExplore?: () => void;
  ctaText?: string;
  badgeText?: string;
}

export const StoreHeroBanner: React.FC<StoreHeroBannerProps> = ({
  identity,
  onExplore,
  ctaText = 'Découvrir la collection',
  badgeText = 'Boutique Certifiée Nexa',
}) => {
  return (
    <section className="relative w-full overflow-hidden rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)] my-4 sm:my-6 shadow-xs">
      {/* Background Graphic or Image */}
      {identity.bannerUrl ? (
        <div className="relative min-h-[220px] sm:min-h-[340px] w-full flex items-center">
          <img
            src={identity.bannerUrl}
            alt={identity.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="relative z-10 max-w-xl p-6 sm:p-12 text-white space-y-3">
            <span className="inline-block px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-[var(--store-btn-radius)] bg-white/20 backdrop-blur-md">
              {badgeText}
            </span>
            <h1
              className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight drop-shadow-sm"
              style={{ fontFamily: 'var(--store-heading-font)' }}
            >
              {identity.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-md">
              {identity.tagline || identity.description || 'Découvrez nos nouveautés exclusives sélectionnées pour vous.'}
            </p>
            {onExplore && (
              <div className="pt-2">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-[var(--store-btn-radius)] text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-all cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>{ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)] text-xs font-bold" style={{ color: 'var(--store-primary)' }}>
              <span>★</span>
              <span>{badgeText}</span>
            </div>
            <h1
              className="text-2xl sm:text-4xl font-extrabold tracking-tight"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              {identity.name}
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--store-muted)' }}>
              {identity.tagline || identity.description || 'Bienvenue dans notre boutique officielle. Commandez directement en ligne avec livraison rapide à domicile et paiement à la réception.'}
            </p>
            {onExplore && (
              <div className="pt-2">
                <button
                  onClick={onExplore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white rounded-[var(--store-btn-radius)] shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--store-primary)' }}
                >
                  <ShoppingBag size={16} />
                  <span>{ctaText}</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="shrink-0 hidden md:block">
            <div
              className="w-36 h-36 rounded-[var(--store-card-radius)] border-2 border-[var(--store-border)] flex items-center justify-center text-4xl font-extrabold shadow-sm"
              style={{
                backgroundColor: 'var(--store-bg)',
                color: 'var(--store-primary)',
                fontFamily: 'var(--store-heading-font)',
              }}
            >
              {identity.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
