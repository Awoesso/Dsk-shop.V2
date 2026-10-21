import { StoreIdentity, StoreTheme, BuilderProjectData } from '../../../types/storefront';

/**
 * Generates an initial starter GrapesJS project structure tailored to the store's active template.
 * This bridges classic templates (General, Fashion, Tech) into GrapesJS visual components seamlessly.
 */
export function generateStarterProjectForTemplate(
  identity: StoreIdentity,
  theme: StoreTheme
): BuilderProjectData {
  const templateId = theme?.templateId || 'general';
  const primary = theme?.colors?.primary || '#012d1d';
  const headingFont = theme?.typography?.headingFont || 'Plus Jakarta Sans, sans-serif';
  const currency = identity?.currency || 'FCFA';

  let heroBadge = '✨ Nouvelle Collection';
  let heroTitle = identity.name || 'Boutique Officielle';
  let heroTagline =
    identity.description ||
    'Découvrez notre catalogue exclusif d’articles disponibles en livraison immédiate à Lomé.';

  if (templateId === 'fashion') {
    heroBadge = '✨ Haute Couture & Élégance';
    heroTitle = identity.name || 'Lomé Élégance';
    heroTagline = 'Prêt-à-porter d’exception, soies fines et créations contemporaines togolaises.';
  } else if (templateId === 'tech') {
    heroBadge = '⚡ High-Tech & Performance';
    heroTitle = identity.name || 'Tech Horizon';
    heroTagline = 'Composants dernière génération, périphériques gaming et stations de travail.';
  }

  const initialHtml = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 16px;">
      <!-- Hero Section -->
      <section style="background: linear-gradient(135deg, ${primary} 0%, #0f172a 100%); color: #ffffff; padding: 60px 24px; text-align: center; border-radius: 20px; margin-bottom: 24px; font-family: ${headingFont};">
        <span style="display: inline-block; padding: 6px 14px; background: rgba(255,255,255,0.15); border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
          ${heroBadge}
        </span>
        <h1 style="font-size: 38px; font-weight: 800; line-height: 1.2; margin: 0 0 16px 0;">
          ${heroTitle}
        </h1>
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0 0 28px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
          ${heroTagline}
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="#produits" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #09090b; font-weight: 800; font-size: 13px; border-radius: 12px; text-decoration: none;">
            Explorer le catalogue
          </a>
        </div>
      </section>

      <!-- Category Filter Bar -->
      <div style="display: flex; gap: 10px; overflow-x: auto; padding: 12px 0; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
        <div style="padding: 10px 20px; background: ${primary}; color: #ffffff; border-radius: 999px; font-size: 12px; font-weight: 700;">
          Tous les produits
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700;">
          Nouveautés
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700;">
          Offres Spéciales
        </div>
      </div>

      <!-- Real Dynamic Product Grid Placeholder (hydrated live on public storefront) -->
      <section data-dsk-dynamic="product-grid" class="dsk-product-grid-section" style="padding: 24px 0; margin-bottom: 32px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; font-family: ${headingFont};">
            Articles Disponibles
          </h2>
          <p style="font-size: 13px; color: #64748b; margin: 0;">
            Sélection en direct de notre stock officiel
          </p>
        </div>
        <div style="padding: 24px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; text-align: center; color: #64748b; font-size: 13px;">
          📦 <strong>Grille Produits Dynamique DSK-Shop</strong><br />
          <em>Sur la vitrine publique, vos vrais produits, stocks et prix en ${currency} s'afficheront ici automatiquement avec le panier connecté.</em>
        </div>
      </section>

      <!-- Trust Badges -->
      <section style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; text-align: center;">
          <div>
            <div style="font-size: 28px; margin-bottom: 4px;">🚚</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Livraison Express Lomé</div>
            <div style="font-size: 12px; color: #64748b;">Sous 24h à domicile ou en point relais</div>
          </div>
          <div>
            <div style="font-size: 28px; margin-bottom: 4px;">💳</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Paiement Sécurisé</div>
            <div style="font-size: 12px; color: #64748b;">Flooz, T-Money & Paiement à la livraison</div>
          </div>
          <div>
            <div style="font-size: 28px; margin-bottom: 4px;">💬</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Support Vendeur</div>
            <div style="font-size: 12px; color: #64748b;">Contact direct via WhatsApp</div>
          </div>
        </div>
      </section>
    </div>
  `;

  return {
    version: '1.0',
    templateId,
    pages: [
      {
        id: 'home',
        name: 'Accueil',
        component: {
          type: 'wrapper',
          content: initialHtml,
        },
      },
    ],
    styles: [],
    symbols: [],
    updatedAt: new Date().toISOString(),
  };
}
