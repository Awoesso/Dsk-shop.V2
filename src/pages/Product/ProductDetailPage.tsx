import React, { useState } from 'react';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ArrowLeft,
  ChevronRight,
  Share2,
  Send,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { ProductImage } from '../../components/Common/ProductImage';
import { ProductDetailSkeleton } from '../../components/Skeleton/ProductDetailSkeleton';
import { formatPrice } from '../../utils/currency';
import { ProductVariant } from '../../types';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigateTo,
    addReview,
    showToast,
    isLoading,
  } = useShop();

  // If no product is selected, fallback to home or first product
  const product = selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants?.[0]
  );
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Review form state
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Sync variant when product changes
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button
          onClick={() => navigateTo('shop')}
          className="mt-4 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
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
      showToast('Product link copied to clipboard!', 'info');
    } else {
      showToast('Link ready to share', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('Please fill out your name and comments', 'warning');
      return;
    }
    addReview(product.id, {
      author: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
    });
    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const priceModifier = selectedVariant?.priceModifier || 0;
  const currentPrice = product.price + priceModifier;

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-20 font-secondary">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-[#647064] mb-6 flex-wrap font-primary">
        <button
          onClick={() => navigateTo('home')}
          className="hover:text-[#166534] transition-colors"
        >
          Home
        </button>
        <ChevronRight size={13} />
        <button
          onClick={() => navigateTo('shop', { category: product.category })}
          className="hover:text-[#166534] transition-colors capitalize"
        >
          {product.category.replace('-', ' ')}
        </button>
        <ChevronRight size={13} />
        <span className="text-[#166534] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Preview */}
          <div className="relative aspect-square sm:aspect-4/3 w-full bg-[#F0FDF4] rounded-3xl overflow-hidden border border-[#DDE8DE] shadow-2xs">
            <ProductImage
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              containerClassName="w-full h-full"
              className="transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start font-primary">
              {product.discountPercent && (
                <span className="px-3 py-1 text-xs font-black bg-rose-600 text-white rounded-lg shadow-xs">
                  SAVE {product.discountPercent}%
                </span>
              )}
              {product.isNew && (
                <span className="px-3 py-1 text-xs font-bold bg-[#166534] text-white rounded-lg shadow-xs">
                  NEW RELEASE
                </span>
              )}
            </div>

            {/* Wishlist & Share Float */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 backdrop-blur-md text-[#647064] hover:bg-white hover:text-[#166534] shadow-xs transition-colors border border-[#DDE8DE]/60"
                title="Share link"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2.5 rounded-full backdrop-blur-md shadow-xs transition-colors border border-[#DDE8DE]/60 ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/90 text-[#647064] hover:bg-white hover:text-rose-600'
                }`}
                title="Add to Wishlist"
              >
                <Heart size={16} className={isFavorited ? 'fill-rose-500 text-rose-500' : ''} />
              </button>
            </div>
          </div>

          {/* Thumbnails Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all bg-[#F0FDF4] ${
                    activeImageIndex === idx
                      ? 'border-[#166534] ring-2 ring-[#166534]/20 shadow-xs'
                      : 'border-[#DDE8DE] opacity-70 hover:opacity-100 hover:border-[#16A34A]'
                  }`}
                >
                  <ProductImage
                    src={imgUrl}
                    alt={`Preview ${idx + 1}`}
                    containerClassName="w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Buying Controls & Info */}
        <div className="lg:col-span-5 space-y-6 bg-[#FAFCFA] p-6 sm:p-8 rounded-3xl border border-[#DDE8DE] shadow-2xs">
          <div>
            <div className="flex items-center justify-between font-primary">
              <span className="text-xs font-bold uppercase tracking-wider text-[#647064]">
                {product.brand}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  product.inStock
                    ? 'bg-[#DCFCE7] text-[#166534] border border-[#DCFCE7]'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {product.inStock ? `In Stock (${product.stockCount} units)` : 'Out of Stock'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172017] tracking-tight mt-1.5 font-primary">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2.5 mt-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#172017] font-primary">{product.rating}</span>
              <span className="text-xs text-[#647064]">•</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-[#647064] hover:text-[#166534] underline font-medium font-secondary"
              >
                {product.reviewCount} reviews
              </button>
            </div>
          </div>

          {/* Price Strip */}
          <div className="flex items-baseline gap-3 pt-2 border-t border-[#DDE8DE] font-primary">
            <span className="text-3xl font-black text-[#172017]">{formatPrice(currentPrice)}</span>
            {product.originalPrice && (
              <>
                <span className="text-base text-[#647064] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] px-2 py-0.5 rounded-md border border-[#DCFCE7]">
                  Économisez {formatPrice(product.originalPrice - currentPrice)}
                </span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[#647064] leading-relaxed font-secondary">
            {product.description}
          </p>

          {/* Variant Selector (Colors / Styles) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#DDE8DE]">
              <div className="flex items-center justify-between text-xs font-bold text-[#172017] font-primary">
                <span>Select Style / Finish:</span>
                <span className="text-[#166534]">{selectedVariant?.name}</span>
              </div>
              <div className="flex flex-wrap gap-2 font-primary">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-[#166534] bg-[#166534] text-white shadow-2xs'
                          : 'border-[#DDE8DE] bg-[#F0FDF4] text-[#172017] hover:border-[#16A34A]'
                      }`}
                    >
                      {v.type === 'color' && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/50"
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

          {/* Quantity Controls & CTA Buttons */}
          <div className="space-y-3 pt-2 border-t border-[#DDE8DE]">
            <div className="flex items-center gap-4 font-primary">
              <span className="text-xs font-bold text-[#172017]">Quantity:</span>
              <div className="flex items-center border border-[#DDE8DE] rounded-xl bg-[#FAFCFA] shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-[#647064] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-l-xl text-xs font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#172017]">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-2 text-[#647064] hover:bg-[#F0FDF4] hover:text-[#166534] rounded-r-xl text-xs font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 font-primary">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-[#DCFCE7] hover:bg-white text-[#166534] border border-[#16A34A]/30 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-2xs"
              >
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Buy Now</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="space-y-2.5 pt-4 border-t border-[#DDE8DE] text-xs text-[#647064] font-secondary">
            <div className="flex items-center gap-2.5">
              <Truck size={16} className="text-[#166534]" />
              <span>Livraison express offerte dès 60 000 FCFA d'achat</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw size={16} className="text-[#16A34A]" />
              <span>30-Day home trial with pre-paid return shipping label</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-[#166534]" />
              <span>Includes 2-Year DSK manufacturer limited warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview, Specs, Reviews */}
      <div className="mt-16 bg-[#FAFCFA] rounded-3xl border border-[#DDE8DE] shadow-2xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#DDE8DE] px-6 overflow-x-auto font-primary bg-[#F0FDF4]/50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-[#647064] hover:text-[#172017]'
            }`}
          >
            Overview & Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-[#647064] hover:text-[#172017]'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'border-[#166534] text-[#166534]'
                : 'border-transparent text-[#647064] hover:text-[#172017]'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-10">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-4xl font-secondary">
              <div>
                <h3 className="text-lg font-bold text-[#172017] mb-2 font-primary">Engineered Without Compromise</h3>
                <p className="text-xs sm:text-sm text-[#647064] leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#172017] mb-3 font-primary">
                  Key Capabilities
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#172017] bg-[#F0FDF4] p-3.5 rounded-xl border border-[#DDE8DE]"
                    >
                      <Check size={16} className="text-[#16A34A] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl font-secondary">
              <h3 className="text-lg font-bold text-[#172017] mb-4 font-primary">Hardware Specifications</h3>
              <div className="border border-[#DDE8DE] rounded-2xl overflow-hidden divide-y divide-[#DDE8DE]">
                {Object.entries(product.specs).map(([label, value], i) => (
                  <div
                    key={label}
                    className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm ${
                      i % 2 === 0 ? 'bg-[#F0FDF4]' : 'bg-[#FAFCFA]'
                    }`}
                  >
                    <span className="font-bold text-[#647064] sm:col-span-1 font-primary">{label}</span>
                    <span className="text-[#172017] sm:col-span-2 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 max-w-4xl font-secondary">
              {/* Write Review Form */}
              <div className="bg-[#F0FDF4] p-6 rounded-2xl border border-[#DDE8DE]">
                <h4 className="text-sm font-bold text-[#172017] mb-1 font-primary">Write a Customer Review</h4>
                <p className="text-xs text-[#647064] mb-4">
                  Share your genuine feedback with other creators and shoppers.
                </p>

                {reviewSubmitted ? (
                  <div className="p-4 bg-[#DCFCE7] border border-[#16A34A]/30 text-[#166534] text-xs font-semibold rounded-xl flex items-center gap-2 font-primary">
                    <Check size={16} className="text-[#16A34A]" /> Thank you! Your review has been recorded.
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder="e.g. Alex Morgan"
                          className="w-full px-3.5 py-2 text-xs bg-white border border-[#DDE8DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">Rating</label>
                        <div className="flex items-center gap-1 py-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="text-amber-400 hover:scale-110 transition-transform"
                            >
                              <Star
                                size={20}
                                className={
                                  star <= reviewRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }
                              />
                            </button>
                          ))}
                          <span className="text-xs font-bold text-[#172017] ml-2 font-primary">
                            {reviewRating} of 5
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#172017] mb-1 font-primary">
                        Review Comments
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What do you love about this item? How is the acoustic balance or ergonomics?"
                        className="w-full px-3.5 py-2 text-xs bg-white border border-[#DDE8DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors font-primary shadow-xs"
                    >
                      <Send size={13} /> Submit Review
                    </button>
                  </form>
                )}
              </div>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#172017] font-primary">
                  Verified Owner Reviews ({product.reviews?.length || 0})
                </h4>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-3">
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-[#DDE8DE] shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between font-primary">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#172017]">{rev.author}</span>
                            {rev.verifiedPurchase && (
                              <span className="text-[10px] bg-[#DCFCE7] text-[#166534] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#DCFCE7]">
                                <Check size={10} className="text-[#16A34A]" /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#647064] font-secondary">{rev.date}</span>
                        </div>

                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={13}
                              className={
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }
                            />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm text-[#647064] leading-relaxed font-secondary">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#647064] italic">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-12 sm:mt-16 font-secondary">
          <h3 className="text-lg sm:text-xl font-bold text-[#172017] mb-4 sm:mb-6 font-primary">Frequently Paired Together</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
