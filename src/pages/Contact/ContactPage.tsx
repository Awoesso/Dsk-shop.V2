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
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16 font-secondary text-[#172017]">
      {/* Header Banner */}
      <section className="text-center max-w-2xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534] text-xs font-bold font-primary tracking-wider uppercase">
          <MessageSquare size={13} className="text-[#16A34A]" /> Assistance & Support
        </span>
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172017] tracking-tight font-primary"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          Contactez notre équipe.
        </h1>
        <p className="text-sm sm:text-base text-[#647064]">
          Une question sur une commande, un conseil technique ou une demande de garantie ? Nous vous répondons sous 24 heures.
        </p>
      </section>

      {/* Main Grid: Form + Contact Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Contact Information Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#DDE8DE] shadow-2xs space-y-5">
            <h3
              className="text-lg font-bold text-[#172017] font-primary"
              style={{ fontFamily: "'Manrope', sans-serif" }}
            >
              Coordonnées Officielles
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-xs text-[#647064] block">Email Service Client</span>
                  <a href="mailto:support@dsk-shop.com" className="font-semibold text-[#172017] hover:text-[#16A34A]">
                    support@dsk-shop.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-xs text-[#647064] block">Téléphone & WhatsApp</span>
                  <span className="font-semibold text-[#172017]">+33 (0)1 84 80 42 10</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-xs text-[#647064] block">Horaires de Support</span>
                  <span className="font-semibold text-[#172017]">Du Lundi au Vendredi : 8h00 – 19h00</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#DCFCE7] text-[#166534] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-xs text-[#647064] block">Centre Logistique</span>
                  <span className="font-semibold text-[#172017]">DSK Logistics Europe, France</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center gap-3">
            <ShieldCheck size={24} className="text-[#166534] flex-shrink-0" />
            <p className="text-xs text-[#166534] leading-relaxed">
              <strong>Engagement Réactivité :</strong> Chaque message est traité par un conseiller dédié en France sous 24h ouvrées.
            </p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] border border-[#DDE8DE] shadow-xs">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#DCFCE7] text-[#166534] flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3
                  className="text-2xl font-bold text-[#172017] font-primary"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  Message bien reçu !
                </h3>
                <p className="text-sm text-[#647064] max-w-md mx-auto">
                  Merci {formData.name}. Un conseiller du support DSK-Shop vous répondra à l&apos;adresse <strong>{formData.email}</strong> dans les plus brefs délais.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'order', message: '' });
                  }}
                  className="px-5 py-2.5 bg-[#DCFCE7] hover:bg-[#cbf7d8] text-[#166534] rounded-xl text-xs font-bold font-primary transition-colors cursor-pointer"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#172017] mb-1 font-primary">
                      Votre Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Alexandre Laurent"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#172017] mb-1 font-primary">
                      Adresse Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alexandre@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172017] mb-1 font-primary">
                    Objet de votre demande
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A]"
                  >
                    <option value="order">Suivi ou question sur une commande</option>
                    <option value="product">Conseil avant-achat sur un produit</option>
                    <option value="warranty">Demande de garantie ou SAV</option>
                    <option value="other">Autre demande</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172017] mb-1 font-primary">
                    Votre Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Détaillez votre demande..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE8DE] bg-[#FAFCFA] text-sm text-[#172017] focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#16A34A] hover:bg-[#166534] text-white font-bold text-sm rounded-xl font-primary transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
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
      <section className="space-y-5">
        <div className="text-center max-w-xl mx-auto">
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-[#172017] font-primary tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }}
          >
            Questions Fréquentes
          </h2>
          <p className="text-xs sm:text-sm text-[#647064] mt-1">
            Les réponses directes aux interrogations les plus courantes.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl border border-[#DDE8DE] bg-[#FFFFFF] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm font-bold text-[#172017] font-primary cursor-pointer hover:bg-[#F3FAF4]"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#166534] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-[#647064] leading-relaxed border-t border-[#F0FDF4] pt-3">
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
