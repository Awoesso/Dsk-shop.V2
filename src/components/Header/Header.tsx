import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top Banner - Discret et compact */}
      <div className="bg-[#14532D] text-white text-[10px] sm:text-[11px] py-1 sm:py-1.5 px-3 sm:px-4 font-medium tracking-wide border-b border-[#166534]/50">
        <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-1 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#DCFCE7] text-[#166534] uppercase tracking-wider font-primary">
              Offre
            </span>
            <span className="hidden sm:inline font-secondary text-emerald-100 text-[11px]">
              Profitez de 15% de réduction avec le code <strong className="text-white font-bold tracking-wider">DSK15</strong>
            </span>
            <span className="sm:hidden font-secondary text-emerald-100 text-[10px]">
              Code <strong className="text-white">DSK15</strong> : -15%
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-emerald-100 text-[10px] sm:text-[11px] font-secondary">
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#DCFCE7]" /> Livraison offerte dès 60 000 FCFA à Lomé
            </span>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '' });
                navigateTo('shop');
              }}
              className="flex items-center gap-1 font-semibold text-emerald-100 hover:text-white transition-colors font-primary cursor-pointer"
            >
              <span>Découvrir</span> <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Épurée, espacée et éléments réduits */}
      <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-13 sm:h-15 lg:h-16 gap-4 sm:gap-8">
          {/* Brand Logo - Réduit et fin */}
          <div className="flex items-center shrink-0">
            <button
              id="dsk-logo-btn"
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#166534] text-white flex items-center justify-center font-bold tracking-tight shadow-2xs group-hover:bg-[#16A34A] transition-colors">
                <span className="text-xs sm:text-sm font-extrabold tracking-tight font-primary">DSK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-[#172017] flex items-center font-primary leading-tight">
                  DSK<span className="text-[#16A34A]">SHOP</span>
                </span>
                <span className="text-[8px] sm:text-[9px] tracking-wider uppercase font-medium text-[#647064] font-secondary hidden sm:inline leading-none">
                  Lomé, Togo
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar - Taille modérée & espacée */}
          <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
            <SearchBar />
          </div>

          {/* Navigation Items (Desktop) - Espacés avec gap généreux et textes réduits */}
          <nav className="hidden lg:flex items-center gap-3 sm:gap-4 xl:gap-6 text-xs sm:text-[13px] font-medium font-secondary text-[#172017]">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'home'
                  ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Accueil
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                navigateTo('shop');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState.category === 'all' && filterState?.sortBy === 'featured'
                  ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Boutique
            </button>

            {/* Desktop Categories Dropdown - Only shown if at least 1 active category exists */}
            {activeCategories.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                    categoriesDropdownOpen || (activePage === 'shop' && filterState.category !== 'all')
                      ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                      : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
                  }`}
                >
                  <span>Catégories</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform duration-200 ${
                      categoriesDropdownOpen ? 'rotate-180 text-[#166534]' : 'text-[#647064]'
                    }`}
                  />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-primary">
                        {activeCategories.length} {activeCategories.length > 1 ? 'Collections' : 'Collection'}
                      </span>
                      <button
                        onClick={() => {
                          setFilters({ category: 'all' });
                          navigateTo('shop');
                          setCategoriesDropdownOpen(false);
                        }}
                        className="text-[10px] font-semibold text-[#166534] hover:underline cursor-pointer"
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
                                ? 'bg-[#166534] text-white'
                                : 'text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={isSelected ? 'text-white' : 'text-[#166534]'}>
                                {getCategoryIcon(cat.id)}
                              </span>
                              <span>{cat.name}</span>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                                isSelected
                                  ? 'bg-white/20 text-white'
                                  : 'bg-[#DCFCE7] text-[#166534]'
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
              className={`px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'newest'
                  ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Nouveautés
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                navigateTo('shop');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'featured'
                  ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Meilleures Ventes
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-primary cursor-pointer ${
                activePage === 'contact'
                  ? 'text-[#166534] bg-[#DCFCE7] font-semibold'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Button - Uniquement le Panier, épuré et espacé */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#166534] hover:bg-[#16A34A] text-white rounded-lg sm:rounded-xl transition-all shadow-2xs focus:outline-none font-primary cursor-pointer"
              title="Mon Panier"
              aria-label="Mon Panier"
            >
              <div className="relative">
                <ShoppingBag size={15} className="sm:w-4 sm:h-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[9px] font-bold text-[#166534] bg-[#DCFCE7] rounded-full ring-1 ring-[#166534]">
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
              className="p-1.5 sm:p-2 text-[#172017] hover:text-[#166534] hover:bg-[#F0FDF4] rounded-lg lg:hidden transition-colors cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-2 pt-0.5">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DDE8DE] bg-[#FAFCFA] shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-110px)] overflow-y-auto pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
          <div className="px-4 py-4 space-y-3 font-primary">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  navigateTo('home');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'home' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Accueil</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'featured' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Boutique</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'newest' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Nouveautés</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
              <button
                onClick={() => {
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'featured' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'featured' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Meilleures Ventes</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
              <button
                onClick={() => {
                  navigateTo('contact');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'contact' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Contact & Support</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
              <button
                onClick={() => {
                  navigateTo('account');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'account' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Mon Compte</span>
                <ChevronRight size={16} className="text-[#647064]" />
              </button>
            </div>

            {activeCategories.length > 0 && (
              <div className="pt-2 border-t border-[#DDE8DE]">
                <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#647064] font-secondary">
                  Catégories
                </p>
                <div className="mt-1 space-y-1">
                  {activeCategories.map((cat) => {
                    const count = categoryCounts[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium text-[#172017] hover:bg-[#F0FDF4] cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-[#166534]">{getCategoryIcon(cat.id)}</span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-xs bg-[#DCFCE7] text-[#166534] font-semibold px-2 py-0.5 rounded-full">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-[#DDE8DE]">
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#166534] hover:bg-[#16A34A] text-white font-semibold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <ShoppingBag size={15} /> Voir mon panier ({cartItemCount}) · {formatPrice(cartSubtotal)}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
