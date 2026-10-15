import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RouteMatch, parseRoute, normalizePathname } from './routes';

export interface RouterContextValue {
  currentPath: string;
  route: RouteMatch;
  navigate: (to: string, options?: { replace?: boolean }) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

function getInitialPath(): string {
  if (typeof window !== 'undefined' && window.location) {
    return normalizePathname(window.location.pathname);
  }
  return '/';
}

export interface RouterProviderProps {
  initialPath?: string;
  children: React.ReactNode;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({
  initialPath,
  children,
}) => {
  const [currentPath, setCurrentPath] = useState<string>(() => initialPath || getInitialPath());

  const route = React.useMemo(() => parseRoute(currentPath), [currentPath]);

  // Synchronize on browser Previous / Next (popstate)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const newPath = normalizePathname(window.location.pathname);
      setCurrentPath(newPath);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const targetPath = normalizePathname(to);

    if (typeof window !== 'undefined' && window.history) {
      if (options?.replace) {
        window.history.replaceState({}, '', targetPath);
      } else {
        window.history.pushState({}, '', targetPath);
      }
    }

    setCurrentPath(targetPath);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history) {
      window.history.back();
    }
  }, []);

  const value: RouterContextValue = {
    currentPath,
    route,
    navigate,
    goBack,
  };

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
};

export function useRouter(): RouterContextValue {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a <RouterProvider>');
  }
  return ctx;
}

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({
  to,
  replace = false,
  children,
  onClick,
  ...rest
}) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Ignore if default prevented or modified click (Ctrl, Cmd, Shift, middle-click)
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      e.shiftKey
    ) {
      return;
    }

    e.preventDefault();
    navigate(to, { replace });
  };

  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
