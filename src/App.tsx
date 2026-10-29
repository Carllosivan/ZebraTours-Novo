/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { SearchEngine } from './components/SearchEngine.tsx';
import { PackageCard } from './components/PackageCard.tsx';
import { PackageDetailModal } from './components/PackageDetailModal.tsx';
import { DestinationModal } from './components/DestinationModal.tsx';
import { QuoteModal } from './components/QuoteModal.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { InfoModal } from './components/InfoModals.tsx';
import { EditorialPageModal } from './components/EditorialPageModal.tsx';
import { TravelPackage, Destination, Category, SiteSettings, AdminUser, NavigationItem, CmsBanner, CmsPage } from './types/travel.ts';
import { filterAndSortPackages, buildWhatsAppLink } from './utils/travel-logic.ts';
import {
  Compass,
  MapPin,
  Sparkles,
  MessageCircle,
  Filter,
  ArrowUpDown,
  Search,
  CheckCircle,
  Megaphone,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [banners, setBanners] = useState<CmsBanner[]>([]);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    phone: '+258 85 104 1826',
    whatsapp: '+258 85 104 1826',
    location: 'Maputo, Moçambique',
    currency: 'MT',
    email: 'info@zebratours.co.mz',
  });

  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('inicio');

  // Package Filters State
  const [selectedDestinationFilter, setSelectedDestinationFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [packageSearchQuery, setPackageSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'duration-asc'>('recommended');

  // Modal States
  const [selectedPackage, setSelectedPackage] = useState<TravelPackage | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedPageModal, setSelectedPageModal] = useState<CmsPage | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quotePrefillData, setQuotePrefillData] = useState<any>({});
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'terms' | 'faq' | null>(null);

  // Admin Auth State
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem('zt_admin_token'));
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('zt_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Fetch application data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [destRes, pkgRes, catRes, setRes, navRes, banRes, pagRes] = await Promise.all([
        fetch('/api/destinations'),
        fetch('/api/packages'),
        fetch('/api/categories'),
        fetch('/api/settings'),
        fetch('/api/navigation'),
        fetch('/api/banners'),
        fetch('/api/pages'),
      ]);

      if (destRes.ok) setDestinations(await destRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (setRes.ok) setSettings(await setRes.json());
      if (navRes.ok) setNavItems(await navRes.json());
      if (banRes.ok) setBanners(await banRes.json());
      if (pagRes.ok) setPages(await pagRes.json());
    } catch (err) {
      console.error('[Error fetching data]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Admin Login Handler
  const handleAdminLoginSuccess = (token: string, user: AdminUser) => {
    setAdminToken(token);
    setAdminUser(user);
    localStorage.setItem('zt_admin_token', token);
    localStorage.setItem('zt_admin_user', JSON.stringify(user));
    setShowAdminDashboard(true);
  };

  // Admin Logout Handler
  const handleAdminLogout = (reason?: string) => {
    if (adminToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      }).catch(() => {});
    }
    setAdminToken(null);
    setAdminUser(null);
    localStorage.removeItem('zt_admin_token');
    localStorage.removeItem('zt_admin_user');
    setShowAdminDashboard(false);
    if (reason === 'expired') {
      setIsAdminLoginOpen(true);
    }
  };

  // Unified Admin Gateway Handler (Single click entry)
  const handleOpenAdmin = () => {
    if (adminToken) {
      setShowAdminDashboard(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Navigation scroll helper
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'voos' || sectionId === 'hoteis') {
      const searchEl = document.getElementById('motor-pesquisa');
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (
      sectionId === 'pacotes' ||
      sectionId === '#pacotes' ||
      sectionId === 'pacotes-seccao' ||
      sectionId === '#pacotes-seccao'
    ) {
      const target = document.getElementById('pacotes-seccao') || document.getElementById('pacotes');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    const cleanId = sectionId.replace('#', '');
    const target = document.getElementById(cleanId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Check if it's an editorial page slug
    const matchingPage = pages.find((p) => p.slug === cleanId || p.slug === sectionId);
    if (matchingPage) {
      setSelectedPageModal(matchingPage);
    }
  };

  // Quote opener helper
  const handleOpenQuoteModal = (service?: string, packageTitle?: string) => {
    setSelectedPackage(null);
    setQuotePrefillData({
      prefilledService: service || 'Pacote Turístico',
      prefilledDestination: packageTitle || '',
    });
    setIsQuoteModalOpen(true);
  };

  const handleOpenPackageQuote = (pkg: TravelPackage) => {
    setSelectedPackage(pkg);
    setQuotePrefillData({});
    setIsQuoteModalOpen(true);
  };

  const handleQuoteWithCriteria = (criteria: any) => {
    setSelectedPackage(null);
    setQuotePrefillData({
      prefilledService: criteria.service_type,
      prefilledDestination: criteria.destination,
      prefilledDates: criteria.preferred_dates,
      prefilledTravelers: criteria.travelers_count,
      prefilledMessage: criteria.message,
    });
    setIsQuoteModalOpen(true);
  };

  // Filter and sort packages
  const filteredPackages = filterAndSortPackages(packages as any, {
    destinationId: selectedDestinationFilter === 'all' ? undefined : selectedDestinationFilter,
    categorySlug: selectedCategoryFilter === 'all' ? undefined : selectedCategoryFilter,
    searchQuery: packageSearchQuery,
    sortBy: sortBy,
  }) as TravelPackage[];

  // Find Cape Town reference package
  const capeTownPackage = packages.find((p) => p.slug.includes('cape-town') || p.title.toLowerCase().includes('cape town'));

  // If in Admin Dashboard view
  if (showAdminDashboard && adminToken) {
    const userToUse = adminUser || {
      id: 1,
      name: 'Administrador Zebra Tours',
      email: 'admin@zebratours.co.mz',
      role: 'admin',
    };
    return (
      <AdminDashboard
        token={adminToken}
        adminUser={userToUse}
        onLogout={handleAdminLogout}
        onClose={() => setShowAdminDashboard(false)}
        onRefreshPublicData={fetchData}
      />
    );
  }

  const floatingWhatsAppUrl = buildWhatsAppLink({
    phone: settings.whatsapp || '+258 85 104 1826',
    packageTitle: 'Informação Geral',
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#0A0E17] selection:bg-[#F8AE07] selection:text-[#040303] font-sans">
      {/* 1. Header */}
      <Header
        onOpenQuoteModal={handleOpenQuoteModal}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={!!adminToken}
        onOpenAdminDashboard={() => setShowAdminDashboard(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        navItems={navItems}
      />

      {/* 2. Hero Section */}
      <Hero
        onExploreDestinations={() => handleNavigate('destinos')}
        onRequestQuote={(service, dest) => handleOpenQuoteModal(service, dest)}
        onSelectCapeTown={() => {
          if (capeTownPackage) {
            setSelectedPackage(capeTownPackage);
          } else {
            handleOpenQuoteModal('Pacote Turístico', 'Cape Town');
          }
        }}
        onSelectPackage={(pkg) => setSelectedPackage(pkg)}
        packages={packages}
        whatsapp={settings.whatsapp}
        settings={settings}
      />

      {/* Active Promotional Campaign Banner (if any) */}
      {banners.filter((b) => b.status === 'ativo').length > 0 && (
        <div className="bg-[#040303] border-y border-[#F8AE07]/40 text-white py-3 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="px-2.5 py-0.5 rounded bg-[#F8AE07] text-[#040303] font-black text-[10px] uppercase tracking-wider shrink-0">
                Campanha
              </span>
              <span className="font-semibold text-white">
                {banners.find((b) => b.status === 'ativo')?.title}
              </span>
              {banners.find((b) => b.status === 'ativo')?.subtitle && (
                <span className="text-stone-300 hidden md:inline">
                  — {banners.find((b) => b.status === 'ativo')?.subtitle}
                </span>
              )}
            </div>
            {banners.find((b) => b.status === 'ativo')?.button_text && (
              <button
                onClick={() => {
                  const b = banners.find((item) => item.status === 'ativo');
                  if (b?.button_url && b.button_url !== '#') {
                    handleNavigate(b.button_url);
                  } else {
                    handleOpenQuoteModal('Campanha Promocional', b?.title);
                  }
                }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-xs transition-colors shadow-sm"
              >
                <span>{banners.find((b) => b.status === 'ativo')?.button_text}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Reusable Travel Search Engine */}
      <div id="motor-pesquisa">
        <SearchEngine
          destinations={destinations}
          onSearchPackages={(destId) => {
            if (destId) setSelectedDestinationFilter(destId);
          }}
          onRequestQuoteWithCriteria={handleQuoteWithCriteria}
        />
      </div>

      {/* 4. Pacotes Turísticos Catalog Section */}
      <section id="pacotes-seccao" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5B00] bg-[#FFF4D6] border border-[#F8AE07]/40 px-3.5 py-1 rounded-full">
              Experiências Selecionadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#040303] tracking-tight mt-2">
              Pacotes Turísticos em Destaque
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Roteiros completos de fim de semana, lazer familiar e viagens de negócios com tarifas indicativas em Meticais (MT).
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] shadow-sm"
            >
              <option value="recommended">Destaques Recomendados</option>
              <option value="price-asc">Preço: Menor ao Maior</option>
              <option value="price-desc">Preço: Maior ao Menor</option>
              <option value="duration-asc">Duração mais curta</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-b border-stone-200 pb-4">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Destino:</span>
          </span>

          <button
            onClick={() => setSelectedDestinationFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedDestinationFilter === 'all'
                ? 'bg-[#040303] text-[#F8AE07] shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-[#FFF9ED] hover:text-[#040303]'
            }`}
          >
            Todos ({packages.length})
          </button>

          {destinations.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDestinationFilter(d.id.toString())}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedDestinationFilter === d.id.toString()
                  ? 'bg-[#040303] text-[#F8AE07] shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-[#FFF9ED] hover:text-[#040303]'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        {filteredPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPackages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onViewDetails={(p) => setSelectedPackage(p)}
                onRequestQuote={handleOpenPackageQuote}
                whatsappPhone={settings.whatsapp}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-stone-300 space-y-3">
            <Compass className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
              Nenhum pacote encontrado para o filtro selecionado
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Tente selecionar outro destino ou solicite uma cotação personalizada à medida das suas datas.
            </p>
            <button
              onClick={() => setSelectedDestinationFilter('all')}
              className="px-5 py-2.5 rounded-xl bg-[#040303] hover:bg-[#1A2234] text-[#F8AE07] text-xs font-bold"
            >
              Ver Todos os Pacotes
            </button>
          </div>
        )}
      </section>

      {/* 5. Destinos Populares Section - Light style with brand warmth */}
      <section id="destinos" className="scroll-mt-20 sm:scroll-mt-24 py-16 sm:py-20 bg-white border-y border-stone-200 text-[#0A0E17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5B00] bg-[#FFF4D6] border border-[#F8AE07]/40 px-3.5 py-1 rounded-full">
                Destinos Estratégicos
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#040303] tracking-tight mt-2">
                Conectamos Moçambique aos Melhores Destinos
              </h2>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Portfólio oficial Zebra Tours com rotas frequentes na África Austral, Europa, Ásia e as praias mais intocadas do nosso país.
              </p>
            </div>

            <button
              onClick={() => handleOpenQuoteModal('Consultoria de Destino')}
              className="px-5 py-2.5 rounded-xl bg-[#040303] hover:bg-[#1A2234] text-[#F8AE07] border border-[#F8AE07]/40 font-bold text-xs uppercase tracking-wider self-start md:self-auto cursor-pointer shadow-sm"
            >
              Consultar Outros Destinos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDestination(d)}
                className="group relative h-80 rounded-2xl overflow-hidden border border-stone-200 shadow-md cursor-pointer transition-all hover:scale-[1.02] hover:border-[#F8AE07] hover:shadow-xl"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setSelectedDestination(d);
                }}
              >
                <img
                  src={d.cover_image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040303] via-[#040303]/40 to-transparent" />

                <div className="absolute top-4 right-4 bg-[#040303]/85 backdrop-blur-sm border border-[#F8AE07]/40 text-[#F8AE07] font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-sm">
                  {d.package_count || 0} Pacotes
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <span className="text-[11px] uppercase font-bold text-[#F8AE07] tracking-wider">
                    {d.country}
                  </span>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#F8AE07] transition-colors">
                    {d.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                    {d.summary}
                  </p>
                  <span className="inline-block text-[11px] text-[#F8AE07] font-bold pt-1">
                    Ver detalhes do destino →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Institutional Services Section */}
      <ServicesSection onRequestQuote={(serviceTitle) => handleOpenQuoteModal(serviceTitle)} />

      {/* 7. Institutional Sobre Nós Section */}
      <AboutSection />

      {/* 8. Contact Section */}
      <ContactSection
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        email={settings.email}
        location={settings.location}
      />

      {/* 9. Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
        onOpenFaq={() => setInfoModalType('faq')}
        phone={settings.phone}
        whatsapp={settings.whatsapp}
        email={settings.email}
        location={settings.location}
        onOpenAdmin={handleOpenAdmin}
        isAdminLoggedIn={!!adminToken}
      />

      {/* Floating WhatsApp Quick Button */}
      <a
        href={floatingWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        aria-label="Abrir WhatsApp oficial da Zebra Tours Moçambique"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="hidden sm:inline">WhatsApp Zebra Tours</span>
        <span className="sm:hidden">+258 85 104 1826</span>
      </a>

      {/* MODALS */}
      {/* Package Detail Modal */}
      <PackageDetailModal
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onRequestQuote={handleOpenPackageQuote}
        whatsappPhone={settings.whatsapp}
      />

      {/* Destination Modal */}
      <DestinationModal
        destination={selectedDestination}
        packages={packages}
        onClose={() => setSelectedDestination(null)}
        onViewPackageDetails={(pkg) => setSelectedPackage(pkg)}
        onRequestQuote={handleOpenPackageQuote}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        selectedPackage={selectedPackage}
        prefilledService={quotePrefillData.prefilledService}
        prefilledDestination={quotePrefillData.prefilledDestination}
        prefilledDates={quotePrefillData.prefilledDates}
        prefilledTravelers={quotePrefillData.prefilledTravelers}
        prefilledMessage={quotePrefillData.prefilledMessage}
        whatsappPhone={settings.whatsapp}
        onSuccessSubmitted={fetchData}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Info Modals (Privacy, Terms, FAQ) */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Editorial Page Modal */}
      <EditorialPageModal
        page={selectedPageModal}
        onClose={() => setSelectedPageModal(null)}
        onRequestQuote={() => handleOpenQuoteModal('Consultoria', selectedPageModal?.title)}
      />
    </div>
  );
}
