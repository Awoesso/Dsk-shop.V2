import type { Editor } from 'grapesjs';

export interface RegisterBlocksOptions {
  primaryColor?: string;
  headingFont?: string;
  currency?: string;
}

/**
 * Registers production-grade, pre-styled e-commerce blocks inside the GrapesJS editor.
 * All blocks are sanitized: zero vendor executable scripts.
 */
export function registerEcommerceBlocks(editor: Editor, options: RegisterBlocksOptions = {}) {
  const primary = options.primaryColor || '#012d1d';
  const headingFont = options.headingFont || 'Plus Jakarta Sans, sans-serif';
  const currency = options.currency || 'FCFA';

  const blockManager = editor.BlockManager;

  // 1. Hero Banner Block
  blockManager.add('dsk-hero', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">🎯</div>
        Bannière Hero
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <section style="background: linear-gradient(135deg, ${primary} 0%, #0f172a 100%); color: #ffffff; padding: 60px 24px; text-align: center; border-radius: 20px; margin: 20px 0; font-family: ${headingFont};">
        <div style="max-width: 800px; margin: 0 auto;">
          <span style="display: inline-block; padding: 6px 14px; background: rgba(255,255,255,0.15); border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
            ✨ Nouvelle Collection Disponible
          </span>
          <h1 style="font-size: 38px; font-weight: 800; line-height: 1.2; margin: 0 0 16px 0;">
            Sublimez votre style avec nos créations exclusives
          </h1>
          <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0 0 28px 0; max-width: 600px; margin-left: auto; margin-right: auto;">
            Commandez en ligne et bénéficiez de la livraison rapide à domicile partout à Lomé avec paiement sécurisé.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <a href="#produits" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #09090b; font-weight: 800; font-size: 13px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
              Explorer les articles
            </a>
            <a href="#contact" style="display: inline-block; padding: 12px 24px; background: rgba(255,255,255,0.1); color: #ffffff; font-weight: 700; font-size: 13px; border-radius: 12px; text-decoration: none; border: 1px solid rgba(255,255,255,0.2);">
              Nous Contacter
            </a>
          </div>
        </div>
      </section>
    `,
  });

  // 2. Product Grid Block
  blockManager.add('dsk-product-grid', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">🛍️</div>
        Grille Produits (4 cols)
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <section style="padding: 40px 16px; margin: 20px 0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="font-size: 26px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; font-family: ${headingFont};">
            Nos Meilleures Ventes
          </h2>
          <p style="font-size: 13px; color: #64748b; margin: 0;">
            Sélection exclusive disponible en stock immédiat
          </p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto;">
          <!-- Product Card 1 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 14px; display: flex; flex-direction: column;">
            <div style="background: #f1f5f9; height: 180px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 12px;">
              👗
            </div>
            <div style="font-size: 10px; font-weight: 700; color: ${primary}; text-transform: uppercase; margin-bottom: 4px;">Mode Féminine</div>
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Robe Soie & Wax</h3>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-top: auto; padding-top: 8px;">
              <span style="font-size: 17px; font-weight: 800; color: ${primary};">45 000 ${currency}</span>
              <span style="font-size: 11px; color: #94a3b8; text-decoration: line-through;">55 000 ${currency}</span>
            </div>
            <button style="margin-top: 10px; width: 100%; padding: 10px; background: ${primary}; color: #ffffff; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer;">
              Ajouter au panier
            </button>
          </div>

          <!-- Product Card 2 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 14px; display: flex; flex-direction: column;">
            <div style="background: #f1f5f9; height: 180px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 12px;">
              👜
            </div>
            <div style="font-size: 10px; font-weight: 700; color: ${primary}; text-transform: uppercase; margin-bottom: 4px;">Maroquinerie</div>
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Sac Cuir Artisan Lomé</h3>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-top: auto; padding-top: 8px;">
              <span style="font-size: 17px; font-weight: 800; color: ${primary};">28 500 ${currency}</span>
            </div>
            <button style="margin-top: 10px; width: 100%; padding: 10px; background: ${primary}; color: #ffffff; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer;">
              Ajouter au panier
            </button>
          </div>

          <!-- Product Card 3 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 14px; display: flex; flex-direction: column;">
            <div style="background: #f1f5f9; height: 180px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 12px;">
              🎧
            </div>
            <div style="font-size: 10px; font-weight: 700; color: ${primary}; text-transform: uppercase; margin-bottom: 4px;">High-Tech</div>
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Casque Audio Sans Fil Pro</h3>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-top: auto; padding-top: 8px;">
              <span style="font-size: 17px; font-weight: 800; color: ${primary};">65 000 ${currency}</span>
            </div>
            <button style="margin-top: 10px; width: 100%; padding: 10px; background: ${primary}; color: #ffffff; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer;">
              Ajouter au panier
            </button>
          </div>

          <!-- Product Card 4 -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; padding: 14px; display: flex; flex-direction: column;">
            <div style="background: #f1f5f9; height: 180px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 40px; margin-bottom: 12px;">
              ⌚
            </div>
            <div style="font-size: 10px; font-weight: 700; color: ${primary}; text-transform: uppercase; margin-bottom: 4px;">Accessoires</div>
            <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">Montre Connectée Sport</h3>
            <div style="display: flex; align-items: baseline; gap: 8px; margin-top: auto; padding-top: 8px;">
              <span style="font-size: 17px; font-weight: 800; color: ${primary};">32 000 ${currency}</span>
              <span style="font-size: 11px; color: #94a3b8; text-decoration: line-through;">40 000 ${currency}</span>
            </div>
            <button style="margin-top: 10px; width: 100%; padding: 10px; background: ${primary}; color: #ffffff; border: none; border-radius: 10px; font-weight: 700; font-size: 12px; cursor: pointer;">
              Ajouter au panier
            </button>
          </div>
        </div>
      </section>
    `,
  });

  // 3. Category Bar Block
  blockManager.add('dsk-category-bar', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">🏷️</div>
        Rayons & Catégories
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <div style="display: flex; gap: 10px; overflow-x: auto; padding: 16px 8px; justify-content: center; flex-wrap: wrap; margin: 16px 0;">
        <div style="padding: 10px 20px; background: ${primary}; color: #ffffff; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;">
          ✨ Tous les produits
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;">
          👗 Vêtements
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;">
          👜 Accessoires
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;">
          📱 High-Tech
        </div>
        <div style="padding: 10px 20px; background: #f8fafc; color: #334155; border: 1px solid #e2e8f0; border-radius: 999px; font-size: 12px; font-weight: 700; cursor: pointer;">
          🎁 Idées Cadeaux
        </div>
      </div>
    `,
  });

  // 4. Trust Badges Block
  blockManager.add('dsk-trust-badges', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">🛡️</div>
        Garanties Client
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <section style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; text-align: center;">
          <div>
            <div style="font-size: 28px; margin-bottom: 6px;">🚚</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Livraison Express Lomé</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">À domicile ou en point relais sous 24h</div>
          </div>
          <div>
            <div style="font-size: 28px; margin-bottom: 6px;">💳</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Paiement Mobile Money</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">T-Money & Flooz à la livraison</div>
          </div>
          <div>
            <div style="font-size: 28px; margin-bottom: 6px;">💬</div>
            <div style="font-weight: 700; font-size: 14px; color: #0f172a;">Assistance WhatsApp</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">Réponse en moins de 15 minutes</div>
          </div>
        </div>
      </section>
    `,
  });

  // 5. Promotional Alert Banner
  blockManager.add('dsk-promo', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">⚡</div>
        Bannière Promo
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <div style="background: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 14px 20px; border-radius: 12px; text-align: center; font-size: 13px; font-weight: 700; margin: 16px 0;">
        ⚡ Vente Flash exclusive : <strong>-20% de réduction</strong> avec le code <span style="background: #ffffff; padding: 3px 8px; border-radius: 6px; font-family: monospace; border: 1px dashed #d97706;">NEXA20</span>
      </div>
    `,
  });

  // 6. Simple Footer
  blockManager.add('dsk-footer', {
    label: `
      <div style="text-align: center; font-size: 11px; font-weight: 700;">
        <div style="font-size: 20px; margin-bottom: 4px;">📄</div>
        Pied de Page
      </div>
    `,
    category: 'E-Commerce DSK',
    content: `
      <footer style="background: #0f172a; color: #94a3b8; padding: 40px 20px; text-align: center; border-radius: 16px; margin-top: 40px; font-size: 12px;">
        <div style="font-weight: 800; font-size: 16px; color: #ffffff; margin-bottom: 8px;">Boutique Officielle Nexa</div>
        <p style="margin: 0 0 16px 0; max-width: 500px; margin-left: auto; margin-right: auto;">
          Propulsé par le moteur e-commerce sécurisé DSK-Shop. Tous droits réservés.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <a href="#" style="color: #cbd5e1; text-decoration: none;">Mentions Légales</a>
          <span>•</span>
          <a href="#" style="color: #cbd5e1; text-decoration: none;">Politique de Confidentialité</a>
          <span>•</span>
          <a href="#" style="color: #cbd5e1; text-decoration: none;">Conditions de Vente</a>
        </div>
      </footer>
    `,
  });
}
