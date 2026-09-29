import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ProductImage } from '../../components/Common/ProductImage';
import { ProductDetailSkeleton } from '../../components/Skeleton/ProductDetailSkeleton';
import { formatPrice } from '../../utils/currency';
import { ProductVariant } from '../../types';
import { SEO } from '../../components/SEO/SEO';
import { CATEGORIES } from '../../constants/categories';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    showToast,
    isLoading,
  } = useShop();

  // If no product is selected, fallback to first product
  const product = selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');

  // Sync state when product changes
  React.useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setSelectedVariant(product?.variants?.[0]);
  }, [product]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-secondary">
        <h2 className="text-xl font-bold text-[#172017] font-primary">Produit introuvable</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold font-primary transition-colors cursor-pointer"
        >
          Retour au Catalogue
        </button>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Lien du produit copié dans le presse-papier !', 'info');
    } else {
      showToast('Lien prêt à être partagé', 'info');
    }
  };

  // Related products from same category or catalog
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 5);

  const priceModifier = selectedVariant?.priceModifier || 0;
  const currentPrice = product.price + priceModifier;

  const currentCategory = CATEGORIES.find((c) => c.id === product.category);
  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    {
      name: currentCategory ? currentCategory.name : product.category,
      url: `/shop?category=${product.category}`,
    },
    { name: product.name, url: `/product/${product.id}` },
  ];

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3.5 sm:px-6 lg:px-8 2xl:px-12 py-3.5 sm:py-6 md:py-8 pb-28 md:pb-20 font-secondary">
      {/* Dynamic SEO Meta Tags & JSON-LD Structured Data */}
      <SEO
        title={`${product.name} | DSK-Shop Lomé`}
        description={`${product.name} par ${product.brand}. ${product.description.slice(0, 130)}... Disponible chez DSK-Shop Lomé avec livraison rapide et garantie.`}
        image={product.images?.[0] || product.primaryImage || ''}
        type="product"
        product={product}
        category={currentCategory}
        breadcrumbs={breadcrumbItems}
        keywords={[
          product.name,
          product.brand,
          product.category,
          'Lomé',
          'Togo',
          'DSK-Shop',
          'achat en ligne',
          'matériel high tech',
        ]}
      />

      {/* Breadcrumb Navigation - Compact on mobile */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs 2xl:text-sm font-medium text-[#647064] mb-3.5 sm:mb-6 2xl:mb-8 flex-wrap font-primary">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-[#166534] transition-colors cursor-pointer"
        >
          Accueil
        </button>
        <ChevronRight size={13} className="shrink-0 text-[#849385]" />
        <button
          onClick={() => navigateTo('shop', { category: product.category })}
          className="hover:text-[#166534] transition-colors capitalize cursor-pointer"
        >
          {currentCategory ? currentCategory.name : product.category.replace('-', ' ')}
        </button>
        <ChevronRight size={13} className="shrink-0 text-[#849385]" />
        <span className="text-[#166534] font-semibold truncate max-w-[160px] sm:max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10 2xl:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-3 sm:space-y-4">
          {/* Main Hero Preview */}
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-[#F3FAF4] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DDE8DE] shadow-xs">
            <ProductImage
              src={product.images?.[activeImageIndex] || product.images?.[0] || product.primaryImage || ''}
              alt={product.name}
              containerClassName="w-full h-full"
              className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-1.5 items-start font-primary z-10">
              {product.discountPercent && (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-black bg-rose-600 text-white rounded-lg shadow-xs">
                  -{product.discountPercent}%
                </span>
              )}
              {product.isNew && (
                <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[11px] sm:text-xs font-bold bg-[#166534] text-white rounded-lg shadow-xs">
                  NOUVEAU
                </span>
              )}
            </div>

            {/* Wishlist & Share Float */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 z-10">
              <button
                onClick={handleShare}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 backdrop-blur-md text-[#647064] hover:bg-white hover:text-[#166534] shadow-xs transition-colors border border-[#DDE8DE]/80 flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px]"
                title="Partager le lien"
                aria-label="Partager le produit"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full backdrop-blur-md shadow-xs transition-colors border border-[#DDE8DE]/80 flex items-center justify-center cursor-pointer min-h-[36px] min-w-[36px] ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/95 text-[#647064] hover:bg-white hover:text-rose-600'
                }`}
                title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                aria-label="Favoris"
              >
                <Heart size={16} className={isFavorited ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1.5 scrollbar-none">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border-2 transition-all bg-[#F3FAF4] cursor-pointer p-1 ${
                    activeImageIndex === idx
                      ? 'border-[#166534] ring-2 ring-[#166534]/20 shadow-xs'
                      : 'border-[#DDE8DE] opacity-70 hover:opacity-100 hover:border-[#16A34A]'
                  }`}
                  aria-label={`Afficher image ${idx + 1}`}
                >
                  <ProductImage
                    src={imgUrl}
                    alt={`${product.name} miniature ${idx + 1}`}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying Controls & Info */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-xs">
          <div>
            <div className="flex items-center justify-between font-primary gap-2">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#166534]">
                {product.brand}
              </span>
              <span
                className={`text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full shrink-0 ${
                  product.inStock
                    ? 'bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7]'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {product.inStock ? `En Stock (${product.stockCount} dispos)` : 'Rupture de stock'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#172017] tracking-tight mt-1 sm:mt-1.5 font-primary leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Strip */}
          <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3 pt-2 border-t border-[#DDE8DE] font-primary">
            <span className="text-2xl sm:text-3xl font-black text-[#172017]">{formatPrice(currentPrice)}</span>
            {product.originalPrice && product.originalPrice > currentPrice && (
              <>
                <span className="text-sm sm:text-base text-[#849385] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#DCFCE7]">
                  Économisez {formatPrice(product.originalPrice - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-[#647064] leading-relaxed font-secondary">
              {product.description}
            </p>
          )}

          {/* Variant Selector (Colors / Styles) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#DDE8DE]">
              <div className="flex items-center justify-between text-xs font-bold text-[#172017] font-primary">
                <span>Variante sélectionnée :</span>
                <span className="text-[#166534]">{selectedVariant?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2 font-primary">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                        isSelected
                          ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                          : 'border-[#DDE8DE] bg-[#F0FDF4] text-[#172017] hover:border-[#16A34A]'
                      }`}
                    >
                      {v.type === 'color' && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/50 shrink-0"
                          style={{ backgroundColor: v.value.startsWith('#') ? v.value : '#94a3b8' }}
                        />
                      )}
                      <span>{v.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Controls & Desktop CTA Buttons */}
          <div className="space-y-3 pt-2 border-t border-[#DDE8DE]">
            <div className="flex items-center gap-3 font-primary">
              <span className="text-xs font-bold text-[#172017]">Quantité :</span>
              <div className="flex items-center border border-[#DDE8DE] rounded-xl bg-[#FAFCFA] shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#647064] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-l-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Diminuer la quantité"
                >
                  -
                </button>
                <span className="px-3 text-xs sm:text-sm font-bold text-[#172017] min-w-[28px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-2 text-[#647064] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-r-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>
            </div>

            {/* Standard actions for mobile, tablet & desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2 font-primary">
              <button
                onClick={handleAddToCart}
                className="py-3 px-4 bg-[#DCFCE7] hover:bg-white text-[#166534] border border-[#16A34A]/40 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer min-h-[44px]"
              >
                <ShoppingBag size={16} />
                <span>Ajouter au Panier</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Acheter Maintenant</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="space-y-2.5 pt-4 border-t border-[#DDE8DE] text-xs text-[#647064] font-secondary">
            <div className="flex items-center gap-2.5">
              <Truck size={16} className="text-[#166534] shrink-0" />
              <span>Livraison express à Lomé (offerte dès 60 000 FCFA)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw size={16} className="text-[#16A34A] shrink-0" />
              <span>Garantie de retour sous 30 jours sans tracas</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-[#166534] shrink-0" />
              <span>Garantie certifiée DSK-Shop Lomé</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview & Specs */}
      <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl border border-[#DDE8DE] shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#DDE8DE] px-4 sm:px-6 overflow-x-auto font-primary bg-[#F3FAF4]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 sm:py-4 px-3 sm:px-5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-[#647064] hover:text-[#172017]'
            }`}
          >
            Présentation & Caractéristiques
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 sm:py-4 px-3 sm:px-5 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-[#647064] hover:text-[#172017]'
            }`}
          >
            Fiche Technique
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl font-secondary">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#172017] mb-2 font-primary">
                  Conçu avec exigence et précision
                </h3>
                <p className="text-xs sm:text-sm text-[#647064] leading-relaxed">
                  {product.description || 'Produit de qualité supérieure disponible chez DSK-Shop à Lomé.'}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172017] mb-3 font-primary">
                    Points Forts & Fonctionnalités
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-[#172017] bg-[#F3FAF4] p-3 rounded-xl border border-[#DDE8DE]"
                      >
                        <Check size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl font-secondary">
              <h3 className="text-base sm:text-lg font-bold text-[#172017] mb-3 sm:mb-4 font-primary">
                Spécifications Techniques
              </h3>
              <div className="border border-[#DDE8DE] rounded-xl sm:rounded-2xl overflow-hidden divide-y divide-[#DDE8DE]">
                {Object.entries(product.specs || {}).map(([label, value], i) => (
                  <div
                    key={label}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-3 sm:p-3.5 text-xs sm:text-sm gap-1 sm:gap-0 ${
                      i % 2 === 0 ? 'bg-[#F3FAF4]' : 'bg-white'
                    }`}
                  >
                    <span className="font-bold text-[#647064] sm:col-span-1 font-primary">{label}</span>
                    <span className="text-[#172017] sm:col-span-2 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 sm:mt-14 font-secondary">
          <h3 className="text-lg sm:text-xl font-bold text-[#172017] mb-4 sm:mb-6 font-primary">
            Autres produits disponibles
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE STICKY BOTTOM BUY BAR (Fixed at bottom on phones) */}
      {/* ======================================================== */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DDE8DE] px-4 py-2.5 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] shadow-xl flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#849385] font-primary">Prix unitaire</span>
          <span className="text-base font-black text-[#172017] font-primary truncate">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#166534] border border-[#16A34A]/40 font-bold active:scale-95 transition-all flex items-center justify-center cursor-pointer min-h-[44px] min-w-[44px]"
            title="Ajouter au panier"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag size={18} />
          </button>

          <button
            onClick={handleBuyNow}
            className="px-4 py-2.5 bg-[#166534] active:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span>Commander</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
