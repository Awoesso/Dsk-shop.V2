import React from 'react';
import { Truck, ShieldCheck, Clock, Headphones } from 'lucide-react';

export const StoreTrustBadges: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-8">
      <div className="flex items-center gap-3 p-3.5 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
        <div
          className="p-2 rounded-[var(--store-btn-radius)] shrink-0"
          style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
        >
          <Truck size={18} />
        </div>
        <div>
          <h4
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            Livraison Express
          </h4>
          <p className="text-[11px]" style={{ color: 'var(--store-muted)' }}>
            À domicile à Lomé & environs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
        <div
          className="p-2 rounded-[var(--store-btn-radius)] shrink-0"
          style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
        >
          <ShieldCheck size={18} />
        </div>
        <div>
          <h4
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            Paiement à Réception
          </h4>
          <p className="text-[11px]" style={{ color: 'var(--store-muted)' }}>
            Payez après vérification
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
        <div
          className="p-2 rounded-[var(--store-btn-radius)] shrink-0"
          style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
        >
          <Clock size={18} />
        </div>
        <div>
          <h4
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            Commande 24/7
          </h4>
          <p className="text-[11px]" style={{ color: 'var(--store-muted)' }}>
            Validation en 3 clics
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3.5 rounded-[var(--store-card-radius)] border border-[var(--store-border)] bg-[var(--store-surface)]">
        <div
          className="p-2 rounded-[var(--store-btn-radius)] shrink-0"
          style={{ backgroundColor: 'var(--store-bg)', color: 'var(--store-primary)' }}
        >
          <Headphones size={18} />
        </div>
        <div>
          <h4
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--store-heading-font)', color: 'var(--store-text)' }}
          >
            Assistance Directe
          </h4>
          <p className="text-[11px]" style={{ color: 'var(--store-muted)' }}>
            Support WhatsApp disponible
          </p>
        </div>
      </div>
    </div>
  );
};
