import React from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { MapPin, Phone, Mail, MessageCircle, Shield, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenFaq: () => void;
  phone?: string;
  whatsapp?: string;
  email?: string;
  location?: string;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenFaq,
  phone = '+258 85 104 1826',
  whatsapp = '+258 85 104 1826',
  email = 'info@zebratours.co.mz',
  location = 'Maputo, Moçambique',
  onOpenAdmin,
  isAdminLoggedIn = false,
}) => {
  const currentYear = new Date().getFullYear();

  const handleClickAdmin = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenAdmin();
  };

  return (
    <footer className="bg-[#040303] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <div className="bg-white/95 rounded-xl p-3 inline-block shadow-sm">
              <BrandLogo showSlogan={false} />
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-sm text-left">
              Agência e Consultoria de Viagens em Moçambique. Especialistas na emissão de passagens aéreas, reservas hoteleiras, pacotes turísticos completos e apoio integral ao viajante.
            </p>

            <div className="pt-2 text-left">
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-stone-300 hover:text-[#F8AE07] font-medium text-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {whatsapp}</span>
              </a>
            </div>
          </div>

          {/* Destinos */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs uppercase font-extrabold text-[#F8AE07] tracking-wider text-left">
              Destinos em Foco
            </h4>
            <ul className="text-xs space-y-2 text-stone-400 text-left">
              <li>
                <button onClick={() => onNavigate('destinos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  África do Sul (Cape Town)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Portugal (Lisboa & Sintra)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Zimbabwe (Harare)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  China (Pequim & Guangzhou)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('destinos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Moçambique (Bazaruto & Gorongosa)
                </button>
              </li>
            </ul>
          </div>

          {/* Serviços */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs uppercase font-extrabold text-[#F8AE07] tracking-wider text-left">
              Serviços
            </h4>
            <ul className="text-xs space-y-2 text-stone-400 text-left">
              <li>
                <button onClick={() => onNavigate('voos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Passagens Aéreas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hoteis')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Hotéis e Alojamento
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pacotes')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Pacotes Turísticos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('servicos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Viagens Corporativas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('servicos')} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                  Assistência ao Viajante
                </button>
              </li>
            </ul>
          </div>

          {/* Institucional & Contactos */}
          <div className="space-y-3 text-left">
            <h4 className="text-xs uppercase font-extrabold text-[#F8AE07] tracking-wider text-left">
              Institucional
            </h4>
            <div className="space-y-2 text-xs text-stone-400 text-left">
              <div className="flex items-start gap-2 text-left">
                <MapPin className="w-3.5 h-3.5 text-[#F8AE07] shrink-0 mt-0.5" />
                <span className="text-left">{location}</span>
              </div>
              <div className="flex items-center gap-2 text-left">
                <Phone className="w-3.5 h-3.5 text-[#F8AE07] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white text-left">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-left">
                <Mail className="w-3.5 h-3.5 text-[#F8AE07] shrink-0" />
                <div className="flex flex-col text-left">
                  <a href={`mailto:${email}`} className="hover:text-white text-left">{email}</a>
                  <a href="mailto:reservas@ztours.co.mz" className="hover:text-white text-left text-[11px] text-[#F8AE07]">reservas@ztours.co.mz</a>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-1.5 text-xs text-stone-400 text-left">
              <button onClick={onOpenFaq} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                Perguntas Frequentes (FAQ)
              </button>
              <button onClick={onOpenPrivacy} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                Política de Privacidade
              </button>
              <button onClick={onOpenTerms} className="text-left block w-full hover:text-white transition-colors cursor-pointer">
                Termos e Condições
              </button>
              {isAdminLoggedIn ? (
                <button
                  type="button"
                  onClick={handleClickAdmin}
                  className="text-left w-full text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5 pt-1 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Centro de Gestão (BackOffice)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleClickAdmin}
                  className="text-left w-full hover:text-[#F8AE07] transition-colors cursor-pointer flex items-center gap-1.5 pt-1"
                >
                  <Shield className="w-3.5 h-3.5 text-[#F8AE07]" />
                  <span>Área de Gestão</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <p className="text-left">
            © {currentYear} Zebra Tours Moçambique. Todos os direitos reservados.
          </p>

          {/* Botão de Gestão (Acesso direto com 1 clique) */}
          <div className="flex items-center">
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={handleClickAdmin}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold px-3 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 transition-colors cursor-pointer text-xs"
                title="Aceder ao Centro de Gestão (BackOffice)"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Centro de Gestão</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleClickAdmin}
                className="flex items-center gap-1.5 text-stone-300 hover:text-[#F8AE07] transition-colors text-xs cursor-pointer py-1.5 px-3 rounded bg-stone-900 hover:bg-stone-800 border border-stone-800"
                title="Acesso de Consultores e Gestão"
              >
                <Shield className="w-3.5 h-3.5 text-[#F8AE07]" />
                <span>Área de Gestão</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 text-left sm:text-right">
            <span>Slogan oficial:</span>
            <span className="text-[#F8AE07] font-semibold italic">
              "O seu próximo destino começa aqui!"
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
