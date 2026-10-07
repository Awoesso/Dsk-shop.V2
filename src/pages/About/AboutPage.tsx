import React from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SEO } from '../../components/SEO/SEO';

export const AboutPage: React.FC = () => {
  const { navigateTo, setFilters } = useShop();

  const handleExploreShop = () => {
    setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
    navigateTo('shop');
  };

  const commitments = [
    {
      icon: ShieldCheck,
      title: 'Garantie & Authenticité',
      description:
        'Chaque produit est minutieusement vérifié avant sa mise en rayon pour vous garantir un fonctionnement optimal.',
      metric: '100% testé',
    },
    {
      icon: Award,
      title: 'Sélection Exigeante',
      description:
        'Nous sélectionnons uniquement des articles utiles et éprouvés pour votre confort au quotidien.',
      metric: 'Sélection certifiée',
    },
    {
      icon: Truck,
      title: 'Livraison Rapide à Lomé',
      description:
        'Expédition rapide directement à votre domicile ou bureau à Lomé avec paiement sécurisé.',
      metric: 'Livraison express',
    },
    {
      icon: RotateCcw,
      title: 'Service Client Dédié',
      description:
        'Une assistance locale réactive et disponible via WhatsApp ou appel pour répondre à toutes vos questions.',
      metric: 'Support local',
    },
  ];

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3.5 sm:px-6 lg:px-8 2xl:px-12 py-8 sm:py-12 2xl:py-16 pb-28 sm:pb-16 space-y-12 sm:space-y-16 font-secondary text-bamboo-text-main">
      <SEO
        title="À Propos de DSK-Shop | Boutique à Lomé, Togo"
        description="Découvrez l'engagement de DSK-Shop à Lomé : des articles utiles sélectionnés avec soin, un service client réactif et une livraison rapide à domicile."
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'À Propos', url: '/about' },
        ]}
        keywords={['À propos DSK-Shop', 'boutique tech Lomé', 'Togo', 'garantie', 'qualité']}
      />

      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-bamboo-divider bg-surface p-6 sm:p-10 lg:p-14">
        <div className="max-w-3xl space-y-4 sm:space-y-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bamboo-tint text-bamboo-forest text-xs font-bold font-primary tracking-wider uppercase">
            <Sparkles size={13} className="text-bamboo-accent" /> Notre Mission
          </span>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-bamboo-text-main tracking-tight leading-tight font-primary"
          >
            DSK-Shop · Vos essentiels à Lomé
          </h1>
          <p className="text-sm sm:text-base text-bamboo-text-muted leading-relaxed">
            Chez <strong className="text-bamboo-text-main font-semibold">DSK-Shop</strong>, nous mettons à votre disposition des produits fiables et de qualité avec une expérience d'achat directe, transparente et sans tracas.
          </p>
          <div className="pt-2">
            <button
              onClick={handleExploreShop}
              className="inline-flex items-center gap-2 px-6 py-3 bg-bamboo-forest hover:bg-bamboo-accent text-white rounded-xl text-sm font-bold font-primary transition-colors shadow-xs cursor-pointer"
            >
              <span>Découvrir la boutique</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story & Philosophy */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-bamboo-divider shadow-2xs">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs font-bold text-bamboo-accent uppercase tracking-wider font-mono">
            Proximité & Qualité
          </span>
          <h2
            className="text-xl sm:text-2xl font-bold text-bamboo-text-main font-primary tracking-tight"
          >
            Une équipe engagée au Togo pour votre satisfaction.
          </h2>
          <p className="text-xs sm:text-sm text-bamboo-text-muted leading-relaxed">
            Notre priorité est de vous fournir des articles de qualité avec un accompagnement personnalisé. De la prise de commande à la livraison devant votre porte, nous vous assurons une totale tranquillité d'esprit.
          </p>
          <ul className="space-y-2.5 pt-2 text-xs sm:text-sm text-bamboo-text-main">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-bamboo-accent mt-0.5 flex-shrink-0" />
              <span>Contrôle qualité systématique avant chaque expédition à Lomé</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-bamboo-accent mt-0.5 flex-shrink-0" />
              <span>Service client togolais réactif par appel et WhatsApp</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-bamboo-accent mt-0.5 flex-shrink-0" />
              <span>Commandes simplifiées et prise en charge rapide</span>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4 flex justify-center">
          <div className="w-full max-w-[240px] aspect-square rounded-2xl bg-surface border border-bamboo-divider flex flex-col items-center justify-center p-6 text-center">
            <span className="text-3xl font-black text-bamboo-forest font-primary">DSK</span>
            <span className="text-xs font-semibold text-bamboo-text-muted mt-1">Boutique officielle Lomé</span>
          </div>
        </div>
      </section>

      {/* Pillars Matrix */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-xl sm:text-2xl font-bold text-bamboo-text-main font-primary tracking-tight"
          >
            Nos Engagements
          </h2>
          <p className="text-xs sm:text-sm text-bamboo-text-muted mt-1">
            Une expérience d&apos;achat transparente, fiable et respectueuse au Togo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-bamboo-divider shadow-2xs space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-bamboo-tint text-bamboo-forest flex items-center justify-center">
                  <Icon size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold font-mono text-bamboo-accent uppercase tracking-wider">
                    {c.metric}
                  </span>
                  <h3 className="text-sm font-bold text-bamboo-text-main mt-0.5 font-primary">
                    {c.title}
                  </h3>
                </div>
                <p className="text-xs text-bamboo-text-muted leading-relaxed">
                  {c.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
