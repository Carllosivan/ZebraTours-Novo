import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.tsx';
import { Phone, MessageCircle, MapPin, Menu, X, Shield, Clock, ChevronRight } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/travel-logic.ts';
import { NavigationItem } from '../types/travel.ts';

interface HeaderProps {
  onOpenQuoteModal: (service?: string, packageTitle?: string) => void;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminDashboard: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  phone?: string;
  whatsapp?: string;
  navItems?: NavigationItem[];
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuoteModal,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminDashboard,
  activeSection,
  onNavigate,
  phone = '+258 85 104 1826',
  whatsapp = '+258 85 104 1826',
  navItems = [],
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const defaultLinks = [
    { id: 'inicio', label: 'Início' },
    { id: 'pacotes', label: 'Pacotes' },
    { id: 'destinos', label: 'Destinos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'sobre', label: 'Sobre Nós' },
    { id: 'contactos', label: 'Contactos' },
  ];

  // If CMS navigation items available, use active header items
  const activeNavLinks = navItems.length > 0
    ? navItems
        .filter((n) => n.is_active && (n.location === 'header' || n.location === 'both'))
        .map((n) => ({ id: n.url, label: n.label }))
    : defaultLinks;

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const whatsappUrl = buildWhatsAppLink({ phone: whatsapp });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Bar - Elegância Editorial Zebra Tours (#040303 Onyx + #F8AE07 Sunburst Gold) */}
      <div className="bg-[#040303] text-stone-300 text-[11px] tracking-wide py-2 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center flex-wrap gap-5 sm:gap-7">
            <span className="flex items-center gap-1.5 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-[#F8AE07] shrink-0" />
              <span>Maputo, Moçambique</span>
            </span>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-stone-200 hover:text-[#F8AE07] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F8AE07] shrink-0" />
              <span>{phone}</span>
            </a>

            <span className="hidden md:flex items-center gap-1.5 text-stone-400">
              <Clock className="w-3 h-3 text-stone-400 shrink-0" />
              <span>Atendimento personalizado</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[#F8AE07] font-bold tracking-wider uppercase text-[10px]">
              Metical Moçambicano (MT)
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('inicio')}
            className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F8AE07] rounded p-0.5"
            aria-label="Zebra Tours Moçambique"
          >
            <BrandLogo showSlogan={true} />
          </button>

          {/* Minimalist Editorial Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] font-medium text-stone-700">
            {activeNavLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-1.5 rounded transition-all relative ${
                    isActive
                      ? 'text-[#040303] font-bold'
                      : 'text-stone-600 hover:text-[#040303] hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#F8AE07]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-medium text-xs border border-emerald-200/90 transition-colors"
              title="Falar com Consultor no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => onOpenQuoteModal()}
              className="px-5 py-2 rounded-lg bg-[#040303] hover:bg-[#1A2234] text-[#F8AE07] hover:text-[#FFC44D] border border-[#F8AE07]/50 font-bold text-xs tracking-wider uppercase transition-all shadow-sm"
            >
              Planear Viagem
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenQuoteModal()}
              className="sm:hidden px-3 py-1.5 rounded bg-[#040303] text-[#F8AE07] font-bold text-xs uppercase border border-[#F8AE07]/40"
            >
              Planear
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-stone-800 hover:bg-stone-100"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-stone-200 pb-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-1 mb-4">
              {activeNavLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left px-3 py-2 rounded text-xs font-medium ${
                    activeSection === link.id
                      ? 'bg-[#FFF9ED] text-[#040303] font-bold border-l-2 border-[#F8AE07]'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-stone-200">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp (+258 85 104 1826)</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="w-full py-2.5 rounded bg-[#040303] text-[#F8AE07] font-bold text-xs uppercase tracking-wider border border-[#F8AE07]/50"
              >
                Planear a Minha Viagem
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
