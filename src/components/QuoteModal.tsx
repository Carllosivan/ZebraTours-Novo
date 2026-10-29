import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Shield,
  Plane,
  FileText,
  Copy,
} from 'lucide-react';
import { TravelPackage } from '../types/travel.ts';
import { validateQuoteRequest, buildWhatsAppLink } from '../utils/travel-logic.ts';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: TravelPackage | null;
  prefilledService?: string;
  prefilledDestination?: string;
  prefilledDates?: string;
  prefilledTravelers?: number;
  prefilledMessage?: string;
  whatsappPhone?: string;
  onSuccessSubmitted?: () => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  prefilledService,
  prefilledDestination,
  prefilledDates,
  prefilledTravelers = 1,
  prefilledMessage,
  whatsappPhone = '+258 85 104 1826',
  onSuccessSubmitted,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState('+258');
  const [serviceType, setServiceType] = useState('Pacote Turístico');
  const [destination, setDestination] = useState('');
  const [preferredDates, setPreferredDates] = useState('');
  const [travelersCount, setTravelersCount] = useState(1);
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    referenceCode?: string;
    message?: string;
  } | null>(null);

  // Sync props when opened
  useEffect(() => {
    if (isOpen) {
      setSubmissionResult(null);
      setErrors({});
      if (selectedPackage) {
        setServiceType('Pacote Turístico');
        setDestination(`${selectedPackage.title} (${selectedPackage.destination_name || 'Destino'})`);
        setPreferredDates(selectedPackage.travel_dates || '');
        setTravelersCount(2);
      } else {
        if (prefilledService) setServiceType(prefilledService);
        if (prefilledDestination) setDestination(prefilledDestination);
        if (prefilledDates) setPreferredDates(prefilledDates);
        if (prefilledTravelers) setTravelersCount(prefilledTravelers);
        if (prefilledMessage) setMessage(prefilledMessage);
      }
    }
  }, [isOpen, selectedPackage, prefilledService, prefilledDestination, prefilledDates, prefilledTravelers, prefilledMessage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateQuoteRequest({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      service_type: serviceType,
      travelers_count: travelersCount,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (!privacyAgreed) {
      setErrors({ privacy: 'É necessário consentir para podermos responder ao seu pedido.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package_id: selectedPackage ? selectedPackage.id : null,
          customer_name: customerName,
          customer_email: customerEmail || null,
          customer_phone: customerPhone,
          phone_country_code: phoneCountryCode,
          service_type: serviceType,
          destination: destination || null,
          preferred_dates: preferredDates || null,
          travelers_count: travelersCount,
          message: message || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao submeter pedido.');
      }

      setSubmissionResult({
        success: true,
        referenceCode: data.reference_code,
        message: data.message,
      });

      if (onSuccessSubmitted) {
        onSuccessSubmitted();
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Falha na ligação com o servidor.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappFastUrl = submissionResult?.referenceCode
    ? buildWhatsAppLink({
        phone: whatsappPhone,
        customerName: customerName,
        packageTitle: selectedPackage?.title,
        serviceType: serviceType,
        referenceCode: submissionResult.referenceCode,
      })
    : buildWhatsAppLink({
        phone: whatsappPhone,
        customerName: customerName,
        packageTitle: selectedPackage?.title,
        serviceType: serviceType,
      });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-quote-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#040303] to-[#1A2234] text-white p-5 sm:p-6 flex items-start justify-between border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-900 text-[#F8AE07] border border-[#F8AE07]/30 text-[11px] font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-[#F8AE07]" />
              <span>Pedido de Cotação de Viagem</span>
            </div>
            <h2 id="modal-quote-title" className="text-xl sm:text-2xl font-black">
              {selectedPackage ? selectedPackage.title : 'Solicitar Cotação Personalizada'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Preencha os seus dados para receber uma proposta oficial sem compromisso da Zebra Tours.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 shrink-0"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {submissionResult?.success ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">
                Pedido Registado com Sucesso!
              </h3>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                Código de Referência Único:
              </p>
              <div className="inline-block px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl font-mono text-lg font-black text-blue-900 tracking-wider">
                {submissionResult.referenceCode}
              </div>
            </div>

            {/* Clear Legal Disclaimer per requirement 12 */}
            <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl text-left text-xs text-slate-700 space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Shield className="w-4 h-4 text-blue-700" />
                <span>Informação Importante sobre o seu Pedido</span>
              </div>
              <p>
                O envio deste pedido <strong>não constitui uma confirmação imediata de reserva</strong> nem garante tarifas ou disponibilidade imediata junto das companhias aéreas ou unidades hoteleiras.
              </p>
              <p>
                A equipa de consultores da <strong>Zebra Tours Moçambique</strong> analisará as melhores opções disponíveis para as suas datas e entrará em contacto através do contacto fornecido.
              </p>
            </div>

            {/* Direct WhatsApp acceleration button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappFastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirmar via WhatsApp (+258 85 104 1826)</span>
              </a>

              <button
                onClick={onClose}
                className="py-3 px-6 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm transition-colors cursor-pointer"
              >
                Concluir
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errors.submit && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errors.submit}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Carlos Mateus"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                    errors.customer_name ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                  } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                {errors.customer_name && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.customer_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Telefone / WhatsApp *
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneCountryCode}
                    onChange={(e) => setPhoneCountryCode(e.target.value)}
                    className="w-24 px-2 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="+258">+258 (MZ)</option>
                    <option value="+27">+27 (ZA)</option>
                    <option value="+351">+351 (PT)</option>
                    <option value="+263">+263 (ZW)</option>
                    <option value="+86">+86 (CN)</option>
                  </select>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="84 123 4567"
                    className={`flex-1 px-3.5 py-2.5 bg-slate-50 border ${
                      errors.customer_phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                    } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600`}
                  />
                </div>
                {errors.customer_phone && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.customer_phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="exemplo@email.co.mz"
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border ${
                    errors.customer_email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-300'
                  } rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600`}
                />
                {errors.customer_email && (
                  <p className="text-[11px] text-rose-600 mt-1">{errors.customer_email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Serviço Pretendido *
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
                >
                  <option>Pacote Turístico</option>
                  <option>Passagens Aéreas</option>
                  <option>Hotéis e Alojamento</option>
                  <option>Viagens de Negócios e Corporativas</option>
                  <option>Escapadinhas e Fins de Semana</option>
                  <option>Transfers e Deslocações</option>
                  <option>Assistência ao Viajante e Vistos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Destino
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Ex: Cape Town, Lisboa, etc."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Datas Pretendidas
                </label>
                <input
                  type="text"
                  value={preferredDates}
                  onChange={(e) => setPreferredDates(e.target.value)}
                  placeholder="Ex: 31 Out a 02 Nov ou Novembro"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Viajantes *
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={travelersCount}
                  onChange={(e) => setTravelersCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mensagem ou Pedidos Especiais
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Indique preferências de horário de voo, tipo de quarto, classe ou qualquer detalhe relevante..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Privacy Checkbox */}
            <div className="space-y-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="text-xs text-slate-600 leading-normal">
                  Autorizo o processamento destes dados pela Zebra Tours Moçambique para efeitos de resposta a este pedido de cotação e contacto comercial, nos termos da Política de Privacidade.
                </span>
              </label>
              {errors.privacy && (
                <p className="text-[11px] text-rose-600">{errors.privacy}</p>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Garantia de privacidade e atendimento personalizado em Maputo.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'A processar...' : 'Submeter Pedido de Cotação'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
