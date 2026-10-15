import React from 'react';
import { ArrowLeft, Sparkles, Store } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useStorefront } from '../../hooks/useStorefront';
import { TemplateGallery } from '../../components/store-editor/TemplateGallery';
import { TemplateId } from '../../types/storefront';
import { SEO } from '../../components/SEO/SEO';

import { useRouter } from '../../router/RouterContext';

export const TemplateGalleryPage: React.FC = () => {
  const { navigate } = useRouter();
  const { storefront, selectTemplate, saveConfig } = useStorefront('dsk-official');

  const handleSelectTemplate = async (templateId: TemplateId) => {
    selectTemplate(templateId);
    await saveConfig();
    navigate('/editeur/dsk-official');
  };

  const handlePreviewTemplate = (templateId: TemplateId) => {
    selectTemplate(templateId);
    navigate('/editeur/dsk-official');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-secondary">
      <SEO
        title="Galerie de Modèles de Boutique | Moteur Nexa & DSK"
        description="Explorez et choisissez parmi les templates e-commerce modernes et personnalisables pour votre boutique."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Retour au portail Nexa</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/editeur/dsk-official')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            >
              <Store size={14} />
              <span>Ouvrir l'Éditeur Visuel</span>
            </button>
          </div>
        </div>

        {/* Gallery Component */}
        <TemplateGallery
          currentTemplateId={storefront?.theme.templateId || 'general'}
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      </div>
    </div>
  );
};
