import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Layers, ShieldAlert, CheckCircle2, Globe, EyeOff, Beaker } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { useStoreCart } from '../../hooks/useStoreCart';
import { ThemeEditor } from '../../components/store-editor/ThemeEditor';
import { StorePreview } from '../../components/store-editor/StorePreview';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components/SEO/SEO';
import { StoreTheme, DeepPartial } from '../../types/storefront';

export interface StoreEditorPageProps {
  slug?: string;
}

export const StoreEditorPage: React.FC<StoreEditorPageProps> = () => {
  const {
    store,
    identity,
    theme: baseTheme,
    storeId,
    slug,
    isUnpublished,
    refreshStore,
    updateSettings,
    storefront,
  } = useStore();

  const { navigate } = useRouter();
  const { addToCart } = useStoreCart(storeId);

  const [themeOverride, setThemeOverride] = useState<DeepPartial<StoreTheme> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Check Supabase authenticated user to enforce owner-only modification
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
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
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const isOwner = Boolean(
    store?.owner_id
      ? currentUser && currentUser.id === store.owner_id
      : true // Demo or synthetic store in sandbox preview
  );

  const effectiveTheme: StoreTheme = React.useMemo(() => {
    if (!themeOverride) return baseTheme;
    return {
      ...baseTheme,
      ...themeOverride,
      colors: {
        ...baseTheme.colors,
        ...(themeOverride.colors || {}),
      },
      typography: {
        ...baseTheme.typography,
        ...(themeOverride.typography || {}),
      },
      shape: {
        ...baseTheme.shape,
        ...(themeOverride.shape || {}),
      },
      layout: {
        ...baseTheme.layout,
        ...(themeOverride.layout || {}),
      },
      sections: {
        ...baseTheme.sections,
        ...(themeOverride.sections || {}),
      },
    };
  }, [baseTheme, themeOverride]);

  const previewStorefront = React.useMemo(() => {
    if (!storefront) return null;
    return {
      ...storefront,
      theme: effectiveTheme,
    };
  }, [storefront, effectiveTheme]);

  const handleUpdateTheme = (updates: DeepPartial<StoreTheme>) => {
    setThemeOverride((prev) => ({
      ...(prev || {}),
      ...updates,
      colors: { ...(prev?.colors || {}), ...(updates.colors || {}) },
      typography: { ...(prev?.typography || {}), ...(updates.typography || {}) },
      shape: { ...(prev?.shape || {}), ...(updates.shape || {}) },
      layout: { ...(prev?.layout || {}), ...(updates.layout || {}) },
      sections: { ...(prev?.sections || {}), ...(updates.sections || {}) },
    }));
  };

  const handleResetTheme = () => {
    setThemeOverride(null);
  };

  const handleSaveTheme = async (): Promise<{ success: boolean; error: string | null }> => {
    if (!storeId) {
      return { success: false, error: 'Identifiant de boutique introuvable.' };
    }

    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await updateSettings({
        primary_color: effectiveTheme.colors?.primary,
        secondary_color: effectiveTheme.colors?.secondary,
        font_family: effectiveTheme.typography?.headingFont,
        template_id: effectiveTheme.templateId,
        social_links: {
          template_id: effectiveTheme.templateId,
          theme: effectiveTheme,
        },
      });

      if (res.success) {
        setThemeOverride(null);
        await refreshStore();
        setSaveStatus({
          type: 'success',
          message: 'Thème et paramètres enregistrés avec succès dans store_settings !',
        });
        setTimeout(() => setSaveStatus(null), 4000);
        setIsSaving(false);
        return { success: true, error: null };
      } else {
        setSaveStatus({
          type: 'error',
          message: res.error || 'Erreur lors de la sauvegarde.',
        });
        setIsSaving(false);
        return { success: false, error: res.error };
      }
    } catch (err: any) {
      setIsSaving(false);
      const msg = err?.message || 'Erreur inattendue.';
      setSaveStatus({ type: 'error', message: msg });
      return { success: false, error: msg };
    }
  };

  const handleTogglePublication = async () => {
    if (!store?.id) return;
    setUpdatingStatus(true);
    try {
      const newStatus = isUnpublished ? 'active' : 'draft';
      const { error: updErr } = await (supabase as any)
        .from('stores')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', store.id);

      if (!updErr) {
        await refreshStore();
      }
    } catch {
      // safe fallback
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Strict Ownership security check: block unauthenticated visitors and non-owners
  if (authChecked && store?.owner_id && (!currentUser || currentUser.id !== store.owner_id)) {
    return (
      <div className="w-full min-h-screen bg-slate-100 flex items-center justify-center p-6 font-secondary">
        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-primary">Accès Restreint</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {currentUser
              ? `Votre compte (${currentUser.email || currentUser.id}) n'est pas le propriétaire de la boutique ${identity.name}.`
              : `Vous devez être connecté avec le compte propriétaire pour accéder à l'éditeur de la boutique ${identity.name}.`}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Retour au portail Nexa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-100 py-6 px-3 sm:px-6 lg:px-8 font-secondary">
      <SEO
        title={`Atelier Thème | ${identity.name}`}
        description="Personnalisez les couleurs, typographies, sections et templates de votre boutique e-commerce en temps réel."
        noindex={true}
      />

      <div className="max-w-[1720px] mx-auto space-y-5">
        {/* Top Control Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Retour accueil"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-sm sm:text-base text-slate-900 font-primary">
                  Atelier Storefront : {identity.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isUnpublished
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isUnpublished ? 'Brouillon privé' : 'Boutique Publiée'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Identifiant : <code className="font-mono">{slug}</code> • Modèle actif :{' '}
                <strong className="text-slate-800 uppercase">{effectiveTheme.templateId}</strong>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePublication}
              disabled={updatingStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer ${
                isUnpublished
                  ? 'border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                  : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              {isUnpublished ? <Globe size={13} /> : <EyeOff size={13} />}
              <span>{isUnpublished ? 'Publier la boutique' : 'Passer en brouillon'}</span>
            </button>

            <button
              onClick={() => navigate('/templates')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Layers size={14} />
              <span className="hidden md:inline">Galerie Modèles</span>
            </button>

            <button
              onClick={() => navigate(`/editeur-lab/${encodeURIComponent(slug)}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors cursor-pointer"
              title="Tester le banc d'essai GrapesJS isolé en mémoire"
            >
              <Beaker size={13} />
              <span className="hidden md:inline">Lab GrapesJS</span>
            </button>

            <button
              onClick={() => navigate(`/boutique/${encodeURIComponent(slug)}`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
            >
              <span>Voir la boutique</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {saveStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
              saveStatus.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border border-rose-200 text-rose-800'
            }`}
          >
            {saveStatus.type === 'success' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
            <span>{saveStatus.message}</span>
          </div>
        )}

        {/* Editor & Preview Workspace */}
        {previewStorefront && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Editor Sidebar Controls */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-4">
              <ThemeEditor
                currentTheme={effectiveTheme}
                identity={identity}
                onUpdateTheme={handleUpdateTheme}
                onSave={handleSaveTheme}
                onReset={handleResetTheme}
                hasUnsavedChanges={themeOverride !== null}
                isSaving={isSaving}
              />
            </div>

            {/* Live Interactive Preview */}
            <div className="lg:col-span-7 xl:col-span-7 sticky top-4">
              <StorePreview
                storefront={previewStorefront}
                themeOverride={themeOverride || undefined}
                onAddToCart={(prod, qty) => addToCart(prod, qty)}
                onOpenStorefront={() => navigate(`/boutique/${encodeURIComponent(slug)}`)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
