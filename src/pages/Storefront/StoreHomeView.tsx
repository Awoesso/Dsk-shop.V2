import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../router/RouterContext';
import { useShop } from '../../context/ShopContext';
import { useStoreCart } from '../../hooks/useStoreCart';
import { TemplateRenderer } from '../../templates/storefront/renderer/TemplateRenderer';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { SEO } from '../../components/SEO/SEO';
import { Product } from '../../types';

export const StoreHomeView: React.FC = () => {
  const { storefront, identity, slug, storeId } = useStore();
  const { navigate } = useRouter();
  const { toggleWishlist, isInWishlist } = useShop();
  const { addToCart } = useStoreCart(storeId);

  if (!storefront) return null;

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans">
      <SEO
        title={`${identity.name} | Boutique Officielle`}
        description={identity.description || `Découvrez les produits de ${identity.name} sur Nexa.`}
      />

      <StoreHeader />

      <main className="flex-1 w-full">
        <TemplateRenderer
          storefront={storefront}
          onAddToCart={(prod: Product, qty?: number) => {
            addToCart(prod, qty);
          }}
          onToggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist}
          onSelectProduct={(prod: Product) => {
            navigate(`/boutique/${encodeURIComponent(slug)}/produit/${encodeURIComponent(prod.slug || prod.id)}`);
          }}
          onSearch={(query: string) => {
            navigate(`/boutique/${encodeURIComponent(slug)}/produits?q=${encodeURIComponent(query)}`);
          }}
          onSelectCategory={(category: string) => {
            navigate(`/boutique/${encodeURIComponent(slug)}/produits?cat=${encodeURIComponent(category)}`);
          }}
        />
      </main>
    </div>
  );
};
