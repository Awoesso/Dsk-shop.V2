import React, { useState } from 'react';
import {
  Store,
  Layers,
  Sliders,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Palette,
  Package,
} from 'lucide-react';
import { useRouter } from '../../router/RouterContext';
import { SEO } from '../../components/SEO/SEO';

export const HubPage: React.FC = () => {
  const { navigate } = useRouter();
  const [customSlug, setCustomSlug] = useState('');

  const handleSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSlug.trim().toLowerCase();
    if (clean) {
      navigate(`/boutique/${encodeURIComponent(clean)}`);
    }
  };

  const demoStores = [
    {
      slug: 'dsk-official',
      name: 'DSK-Shop Officiel',
      category: 'Généraliste & Lifestyle',
      template: 'General',
      tagline: 'Votre référence shopping audio et gadgets connectés à Lomé',
      accentColor: 'from-slate-900 to-slate-800',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
    {
      slug: 'lome-elegance',
      name: 'Lomé Élégance',
      category: 'Mode & Haute Couture',
      template: 'Fashion',
      tagline: 'Prêt-à-porter de luxe, maroquinerie fine et créateurs togolais',
      accentColor: 'from-amber-900 to-rose-900',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      slug: 'tech-horizon',
      name: 'Tech Horizon',
      category: 'Informatique & Composants',
      template: 'Tech',
      tagline: 'Composants gamer, périphériques pro et stations de travail',
      accentColor: 'from-indigo-900 to-blue-900',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SEO
        title="Nexa Storefront Hub | Moteur Multi-Boutiques E-commerce"
        description="Portail central du moteur de vitrines e-commerce Nexa : accédez aux boutiques multi-vendeurs par slug ou explorez les modèles."
      />

      {/* Hero Header */}
      <header className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200">
            <Sparkles size={14} className="text-amber-400" />
            <span>Nexa Multi-Tenant Architecture • DSK-Shop Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Moteur de Storefronts E-commerce Multi-Boutiques
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Chaque boutique hébergée sur Nexa dispose de sa propre URL isolée, de son catalogue scanné par <code className="text-slate-200 font-mono">store_id</code> et de son modèle de rendu sur-mesure.
          </p>

          {/* Quick Slug Navigator */}
          <div className="max-w-xl mx-auto pt-4">
            <form onSubmit={handleSlugSubmit} className="flex flex-col sm:flex-row gap-2.5 p-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono font-medium">
                  /boutique/
                </span>
                <input
                  type="text"
                  placeholder="votre-slug-de-boutique"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full pl-24 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-lg shadow-emerald-900/30"
              >
                <span>Accéder</span>
                <ArrowRight size={16} />
              </button>
            </form>
            <p className="text-xs text-slate-400 mt-2">
              Saisissez n'importe quel slug de vendeur enregistré sur Nexa pour afficher sa vitrine.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-16">
        {/* Demo Stores Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-600">
                Vitrines en démonstration
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Explorez les boutiques actives
              </h2>
            </div>
            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              <Layers size={14} />
              <span>Voir la galerie complète des modèles</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoStores.map((store) => (
              <div
                key={store.slug}
                className="flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
              >
                {/* Header Band */}
                <div className={`p-6 bg-gradient-to-br ${store.accentColor} text-white space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                      Modèle {store.template}
                    </span>
                    <span className="text-xs text-white/70 font-mono">
                      /boutique/{store.slug}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white">{store.name}</h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
                    {store.tagline}
                  </p>
                </div>

                {/* Sub-links */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <Store size={14} className="text-slate-500" />
                      <span>Parcours disponibles :</span>
                    </div>
                    <ul className="space-y-1.5 pl-5 list-disc text-slate-500">
                      <li>
                        <button
                          onClick={() => navigate(`/boutique/${store.slug}`)}
                          className="hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          Accueil vitrine
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(`/boutique/${store.slug}/produits`)}
                          className="hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          Catalogue des articles
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate(`/boutique/${store.slug}/panier`)}
                          className="hover:text-emerald-700 hover:underline cursor-pointer"
                        >
                          Panier isolé de la boutique
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/boutique/${store.slug}`)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <span>Ouvrir la boutique</span>
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={() => navigate(`/editeur/${store.slug}`)}
                      title="Personnaliser dans l'éditeur"
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    >
                      <Sliders size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Multi-tenant Architecture Guarantees */}
        <section className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600">
              Garanties architecturales
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
              Conception SaaS Multi-Boutiques Sécurisée
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Le moteur DSK-Shop répond aux exigences du commerce multi-vendeurs de Nexa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Isolation stricte par store_id</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Toute requête de catalogue est explicitement filtrée sur l'identifiant stable de la boutique pour empêcher toute fuite entre vendeurs.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Palette size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Moteur de Thèmes Polymorphe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque boutique applique son propre modèle (Fashion, Tech, General) sans duplication de code ni migration SQL destructive.
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Package size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Routage Explicite & 404 Fiable</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les URLs inconnues affichent un 404 explicite sans jamais se replier silencieusement sur une boutique de démonstration.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Nexa Multi-Storefront Architecture • Moteur DSK-Shop • Lomé, Togo
      </footer>
    </div>
  );
};
