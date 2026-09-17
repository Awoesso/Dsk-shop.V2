import React, { useState } from 'react';
import { ShoppingBag, Heart, Menu, X, ArrowRight, ShieldCheck, Sparkles, ChevronRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SearchBar } from '../SearchBar/SearchBar';
import { CATEGORIES } from '../../data/products';
import { formatPrice } from '../../utils/currency';

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
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCategoryClick = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F3FAF4]/95 backdrop-blur-md border-b border-[#DDE8DE] transition-all">
      {/* Top Banner - Vert Profond #14532D */}
      <div className="bg-[#14532D] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 font-medium tracking-wide border-b border-[#166534]/50">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#DCFCE7] text-[#166534] uppercase tracking-wider font-primary">
              Offer
            </span>
            <span className="hidden sm:inline font-secondary text-emerald-100 text-xs">
              Use code <strong className="text-white font-bold tracking-wider">DSK15</strong> for an exclusive 15% discount
            </span>
            <span className="sm:hidden font-secondary text-emerald-100 text-[11px]">
              Code <strong className="text-white">DSK15</strong> for 15% off
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-emerald-100 text-[11px] sm:text-xs font-secondary">
            <span className="hidden md:flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#DCFCE7]" /> Livraison offerte dès 60 000 FCFA
            </span>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '' });
                navigateTo('shop');
              }}
              className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-emerald-100 hover:text-white transition-colors font-primary"
            >
              Shop <ArrowRight size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20 gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="dsk-logo-btn"
              onClick={() => navigateTo('home')}
              className="group flex items-center gap-2 sm:gap-3 text-left focus:outline-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#166534] text-white flex items-center justify-center font-bold tracking-tight shadow-sm group-hover:bg-[#16A34A] transition-colors">
                <span className="text-sm sm:text-base font-extrabold tracking-tight font-primary">DSK</span>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-[#172017] flex items-center font-primary">
                  DSK<span className="text-[#16A34A]">SHOP</span>
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-[#647064] -mt-0.5 font-secondary hidden sm:inline">
                  Premium Essentials
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          {/* Navigation Items (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-semibold font-secondary text-[#172017]">
            <button
              onClick={() => navigateTo('home')}
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
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
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'featured'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Boutique
            </button>
            <button
              onClick={() => {
                setFilters({ category: 'all', searchQuery: '', sortBy: 'newest' });
                navigateTo('shop');
              }}
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
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
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'shop' && filterState?.sortBy === 'rating'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Meilleures Ventes
            </button>
            <button
              onClick={() => navigateTo('about')}
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'about'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              À Propos
            </button>
            <button
              onClick={() => navigateTo('contact')}
              className={`px-3.5 py-2 rounded-xl transition-colors font-primary cursor-pointer ${
                activePage === 'contact'
                  ? 'text-[#166534] bg-[#DCFCE7] font-bold shadow-2xs'
                  : 'hover:text-[#166534] hover:bg-[#F0FDF4]'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wishlist Button */}
            <button
              id="header-wishlist-btn"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 sm:p-2.5 text-[#172017] hover:text-[#166534] hover:bg-[#DCFCE7]/60 rounded-xl transition-colors focus:outline-none"
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500 sm:w-5 sm:h-5' : 'sm:w-5 sm:h-5'} />
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
              className="relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2.5 bg-[#166534] hover:bg-[#16A34A] text-white rounded-xl transition-all shadow-xs focus:outline-none font-primary"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center text-[9px] sm:text-[10px] font-bold text-[#166534] bg-[#DCFCE7] rounded-full ring-1 ring-[#166534]">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                ${cartSubtotal.toFixed(0)}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2.5 text-[#172017] hover:text-[#166534] hover:bg-[#F0FDF4] rounded-xl lg:hidden transition-colors"
              aria-label="Toggle navigation menu"
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
                  navigateTo('about');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between p-3 rounded-xl text-left font-semibold text-sm ${
                  activePage === 'about' ? 'bg-[#DCFCE7] text-[#166534]' : 'text-[#172017] hover:bg-[#F0FDF4]'
                }`}
              >
                <span>À Propos</span>
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
                Categories
              </p>
              <div className="mt-1 space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl text-left text-sm font-medium text-[#172017] hover:bg-[#F0FDF4]"
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
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#F0FDF4] text-[#172017] font-semibold text-xs hover:bg-[#DCFCE7]"
              >
                <Heart size={16} className="text-rose-500" /> Wishlist ({wishlist.length})
              </button>
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#166534] hover:bg-[#16A34A] text-white font-semibold text-xs transition-colors"
              >
                <ShoppingBag size={16} /> Cart ({cartItemCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
