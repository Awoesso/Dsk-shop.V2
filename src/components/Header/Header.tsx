import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Heart,
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
import { CATEGORIES } from '../../data/products';
import { formatPrice } from '../../utils/currency';

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
    wishlist,
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
    const map: Record<string, number> = {};
    products.forEach((p) => {
      const k = p.category || 'Other';
      map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [products]);

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
      {/* Top Banner - Vert Profond #14532D */}
      <div className="bg-[#14532D] text-white text-[11px] sm:text-xs 2xl:text-sm py-1.5 sm:py-2 2xl:py-2.5 px-3 sm:px-4 font-medium tracking-wide border-b border-[#166534]/50">
        <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto 2xl:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] 2xl:text-xs font-bold bg-[#DCFCE7] text-[#166534] uppercase tracking-wider font-primary">
              Offre
            </span>
            <span className="hidden sm:inline font-secondary text-emerald-100 text-xs 2xl:text-sm">
              Profitez de 15% de réduction avec le code <strong className="text-white font-bold tracking-wider">DSK15</strong>
            </span>
            <span className="sm:hidden font-secondary text-emerald-100 text-[11px]">
              Code <strong className="text-white">DSK15</strong> : -15%
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-emerald-100 text-[11px] sm:text-xs 2xl:text-sm font-secondary">
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#DCFCE7] 2xl:w-4 2xl:h-4" /> Livraison offerte dès 60 000 FCFA à Lomé
            </span>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '' });
                navigateTo('shop');
              }}
              className="flex items-center gap-1 text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-100 hover:text-white transition-colors font-primary cursor-pointer"
            >
              <span>Découvrir</span> <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1720px] 2xl:max-w-[1880px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12">
        <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20 2xl:h-24 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="dsk-logo-btn"
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-lg sm:rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold tracking-tight shadow-sm group-hover:bg-[#16A34A] transition-colors">
                <span className="text-sm sm:text-base 2xl:text-lg font-extrabold tracking-tight font-primary">DSK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl 2xl:text-2xl font-extrabold tracking-tight text-[#172017] flex items-center font-primary">
                  DSK<span className="text-[#16A34A]">SHOP</span>
                </span>
                <span className="text-[9px] sm:text-[10px] 2xl:text-xs tracking-widest uppercase font-semibold text-[#647064] -mt-0.5 font-secondary hidden sm:inline">
                  High-Tech & Lifestyle Lomé
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md 2xl:max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 2xl:gap-3 text-sm 2xl:text-base font-semibold font-secondary text-[#172017]">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'home'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
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
              className={`px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState.category === 'all' && filterState?.sortBy === 'featured'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Boutique
            </button>

            {/* Desktop Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                  categoriesDropdownOpen || (activePage === 'shop' && filterState.category !== 'all')
                    ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                    : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>Catégories</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    categoriesDropdownOpen ? 'rotate-180 text-[#166534]' : 'text-[#647064]'
                  }`}
                />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-primary">
                      9 Collections
                    </span>
                    <button
                      onClick={() => {
                        setFilters({ category: 'all' });
                        navigateTo('shop');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="text-[11px] font-semibold text-[#166534] hover:underline cursor-pointer"
                    >
                      Tout afficher
                    </button>
                  </div>
                  <div className="mt-1 max-h-[380px] overflow-y-auto px-1.5 space-y-0.5">
                    {CATEGORIES.map((cat) => {
                      const isSelected = filterState.category === cat.id;
                      const count = categoryCounts[cat.id] ?? cat.itemCount;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#166534] text-white'
                              : 'text-slate-700 hover:bg-[#F0FDF4] hover:text-[#166534]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={isSelected ? 'text-white' : 'text-[#166534]'}>
                              {getCategoryIcon(cat.id)}
                            </span>
                            <span>{cat.name}</span>
                          </div>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
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
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' });
                navigateTo('shop');
              }}
              className={`px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'newest'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Nouveautés
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'rating' });
                navigateTo('shop');
              }}
              className={`px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'rating'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Meilleures Ventes
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-2 2xl:px-4 2xl:py-2.5 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'contact'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 2xl:gap-4">
            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 sm:p-2.5 2xl:p-3 text-[#172017] hover:text-[#166534] hover:bg-[#DCFCE7]/60 rounded-xl transition-colors focus:outline-none cursor-pointer"
              title="Voir mes favoris"
              aria-label="Mes favoris"
            >
              <Heart size={18} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6' : 'sm:w-5 sm:h-5 2xl:w-6 2xl:h-6'} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-white bg-rose-500 rounded-full ring-2 ring-white shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 sm:gap-2.5 2xl:gap-3 px-3 sm:px-4 2xl:px-5 py-1.5 sm:py-2.5 2xl:py-3 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl transition-all shadow-xs focus:outline-none font-primary cursor-pointer"
              title="Mon Panier"
              aria-label="Mon Panier"
            >
              <div className="relative">
                <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px] 2xl:w-5 2xl:h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 flex items-center justify-center text-[9px] sm:text-[10px] 2xl:text-[11px] font-bold text-[#166534] bg-[#DCFCE7] rounded-full ring-1 ring-[#166534]">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs 2xl:text-sm font-bold tracking-tight">
                {formatPrice(cartSubtotal)}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2.5 text-[#172017] hover:text-[#166534] hover:bg-[#F0FDF4] rounded-xl lg:hidden transition-colors cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-2.5">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DDE8DE] bg-[#FAFCFA] shadow-xl animate-in slide-in-from-top-2 duration-200">
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
                  setFilters({ category: 'all', searchQuery: '', sortBy: 'rating' });
                  navigateTo('shop');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'shop' && filterState?.sortBy === 'rating' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
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
            </div>

            <div className="pt-2 border-t border-[#DDE8DE]">
              <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#647064] font-secondary">
                Catégories
              </p>
              <div className="mt-1 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium text-[#172017] hover:bg-[#F0FDF4] cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs bg-[#DCFCE7] text-[#166534] font-semibold px-2 py-0.5 rounded-full">
                      {cat.itemCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#DDE8DE] grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  navigateTo('wishlist');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#F0FDF4] text-[#172017] font-semibold text-xs hover:bg-[#DCFCE7] cursor-pointer"
              >
                <Heart size={16} className="text-rose-500" /> Favoris ({wishlist.length})
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#166534] hover:bg-[#16A34A] text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <ShoppingBag size={16} /> Panier ({cartItemCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
