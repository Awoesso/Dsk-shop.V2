import { BuilderProjectData } from '../../../types/storefront';

const MAX_PROJECT_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB safety limit
const SAFE_URL_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:', '/', '#'];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitized: BuilderProjectData | null;
}

/**
 * Validates and sanitizes a GrapesJS project data payload before saving to Supabase or rendering.
 * Enforces strict anti-XSS and integrity constraints:
 * - Rejects arbitrary scripts and event handlers (onerror, onload, onclick, etc.)
 * - Validates href and src protocols
 * - Enforces JSON structure and maximum payload size
 */
export function validateBuilderProject(rawProject: any): ValidationResult {
  const errors: string[] = [];

  if (!rawProject || typeof rawProject !== 'object') {
    return {
      valid: false,
      errors: ['Données de projet invalides ou absentes.'],
      sanitized: null,
    };
  }

  // 1. Size constraint
  let serialized = '';
  try {
    serialized = JSON.stringify(rawProject);
  } catch {
    return {
      valid: false,
      errors: ['Impossible de sérialiser le projet (référence circulaire ou données corrompues).'],
      sanitized: null,
    };
  }

  if (serialized.length > MAX_PROJECT_SIZE_BYTES) {
    return {
      valid: false,
      errors: [`Le projet dépasse la taille maximale autorisée de 2 Mo (${(serialized.length / 1024).toFixed(1)} ko).`],
      sanitized: null,
    };
  }

  // Deep clone to sanitize safely
  const sanitized = JSON.parse(serialized);

  // 2. Recursive sanitization of components tree
  function sanitizeComponent(comp: any) {
    if (!comp || typeof comp !== 'object') return;

    // Check dangerous component type
    if (comp.type === 'script') {
      errors.push('Les composants de type <script> sont formellement interdits.');
      comp.type = 'div';
      comp.content = '';
    }

    // Check attributes
    if (comp.attributes && typeof comp.attributes === 'object') {
      for (const [key, value] of Object.entries(comp.attributes)) {
        const lowerKey = key.toLowerCase();
        // Remove event handlers (onclick, onerror, onload, etc.)
        if (lowerKey.startsWith('on')) {
          delete comp.attributes[key];
          errors.push(`Attribut de gestionnaire d'événement retiré pour sécurité : "${key}"`);
          continue;
        }

        // Check URL schemes
        if ((lowerKey === 'href' || lowerKey === 'src') && typeof value === 'string') {
          const trimmed = value.trim().toLowerCase();
          const isSafe = SAFE_URL_PROTOCOLS.some((p) => trimmed.startsWith(p));
          if (!isSafe && trimmed.length > 0) {
            delete comp.attributes[key];
            errors.push(`URL non sécurisée retirée : "${value}"`);
          }
        }
      }
    }

    // Check raw content string for embedded scripts
    if (typeof comp.content === 'string') {
      if (
        comp.content.toLowerCase().includes('<script') ||
        comp.content.toLowerCase().includes('javascript:')
      ) {
        errors.push('Contenu textuel contenant un script neutralisé.');
        comp.content = comp.content
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '');
      }
    }

    // Recurse children
    if (Array.isArray(comp.components)) {
      comp.components.forEach(sanitizeComponent);
    }
  }

  // Sanitize pages and component trees (GrapesJS v0.18 component and v0.23+ frames)
  if (Array.isArray(sanitized.pages)) {
    sanitized.pages.forEach((page: any) => {
      if (page.component) {
        sanitizeComponent(page.component);
      }
      if (Array.isArray(page.frames)) {
        page.frames.forEach((frame: any) => {
          if (frame.component) {
            sanitizeComponent(frame.component);
          }
        });
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: {
      version: sanitized.version || '1.0',
      templateId: sanitized.templateId || 'general',
      pages: sanitized.pages || [],
      styles: sanitized.styles || [],
      symbols: sanitized.symbols || [],
      html: typeof sanitized.html === 'string' ? sanitized.html : undefined,
      css: typeof sanitized.css === 'string' ? sanitized.css : undefined,
      updatedAt: new Date().toISOString(),
    },
  };
}
