import React from 'react';
import { Home, Compass, Heart, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const MobileNavigation: React.FC = () => {
  const { activePage, navigateTo, cartItemCount, wishlist, setIsCartOpen } = useShop();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFCFA]/95 backdrop-blur-md border-t border-[#DDE8DE] px-2 py-1 shadow-lg font-primary">
      <nav className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[64px] min-h-[44px] transition-colors ${
            activePage === 'home' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
        >
          <Home size={20} className={activePage === 'home' ? 'stroke-[2.5] text-[#166534]' : ''} />
          <span className="text-[10px] mt-1 font-medium">Home</span>
        </button>

        {/* Shop / Browse */}
        <button
          onClick={() => navigateTo('shop')}
          className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[64px] min-h-[44px] transition-colors ${
            activePage === 'shop' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
        >
          <Compass size={20} className={activePage === 'shop' ? 'stroke-[2.5] text-[#166534]' : ''} />
          <span className="text-[10px] mt-1 font-medium">Catalog</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigateTo('wishlist')}
          className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[64px] min-h-[44px] transition-colors ${
            activePage === 'wishlist' ? 'text-[#166534] font-bold' : 'text-[#647064] hover:text-[#172017]'
          }`}
        >
          <div className="relative">
            <Heart size={20} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-rose-500 rounded-full">
                {wishlist.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-[64px] min-h-[44px] text-[#647064] hover:text-[#166534] transition-colors"
        >
          <div className="relative">
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-[#16A34A] rounded-full">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-medium">Cart</span>
        </button>
      </nav>
    </div>
  );
};
