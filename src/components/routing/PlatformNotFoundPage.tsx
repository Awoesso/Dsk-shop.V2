import React from 'react';
import { Compass, ArrowLeft, Home, Layers } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';

interface PlatformNotFoundPageProps {
  path?: string;
}

export const PlatformNotFoundPage: React.FC<PlatformNotFoundPageProps> = ({ path }) => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 text-slate-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-xl shadow-slate-200/50 text-center space-y-6">
        <div className="w-18 h-18 rounded-3xl bg-slate-100 text-slate-700 mx-auto flex items-center justify-center">
          <Compass size={36} strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-100 text-slate-600">
            Erreur 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Page introuvable
          </h1>
          <p className="text-sm text-slate-600">
            L'adresse <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">{path || 'demandée'}</code> n'existe pas sur la plateforme Nexa.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={() => navigate('/')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <Home size={16} />
            <span>Retour au portail Nexa</span>
          </button>
          <button
            onClick={() => navigate('/templates')}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
          >
            <Layers size={16} />
            <span>Explorer les modèles de boutiques</span>
          </button>
        </div>
      </div>
    </div>
  );
};
