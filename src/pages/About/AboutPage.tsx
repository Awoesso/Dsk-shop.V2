import React from 'react';
import {
  ShieldCheck,
  Award,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
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
      title: 'Garantie Remplacement 2 Ans',
      description:
        'Chaque pièce est couverte par une garantie matérielle complète. En cas de dysfonctionnement, nous remplaçons sans délai.',
      metric: '100% garanti',
    },
    {
      icon: Award,
      title: 'Matériaux Certifiés & Durables',
      description:
        'Aluminium 6063 fraisé CNC, transducteurs béryllium et circuits électroniques rigoureusement calibrés en atelier.',
      metric: 'Norme Grade A',
    },
    {
      icon: Truck,
      title: 'Expédition Sécurisée & Suivie',
      description:
        'Envois sous 24h avec emballage renforcé et suivi en direct du départ de l’entrepôt jusqu’à votre porte.',
      metric: '24-48h dispatch',
    },
    {
      icon: RotateCcw,
      title: 'Essai Sérénité 30 Jours',
      description:
        'Prenez le temps d’intégrer vos équipements à votre espace. Retours simplifiés sous 30 jours sans friction.',
      metric: 'Retours gratuits',
    },
  ];

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-8 sm:py-12 2xl:py-16 space-y-12 sm:space-y-16 2xl:space-y-24 font-secondary text-[#172017]">
      <SEO
        title="À Propos de DSK-Shop | Notre Mission & Vision à Lomé"
        description="Découvrez l'histoire de DSK-Shop à Lomé : notre sélection rigoureuse d'équipements technologiques et lifestyle, notre engagement qualité et notre service client."
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'À Propos', url: '/about' },
        ]}
        keywords={['À propos DSK-Shop', 'boutique tech Lomé', 'Togo', 'garantie', 'qualité']}
      />
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#DDE8DE] bg-gradient-to-br from-[#F3FAF4] via-[#F8FCF8] to-[#F0FDF4] p-6 sm:p-12 lg:p-16 2xl:p-20">
        <div className="max-w-3xl 2xl:max-w-4xl space-y-4 sm:space-y-6 2xl:space-y-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-xs 2xl:text-sm font-bold font-primary tracking-wider uppercase">
            <Sparkles size={13} className="text-[#16A34A] 2xl:w-4 2xl:h-4" /> Notre Vision
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-[#172017] tracking-tight leading-[1.15] font-primary"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            L&apos;exigence de l&apos;essentiel high-tech.
          </h1>
          <p className="text-base sm:text-lg 2xl:text-xl text-[#647064] leading-relaxed">
            Chez <strong className="text-[#172017] font-semibold">DSK-Shop Lomé</strong>, nous croyons qu&apos;un espace de travail et des équipements du quotidien doivent allier pureté visuelle, acoustique fidèle et longévité mécanique irréprochable.
          </p>
          <div className="pt-2">
            <button
              onClick={handleExploreShop}
              className="inline-flex items-center gap-2 px-6 py-3.5 2xl:px-8 2xl:py-4 bg-[#16A34A] hover:bg-[#166534] text-white rounded-xl text-sm 2xl:text-base font-bold font-primary transition-colors shadow-xs cursor-pointer"
            >
              <span>Découvrir la collection</span>
              <ArrowRight size={16} className="2xl:w-5 2xl:h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Brand Story & Philosophy Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16 items-center">
        <div className="lg:col-span-6 space-y-5 2xl:space-y-7">
          <span className="text-xs 2xl:text-sm font-bold text-[#16A34A] uppercase tracking-wider font-mono">
            01 // Savoir-Faire & Proximité
          </span>
          <h2
            className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#172017] font-primary tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Une sélection minutieuse, sans compromis.
          </h2>
          <p className="text-sm sm:text-base 2xl:text-lg text-[#647064] leading-relaxed">
            Plutôt que d&apos;accumuler des milliers de références superflues, notre équipe basée à Lomé teste, calibre et sélectionne uniquement les outils qui apportent un réel gain de confort, de silence et de performance au quotidien.
          </p>
          <ul className="space-y-3 2xl:space-y-4 pt-2 text-sm 2xl:text-base text-[#172017]">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0 2xl:w-5 2xl:h-5" />
              <span>Contrôle qualité systématique avant chaque expédition à Lomé</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0 2xl:w-5 2xl:h-5" />
              <span>Conception ergonomique validée pour les longues sessions de travail</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-[#16A34A] mt-0.5 flex-shrink-0 2xl:w-5 2xl:h-5" />
              <span>Service client togolais réactif par appel, WhatsApp et email</span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDE8DE] shadow-sm aspect-[4/3]">
            <ProductImage
              src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200&auto=format&fit=crop&q=80"
              alt="Atelier DSK-Shop"
              containerClassName="w-full h-full"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pillars Matrix */}
      <section className="space-y-6 2xl:space-y-8">
        <div className="text-center max-w-xl 2xl:max-w-2xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#172017] font-primary tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Nos Engagements
          </h2>
          <p className="text-sm 2xl:text-base text-[#647064] mt-1.5">
            Une expérience d&apos;achat transparente, fiable et respectueuse au Togo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 2xl:gap-6">
          {commitments.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-6 2xl:p-8 rounded-2xl bg-[#FFFFFF] border border-[#DDE8DE] shadow-2xs hover:border-[#16A34A] transition-all space-y-3"
              >
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                  <Icon size={20} className="2xl:w-6 2xl:h-6" />
                </div>
                <div>
                  <span className="text-[10px] 2xl:text-xs font-bold font-mono text-[#16A34A] uppercase tracking-wider">
                    {c.metric}
                  </span>
                  <h3
                    className="text-base 2xl:text-lg font-bold text-[#172017] mt-0.5 font-primary"
                    style={{ fontFamily: "'Manrope', sans-serif" }}
                  >
                    {c.title}
                  </h3>
                </div>
                <p className="text-xs 2xl:text-sm text-[#647064] leading-relaxed">
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
