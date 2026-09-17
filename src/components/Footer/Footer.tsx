import React, { useState } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones, ArrowRight, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';

export const Footer: React.FC = () => {
  const { navigateTo, setFilters, showToast } = useShop();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Check your inbox for your 10% coupon code.', 'success');
  };

  const handleCategoryNav = (catId: string) => {
    setFilters({ category: catId, searchQuery: '' });
    navigateTo('shop', { category: catId });
  };

  return (
    <footer className="bg-[#0c1d12] text-slate-300 pt-12 pb-24 md:pb-12 border-t border-emerald-950/60 font-secondary">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-emerald-900/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <Truck size={22} className="text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-primary">Free Express Delivery</h4>
              <p className="text-xs text-slate-400 mt-0.5">Offerte dès 60 000 FCFA d'achat</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <RotateCcw size={22} className="text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-primary">30-Day Free Returns</h4>
              <p className="text-xs text-slate-400 mt-0.5">Zero hassle, prepaid return labels</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={22} className="text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-primary">2-Year DSK Warranty</h4>
              <p className="text-xs text-slate-400 mt-0.5">Guaranteed hardware replacement</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-[#16A34A] flex items-center justify-center flex-shrink-0">
              <Headphones size={22} className="text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white font-primary">24/7 Expert Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Dedicated audio & hardware specialists</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5 font-primary">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold tracking-tight">
                <span>DSK</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                DSK<span className="text-emerald-400 font-medium">SHOP</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              DSK-Shop curates premium audio, workspace peripherals, smart living technologies, and everyday carry gear designed for creators, builders, and audiophiles.
            </p>

            {/* Newsletter Form */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-primary">
                Join the DSK Insider Club
              </p>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40 font-primary">
                  <Check size={16} /> Thank you for subscribing! Check your email for $15 off.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md font-primary">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email..."
                    className="flex-1 px-3.5 py-2.5 bg-white/5 text-white placeholder:text-slate-500 text-xs rounded-xl border border-white/10 focus:outline-none focus:border-[#16A34A] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#16A34A] hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                  >
                    Subscribe <ArrowRight size={13} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Shop Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategoryNav(cat.id)}
                    className="hover:text-[#16A34A] transition-colors"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-primary">
              Customer Experience
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('cart')} className="hover:text-[#16A34A] transition-colors">
                  Order Tracking & Status
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Warranty & Replacements
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Contact Concierge Support
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4 font-primary">
              About DSK
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Our Engineering Story
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Acoustic Lab Standards
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-[#16A34A] cursor-pointer transition-colors text-left">
                  Sustainability & Materials
                </button>
              </li>
              <li>
                <span className="hover:text-[#16A34A] cursor-pointer transition-colors">
                  Affiliate & Partners
                </span>
              </li>
              <li>
                <span className="hover:text-[#16A34A] cursor-pointer transition-colors">
                  Press & Media Kit
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DSK-Shop Inc. All rights reserved. Built with React & TypeScript.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Certifications</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
