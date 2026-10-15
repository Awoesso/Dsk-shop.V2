import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider, useRouter } from './router/RouterContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { CartDrawer } from './components/Cart/CartDrawer';
import { StoreResolver } from './components/routing/StoreResolver';

// Storefront & Multi-tenant Views
import { HubPage } from './pages/Hub/HubPage';
import { StoreHomeView } from './pages/Storefront/StoreHomeView';
import { StoreProductsView } from './pages/Storefront/StoreProductsView';
import { StoreProductDetailView } from './pages/Storefront/StoreProductDetailView';
import { StoreCartView } from './pages/Storefront/StoreCartView';
import { StoreCheckoutView } from './pages/Storefront/StoreCheckoutView';
import { StoreEditorPage } from './pages/StoreEditor/StoreEditorPage';
import { TemplateGalleryPage } from './pages/Templates/TemplateGalleryPage';
import { PlatformNotFoundPage } from './components/routing/PlatformNotFoundPage';

const RouteDispatcher: React.FC = () => {
  const { route } = useRouter();

  switch (route.type) {
    case 'hub':
      return <HubPage />;

    case 'templates':
      return <TemplateGalleryPage />;

    case 'store-home':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreHomeView />
        </StoreResolver>
      );

    case 'store-products':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreProductsView />
        </StoreResolver>
      );

    case 'store-product-detail':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreProductDetailView productSlug={route.productSlug!} />
        </StoreResolver>
      );

    case 'store-cart':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreCartView />
        </StoreResolver>
      );

    case 'store-checkout':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreCheckoutView />
        </StoreResolver>
      );

    case 'store-editor':
      return (
        <StoreResolver slug={route.slug!}>
          <StoreEditorPage slug={route.slug!} />
        </StoreResolver>
      );

    case 'not-found':
    default:
      return <PlatformNotFoundPage path={route.path} />;
  }
};

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <RouterProvider>
        <ShopProvider>
          <div className="min-h-screen flex flex-col bg-surface-container-lowest text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
            <RouteDispatcher />
            {/* Global Slide-over Cart Drawer accessible when needed */}
            <CartDrawer />
          </div>
        </ShopProvider>
      </RouterProvider>
    </HelmetProvider>
  );
};

export default App;
