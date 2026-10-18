import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { useStoreCart } from '../../hooks/useStoreCart';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { SEO } from '../../components/SEO/SEO';
import { ShoppingBag, ArrowRight, ArrowLeft, Trash2 } from 'lucide-react';

export const StoreCartView: React.FC = () => {
  const { identity, slug, storeId } = useStore();
  const { navigate } = useRouter();
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useStoreCart(storeId);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
      <SEO
        title={`Panier | ${identity.name}`}
        description={`Consultez vos articles et finalisez votre commande chez ${identity.name}.`}
      />

      <StoreHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Votre panier
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Commande chez {identity.name}
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Trash2 size={14} />
              <span>Vider le panier de cette boutique</span>
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <ShoppingBag size={32} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Votre panier est vide</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Vous n'avez pas encore ajouté d'articles de cette boutique à votre panier.
            </p>
            <button
              onClick={() => navigate(`/boutique/${slug}/produits`)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Explorer le catalogue</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cart Items list */}
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 flex gap-4 items-center"
                >
                  <img
                    src={item.product.primaryImage || item.product.images[0] || ''}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 truncate">
                      {item.product.name}
                    </h3>
                    <div className="text-xs font-extrabold text-slate-800 mt-0.5">
                      {item.product.price.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4">
                <h3 className="font-bold text-sm text-slate-900">Récapitulatif</h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Sous-total :</span>
                    <span className="font-bold text-slate-900">
                      {cartTotal.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison à Lomé :</span>
                    <span className="font-bold text-emerald-600">Gratuite</span>
                  </div>
                  <div className="border-t border-slate-100 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total :</span>
                    <span>
                      {cartTotal.toLocaleString('fr-FR')} {identity.currency || 'FCFA'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/boutique/${slug}/commande`)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  <span>Passer la commande</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <button
                onClick={() => navigate(`/boutique/${slug}/produits`)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
