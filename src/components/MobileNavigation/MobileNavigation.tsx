import React from 'react';
import { Home, Compass, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const MobileNavigation: React.FC = () => {
  const { activePage, navigateTo, cartItemCount, setIsCartOpen, wishlist } = useShop();

  // On product detail page, checkout, and order success, hide standard bottom nav
  // (ProductDetailPage provides its own dedicated action buy bar; checkout is a distraction-free flow)
  if (activePage === 'product' || activePage === 'checkout' || activePage === 'order-success') {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFCFA]/95 backdrop-blur-md border-t border-[#DDE8DE] px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] shadow-lg font-primary">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[56px] transition-colors cursor-pointer ${
            activePage === 'home' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
          aria-label="Accueil"
        >
          <Home size={19} className={activePage === 'home' ? 'stroke-[2.5] text-[#166534]' : ''} />
          <span className="text-[10px] mt-1 font-medium">Accueil</span>
        </button>

        {/* Shop / Browse */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[56px] transition-colors cursor-pointer ${
            activePage === 'shop' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
          aria-label="Boutique"
        >
          <Compass size={19} className={activePage === 'shop' ? 'stroke-[2.5] text-[#166534]' : ''} />
          <span className="text-[10px] mt-1 font-medium">Boutique</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigateTo('wishlist')}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[56px] transition-colors cursor-pointer ${
            activePage === 'wishlist' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
          aria-label="Favoris"
        >
          <div className="relative">
            <Heart size={19} className={activePage === 'wishlist' ? 'stroke-[2.5] text-[#166534] fill-[#DCFCE7]' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-rose-500 rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Favoris</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-h-[46px] min-w-[56px] transition-colors cursor-pointer ${
            activePage === 'cart' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#166534]'
          }`}
          aria-label="Mon Panier"
        >
          <div className="relative">
            <ShoppingBag size={19} className={activePage === 'cart' ? 'stroke-[2.5] text-[#166534]' : ''} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center text-[9px] font-bold text-white bg-[#16A34A] rounded-full">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Panier</span>
        </button>
      </nav>
    </div>
  );
};
