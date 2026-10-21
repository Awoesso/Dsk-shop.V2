import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, SlidersHorizontal, Beaker, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { GrapesJSEditor } from '../../components/store-editor/GrapesJSEditor';
import { SEO } from '../../components/SEO/SEO';
import { StoresService } from '../../services/stores.service';
import { supabase } from '../../lib/supabase';
import { BuilderProjectData } from '../../types/storefront';

export interface GrapesLabPageProps {
  slug?: string;
}

export const GrapesLabPage: React.FC<GrapesLabPageProps> = () => {
  const { identity, theme, slug, storeId, storefront, store, refreshStore } = useStore();
  const { navigate } = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    async function checkUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (isMounted) {
          setCurrentUser(data.user || null);
          setAuthChecked(true);
        }
      } catch {
        if (isMounted) {
          setCurrentUser(null);
          setAuthChecked(true);
        }
      }
    }
    checkUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const isOwner = Boolean(
    store?.owner_id
      ? currentUser && currentUser.id === store.owner_id
      : true // Demo or synthetic stores in local sandbox
  );

  // If store has owner_id and user is not owner, show Access Restricted
  if (authChecked && store?.owner_id && (!currentUser || currentUser.id !== store.owner_id)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
        <div className="max-w-md w-full bg-slate-950 border border-rose-900/60 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/60 text-rose-400 mx-auto flex items-center justify-center border border-rose-800/40">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold">Accès Restreint</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Seul le propriétaire de la boutique ({identity.name}) peut accéder à l'atelier visuel GrapesJS.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Retour au Hub
          </button>
        </div>
      </div>
    );
  }

  const handleSaveDraft = async (projectData: BuilderProjectData) => {
    if (!storeId) return { success: false, error: 'Identifiant boutique introuvable.' };
    const res = await StoresService.saveBuilderDraft(storeId, projectData);
    if (res.success) {
      await refreshStore();
    }
    return res;
  };

  const handlePublish = async (projectData: BuilderProjectData) => {
    if (!storeId) return { success: false, error: 'Identifiant boutique introuvable.' };
    const res = await StoresService.publishBuilderProject(storeId, projectData);
    if (res.success) {
      await refreshStore();
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans p-3 sm:p-5">
      <SEO
        title={`Atelier Visuel GrapesJS | ${identity.name}`}
        description="Atelier visuel professionnel drag-and-drop connecté à Supabase."
        noindex={true}
      />

      {/* Top Bar Header */}
      <header className="flex flex-wrap items-center justify-between pb-4 gap-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/editeur/${slug}`)}
            className="inline-flex items-center gap-1.5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Revenir à l'éditeur standard"
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-900/60 text-purple-300 border border-purple-700/50">
                <Beaker size={12} />
                Constructeur Visuel GrapesJS
              </span>
              <h1 className="font-bold text-base text-white tracking-tight">
                {identity.name}
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Conception visuelle par blocs • Enregistrement Supabase et publication en direct
            </p>
          </div>
        </div>

        {/* Action navigation links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/editeur/${slug}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <SlidersHorizontal size={13} />
            <span>Éditeur Thème</span>
          </button>

          <button
            onClick={() => navigate(`/boutique/${slug}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <span>Vitrine Live</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </header>

      {/* Main GrapesJS Editor Container */}
      <main className="flex-1 w-full">
        <GrapesJSEditor
          storeId={storeId}
          identity={identity}
          theme={theme}
          initialProjectData={storefront?.builderDraft || storefront?.builderPublished || null}
          isOwner={isOwner}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onOpenStorefront={() => navigate(`/boutique/${slug}`)}
        />
      </main>
    </div>
  );
};
