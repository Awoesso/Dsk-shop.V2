import React from 'react';
import { StoreProvider, useStore } from '../../context/StoreContext';
import { StoreCartProvider } from '../../context/StoreCartContext';
import { StoreNotFoundPage } from './StoreNotFoundPage';
import { Lock, AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useRouter } from '../../router/RouterContext';

interface StoreResolverProps {
  slug: string;
  children: React.ReactNode;
}

const ResolvedStoreGate: React.FC<{ slug: string; children: React.ReactNode }> = ({
  slug,
  children,
}) => {
  const { isLoading, error, notFound, isUnpublished, store, identity, refreshStore, storeId } = useStore();
  const { navigate, route } = useRouter();

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-600">
        <div className="w-12 h-12 rounded-2xl border-4 border-slate-200 border-t-slate-900 animate-spin mb-4" />
        <h2 className="text-base font-bold text-slate-800">Résolution de la boutique...</h2>
        <p className="text-xs text-slate-500 font-mono mt-1">/boutique/{slug}</p>
      </div>
    );
  }

  // 2. Not Found 404
  if (notFound) {
    return <StoreNotFoundPage slug={slug} />;
  }

  // 3. Supabase or Network Error (no fake data fallback!)
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-xl shadow-rose-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">Erreur de chargement</h2>
            <p className="text-xs text-slate-600">
              Impossible de récupérer les informations de la boutique <code className="font-mono font-bold text-slate-800">{slug}</code> depuis la base de données.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs text-left font-mono break-words">
            {error}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => refreshStore()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Réessayer</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Portail Nexa
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Unpublished Store Screen for public visitors (draft, suspended, archived)
  // The editor routes (/editeur/:slug and /editeur-lab/:slug) are allowed through so the store owner can edit and publish
  if (isUnpublished && route.type !== 'store-editor' && route.type !== 'grapes-lab') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-amber-200 p-8 shadow-xl shadow-amber-100 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
            <Lock size={30} />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-100 text-amber-800">
              Boutique non publique
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">{identity?.name || store?.name || slug}</h2>
            <p className="text-xs text-slate-600">
              Cette boutique est actuellement en cours de préparation par son propriétaire ou suspendue par l'administration Nexa. Elle n'est pas accessible au public.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Statut actuel : {store?.status || 'non publié'}
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Retour au portail Nexa</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Store resolved successfully: Render children with isolated StoreCartProvider
  return <StoreCartProvider storeId={storeId}>{children}</StoreCartProvider>;
};

export const StoreResolver: React.FC<StoreResolverProps> = ({ slug, children }) => {
  return (
    <StoreProvider slug={slug}>
      <ResolvedStoreGate slug={slug}>{children}</ResolvedStoreGate>
    </StoreProvider>
  );
};
