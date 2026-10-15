import React, { useState } from 'react';
import {
  Palette,
  Type,
  Layout,
  Layers,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Eye,
  Store,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  StoreTheme,
  TemplateId,
  HeadingFontFamily,
  BodyFontFamily,
  ButtonRadius,
  CardRadius,
  ContentWidth,
  ProductLayout,
  StoreIdentity,
  DeepPartial,
} from '../../types/storefront';
import { templateRegistry } from '../../templates/storefront/registry/templateRegistry';

interface ThemeEditorProps {
  currentTheme: StoreTheme;
  identity: StoreIdentity;
  onUpdateTheme: (updates: DeepPartial<StoreTheme>) => void;
  onUpdateIdentity?: (updates: Partial<StoreIdentity>) => void;
  onSave: () => Promise<{ success: boolean; error: string | null }>;
  onReset: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
  onPreview?: () => void;
}

const COLOR_PRESETS = [
  {
    name: 'Bambou Éco-Moderne',
    colors: {
      primary: '#012d1d',
      secondary: '#1b4332',
      accent: '#c1ecd4',
      background: '#f4fafd',
      surface: '#ffffff',
      text: '#161d1f',
      muted: '#717973',
      border: '#dde4e6',
    },
  },
  {
    name: 'Obsidienne Épuré',
    colors: {
      primary: '#18181b',
      secondary: '#27272a',
      accent: '#f43f5e',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#09090b',
      muted: '#71717a',
      border: '#e4e4e7',
    },
  },
  {
    name: 'Cyber Azur',
    colors: {
      primary: '#0284c7',
      secondary: '#0f172a',
      accent: '#38bdf8',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      muted: '#64748b',
      border: '#e2e8f0',
    },
  },
  {
    name: 'Or Impérial',
    colors: {
      primary: '#78350f',
      secondary: '#92400e',
      accent: '#d97706',
      background: '#fffbeb',
      surface: '#ffffff',
      text: '#451a03',
      muted: '#92400e',
      border: '#fde68a',
    },
  },
];

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  currentTheme,
  identity,
  onUpdateTheme,
  onUpdateIdentity,
  onSave,
  onReset,
  hasUnsavedChanges,
  isSaving,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'template' | 'colors' | 'typography' | 'layout' | 'sections' | 'identity'>('template');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableTemplates = templateRegistry.getAvailableTemplates();

  const handleSave = async () => {
    setSaveMessage(null);
    const res = await onSave();
    if (res.success) {
      setSaveMessage({ type: 'success', text: 'Paramètres de la boutique enregistrés avec succès !' });
      setTimeout(() => setSaveMessage(null), 3500);
    } else {
      setSaveMessage({ type: 'error', text: res.error || 'Erreur lors de la sauvegarde.' });
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col font-secondary">
      {/* Editor Top Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
            <Palette size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 font-primary">
              Personnalisation de la Boutique
            </h3>
            <span className="text-xs text-slate-500">
              Boutique : <strong className="text-slate-800">{identity.name}</strong> • Template :{' '}
              <strong className="text-slate-800 uppercase">{currentTheme.templateId}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RotateCcw size={14} />
              <span>Annuler</span>
            </button>
          )}

          {onPreview && (
            <button
              onClick={onPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Eye size={14} />
              <span>Aperçu</span>
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-white shadow-xs transition-all cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isSaving ? (
              <span>Enregistrement...</span>
            ) : (
              <>
                <Save size={14} />
                <span>{hasUnsavedChanges ? 'Enregistrer les modifications' : 'Enregistré'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save feedback banner */}
      {saveMessage && (
        <div
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b animate-in fade-in ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {saveMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold bg-slate-50/30">
        <button
          onClick={() => setActiveTab('template')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'template'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={14} />
          <span>Modèle de base</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'colors'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette size={14} />
          <span>Palette de Couleurs</span>
        </button>

        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'typography'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Type size={14} />
          <span>Typographie & Formes</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'layout'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layout size={14} />
          <span>Disposition & Grille</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'sections'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles size={14} />
          <span>Sections Actives</span>
        </button>

        <button
          onClick={() => setActiveTab('identity')}
          className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'identity'
              ? 'border-slate-900 text-slate-900 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store size={14} />
          <span>Identité & Coordonnées</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6 space-y-6">
        {/* TAB 1: TEMPLATE SELECTION */}
        {activeTab === 'template' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-primary">Sélectionner un Modèle</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Changer de modèle adapte automatiquement la mise en page tout en conservant vos produits et vos données.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {availableTemplates.map((t) => {
                const isCurrent = t.id === currentTheme.templateId;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      const defTheme = templateRegistry.getDefaultThemeForTemplate(t.id);
                      onUpdateTheme({
                        templateId: t.id,
                        colors: defTheme.colors,
                        typography: defTheme.typography,
                        shape: defTheme.shape,
                        layout: defTheme.layout,
                        sections: defTheme.sections,
                      });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {t.category}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <Check size={14} />
                          <span>Actif</span>
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-sm text-slate-900">{t.name}</h5>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: COLORS */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Palettes Prédéfinies</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => onUpdateTheme({ colors: { ...currentTheme.colors, ...preset.colors } })}
                    className="p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.primary }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.accent }} />
                      <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.colors.background }} />
                    </div>
                    <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-slate-900">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="pt-4 border-t border-slate-200">
              <label className="text-xs font-bold text-slate-700 block mb-3">Couleurs Personnalisées</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">Couleur Principale</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.primary}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, primary: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.primary}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, primary: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">Couleur Secondaire</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.secondary}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, secondary: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.secondary}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, secondary: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">Fond de la Boutique</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.background}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, background: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.background}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, background: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-slate-600">Texte & Titres</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTheme.colors.text}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, text: e.target.value },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={currentTheme.colors.text}
                      onChange={(e) =>
                        onUpdateTheme({
                          colors: { ...currentTheme.colors, text: e.target.value },
                        })
                      }
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TYPOGRAPHY & SHAPES */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Heading Font */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Police des Titres</label>
                <select
                  value={currentTheme.typography.headingFont}
                  onChange={(e) =>
                    onUpdateTheme({
                      typography: {
                        ...currentTheme.typography,
                        headingFont: e.target.value as HeadingFontFamily,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Montserrat">Montserrat (Moderne & Audacieux)</option>
                  <option value="Playfair Display">Playfair Display (Éditorial & Chic)</option>
                  <option value="Space Grotesk">Space Grotesk (Technologique & Épuré)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Harmonieux)</option>
                  <option value="Syne">Syne (Créatif & Distinctif)</option>
                  <option value="Inter">Inter (Universel & Neutre)</option>
                </select>
              </div>

              {/* Body Font */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Police du Corps de Texte</label>
                <select
                  value={currentTheme.typography.bodyFont}
                  onChange={(e) =>
                    onUpdateTheme({
                      typography: {
                        ...currentTheme.typography,
                        bodyFont: e.target.value as BodyFontFamily,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Inter">Inter (Lisibilité Maximale)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Doux)</option>
                  <option value="Roboto">Roboto (Classique)</option>
                </select>
              </div>
            </div>

            {/* Shapes & Radii */}
            <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Arrondi des Boutons</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['none', 'sm', 'md', 'lg', 'full'] as ButtonRadius[]).map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        onUpdateTheme({
                          shape: { ...currentTheme.shape, buttonRadius: r },
                        })
                      }
                      className={`py-2 text-[11px] font-bold border transition-colors cursor-pointer ${
                        currentTheme.shape.buttonRadius === r
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                      style={{
                        borderRadius:
                          r === 'none' ? '0' : r === 'sm' ? '4px' : r === 'md' ? '8px' : r === 'lg' ? '12px' : '9999px',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Arrondi des Cartes Produits</label>
                <div className="grid grid-cols-6 gap-1.5">
                  {(['none', 'sm', 'md', 'lg', 'xl', '2xl'] as CardRadius[]).map((r) => (
                    <button
                      key={r}
                      onClick={() =>
                        onUpdateTheme({
                          shape: { ...currentTheme.shape, cardRadius: r },
                        })
                      }
                      className={`py-2 text-[11px] font-bold border rounded-lg transition-colors cursor-pointer ${
                        currentTheme.shape.cardRadius === r
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LAYOUT & GRID */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Product Layout */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Disposition des Produits</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  <button
                    onClick={() =>
                      onUpdateTheme({
                        layout: { ...currentTheme.layout, productLayout: 'grid' },
                      })
                    }
                    className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      currentTheme.layout.productLayout === 'grid'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Grille
                  </button>
                  <button
                    onClick={() =>
                      onUpdateTheme({
                        layout: { ...currentTheme.layout, productLayout: 'list' },
                      })
                    }
                    className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                      currentTheme.layout.productLayout === 'list'
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Liste
                  </button>
                </div>
              </div>

              {/* Grid Columns */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Colonnes (sur Grand Écran)</label>
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  {[2, 3, 4].map((cols) => (
                    <button
                      key={cols}
                      onClick={() =>
                        onUpdateTheme({
                          layout: {
                            ...currentTheme.layout,
                            productGridColumns: cols as 2 | 3 | 4,
                          },
                        })
                      }
                      className={`flex-1 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        currentTheme.layout.productGridColumns === cols
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cols} col.
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Width */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Largeur du Contenu</label>
                <select
                  value={currentTheme.layout.contentWidth}
                  onChange={(e) =>
                    onUpdateTheme({
                      layout: {
                        ...currentTheme.layout,
                        contentWidth: e.target.value as ContentWidth,
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white"
                >
                  <option value="compact">Compacte (1024px)</option>
                  <option value="standard">Standard (1280px)</option>
                  <option value="wide">Très Large (1680px)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECTIONS TOGGLES */}
        {activeTab === 'sections' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-primary">Modules et Sections Visibles</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Activez ou désactivez les blocs de la boutique selon votre stratégie commerciale.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'showHeroBanner', label: "Bannière d'accueil principale", desc: 'Grande bannière avec titre, slogan et appel à action' },
                { key: 'showBrandStory', label: 'Présentation de la marque', desc: 'Bloc éditorial ou citation philosophique de votre enseigne' },
                { key: 'showPromoBanner', label: 'Bannière promotionnelle flash', desc: 'Bandeau d’alerte promo en tête de page' },
                { key: 'showCategoryPills', label: 'Barre de filtres par catégories', desc: 'Boutons de navigation rapide par rayon' },
                { key: 'showTrustBadges', label: 'Garanties & Réassurance client', desc: 'Badges de livraison rapide, paiement sécurisé et WhatsApp' },
                { key: 'showNewsletter', label: 'Formulaire de fidélité / Newsletter', desc: 'Capture des adresses e-mail ou numéros de vos clients' },
              ].map(({ key, label, desc }) => {
                const isEnabled = (currentTheme.sections as any)[key] ?? true;
                return (
                  <div
                    key={key}
                    onClick={() =>
                      onUpdateTheme({
                        sections: {
                          ...currentTheme.sections,
                          [key]: !isEnabled,
                        },
                      })
                    }
                    className="p-3.5 rounded-xl border border-slate-200 flex items-start justify-between gap-3 bg-white hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{label}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{desc}</span>
                    </div>

                    <div
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${
                        isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: STORE IDENTITY */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-primary">Coordonnées de la Boutique</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ces informations s’affichent dans l’en-tête, le pied de page et les boutons de contact WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nom commercial</label>
                <input
                  type="text"
                  value={identity.name}
                  onChange={(e) => onUpdateIdentity && onUpdateIdentity({ name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Slogan court</label>
                <input
                  type="text"
                  value={identity.tagline || ''}
                  onChange={(e) => onUpdateIdentity && onUpdateIdentity({ tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Numéro WhatsApp / Téléphone</label>
                <input
                  type="text"
                  value={identity.phone || ''}
                  onChange={(e) => onUpdateIdentity && onUpdateIdentity({ phone: e.target.value })}
                  placeholder="+228 90 00 00 00"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Adresse / Ville</label>
                <input
                  type="text"
                  value={identity.address || ''}
                  onChange={(e) => onUpdateIdentity && onUpdateIdentity({ address: e.target.value })}
                  placeholder="Déckon, Lomé"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Description détaillée de la boutique</label>
                <textarea
                  rows={3}
                  value={identity.description || ''}
                  onChange={(e) => onUpdateIdentity && onUpdateIdentity({ description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
