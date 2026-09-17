import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header/Header';
import { CartDrawer } from './components/Cart/CartDrawer';
import { ToastContainer } from './components/Toast/Toast';
import { MobileNavigation } from './components/MobileNavigation/MobileNavigation';
import { Footer } from './components/Footer/Footer';

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
  const { activePage, selectedProduct } = useShop();

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
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 flex flex-col w-full"
          >
            {activePage === 'home' && <HomePage />}
            {activePage === 'shop' && <ShopPage />}
            {activePage === 'product' && <ProductDetailPage />}
            {activePage === 'cart' && <CartPage />}
            {activePage === 'wishlist' && <WishlistPage />}
            {activePage === 'checkout' && <CheckoutPage />}
            {activePage === 'order-success' && <OrderSuccessPage />}
            {activePage === 'about' && <AboutPage />}
            {activePage === 'contact' && <ContactPage />}
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
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
