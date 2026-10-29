import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, MessageCircle, AlertCircle } from 'lucide-react';
import { TravelPackage } from '../types/travel.ts';
import { formatMZN, buildWhatsAppLink } from '../utils/travel-logic.ts';

interface PackageCardProps {
  pkg: TravelPackage;
  onViewDetails: (pkg: TravelPackage) => void;
  onRequestQuote: (pkg: TravelPackage) => void;
  whatsappPhone?: string;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  onViewDetails,
  onRequestQuote,
  whatsappPhone = '+258 85 104 1826',
}) => {
  const isPendingValidation = pkg.status === 'pendente_validacao';
  const priceDisplay = formatMZN(pkg.price_per_person ?? pkg.total_price, pkg.currency, pkg.price_type);

  const whatsappUrl = buildWhatsAppLink({
    phone: whatsappPhone,
    packageTitle: pkg.title,
  });

  return (
    <div className="flex flex-col bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-xl hover:border-[#F8AE07] transition-all duration-300 overflow-hidden group">
      {/* Cover Image Container */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-stone-900">
        <img
          src={pkg.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#040303]/90 via-[#040303]/25 to-transparent" />

        {/* Featured Badge */}
        {pkg.is_featured ? (
          <div className="absolute top-3 left-3 bg-[#F8AE07] text-[#040303] font-black text-[10px] px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
            Destaque
          </div>
        ) : null}

        {/* Validation Status for Cape Town reference poster */}
        {isPendingValidation && (
          <div className="absolute top-3 right-3 bg-[#040303]/90 border border-[#F8AE07]/50 text-[#F8AE07] font-semibold text-[10px] px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-1 shadow-sm">
            <AlertCircle className="w-3 h-3 text-[#F8AE07]" />
            <span>Oferta Especial</span>
          </div>
        )}

        {/* Destination & Duration in Image Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-stone-200">
            <MapPin className="w-3.5 h-3.5 text-[#F8AE07]" />
            <span>{pkg.destination_name || 'Destino Internacional'}</span>
            {pkg.country && <span className="text-stone-300 font-normal">({pkg.country})</span>}
          </span>

          <span className="flex items-center gap-1 bg-[#040303]/80 border border-stone-700/80 px-2 py-0.5 rounded text-[10px] text-stone-200">
            <Clock className="w-3 h-3 text-[#F8AE07]" />
            <span>{pkg.duration_nights}N / {pkg.duration_days}D</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3 justify-between">
        <div className="space-y-2">
          <h3 className="text-lg font-bold font-editorial text-stone-900 group-hover:text-[#040303] transition-colors leading-snug line-clamp-2">
            {pkg.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {pkg.summary}
          </p>

          {/* Dates preview if available */}
          {pkg.travel_dates && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{pkg.travel_dates}</span>
            </div>
          )}

          {/* Special notice for Cape Town or validation pending */}
          {isPendingValidation && (
            <p className="text-[10px] text-amber-950 bg-[#FFF9ED] border border-[#F8AE07]/30 p-2 rounded leading-tight">
              Tarifa promocional do cartaz. Validação de lugares e datas operacionais no pedido de cotação.
            </p>
          )}
        </div>

        {/* Price & Actions Box */}
        <div className="pt-3.5 mt-auto border-t border-stone-200 space-y-2.5">
          {/* Linha 1: Preço em linha única */}
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            {pkg.price_type === 'sob_consulta' ? (
              <span className="text-base sm:text-lg font-bold text-stone-800">
                Sob Consulta
              </span>
            ) : (
              <>
                <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                  {pkg.price_type === 'fixo' ? '' : 'Desde'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#040303] tracking-tight">
                  {priceDisplay}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  / pessoa
                </span>
              </>
            )}
          </div>

          {/* Linha 2: Componentes na linha de baixo */}
          <div className="flex items-center gap-2 w-full">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-200 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer text-xs font-semibold shrink-0"
              title="Informação via WhatsApp"
              aria-label={`WhatsApp para ${pkg.title}`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            <button
              onClick={() => onViewDetails(pkg)}
              className="flex-1 px-4 py-2 rounded-lg bg-[#040303] hover:bg-[#1A2234] text-[#F8AE07] hover:text-[#FFC44D] border border-[#F8AE07]/40 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow cursor-pointer"
            >
              <span>Ver Detalhes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
