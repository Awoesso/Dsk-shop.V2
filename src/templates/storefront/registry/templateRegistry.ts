import { TemplateDefinition, TemplateId, StoreTheme } from '../../../types/storefront';
import { FashionTemplate } from '../fashion/FashionTemplate';
import { TechTemplate } from '../tech/TechTemplate';
import { GeneralTemplate } from '../general/GeneralTemplate';

export const DEFAULT_TEMPLATE_ID: TemplateId = 'general';

/**
 * Default Theme configuration for Fashion template
 */
export const FASHION_DEFAULT_THEME: StoreTheme = {
  templateId: 'fashion',
  colors: {
    primary: '#1c1917', // warm stone black
    secondary: '#44403c',
    accent: '#d97706', // subtle amber
    background: '#fafaf9', // warm linen
    surface: '#ffffff',
    text: '#1c1917',
    muted: '#78716c',
    border: '#e7e5e4',
  },
  typography: {
    headingFont: 'Playfair Display',
    bodyFont: 'Inter',
  },
  shape: {
    buttonRadius: 'sm',
    cardRadius: 'md',
  },
  layout: {
    contentWidth: 'standard',
    spacing: 'spacious',
    productCardStyle: 'minimal',
    productGridColumns: 3,
    productLayout: 'grid',
  },
  sections: {
    showHeroBanner: true,
    showBrandStory: true,
    showFeaturedGrid: true,
    showCategoryPills: true,
    showPromoBanner: false,
    showNewsletter: true,
    showTrustBadges: true,
    showContactCta: true,
  },
};

/**
 * Default Theme configuration for Tech template
 */
export const TECH_DEFAULT_THEME: StoreTheme = {
  templateId: 'tech',
  colors: {
    primary: '#0284c7', // cyan/sky blue
    secondary: '#0f172a', // deep slate
    accent: '#38bdf8',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
  },
  typography: {
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
  },
  shape: {
    buttonRadius: 'md',
    cardRadius: 'lg',
  },
  layout: {
    contentWidth: 'wide',
    spacing: 'comfortable',
    productCardStyle: 'bordered',
    productGridColumns: 4,
    productLayout: 'grid',
  },
  sections: {
    showHeroBanner: true,
    showBrandStory: false,
    showFeaturedGrid: true,
    showCategoryPills: true,
    showPromoBanner: true,
    showNewsletter: false,
    showTrustBadges: true,
    showContactCta: true,
  },
};

/**
 * Default Theme configuration for General template
 */
export const GENERAL_DEFAULT_THEME: StoreTheme = {
  templateId: 'general',
  colors: {
    primary: '#012d1d', // bamboo deep forest
    secondary: '#1b4332',
    accent: '#c1ecd4',
    background: '#f4fafd',
    surface: '#ffffff',
    text: '#161d1f',
    muted: '#717973',
    border: '#dde4e6',
  },
  typography: {
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
  },
  shape: {
    buttonRadius: 'md',
    cardRadius: 'xl',
  },
  layout: {
    contentWidth: 'standard',
    spacing: 'comfortable',
    productCardStyle: 'standard',
    productGridColumns: 4,
    productLayout: 'grid',
  },
  sections: {
    showHeroBanner: true,
    showBrandStory: true,
    showFeaturedGrid: true,
    showCategoryPills: true,
    showPromoBanner: true,
    showNewsletter: true,
    showTrustBadges: true,
    showContactCta: true,
  },
};

/**
 * Initial Template Definitions
 */
const initialTemplates: Record<string, TemplateDefinition> = {
  fashion: {
    id: 'fashion',
    name: 'Atelier Mode & Création',
    slug: 'fashion',
    description:
      'Design haute couture, lookbook éditorial et typographies raffinées pour créateurs, boutiques de vêtements et accessoires chic.',
    category: 'fashion',
    version: '1.0.0',
    author: 'DSK & Nexa Team',
    previewImage: '/Harmonie.png',
    component: FashionTemplate,
    defaultTheme: FASHION_DEFAULT_THEME,
    supportedFeatures: [
      'Lookbook éditorial',
      'Citations de marque',
      'Grille élégante 3 colonnes',
      'Conseiller VIP WhatsApp',
      'Wishlist intégrée',
    ],
    isAvailable: true,
  },
  tech: {
    id: 'tech',
    name: 'CyberTech & Gadgets',
    slug: 'tech',
    description:
      'Interface technologique haute performance avec bannières de ventes flash, fiches de spécifications et badges de garantie.',
    category: 'tech',
    version: '1.0.0',
    author: 'DSK & Nexa Team',
    previewImage: '/Harmonie.png',
    component: TechTemplate,
    defaultTheme: TECH_DEFAULT_THEME,
    supportedFeatures: [
      'Bannière Vente Flash animée',
      'Badges techniques et garanties',
      'Format large haute densité',
      'Commande WhatsApp express',
      'Paiement mobile instantané',
    ],
    isAvailable: true,
  },
  general: {
    id: 'general',
    name: 'Boutique Polyvalente Universelle',
    slug: 'general',
    description:
      'Modèle complet et équilibré, adapté à tout type de commerce : multi-catégories, réassurance client, bannières et newsletter.',
    category: 'general',
    version: '1.0.0',
    author: 'DSK & Nexa Team',
    previewImage: '/Harmonie.png',
    component: GeneralTemplate,
    defaultTheme: GENERAL_DEFAULT_THEME,
    supportedFeatures: [
      'Bannière d’accueil configurable',
      'Multi-catégories dynamiques',
      'Garanties et réassurance',
      'Module Newsletter',
      'Filtres de recherche instantanés',
    ],
    isAvailable: true,
  },
};

/**
 * In-memory Template Registry
 */
class TemplateRegistry {
  private templates: Map<string, TemplateDefinition> = new Map();

  constructor() {
    // Register initial built-in templates
    Object.values(initialTemplates).forEach((t) => {
      this.templates.set(t.id, t);
    });
  }

  /**
   * Registers a new template into the engine.
   * Enables third-party or future template additions (e.g., Beauty, Food, Art)
   * without modifying other unrelated files.
   */
  public registerTemplate(definition: TemplateDefinition): void {
    if (!definition.id || !definition.name || !definition.component) {
      throw new Error(`[TemplateRegistry] Invalid template definition: missing required properties.`);
    }
    this.templates.set(definition.id, definition);
  }

  /**
   * Retrieves a template by its ID with safe fallback.
   * If the requested template ID does not exist or is disabled,
   * falls back safely to 'general' without crashing.
   */
  public getTemplate(id?: string | null): TemplateDefinition {
    if (id && this.templates.has(id)) {
      const template = this.templates.get(id)!;
      if (template.isAvailable) {
        return template;
      }
    }

    // Safe fallback to 'general'
    const fallback = this.templates.get(DEFAULT_TEMPLATE_ID);
    if (fallback) {
      return fallback;
    }

    // Ultimate fallback if map is empty
    return initialTemplates.general;
  }

  /**
   * Returns all registered templates.
   */
  public getAllTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  /**
   * Returns only active and available templates for the gallery.
   */
  public getAvailableTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values()).filter((t) => t.isAvailable);
  }

  /**
   * Checks if a template ID is recognized and registered.
   */
  public isValidTemplateId(id: string): boolean {
    return this.templates.has(id);
  }

  /**
   * Returns the default theme for a given template ID.
   */
  public getDefaultThemeForTemplate(id: TemplateId): StoreTheme {
    const template = this.getTemplate(id);
    return JSON.parse(JSON.stringify(template.defaultTheme));
  }
}

export const templateRegistry = new TemplateRegistry();
export default templateRegistry;
