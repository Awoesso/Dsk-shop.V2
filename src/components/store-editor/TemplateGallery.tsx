import React, { useState } from 'react';
import { Check, Sparkles, Eye, ArrowRight, Layers } from 'lucide-react';
import { TemplateDefinition, TemplateId } from '../../types/storefront';
import { templateRegistry } from '../../templates/storefront/registry/templateRegistry';

interface TemplateGalleryProps {
  currentTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onPreviewTemplate?: (templateId: TemplateId) => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  currentTemplateId,
  onSelectTemplate,
  onPreviewTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const templates = templateRegistry.getAvailableTemplates();

  const categories = [
    { id: 'all', label: 'Tous les modèles' },
    { id: 'fashion', label: 'Mode & Créateurs' },
    { id: 'tech', label: 'High-Tech & Gadgets' },
    { id: 'general', label: 'Commerce Général' },
  ];

  const filteredTemplates = templates.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  return (
    <div className="w-full space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-primary">
            Catalogue des Modèles de Boutique
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Sélectionnez une structure visuelle pour votre boutique Nexa. Chaque template est 100% personnalisable.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isSelected = template.id === currentTemplateId;

          return (
            <div
              key={template.id}
              className={`flex flex-col rounded-2xl border bg-white overflow-hidden transition-all duration-200 hover:shadow-lg ${
                isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md' : 'border-slate-200'
              }`}
            >
              {/* Preview Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />

                {isSelected && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                    <Check size={14} />
                    <span>Modèle Actif</span>
                  </div>
                )}

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono">
                  v{template.version}
                </div>
              </div>

              {/* Template Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {template.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Par {template.author}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 font-primary">
                    {template.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {template.description}
                  </p>

                  {/* Feature Chips */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {template.supportedFeatures.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-100 text-slate-700"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  {onPreviewTemplate && (
                    <button
                      onClick={() => onPreviewTemplate(template.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <Eye size={14} />
                      <span>Aperçu</span>
                    </button>
                  )}

                  <button
                    onClick={() => onSelectTemplate(template.id)}
                    disabled={isSelected}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} />
                        <span>Sélectionné</span>
                      </>
                    ) : (
                      <>
                        <span>Appliquer</span>
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
