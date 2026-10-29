import React, { useEffect, useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MessageCircle,
  Share2,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { TravelPackage } from '../types/travel.ts';
import { formatMZN, buildWhatsAppLink } from '../utils/travel-logic.ts';

interface PackageDetailModalProps {
  pkg: TravelPackage | null;
  onClose: () => void;
  onRequestQuote: (pkg: TravelPackage) => void;
  whatsappPhone?: string;
}

export const PackageDetailModal: React.FC<PackageDetailModalProps> = ({
  pkg,
  onClose,
  onRequestQuote,
  whatsappPhone = '+258 85 104 1826',
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pkg) return null;

  const isCapeTownOrPending = pkg.status === 'pendente_validacao';
  const priceDisplay = formatMZN(pkg.price_per_person ?? pkg.total_price, pkg.currency, pkg.price_type);

  const images = pkg.images && pkg.images.length > 0
    ? pkg.images.map((img) => img.image_url)
    : [pkg.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'];

  const whatsappUrl = buildWhatsAppLink({
    phone: whatsappPhone,
    packageTitle: pkg.title,
  });

  const includedList = pkg.included_services
    ? pkg.included_services.split(';').map((s) => s.trim()).filter(Boolean)
    : [];

  const excludedList = pkg.excluded_services
    ? pkg.excluded_services.split(';').map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-package-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Media Gallery */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full bg-slate-900 overflow-hidden">
          <img
            src={images[activeImageIndex] || images[0]}
            alt={pkg.title}
            className="w-full h-full object-cover transition-all duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Badges on Top */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="bg-blue-900/90 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{pkg.destination_name || 'Destino'}</span>
              {pkg.country && <span>• {pkg.country}</span>}
            </span>

            {isCapeTownOrPending && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
                Campanha Promocional
              </span>
            )}
          </div>

          {/* Bottom Title Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 id="modal-package-title" className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow">
              {pkg.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{pkg.duration_nights} noites / {pkg.duration_days} dias</span>
              </span>
              {pkg.travel_dates && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>{pkg.travel_dates}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail gallery if multiple images */}
        {images.length > 1 && (
          <div className="flex items-center gap-2 px-6 py-2 bg-slate-900 overflow-x-auto scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-12 w-20 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Price and Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100">
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 block tracking-wider">
                Preço Indicativo
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-950">
                  {priceDisplay}
                </span>
                {pkg.price_type !== 'sob_consulta' && (
                  <span className="text-xs sm:text-sm text-slate-600 font-medium">por pessoa</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+258 85 104 1826)</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onRequestQuote(pkg);
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
              >
                Solicitar Reserva / Cotação
              </button>
            </div>
          </div>

          {/* Validation Notice for Cape Town or Pending */}
          {isCapeTownOrPending && (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 text-xs sm:text-sm space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Nota Operacional sobre Esta Oferta Promocional</span>
              </div>
              <p>
                Este pacote reproduz as condições anunciadas no cartaz promocional oficial (Cape Town 31 Out - 02 Nov, 59.500 MT/pessoa com passagem aérea, 2 noites de hotel e assistência). As datas de calendário e disponibilidade de voos estão sujeitas a confirmação imediata pela equipa da Zebra Tours no momento do pedido.
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Descrição da Viagem
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {pkg.description || pkg.summary}
            </p>
          </div>

          {/* Day-by-Day Itinerary */}
          {pkg.itineraries && pkg.itineraries.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Itinerário Programado
              </h3>
              <div className="space-y-3 border-l-2 border-amber-400 pl-4 ml-1">
                {pkg.itineraries.map((it) => (
                  <div key={it.id} className="relative">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Dia {it.day_number}: {it.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {it.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included / Excluded services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {includedList.length > 0 && (
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>O que está Incluído</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  {includedList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {excludedList.length > 0 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  <span>O que não está Incluído</span>
                </h4>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  {excludedList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Conditions and Validity */}
          {pkg.conditions && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs text-slate-600">
              <span className="font-bold text-slate-800 uppercase text-[11px] block">
                Condições e Observações
              </span>
              <p className="leading-relaxed">{pkg.conditions}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zebra Tours Moçambique • Apoio e assistência 24/7 ao viajante</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
