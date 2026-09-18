import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { SEO } from '../../components/SEO/SEO';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, addToCart, toggleWishlist, navigateTo, showToast } = useShop();

  const favoritedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    favoritedProducts.forEach((p) => addToCart(p, 1, p.variants?.[0]));
    showToast(`${favoritedProducts.length} article(s) ajouté(s) à votre panier !`, 'success');
  };

  if (favoritedProducts.length === 0) {
    return (
      <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-4 py-20 2xl:py-32 text-center font-secondary">
        <SEO
          title="Ma Liste d'Envies | DSK-Shop Lomé"
          description="Votre liste d'envies DSK-Shop est vide. Enregistrez vos articles coups de cœur pour les retrouver plus tard."
          noindex={true}
        />
        <div className="w-20 h-20 2xl:w-24 2xl:h-24 bg-[#F0FDF4] border border-[#DDE8DE] rounded-3xl flex items-center justify-center mx-auto text-rose-500 mb-5 2xl:mb-8">
          <Heart size={36} className="2xl:w-12 2xl:h-12" />
        </div>
        <h2 className="text-2xl 2xl:text-3xl font-extrabold text-[#172017] tracking-tight font-primary">Votre liste d'envies est vide</h2>
        <p className="text-sm 2xl:text-base text-[#647064] mt-2 max-w-md 2xl:max-w-xl mx-auto font-secondary">
          Enregistrez vos écouteurs, claviers mécaniques, chargeurs solaires et accessoires préférés pour les retrouver à tout moment.
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-6 2xl:mt-8 px-8 py-3.5 2xl:px-10 2xl:py-4 bg-[#166534] hover:bg-[#16A34A] text-white text-xs 2xl:text-sm font-bold rounded-xl shadow-xs transition-all inline-flex items-center gap-2 font-primary cursor-pointer"
        >
          <span>Découvrir les produits</span>
          <ArrowRight size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-4 sm:py-8 2xl:py-12 pb-20 font-secondary">
      <SEO
        title={`Ma Liste d'Envies (${favoritedProducts.length} articles) | DSK-Shop Lomé`}
        description="Retrouvez tous vos articles et produits favoris enregistrés sur DSK-Shop Lomé."
        noindex={true}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-8 2xl:mb-10 pb-3 sm:pb-4 2xl:pb-6 border-b border-[#DDE8DE]">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-extrabold text-[#172017] tracking-tight font-primary">
            Mes Articles Favoris
          </h1>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-0.5 font-secondary">
            {favoritedProducts.length} produit{favoritedProducts.length > 1 ? 's' : ''} enregistré{favoritedProducts.length > 1 ? 's' : ''} dans votre sélection
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 2xl:px-7 2xl:py-3.5 bg-[#166534] hover:bg-[#16A34A] text-white text-xs 2xl:text-sm font-bold rounded-xl shadow-xs transition-all inline-flex items-center justify-center gap-2 font-primary cursor-pointer"
        >
          <ShoppingBag size={14} className="2xl:w-4 2xl:h-4" />
          <span>Tout ajouter au panier</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 2xl:gap-6">
        {favoritedProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
};
