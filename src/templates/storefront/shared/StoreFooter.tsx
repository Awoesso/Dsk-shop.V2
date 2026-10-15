import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { StoreIdentity } from '../../../types/storefront';

interface StoreFooterProps {
  identity: StoreIdentity;
}

export const StoreFooter: React.FC<StoreFooterProps> = ({ identity }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-[var(--store-border)] bg-[var(--store-surface)] text-[var(--store-text)] transition-colors duration-200 mt-16">
      <div className="mx-auto max-w-[var(--store-content-max-w)] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {identity.logoUrl ? (
                <img
                  src={identity.logoUrl}
                  alt={identity.name}
                  className="h-10 w-10 rounded-[var(--store-card-radius)] object-cover border border-[var(--store-border)]"
                />
              ) : (
                <div
                  className="h-10 w-10 flex items-center justify-center font-bold text-white rounded-[var(--store-card-radius)]"
                  style={{ backgroundColor: 'var(--store-primary)' }}
                >
                  {identity.name.charAt(0).toUpperCase()}
                </div>
              )}
              <span
                className="font-bold text-lg"
                style={{ fontFamily: 'var(--store-heading-font)' }}
              >
                {identity.name}
              </span>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--store-muted)' }}>
              {identity.description ||
                identity.tagline ||
                'Votre boutique en ligne de référence pour des produits de qualité avec livraison rapide et paiement sécurisé.'}
            </p>

            {/* Socials */}
            {identity.socialLinks && (
              <div className="flex items-center gap-3 pt-2">
                {identity.socialLinks.whatsapp && (
                  <a
                    href={`https://wa.me/${identity.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)] text-emerald-600 hover:opacity-80 transition-opacity"
                    aria-label="WhatsApp"
                  >
                    <Phone size={16} />
                  </a>
                )}
                {identity.socialLinks.instagram && (
                  <a
                    href={identity.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)] hover:opacity-80"
                  >
                    Instagram
                  </a>
                )}
                {identity.socialLinks.facebook && (
                  <a
                    href={identity.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)] hover:opacity-80"
                  >
                    Facebook
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              Contact & Support
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm" style={{ color: 'var(--store-muted)' }}>
              {identity.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-emerald-600 shrink-0" />
                  <span>{identity.phone}</span>
                </li>
              )}
              {identity.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="shrink-0" />
                  <span>{identity.email}</span>
                </li>
              )}
              {identity.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="shrink-0 mt-0.5" />
                  <span>
                    {identity.address}
                    {identity.city ? `, ${identity.city}` : ''}
                    {identity.country ? `, ${identity.country}` : ''}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              Garanties Boutique
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm" style={{ color: 'var(--store-muted)' }}>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Paiement à la livraison</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Articles certifiés authentiques</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                <span>Support réactif WhatsApp</span>
              </li>
            </ul>
          </div>

          {/* Payment Badges & Notice */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider"
              style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
            >
              Moyens de Règlement
            </h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="px-2.5 py-1 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)]">
                Espèces à la livraison
              </span>
              <span className="px-2.5 py-1 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)]">
                T-Money
              </span>
              <span className="px-2.5 py-1 rounded-[var(--store-btn-radius)] bg-[var(--store-bg)] border border-[var(--store-border)]">
                Moov Money (Flooz)
              </span>
            </div>
            <p className="text-[11px] leading-relaxed pt-2" style={{ color: 'var(--store-muted)' }}>
              Commandez en toute confiance et inspectez votre colis avant de régler.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[var(--store-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'var(--store-muted)' }}>
          <p>© {currentYear} {identity.name}. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>Propulsé par le moteur de templates</span>
            <span
              className="font-bold text-[var(--store-primary)]"
              style={{ fontFamily: 'var(--store-heading-font)' }}
            >
              Nexa & DSK Engine
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
