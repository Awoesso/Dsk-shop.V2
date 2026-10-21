import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { useWishlist } from '../../hooks/useWishlist';
import { useStoreCart } from '../../hooks/useStoreCart';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { SEO } from '../../components/SEO/SEO';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../types';
import { ArrowLeft, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface StoreProductDetailViewProps {
  productSlug: string;
}

export const StoreProductDetailView: React.FC<StoreProductDetailViewProps> = ({ productSlug }) => {
  const { storefront, identity, slug, storeId } = useStore();
  const { navigate } = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useStoreCart(storeId);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    // 1. Try finding in storefront products already loaded
    const foundLocal = storefront?.products.find(
      (p) => p.slug === productSlug || p.id === productSlug
    );
    if (foundLocal) {
      setProduct(foundLocal);
      setSelectedImage(foundLocal.primaryImage || foundLocal.images[0] || '');
      setLoading(false);
      return;
    }

    // 2. Otherwise fetch from service scoped to storeId
    let cancelled = false;
    setLoading(true);

    ProductsService.getProductBySlug(productSlug, storeId).then((res) => {
      if (cancelled) return;
      if (res.data) {
        setProduct(res.data);
        setSelectedImage(res.data.primaryImage || res.data.images[0] || '');
      } else {
        setProduct(null);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [productSlug, storefront?.products, storeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StoreHeader />
        <div className="flex-1 flex items-center justify-center p-12 text-slate-500 text-sm">
          Chargement du produit...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <StoreHeader />
        <div className="flex-1 max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Produit introuvable</h2>
          <p className="text-xs text-slate-500">
            Ce produit n'existe pas ou n'appartient pas à la boutique {identity.name}.
          </p>
          <button
            onClick={() => navigate(`/boutique/${slug}/produits`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Retour au catalogue</span>
          </button>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [product.primaryImage].filter(Boolean);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
      <SEO
        title={`${product.name} | ${identity.name}`}
        description={product.description || `Achetez ${product.name} chez ${identity.name} sur Nexa.`}
      />

      <StoreHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(`/boutique/${slug}/produits`)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Retour aux produits de {identity.name}</span>
        </button>

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-100">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Aucune image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img ? 'border-slate-900' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {product.category || 'Article'}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {product.name}
                </h1>
                <div className="text-xs text-slate-500">
                  Vendu par <span className="font-bold text-slate-800">{identity.name}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {product.price.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    {product.compare_price.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed pt-2">
                {product.description || "Aucune description détaillée n'a été fournie pour cet article."}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-slate-900/10"
                >
                  <ShoppingBag size={16} />
                  <span>Ajouter au panier</span>
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                    isInWishlist(product.id)
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                  title="Ajouter aux favoris"
                >
                  <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <Truck size={16} className="text-emerald-600" />
                  <span>Livraison rapide à Lomé</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>Garantie Nexa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
