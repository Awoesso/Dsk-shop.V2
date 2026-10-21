import React, { useEffect, useRef, useState, useCallback } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { registerEcommerceBlocks } from './grapes/ecommerceBlocks';
import { generateStarterProjectForTemplate } from './grapes/templateStarter';
import { validateBuilderProject } from './grapes/projectValidator';
import { StoreIdentity, StoreTheme, BuilderProjectData } from '../../types/storefront';
import {
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Globe,
  Download,
  Upload,
  Trash2,
  Undo2,
  Redo2,
  CheckCircle2,
  AlertCircle,
  Code2,
  X,
  Copy,
  ExternalLink,
  Loader2,
} from 'lucide-react';

export interface GrapesJSEditorProps {
  storeId?: string;
  identity?: StoreIdentity;
  theme?: StoreTheme;
  initialProjectData?: BuilderProjectData | null;
  isOwner?: boolean;
  onSaveDraft?: (projectData: BuilderProjectData) => Promise<{ success: boolean; error: string | null }>;
  onPublish?: (projectData: BuilderProjectData) => Promise<{ success: boolean; error: string | null }>;
  onOpenStorefront?: () => void;
}

export const GrapesJSEditor: React.FC<GrapesJSEditorProps> = ({
  identity,
  theme,
  initialProjectData,
  isOwner = true,
  onSaveDraft,
  onPublish,
  onOpenStorefront,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);

  const [activeDevice, setActiveDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [memoryProjectData, setMemoryProjectData] = useState<any>(null);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const showNotification = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Initialize and tear down GrapesJS instance cleanly
  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    const primaryColor = theme?.colors?.primary || '#012d1d';
    const headingFont = theme?.typography?.headingFont || 'Plus Jakarta Sans, sans-serif';
    const currency = identity?.currency || 'FCFA';

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: '100%',
      width: 'auto',
      // Disable default local storage to maintain strict programmatic control
      storageManager: false,
      // Device Manager for Responsive Design testing
      deviceManager: {
        devices: [
          {
            id: 'desktop',
            name: 'Ordinateur',
            width: '', // 100%
          },
          {
            id: 'tablet',
            name: 'Tablette',
            width: '768px',
            widthMedia: '992px',
          },
          {
            id: 'mobile',
            name: 'Mobile',
            width: '390px',
            widthMedia: '480px',
          },
        ],
      },
      // Canvas styling: inject theme variables & standard fonts (no vendor external scripts)
      canvas: {
        scripts: [],
        styles: [
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:wght@600;800&family=Space+Grotesk:wght@500;700&display=swap',
          `
            :root {
              --store-primary: ${primaryColor};
              --store-font: ${headingFont};
            }
            body {
              font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
              margin: 0;
              padding: 16px;
              background-color: #fafafa;
              color: #1e293b;
            }
            * {
              box-sizing: border-box;
            }
          `,
        ],
      },
      // Panels & Toolbars configuration
      panels: {
        defaults: [
          {
            id: 'panel-top',
            el: '.panel-top',
          },
          {
            id: 'basic-actions',
            el: '.panel-basic-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                className: 'btn-toggle-borders',
                label: '🔲',
                command: 'sw-visibility',
              },
            ],
          },
          {
            id: 'panel-devices',
            el: '.panel-devices',
            buttons: [],
          },
        ],
      },
      blockManager: {
        appendTo: '#grapes-blocks-container',
      },
      styleManager: {
        appendTo: '#grapes-styles-container',
      },
      layerManager: {
        appendTo: '#grapes-layers-container',
      },
      selectorManager: {
        appendTo: '#grapes-selectors-container',
      },
    });

    // Register our modular e-commerce blocks
    registerEcommerceBlocks(editor, {
      primaryColor,
      headingFont,
      currency,
    });

    // Load initial project data if present, or generate template-matching starter
    if (initialProjectData && initialProjectData.pages?.length) {
      try {
        editor.loadProjectData(initialProjectData);
      } catch (err) {
        console.warn('Failed to load initial GrapesJS project data, falling back to template starter:', err);
        const starter = generateStarterProjectForTemplate(identity || ({} as any), theme || ({} as any));
        editor.loadProjectData(starter);
      }
    } else {
      const starter = generateStarterProjectForTemplate(identity || ({} as any), theme || ({} as any));
      editor.loadProjectData(starter);
    }

    // Track user changes
    editor.on('update', () => {
      setHasUnsavedChanges(true);
    });

    editorRef.current = editor;

    // Strict destruction on unmount
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // single mount

  // Device switcher
  const handleSetDevice = (device: 'desktop' | 'tablet' | 'mobile') => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(device);
    setActiveDevice(device);
  };

  // Undo / Redo
  const handleUndo = () => editorRef.current?.UndoManager?.undo();
  const handleRedo = () => editorRef.current?.UndoManager?.redo();

  // Export Project JSON to memory modal
  const handleExportJson = () => {
    if (!editorRef.current) return;
    const project = editorRef.current.getProjectData();
    const html = editorRef.current.getHtml();
    const css = editorRef.current.getCss();
    const fullProject = {
      ...project,
      html,
      css,
      templateId: theme?.templateId || 'general',
      version: '1.0',
    };
    setMemoryProjectData(fullProject);
    setJsonText(JSON.stringify(fullProject, null, 2));
    setShowJsonModal(true);
    showNotification('Project JSON exporté en mémoire avec succès !');
  };

  // Restore Project JSON from memory
  const handleRestoreJson = () => {
    if (!editorRef.current) return;
    if (!memoryProjectData) {
      showNotification("Aucun Project JSON n'a encore été exporté en mémoire.", 'error');
      return;
    }
    try {
      editorRef.current.loadProjectData(memoryProjectData);
      setHasUnsavedChanges(true);
      showNotification('Project JSON restauré avec succès dans le canvas !');
    } catch {
      showNotification('Erreur lors de la restauration du Project JSON.', 'error');
    }
  };

  // Save Draft to Supabase
  const handleSaveDraft = async () => {
    if (!editorRef.current) return;
    if (!isOwner) {
      showNotification('Seul le propriétaire de la boutique peut enregistrer les modifications.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const rawData = editorRef.current.getProjectData();
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();

      const projectPayload: BuilderProjectData = {
        ...rawData,
        html,
        css,
        templateId: theme?.templateId || 'general',
        version: '1.0',
        updatedAt: new Date().toISOString(),
      };

      // Security check
      const validation = validateBuilderProject(projectPayload);
      if (!validation.valid && validation.errors.length > 0) {
        showNotification(validation.errors[0], 'error');
        setIsSaving(false);
        return;
      }

      if (onSaveDraft) {
        const res = await onSaveDraft(validation.sanitized || projectPayload);
        if (res.success) {
          setHasUnsavedChanges(false);
          setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
          showNotification('Brouillon enregistré avec succès dans Supabase !');
        } else {
          showNotification(res.error || "Erreur lors de l'enregistrement du brouillon.", 'error');
        }
      } else {
        // In-memory fallback
        setMemoryProjectData(validation.sanitized || projectPayload);
        setHasUnsavedChanges(false);
        setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
        showNotification('Brouillon enregistré en mémoire (mode bac à sable) !');
      }
    } catch (err: any) {
      showNotification(err?.message || 'Erreur inattendue.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish visual project to live public storefront
  const handlePublish = async () => {
    if (!editorRef.current) return;
    if (!isOwner) {
      showNotification('Seul le propriétaire de la boutique peut publier la vitrine.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const rawData = editorRef.current.getProjectData();
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();

      const projectPayload: BuilderProjectData = {
        ...rawData,
        html,
        css,
        templateId: theme?.templateId || 'general',
        version: '1.0',
        updatedAt: new Date().toISOString(),
      };

      const validation = validateBuilderProject(projectPayload);
      if (!validation.valid && validation.errors.length > 0) {
        showNotification(validation.errors[0], 'error');
        setIsPublishing(false);
        return;
      }

      if (onPublish) {
        const res = await onPublish(validation.sanitized || projectPayload);
        if (res.success) {
          setHasUnsavedChanges(false);
          setLastSavedTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
          showNotification('Boutique publiée avec succès ! Le design est en ligne.');
        } else {
          showNotification(res.error || 'Erreur lors de la publication.', 'error');
        }
      } else {
        setMemoryProjectData(validation.sanitized || projectPayload);
        setHasUnsavedChanges(false);
        showNotification('Version visuelle validée en mémoire (mode bac à sable).');
      }
    } catch (err: any) {
      showNotification(err?.message || 'Erreur inattendue.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset Canvas to template starter
  const handleClearCanvas = () => {
    if (!editorRef.current) return;
    if (window.confirm('Voulez-vous réinitialiser le canvas avec le modèle de départ ?')) {
      const starter = generateStarterProjectForTemplate(identity || ({} as any), theme || ({} as any));
      editorRef.current.loadProjectData(starter);
      setHasUnsavedChanges(true);
      showNotification('Canvas réinitialisé avec le modèle de départ.');
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 gap-3">
        {/* Left: Device switcher & Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleSetDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeDevice === 'desktop' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Ordinateur (100%)"
            >
              <Monitor size={15} />
              <span className="hidden sm:inline">Bureau</span>
            </button>
            <button
              onClick={() => handleSetDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeDevice === 'tablet' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Tablette (768px)"
            >
              <Tablet size={15} />
              <span className="hidden sm:inline">Tablette</span>
            </button>
            <button
              onClick={() => handleSetDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                activeDevice === 'mobile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vue Mobile (390px)"
            >
              <Smartphone size={15} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs">
            {hasUnsavedChanges ? (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Modifications non enregistrées
              </span>
            ) : lastSavedTime ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} />
                Enregistré à {lastSavedTime}
              </span>
            ) : (
              <span className="text-slate-500">Prêt</span>
            )}
          </div>
        </div>

        {/* Center: History Undo/Redo & Clear */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
          <button
            onClick={handleClearCanvas}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Réinitialiser le canvas"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Right: Actions (Save Draft, Publish, Export JSON, View Live) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            title="Inspecter le Project JSON"
          >
            <Code2 size={14} className="text-emerald-400" />
            <span className="hidden md:inline">JSON</span>
          </button>

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} className="text-slate-300" />}
            <span>Enregistrer Brouillon</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl border border-emerald-500 shadow-md shadow-emerald-950/40 transition-colors cursor-pointer disabled:opacity-50"
          >
            {isPublishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            <span>Publier</span>
          </button>

          {onOpenStorefront && (
            <button
              onClick={onOpenStorefront}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Ouvrir la vitrine publique"
            >
              <ExternalLink size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-b border-rose-500/20'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Main Workspace : Canvas (Center) + Right Sidebar (Blocks & Styles) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Center Canvas */}
        <div className="flex-1 h-full bg-slate-800 overflow-hidden relative">
          <div ref={containerRef} className="w-full h-full" />
        </div>

        {/* Right Sidebar: Tabs for Blocks, Styles, Layers */}
        <div className="w-80 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Palette E-Commerce
            </span>
            <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/40 font-mono">
              GrapesJS 0.23
            </span>
          </div>

          {/* Scrollable Blocks Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div id="grapes-blocks-container" />
            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-400 mb-2 block">Styles & Sélecteurs</span>
              <div id="grapes-selectors-container" className="mb-2" />
              <div id="grapes-styles-container" />
            </div>
          </div>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="text-emerald-400" size={18} />
                <h3 className="font-bold text-sm text-white">Project JSON Exporté (GrapesJS)</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-slate-950 font-mono text-xs text-slate-300">
              <pre>{jsonText}</pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
              <span className="text-xs text-slate-400 font-mono">
                Taille : {(jsonText.length / 1024).toFixed(1)} ko
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Copy size={13} />
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
