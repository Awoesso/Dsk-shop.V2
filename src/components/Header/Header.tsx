import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Laptop,
  Shirt,
  BookOpen,
  Home,
  Activity,
  Watch,
  Cpu,
  Package,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SearchBar } from '../SearchBar/SearchBar';
import { CATEGORIES } from '../../constants/categories';
import { formatPrice } from '../../utils/currency';
import { getCategoryProductCounts, filterActiveCategories } from '../../utils/categoryUtils';

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'Electronics':
      return <Laptop size={15} className="shrink-0" />;
    case 'Fashion':
      return <Shirt size={15} className="shrink-0" />;
    case 'Books':
      return <BookOpen size={15} className="shrink-0" />;
    case 'Home':
      return <Home size={15} className="shrink-0" />;
    case 'Beauty':
      return <Sparkles size={15} className="shrink-0" />;
    case 'Sports':
      return <Activity size={15} className="shrink-0" />;
    case 'Accessories':
      return <Watch size={15} className="shrink-0" />;
    case 'Digital':
      return <Cpu size={15} className="shrink-0" />;
    case 'Other':
    default:
      return <Package size={15} className="shrink-0" />;
  }
};

export const Header: React.FC = () => {
  const {
    activePage,
    navigateTo,
    cartItemCount,
    cartSubtotal,
    setIsCartOpen,
    setFilters,
    filterState,
    products,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic category counts
  const categoryCounts = React.useMemo(() => {
    return getCategoryProductCounts(products);
  }, [products]);

  // Only display categories with at least 1 product (hide if 0, null, or empty)
  const activeCategories = React.useMemo(() => {
    return filterActiveCategories(CATEGORIES, categoryCounts);
  }, [categoryCounts]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-variant transition-all">
      {/* Top Banner - Discret et compact */}
      <div className="bg-primary text-white text-[10px] sm:text-[11px] py-1 sm:py-1.5 px-3 sm:px-4 font-medium tracking-wide border-b border-primary-container">
        <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-1 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary-fixed text-on-primary-fixed uppercase tracking-wider font-primary">
              Offre
            </span>
            <span className="hidden sm:inline font-secondary text-primary-fixed text-[11px]">
              Profitez de 15% de réduction avec le code <strong className="text-white font-bold tracking-wider">DSK15</strong>
            </span>
            <span className="sm:hidden font-secondary text-primary-fixed text-[10px]">
              Code <strong className="text-white">DSK15</strong> : -15%
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-primary-fixed text-[10px] sm:text-[11px] font-secondary">
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-primary-fixed-dim" /> Livraison offerte dès 60 000 FCFA à Lomé
            </span>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '' });
                navigateTo('shop');
              }}
              className="flex items-center gap-1 font-semibold text-primary-fixed hover:text-white transition-colors font-primary cursor-pointer"
            >
              <span>Découvrir</span> <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Épurée, espacée et éléments réduits */}
      <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-15 lg:h-16 gap-3 sm:gap-6 lg:gap-8">
          {/* Brand Logo - Réduit et fin */}
          <div className="flex items-center shrink-0">
            <button
              id="dsk-logo-btn"
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold tracking-tight shadow-xs group-hover:bg-primary-container transition-colors">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight font-primary">DSK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-on-surface flex items-center font-primary leading-tight">
                  DSK<span className="text-surface-tint">SHOP</span>
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-wider uppercase font-medium text-on-surface-variant font-secondary hidden sm:inline leading-none">
                  Lomé, Togo
                </span>
              </div>
            </button>
          </div>

         

          {/* Navigation Items (Desktop) - Espacés avec gap généreux et textes réduits */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-6 text-xs sm:text-[13px] font-medium font-secondary text-on-surface">
            <button
              onClick={() => navigateTo('home')}
              className={`nav-link px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'home'
                  ? 'text-primary  bg-secondary-container  font-semibold'
                  : 'text-on-surface'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                navigateTo('shop');
              }}
              className={`nav-link px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState.category === 'all' && filterState?.sortBy === 'featured'
                  ? 'text-primary bg-secondary-container font-semibold'
                  : 'text-on-surface'
              }`}
            >
              Boutique
            </button>

            {/* Desktop Categories Dropdown - Only shown if at least 1 active category exists */}
            {activeCategories.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className={`nav-link flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                    categoriesDropdownOpen || (activePage === 'shop' && filterState.category !== 'all')
                      ? 'text-primary bg-secondary-container font-semibold'
                      : 'text-on-surface'
                  }`}
                >
                  <span>Catégories</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      categoriesDropdownOpen ? 'rotate-180 text-primary' : 'text-outline'
                    }`}
                  />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-surface-variant py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 border-b border-surface-variant flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-primary">
                        {activeCategories.length} {activeCategories.length > 1 ? 'Collections' : 'Collection'}
                      </span>
                      <button
                        onClick={() => {
                          setFilters({ category: 'all' });
                          navigateTo('shop');
                          setCategoriesDropdownOpen(false);
                        }}
                        className="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Tout afficher
                      </button>
                    </div>
                    <div className="mt-1 max-h-[340px] overflow-y-auto px-1 space-y-0.5">
                      {activeCategories.map((cat) => {
                        const isSelected = filterState.category === cat.id;
                        const count = categoryCounts[cat.id] ?? 0;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'text-on-surface hover:bg-surface-container-low hover:text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={isSelected ? 'text-white' : 'text-primary'}>
                                {getCategoryIcon(cat.id)}
                              </span>
                              <span>{cat.name}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-secondary-container text-primary'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' });
                navigateTo('shop');
              }}
              className={`nav-link px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'newest'
                  ? 'text-primary bg-secondary-container font-semibold'
                  : 'text-on-surface'
              }`}
            >
              Nouveautés
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                navigateTo('shop');
              }}
              className={`nav-link px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'featured'
                  ? 'text-primary bg-secondary-container font-semibold'
                  : 'text-on-surface'
              }`}
            >
              Meilleures Ventes
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`nav-link px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'contact'
                  ? 'text-primary bg-secondary-container font-semibold'
                  : 'text-on-surface'
              }`}
            >
              Contact
            </button>
          </nav>


          
 {/* Desktop Search Bar - Taille généreuse et premium */}
       



          {/* Right actions: search on desktop, search + menu on mobile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex flex-1 max-w-xl lg:max-w-2xl mx-2">
              <SearchBar />
            </div>

            {/* Mobile Search Bar */}
            <div className="md:hidden">
              <SearchBar />
            </div>

            {/* Desktop Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="hidden md:flex relative items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-primary rounded-lg sm:rounded-xl transition-all shadow-xs focus:outline-none font-primary cursor-pointer min-h-[38px] sm:min-h-[42px]"
              title="Mon Panier"
              aria-label="Mon Panier"
            >
              <div className="relative">
                <ShoppingCart size={15} className="sm:w-4 sm:h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-on-primary-fixed ring-1 ring-primary bg-primary rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold tracking-tight">
                {formatPrice(cartSubtotal)}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center text-on-surface hover:text-primary hover:bg-surface-container-low rounded-lg lg:hidden transition-colors cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden border-t border-surface-variant bg-surface shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-110px)] overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
        >
          <div className="px-4 py-4 space-y-3 font-primary">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'home' ? 'bg-secondary-container text-primary' : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>Accueil</span>
                <ChevronRight size={16} className="text-outline" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'featured' ? 'bg-secondary-container text-primary' : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>Boutique</span>
                <ChevronRight size={16} className="text-outline" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'newest' ? 'bg-secondary-container text-primary' : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>Nouveautés</span>
                <ChevronRight size={16} className="text-outline" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'featured' ? 'bg-secondary-container text-primary' : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>Meilleures Ventes</span>
                <ChevronRight size={16} className="text-outline" />
              </button>
              <button
                onClick={() => {
                  navigateTo('contact');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'contact' ? 'bg-secondary-container text-primary' : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>Contact & Support</span>
                <ChevronRight size={16} className="text-outline" />
              </button>
            </div>

            {activeCategories.length > 0 && (
              <div className="pt-2 border-t border-surface-variant">
                <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-surface-variant font-secondary">
                  Catégories
                </p>
                <div className="mt-1 space-y-1">
                  {activeCategories.map((cat) => {
                    const count = categoryCounts[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium text-on-surface hover:bg-surface-container-low cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-primary">{getCategoryIcon(cat.id)}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-xs bg-secondary-container text-primary font-semibold px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-surface-variant">
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs min-h-[44px]"
              >
                <ShoppingCart size={15} /> Voir mon panier ({cartItemCount}) · {formatPrice(cartSubtotal)}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
