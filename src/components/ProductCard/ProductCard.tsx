import React from 'react';
import { Heart, Plus, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

type ProductAvailability = Product & {
  available?: boolean;
  inStock?: boolean;
  stock?: number;
};

const formatPrice = (price: number) =>
  `${new Intl.NumberFormat('fr-FR').format(price)} FCFA`;

const fallbackImage =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" fill="#f4f3ef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8a918d" font-family="sans-serif" font-size="24">Image indisponible</text></svg>',
  );

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigateTo } = useShop();
  const [imageSrc, setImageSrc] = React.useState(
    product.primaryImage || product.images?.[0] || fallbackImage,
  );

  React.useEffect(() => {
    setImageSrc(product.primaryImage || product.images?.[0] || fallbackImage);
  }, [product.primaryImage, product.images]);

  const inventory = product as ProductAvailability;
  const isAvailable =
    inventory.available ??
    inventory.inStock ??
    (typeof inventory.stock === 'number' ? inventory.stock > 0 : true);

  const isFavorited = isInWishlist(product.id);
  const discount =
    product.discountPercent ??
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0);

  const openProduct = () => navigateTo('product', { product });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100/80 bg-white shadow-xs transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-square w-full overflow-hidden bg-[#f4f3ef]">
        <button
          type="button"
          onClick={openProduct}
          className="h-full w-full cursor-pointer"
          aria-label={`Voir le produit ${product.name}`}
        >
          <img
            src={imageSrc}
            alt={product.name}
            onError={() => setImageSrc(fallbackImage)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </button>

        {discount > 0 && isAvailable && (
          <span className="absolute left-3 top-3 rounded-md bg-[#fde8e8] px-2 py-1 text-[11px] font-bold text-[#b83d3d]">
            -{discount}%
          </span>
        )}

        {!isAvailable && (
          <span className="absolute bottom-3 left-3 rounded-md bg-gray-900/80 px-2.5 py-1 text-[11px] font-semibold text-white">
            Indisponible
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            isFavorited
              ? `Retirer ${product.name} des favoris`
              : `Ajouter ${product.name} aux favoris`
          }
          aria-pressed={isFavorited}
          className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-xs transition-colors hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#133e35]"
        >
          <Heart
            size={17}
            className={isFavorited ? 'fill-red-500 text-red-500' : ''}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
        

          <button
            type="button"
            onClick={openProduct}
            className="mt-1 line-clamp-2 cursor-pointer text-left text-sm font-extrabold leading-snug text-gray-900 hover:text-[#133e35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#133e35] sm:text-base"
          >
            {product.name}
          </button>

          {product.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col">
            <span className="text-base font-extrabold text-gray-900   text-xs  sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={!isAvailable}
            aria-label={`Ajouter ${product.name} au panier`}
            className="flex h-6 w-6 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#133e35] text-white shadow-xs transition-all hover:bg-[#1d574b] active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Plus size={16}  className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
};