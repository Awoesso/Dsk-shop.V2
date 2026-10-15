import React, { useMemo } from 'react';
import { StoreTheme } from '../../../types/storefront';

interface StoreThemeScopeProps {
  theme: StoreTheme;
  children: React.ReactNode;
  className?: string;
}

const BUTTON_RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};

const CARD_RADIUS_MAP: Record<string, string> = {
  none: '0px',
  sm: '6px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
};

const CONTENT_WIDTH_MAP: Record<string, string> = {
  compact: '1024px',
  standard: '1280px',
  wide: '1680px',
};

const FONT_FAMILY_MAP: Record<string, string> = {
  Montserrat: "'Montserrat', sans-serif",
  Inter: "'Inter', sans-serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Plus Jakarta Sans': "'Plus Jakarta Sans', sans-serif",
  Syne: "'Syne', sans-serif",
  'Space Grotesk': "'Space Grotesk', monospace, sans-serif",
  Roboto: "'Roboto', sans-serif",
};

/**
 * Sanitizes hex/rgb/hsl color strings to prevent CSS injection.
 */
function sanitizeColor(val: string, fallback: string): string {
  if (!val || typeof val !== 'string') return fallback;
  const trimmed = val.trim();
  // Validates hex colors (#fff, #123456, #12345678) or standard rgb/hsl
  if (/^#([0-9a-fA-F]{3,8})$/.test(trimmed)) return trimmed;
  if (/^(rgb|rgba|hsl|hsla)\([0-9.,%\s]+\)$/.test(trimmed)) return trimmed;
  return fallback;
}

export const StoreThemeScope: React.FC<StoreThemeScopeProps> = ({
  theme,
  children,
  className = '',
}) => {
  const cssVariables = useMemo(() => {
    const colors = theme.colors || ({} as any);
    const typography = theme.typography || ({} as any);
    const shape = theme.shape || ({} as any);
    const layout = theme.layout || ({} as any);

    const primary = sanitizeColor(colors.primary, '#012d1d');
    const secondary = sanitizeColor(colors.secondary, '#1b4332');
    const accent = sanitizeColor(colors.accent, '#c1ecd4');
    const background = sanitizeColor(colors.background, '#f4fafd');
    const surface = sanitizeColor(colors.surface, '#ffffff');
    const text = sanitizeColor(colors.text, '#161d1f');
    const muted = sanitizeColor(colors.muted, '#717973');
    const border = sanitizeColor(colors.border, '#dde4e6');

    const headingFont = FONT_FAMILY_MAP[typography.headingFont] || "'Montserrat', sans-serif";
    const bodyFont = FONT_FAMILY_MAP[typography.bodyFont] || "'Inter', sans-serif";

    const btnRadius = BUTTON_RADIUS_MAP[shape.buttonRadius] || '8px';
    const cardRadius = CARD_RADIUS_MAP[shape.cardRadius] || '16px';
    const contentMaxW = CONTENT_WIDTH_MAP[layout.contentWidth] || '1280px';

    return {
      '--store-primary': primary,
      '--store-secondary': secondary,
      '--store-accent': accent,
      '--store-bg': background,
      '--store-surface': surface,
      '--store-text': text,
      '--store-muted': muted,
      '--store-border': border,
      '--store-heading-font': headingFont,
      '--store-body-font': bodyFont,
      '--store-btn-radius': btnRadius,
      '--store-card-radius': cardRadius,
      '--store-content-max-w': contentMaxW,
    } as React.CSSProperties;
  }, [theme]);

  return (
    <div
      className={`store-theme-scope min-h-screen transition-colors duration-200 ${className}`}
      style={{
        ...cssVariables,
        backgroundColor: 'var(--store-bg)',
        color: 'var(--store-text)',
        fontFamily: 'var(--store-body-font)',
      }}
    >
      {/* Dynamic font stylesheet injection if Google Fonts needed */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
};
