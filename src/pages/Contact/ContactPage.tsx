import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { SEO } from '../../components/SEO/SEO';

export const ContactPage: React.FC = () => {
  const { showToast } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'order',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }
    setIsSubmitted(true);
    showToast('Votre message a été envoyé avec succès au service client DSK-Shop.', 'success');
  };

  const faqs = [
    {
      q: 'Quels sont les délais de livraison ?',
      a: 'Toutes les commandes passées avant 14h sont expédiées le jour même. La livraison standard prend 2 à 4 jours ouvrés avec numéro de suivi en direct.',
    },
    {
      q: 'Comment fonctionne la garantie de 2 ans ?',
      a: 'Chaque article acheté sur DSK-Shop bénéficie d’une garantie remplacement intégrale de 2 ans. Il vous suffit de nous contacter avec votre numéro de commande pour une prise en charge immédiate.',
    },
    {
      q: 'Puis-je retourner un produit sous 30 jours ?',
      a: 'Oui, vous disposez de 30 jours à compter de la réception pour tester votre matériel. Les retours sont sans frais et le remboursement intervient sous 48h après réception.',
    },
    {
      q: 'Les paiements sont-ils sécurisés ?',
      a: 'Nous utilisons un cryptage SSL bancaire 256-bit pour l’ensemble des transactions (Cartes bancaires, Apple Pay, PayPal) et supportons également le règlement à la livraison.',
    },
  ];

  return (
    <div className="max-w-[1600px] 2xl:max-w-[1760px] mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 py-8 sm:py-12 2xl:py-16 space-y-12 sm:space-y-16 2xl:space-y-24 font-secondary text-[#172017]">
      <SEO
        title="Contact & Support Client | DSK-Shop Lomé"
        description="Besoin d'aide ou d'un renseignement sur vos commandes DSK-Shop ? Contactez notre équipe basée à Lomé, Togo. Support réactif par email, téléphone et WhatsApp."
        breadcrumbs={[
          { name: 'Accueil', url: '/' },
          { name: 'Contact & Support', url: '/contact' },
        ]}
        keywords={['Contact DSK-Shop', 'support client Lomé', 'Togo', 'SAV', 'livraison Lomé']}
      />
      {/* Header Banner */}
      <section className="text-center max-w-2xl 2xl:max-w-3xl mx-auto space-y-3 2xl:space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 2xl:px-4 2xl:py-1.5 rounded-full bg-[#DCFCE7] text-[#166534] text-xs 2xl:text-sm font-bold font-primary tracking-wider uppercase">
          <MessageSquare size={13} className="text-[#16A34A] 2xl:w-4 2xl:h-4" /> Assistance & Support Lomé
        </span>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-extrabold text-[#172017] tracking-tight font-primary"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Contactez notre équipe.
        </h1>
        <p className="text-sm sm:text-base 2xl:text-lg text-[#647064]">
          Une question sur une commande, un conseil technique ou une demande de garantie ? Notre équipe à Lomé vous répond sous 24 heures.
        </p>
      </section>

      {/* Main Grid: Form + Contact Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 2xl:gap-16">
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4 2xl:space-y-6">
          <div className="p-6 2xl:p-8 rounded-2xl bg-[#FFFFFF] border border-[#DDE8DE] shadow-2xs space-y-5 2xl:space-y-7">
            <h3
              className="text-lg 2xl:text-xl font-bold text-[#172017] font-primary"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Coordonnées Officielles
            </h3>

            <div className="space-y-4 2xl:space-y-6 text-sm 2xl:text-base">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <div>
                  <span className="text-xs 2xl:text-sm text-[#647064] block">Email Service Client</span>
                  <a href="mailto:contact@dsk-shop.tg" className="font-semibold text-[#172017] hover:text-[#16A34A] transition-colors">
                    contact@dsk-shop.tg
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <div>
                  <span className="text-xs 2xl:text-sm text-[#647064] block">Téléphone & WhatsApp (Togo)</span>
                  <span className="font-semibold text-[#172017]">+228 90 12 34 56 / +228 97 88 00 11</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <div>
                  <span className="text-xs 2xl:text-sm text-[#647064] block">Horaires d'Ouverture</span>
                  <span className="font-semibold text-[#172017]">Du Lundi au Samedi : 8h00 – 19h30 GMT</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} className="2xl:w-5 2xl:h-5" />
                </div>
                <div>
                  <span className="text-xs 2xl:text-sm text-[#647064] block">Boutique & Showroom Principal</span>
                  <span className="font-semibold text-[#172017]">Boulevard du 13 Janvier, Quartier Déckon, Lomé, Togo</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 2xl:p-6 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center gap-3">
            <ShieldCheck size={24} className="text-[#166534] flex-shrink-0 2xl:w-7 2xl:h-7" />
            <p className="text-xs 2xl:text-sm text-[#166534] leading-relaxed">
              <strong>Engagement Réactivité :</strong> Chaque message est traité par notre équipe à Lomé sous 24h avec un suivi personnalisé.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 2xl:p-10 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#DDE8DE] shadow-xs">
            {isSubmitted ? (
              <div className="py-12 2xl:py-16 text-center space-y-4">
                <div className="w-14 h-14 2xl:w-16 2xl:h-16 mx-auto rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                  <CheckCircle2 size={32} className="2xl:w-10 2xl:h-10" />
                </div>
                <h3
                  className="text-2xl 2xl:text-3xl font-bold text-[#172017] font-primary"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Message bien reçu !
                </h3>
                <p className="text-sm 2xl:text-base text-[#647064] max-w-md 2xl:max-w-lg mx-auto">
                  Merci {formData.name}. Un conseiller du support DSK-Shop Lomé vous répondra à l&apos;adresse <strong>{formData.email}</strong> dans les plus brefs délais.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'order', message: '' });
                  }}
                  className="px-5 py-2.5 2xl:px-7 2xl:py-3.5 bg-[#DCFCE7] hover:bg-[#cbf7d8] text-[#166534] rounded-xl text-xs 2xl:text-sm font-bold font-primary transition-colors cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 2xl:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 2xl:gap-6">
                  <div>
                    <label className="block text-xs 2xl:text-sm font-semibold text-[#172017] mb-1 font-primary">
                      Votre Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Koffi Mensah"
                      className="w-full px-3.5 py-2.5 2xl:py-3 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm 2xl:text-base text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs 2xl:text-sm font-semibold text-[#172017] mb-1 font-primary">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="koffi@example.com"
                      className="w-full px-3.5 py-2.5 2xl:py-3 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm 2xl:text-base text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs 2xl:text-sm font-semibold text-[#172017] mb-1 font-primary">
                    Objet de votre demande
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 2xl:py-3 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm 2xl:text-base text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                  >
                    <option value="order">Suivi ou question sur une commande</option>
                    <option value="product">Conseil avant-achat sur un produit</option>
                    <option value="warranty">Demande de garantie ou SAV</option>
                    <option value="other">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs 2xl:text-sm font-semibold text-[#172017] mb-1 font-primary">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Détaillez votre demande..."
                    className="w-full px-3.5 py-2.5 2xl:py-3 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm 2xl:text-base text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 2xl:px-8 2xl:py-4 bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-sm 2xl:text-base rounded-xl font-primary transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send size={16} />
                  <span>Envoyer ma demande</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-5 2xl:space-y-8">
        <div className="text-center max-w-xl 2xl:max-w-2xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl 2xl:text-4xl font-extrabold text-[#172017] font-primary tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Questions Fréquentes
          </h2>
          <p className="text-xs sm:text-sm 2xl:text-base text-[#647064] mt-1">
            Les réponses directes aux interrogations les plus courantes à Lomé.
          </p>
        </div>

        <div className="max-w-3xl 2xl:max-w-4xl mx-auto space-y-3 2xl:space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl border border-[#DDE8DE] bg-[#FFFFFF] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 2xl:p-6 text-left text-sm 2xl:text-base font-bold text-[#172017] font-primary cursor-pointer hover:bg-[#F3FAF4]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#166534] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 2xl:px-6 pb-4 sm:pb-5 2xl:pb-6 text-xs sm:text-sm 2xl:text-base text-[#647064] leading-relaxed border-t border-[#F0FDF4] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
