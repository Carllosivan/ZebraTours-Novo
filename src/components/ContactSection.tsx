import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { buildWhatsAppLink } from '../utils/travel-logic.ts';

interface ContactSectionProps {
  phone?: string;
  whatsapp?: string;
  email?: string;
  location?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  phone = '+258 85 104 1826',
  whatsapp = '+258 85 104 1826',
  email = 'info@zebratours.co.mz',
  location = 'Maputo, Moçambique',
}) => {
  const [name, setName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const whatsappUrl = buildWhatsAppLink({ phone: whatsapp, customerName: name, serviceType: subject });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!name.trim() || !contactEmail.trim() || !subject.trim() || !message.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor preencha todos os campos obrigatórios assinalados.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem.');

      setStatusMessage({
        type: 'success',
        text: data.message || 'Mensagem enviada com sucesso! Entraremos em contacto brevemente.',
      });

      setName('');
      setContactEmail('');
      setContactPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Erro ao enviar mensagem. Tente novamente ou use o WhatsApp.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contactos" className="py-16 sm:py-20 bg-[#FAF9F5] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5B00] bg-[#FFF4D6] border border-[#F8AE07]/40 px-3.5 py-1 rounded-full">
            Fale Connosco
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#040303] tracking-tight">
            Estamos Prontos para Ajudar na Sua Próxima Viagem
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Consulte a nossa equipa para emissão de passagens, reserva de alojamento ou aconselhamento de vistos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Institutional Contact Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#040303] text-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl border border-stone-800">
              <h3 className="text-xl font-black tracking-tight border-b border-stone-800 pb-4 text-[#F8AE07]">
                Zebra Tours Moçambique
              </h3>

              <div className="space-y-4 text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F8AE07] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-stone-400 font-bold">Localização</span>
                    <span className="font-medium text-stone-200">{location}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#F8AE07] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-stone-400 font-bold">Telefone Oficial</span>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-medium hover:text-[#F8AE07] transition-colors text-stone-200">
                      {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-stone-400 font-bold">WhatsApp Direto</span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      {whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#F8AE07] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-stone-400 font-bold">Email Institucional</span>
                    <span className="font-medium text-stone-200">{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#F8AE07] shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs uppercase text-stone-400 font-bold">Horário de Atendimento</span>
                    <span className="font-medium text-stone-200">Segunda a Sexta: 08:00 - 17:00</span>
                    <span className="block text-xs text-stone-400">Sábado: 08:30 - 13:00</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-stone-800">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Conversar Agora pelo WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            <h3 className="text-xl font-black text-[#040303] mb-6">
              Envie-nos uma Mensagem
            </h3>

            {statusMessage && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm mb-6 flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="seuemail@exemplo.co.mz"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Telefone (Opcional)
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+258 84 000 0000"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Ex: Cotação de Voo para Lisboa"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Mensagem *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva aqui a sua mensagem ou questão..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-[#040303] hover:bg-[#1A2234] text-[#F8AE07] border border-[#F8AE07]/50 font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'A enviar...' : 'Enviar Mensagem'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
