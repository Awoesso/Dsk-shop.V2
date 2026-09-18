import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'motion/react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header/Header';
import { CartDrawer } from './components/Cart/CartDrawer';
import { ToastContainer } from './components/Toast/Toast';
import { MobileNavigation } from './components/MobileNavigation/MobileNavigation';
import { Footer } from './components/Footer/Footer';
import { InitialLoader } from './components/Common/InitialLoader';

// Page-specific Skeleton Loaders for route changes
import {
  HomeSkeleton,
  ShopSkeleton,
  ProductDetailSkeleton,
  CartSkeleton,
  WishlistSkeleton,
  CheckoutSkeleton,
  OrderSuccessSkeleton,
  AboutSkeleton,
  ContactSkeleton,
} from './components/Skeleton';

// Pages
import { HomePage } from './pages/Home/HomePage';
import { ShopPage } from './pages/Shop/ShopPage';
import { ProductDetailPage } from './pages/Product/ProductDetailPage';
import { CartPage } from './pages/Cart/CartPage';
import { WishlistPage } from './pages/Wishlist/WishlistPage';
import { CheckoutPage } from './pages/Checkout/CheckoutPage';
import { OrderSuccessPage } from './pages/Checkout/OrderSuccessPage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';

const AppContent: React.FC = () => {
  const { activePage, selectedProduct, isInitialLoading, isPageLoading } = useShop();

  // 1. PREMIÈRE OUVERTURE DU SITE: Full-screen centered SpinnerDotted loader
  if (isInitialLoading) {
    return <InitialLoader />;
  }

  // 2. NAVIGATION ENTRE LES AUTRES PAGES: Page-specific Skeleton Loader
  const renderCurrentPage = () => {
    if (isPageLoading) {
      switch (activePage) {
        case 'home':
          return <HomeSkeleton />;
        case 'shop':
          return <ShopSkeleton />;
        case 'product':
          return <ProductDetailSkeleton />;
        case 'cart':
          return <CartSkeleton />;
        case 'wishlist':
          return <WishlistSkeleton />;
        case 'checkout':
          return <CheckoutSkeleton />;
        case 'order-success':
          return <OrderSuccessSkeleton />;
        case 'about':
          return <AboutSkeleton />;
        case 'contact':
          return <ContactSkeleton />;
        default:
          return <HomeSkeleton />;
      }
    }

    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductDetailPage />;
      case 'cart':
        return <CartPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-success':
        return <OrderSuccessPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3FAF4] text-[#172017] font-sans selection:bg-[#166534] selection:text-white">
      {/* Sticky Header with Navigation & Quick Actions */}
      <Header />

      {/* Main Page Content Dynamic View */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activePage === 'product' ? `product-${selectedProduct?.id}` : activePage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full"
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Mobile Bottom Fixed Bar */}
      <MobileNavigation />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </HelmetProvider>
  );
}
