import { useState, useEffect, useCallback, useMemo } from 'react';
import { Storefront, StoreTheme, TemplateId, DeepPartial } from '../types/storefront';
import { StorefrontService } from '../services/storefrontService';
import { templateRegistry } from '../templates/storefront/registry/templateRegistry';

export function useStorefront(slugOrStoreId: string = 'dsk-official') {
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [themeOverride, setThemeOverride] = useState<DeepPartial<StoreTheme> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchStorefront = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchErr } = await StorefrontService.getStorefrontBySlug(slugOrStoreId);
    if (fetchErr) {
      setError(fetchErr);
    } else {
      setStorefront(data);
      setThemeOverride(null);
    }
    setIsLoading(false);
  }, [slugOrStoreId]);

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  const hasUnsavedChanges = useMemo(() => {
    return themeOverride !== null;
  }, [themeOverride]);

  const updateTheme = useCallback((updates: DeepPartial<StoreTheme>) => {
    setThemeOverride((prev) => {
      const current = prev || {};
      return {
        ...current,
        ...updates,
        colors: {
          ...(current.colors || {}),
          ...(updates.colors || {}),
        },
        typography: {
          ...(current.typography || {}),
          ...(updates.typography || {}),
        },
        shape: {
          ...(current.shape || {}),
          ...(updates.shape || {}),
        },
        layout: {
          ...(current.layout || {}),
          ...(updates.layout || {}),
        },
        sections: {
          ...(current.sections || {}),
          ...(updates.sections || {}),
        },
      };
    });
  }, []);

  const selectTemplate = useCallback(
    (templateId: TemplateId) => {
      const defaultTheme = templateRegistry.getDefaultThemeForTemplate(templateId);
      updateTheme({
        templateId,
        colors: defaultTheme.colors,
        typography: defaultTheme.typography,
        shape: defaultTheme.shape,
        layout: defaultTheme.layout,
        sections: defaultTheme.sections,
      });
    },
    [updateTheme]
  );

  const resetTheme = useCallback(() => {
    setThemeOverride(null);
  }, []);

  const saveConfig = useCallback(async (): Promise<{ success: boolean; error: string | null }> => {
    if (!storefront) {
      return { success: false, error: 'Boutique introuvable.' };
    }

    const effectiveTheme: StoreTheme = {
      ...storefront.theme,
      ...(themeOverride || {}),
      colors: {
        ...storefront.theme.colors,
        ...(themeOverride?.colors || {}),
      },
      typography: {
        ...storefront.theme.typography,
        ...(themeOverride?.typography || {}),
      },
      shape: {
        ...storefront.theme.shape,
        ...(themeOverride?.shape || {}),
      },
      layout: {
        ...storefront.theme.layout,
        ...(themeOverride?.layout || {}),
      },
      sections: {
        ...storefront.theme.sections,
        ...(themeOverride?.sections || {}),
      },
    };

    setIsSaving(true);
    const result = await StorefrontService.saveStorefrontConfig(
      storefront.identity.id,
      effectiveTheme.templateId,
      effectiveTheme
    );

    if (result.success) {
      setStorefront((prev) => (prev ? { ...prev, theme: effectiveTheme } : null));
      setThemeOverride(null);
    }
    setIsSaving(false);
    return result;
  }, [storefront, themeOverride]);

  return {
    storefront,
    isLoading,
    error,
    themeOverride,
    hasUnsavedChanges,
    isSaving,
    updateTheme,
    selectTemplate,
    resetTheme,
    saveConfig,
    refetch: fetchStorefront,
  };
}
