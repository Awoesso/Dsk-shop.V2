import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, navigateTo, showToast } = useShop();

  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    favoritedProducts.forEach((p) => addToCart(p, 1, p.variants?.[0]));
    showToast(`Added ${favoritedProducts.length} saved items to your cart!`, 'success');
  };

  if (favoritedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-secondary">
        <div className="w-20 h-20 bg-[#F0FDF4] border border-[#DDE8DE] rounded-3xl flex items-center justify-center mx-auto text-rose-500 mb-5">
          <Heart size={36} />
        </div>
        <h2 className="text-2xl font-extrabold text-[#172017] tracking-tight font-primary">Your Wishlist is Empty</h2>
        <p className="text-sm text-[#647064] mt-2 max-w-md mx-auto font-secondary">
          Save high-performance mechanical keyboards, wireless audio gear, and titanium carry items to review later.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 px-8 py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 font-primary"
        >
          <span>Browse Products</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 font-secondary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-[#DDE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">
            Saved Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-[#647064] mt-0.5 font-secondary">
            {favoritedProducts.length} saved products ready for your setup
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl shadow-xs transition-all inline-flex items-center justify-center gap-2 font-primary"
        >
          <ShoppingBag size={14} />
          <span>Move All to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
        {favoritedProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
