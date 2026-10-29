import React, { useState } from 'react';
import {
  Plane,
  Building2,
  Luggage,
  Map,
  Car,
  Compass,
  Bus,
  Search,
  Calendar,
  Users,
  AlertCircle,
  ArrowRightLeft,
} from 'lucide-react';
import { validateTravelDates } from '../utils/travel-logic.ts';
import { Destination } from '../types/travel.ts';

interface SearchEngineProps {
  destinations: Destination[];
  onSearchPackages: (destinationId?: string, query?: string) => void;
  onRequestQuoteWithCriteria: (criteria: any) => void;
}

type TabType = 'voos' | 'alojamento' | 'pacotes' | 'multidestino' | 'transfers' | 'actividades' | 'viaturas';

export const SearchEngine: React.FC<SearchEngineProps> = ({
  destinations,
  onSearchPackages,
  onRequestQuoteWithCriteria,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('pacotes');

  // Flight fields
  const [tripType, setTripType] = useState<'round' | 'oneWay'>('round');
  const [origin, setOrigin] = useState('Maputo (MPM)');
  const [flightDestination, setFlightDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flightClass, setFlightClass] = useState('Económica');
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  // Accommodation fields
  const [hotelDestination, setHotelDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [hotelGuests, setHotelGuests] = useState(2);

  // Package fields
  const [packageDestinationId, setPackageDestinationId] = useState('all');
  const [packageDate, setPackageDate] = useState('');
  const [packageTravelers, setPackageTravelers] = useState(2);

  // Transfer fields
  const [transferOrigin, setTransferOrigin] = useState('Aeroporto Internacional de Maputo');
  const [transferDest, setTransferDest] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [transferTime, setTransferTime] = useState('12:00');

  // Validation error state
  const [formError, setFormError] = useState<string | null>(null);

  const tabs = [
    { id: 'pacotes', label: 'Pacotes Turísticos', icon: Luggage },
    { id: 'voos', label: 'Passagens Aéreas', icon: Plane },
    { id: 'alojamento', label: 'Hotéis e Alojamento', icon: Building2 },
    { id: 'multidestino', label: 'Multidestino', icon: Map },
    { id: 'transfers', label: 'Transfers', icon: Bus },
    { id: 'actividades', label: 'Actividades & Tours', icon: Compass },
    { id: 'viaturas', label: 'Aluguer de Viaturas', icon: Car },
  ];

  const handlePackageSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    onSearchPackages(packageDestinationId === 'all' ? undefined : packageDestinationId);
    
    // Smooth scroll to packages catalog
    const el = document.getElementById('pacotes-seccao');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFlightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!flightDestination.trim()) {
      setFormError('Por favor indique o destino do voo.');
      return;
    }

    if (tripType === 'round') {
      const validation = validateTravelDates(departureDate, returnDate);
      if (!validation.valid) {
        setFormError(validation.error || 'Datas de voo inválidas.');
        return;
      }
    } else {
      if (!departureDate) {
        setFormError('Indique a data de partida.');
        return;
      }
    }

    onRequestQuoteWithCriteria({
      service_type: 'Passagens Aéreas',
      destination: flightDestination,
      preferred_dates: tripType === 'round' ? `${departureDate} até ${returnDate}` : `Partida em ${departureDate}`,
      travelers_count: adults + childrenCount,
      message: `Cotação de Voo (${tripType === 'round' ? 'Ida e Volta' : 'Só Ida'}). Origem: ${origin}. Classe: ${flightClass}. Passageiros: ${adults} adultos, ${childrenCount} crianças.`,
    });
  };

  const handleHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!hotelDestination.trim()) {
      setFormError('Indique a cidade ou destino do alojamento.');
      return;
    }

    const validation = validateTravelDates(checkIn, checkOut);
    if (!validation.valid) {
      setFormError(validation.error || 'A data de check-out deve ser posterior ao check-in.');
      return;
    }

    onRequestQuoteWithCriteria({
      service_type: 'Hotéis e Alojamento',
      destination: hotelDestination,
      preferred_dates: `${checkIn} até ${checkOut}`,
      travelers_count: hotelGuests,
      message: `Cotação de Alojamento. Quartos: ${rooms}. Hóspedes: ${hotelGuests}.`,
    });
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!transferDest.trim()) {
      setFormError('Indique o destino ou hotel do transfer.');
      return;
    }

    onRequestQuoteWithCriteria({
      service_type: 'Transfers e Deslocações',
      destination: transferDest,
      preferred_dates: `${transferDate} às ${transferTime}`,
      travelers_count: adults,
      message: `Transfer de: ${transferOrigin} para: ${transferDest}. Data e Hora: ${transferDate} ${transferTime}. Passageiros: ${adults}.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-30">
      <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto bg-stone-50 border-b border-stone-200 p-1.5 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setFormError(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#040303] text-[#F8AE07] shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F8AE07]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Error message banner */}
        {formError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Tab Forms */}
        <div className="p-5 sm:p-7">
          {/* TAB 1: PACOTES TURÍSTICOS */}
          {activeTab === 'pacotes' && (
            <form onSubmit={handlePackageSearchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Destino Pretendido
                  </label>
                  <select
                    value={packageDestinationId}
                    onChange={(e) => setPackageDestinationId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  >
                    <option value="all">Todos os Destinos</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Mês / Período
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={packageDate}
                      onChange={(e) => setPackageDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Viajantes
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={packageTravelers}
                      onChange={(e) => setPackageTravelers(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-stone-500">
                  Preços transparentes com cotação oficial em Meticais (MT) e assistência ao viajante.
                </p>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#F8AE07]/20 cursor-pointer transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Pesquisar Pacotes</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PASSAGENS AÉREAS */}
          {activeTab === 'voos' && (
            <form onSubmit={handleFlightSubmit} className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'round'}
                    onChange={() => setTripType('round')}
                    className="accent-[#F8AE07]"
                  />
                  <span>Ida e Volta</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="tripType"
                    checked={tripType === 'oneWay'}
                    onChange={() => setTripType('oneWay')}
                    className="accent-[#F8AE07]"
                  />
                  <span>Só Ida</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Origem
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ex: Maputo (MPM)"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Destino
                  </label>
                  <input
                    type="text"
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    placeholder="Ex: Cape Town, Lisboa, Joanesburgo, Harare"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Data Partida
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                {tripType === 'round' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Data Regresso
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Classe
                    </label>
                    <select
                      value={flightClass}
                      onChange={(e) => setFlightClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                    >
                      <option>Económica</option>
                      <option>Executiva / Business</option>
                      <option>Primeira Classe</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-stone-500">
                  Nota: As tarifas e disponibilidades de voos são confirmadas com companhias aéreas parceiras.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-sm tracking-wide shadow-md shadow-[#F8AE07]/20 cursor-pointer transition-all"
                >
                  Solicitar Cotação de Voos
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: ALOJAMENTO */}
          {activeTab === 'alojamento' && (
            <form onSubmit={handleHotelSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Destino ou Hotel
                  </label>
                  <input
                    type="text"
                    value={hotelDestination}
                    onChange={(e) => setHotelDestination(e.target.value)}
                    placeholder="Cidade, região ou resort"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Hóspedes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={hotelGuests}
                    onChange={(e) => setHotelGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F8AE07] focus:border-[#F8AE07]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-stone-500">
                  Seleção de hotéis executivos, resorts de praia e estadias familiares com pequeno-almoço incluído.
                </span>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-sm tracking-wide shadow-md shadow-[#F8AE07]/20 cursor-pointer transition-all"
                >
                  Solicitar Cotação de Hotel
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: MULTIDESTINO, TRANSFERS, ACTIVIDADES, VIATURAS */}
          {['multidestino', 'transfers', 'actividades', 'viaturas'].includes(activeTab) && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FFF9ED] border border-[#F8AE07]/30 rounded-xl text-stone-800 text-xs sm:text-sm">
                <p className="font-bold text-[#8F5B00] mb-1">
                  Serviço Personalizado Zebra Tours: {tabs.find((t) => t.id === activeTab)?.label}
                </p>
                <p className="text-stone-600">
                  Organizamos itinerários completos com transfers aeroportuários, aluguer de viaturas com ou sem motorista, excursões privadas e circuitos combinados.
                </p>
              </div>

              {activeTab === 'transfers' && (
                <form onSubmit={handleTransferSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Ponto de Partida</label>
                    <input
                      type="text"
                      value={transferOrigin}
                      onChange={(e) => setTransferOrigin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F8AE07]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Ponto de Destino / Hotel</label>
                    <input
                      type="text"
                      value={transferDest}
                      onChange={(e) => setTransferDest(e.target.value)}
                      placeholder="Ex: Hotel Polana, Ponta do Ouro, etc."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F8AE07]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Data e Hora</label>
                    <input
                      type="date"
                      value={transferDate}
                      onChange={(e) => setTransferDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-[#F8AE07]"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-sm cursor-pointer shadow-md shadow-[#F8AE07]/20 transition-all"
                    >
                      Solicitar Cotação de Transfer
                    </button>
                  </div>
                </form>
              )}

              {activeTab !== 'transfers' && (
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      onRequestQuoteWithCriteria({
                        service_type: tabs.find((t) => t.id === activeTab)?.label,
                      })
                    }
                    className="px-6 py-2.5 rounded-xl bg-[#F8AE07] hover:bg-[#E29E06] text-[#040303] font-bold text-sm cursor-pointer shadow-md shadow-[#F8AE07]/20 transition-all"
                  >
                    Pedir Cotação de {tabs.find((t) => t.id === activeTab)?.label}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
