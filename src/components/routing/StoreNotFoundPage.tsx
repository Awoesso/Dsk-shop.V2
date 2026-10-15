import React, { useState } from 'react';
import { Store, Search, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';

interface StoreNotFoundPageProps {
  slug?: string;
}

export const StoreNotFoundPage: React.FC<StoreNotFoundPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const [searchSlug, setSearchSlug] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchSlug.trim().toLowerCase();
    if (clean) {
      navigate(`/boutique/${encodeURIComponent(clean)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-slate-800 font-sans">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-slate-200/50 text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200/70 mx-auto flex items-center justify-center">
          <Store size={40} strokeWidth={1.75} />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-100 text-amber-800">
            Erreur 404 • Boutique introuvable
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cette boutique n'existe pas
          </h1>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Aucune boutique active ne correspond à l'adresse{' '}
            <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold text-xs">
              /boutique/{slug || '...'}
            </code>{' '}
            sur la plateforme Nexa.
          </p>
        </div>

        {/* Search Slug Form */}
        <form onSubmit={handleSearch} className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-500 text-left">
            Rechercher ou accéder à une autre boutique par son slug :
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Ex: lome-elegance, tech-horizon..."
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Accéder
            </button>
          </div>
        </form>

        {/* Demo Stores Shortcuts */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-400 mb-2">Boutiques de démonstration disponibles :</div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => navigate('/boutique/dsk-official')}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              DSK Officiel (Général)
            </button>
            <button
              onClick={() => navigate('/boutique/lome-elegance')}
              className="text-xs px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition-colors cursor-pointer"
            >
              Lomé Élégance (Fashion)
            </button>
            <button
              onClick={() => navigate('/boutique/tech-horizon')}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-colors cursor-pointer"
            >
              Tech Horizon (Tech)
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Portail Nexa Hub</span>
          </button>
          <button
            onClick={() => navigate('/templates')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <span>Catalogue de modèles</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
