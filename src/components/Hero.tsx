import React from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/travel-logic.ts';
import { SiteSettings, TravelPackage } from '../types/travel.ts';

interface HeroProps {
  onExploreDestinations: () => void;
  onRequestQuote: (prefilledService?: string, prefilledDestination?: string) => void;
  onSelectCapeTown?: () => void;
  onSelectPackage?: (pkg: TravelPackage) => void;
  packages?: TravelPackage[];
  whatsapp?: string;
  settings?: SiteSettings;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreDestinations,
  onRequestQuote,
  whatsapp = '+258 85 104 1826',
  settings = {},
}) => {
  const whatsappUrl = buildWhatsAppLink({ phone: whatsapp, packageTitle: 'Informações de Viagem Premium' });

  const heroTitle = settings.hero_title || 'O mundo espera por si.';
  const heroSubtitle = settings.hero_subtitle || 'Descubra novos destinos com experiências de viagem pensadas à sua medida.';
  const ctaPrimary = settings.hero_cta_primary || 'Explorar Destinos';
  const ctaSecondary = settings.hero_cta_secondary || 'Planear a Minha Viagem';
  const bgImage = settings.hero_bg_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80';

  return (
    <div className="relative bg-[#071629] text-white overflow-hidden border-b border-stone-800">
      {/* Panorâmica fotográfica editorial com tratamento subtil */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Paisagem de Viagem Panorâmica"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071629] via-[#071629]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071629] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl lg:max-w-4xl space-y-7 text-left">
          {/* Tagline com identidade autêntica */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B2545]/80 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-semibold tracking-widest uppercase">
            <span>Zebra Tours Moçambique</span>
            <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />
            <span>Agência & Consultoria de Viagens</span>
          </div>

          {/* Título Principal Editorial */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal font-editorial tracking-tight text-white leading-[1.08] max-w-3xl">
            {heroTitle}
          </h1>

          {/* Subtítulo Refinado */}
          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-2xl">
            {heroSubtitle}
          </p>

          {/* Slogan Oficial dos Cartazes da Agência */}
          <div className="flex items-center gap-3 border-l-2 border-[#D4AF37] pl-3.5 py-0.5">
            <span className="text-sm font-editorial italic text-[#D4AF37] tracking-wide">
              "O seu próximo destino começa aqui!"
            </span>
          </div>

          {/* CTAs Primárias com Hierarquia Clara */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onExploreDestinations}
              className="px-7 py-3.5 rounded-lg bg-[#D4AF37] hover:bg-[#C59B27] text-[#071629] font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              {ctaPrimary}
            </button>

            <button
              onClick={() => onRequestQuote()}
              className="px-7 py-3.5 rounded-lg bg-transparent hover:bg-white/10 text-white font-medium text-xs tracking-wider border border-stone-500/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{ctaSecondary}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center gap-2"
              title="Conversar por WhatsApp (+258 85 104 1826)"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>WhatsApp Oficial</span>
            </a>
          </div>

          {/* Pilares da Agência */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-stone-800/80 text-stone-300 text-left max-w-2xl">
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                Personalização
              </span>
              <span className="text-[12px] text-stone-400">Roteiros sob medida</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                Acompanhamento
              </span>
              <span className="text-[12px] text-stone-400">Apoio e assistência</span>
            </div>
            <div>
              <span className="block text-xs uppercase tracking-wider font-semibold text-[#D4AF37]">
                Transparência
              </span>
              <span className="text-[12px] text-stone-400">Valores em Meticais</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
