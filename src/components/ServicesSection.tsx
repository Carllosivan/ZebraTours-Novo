import React from 'react';
import {
  Plane,
  Building2,
  Luggage,
  Briefcase,
  Headphones,
  FileCheck2,
  ArrowRight,
} from 'lucide-react';

interface ServicesSectionProps {
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onRequestQuote }) => {
  const services = [
    {
      id: 'passagens-aereas',
      title: 'Reserva de Passagens Aéreas',
      description:
        'Emissão e cotação de bilhetes aéreos de ida e volta nacionais e internacionais, com as principais companhias que operam a partir de Moçambique.',
      icon: Plane,
    },
    {
      id: 'hoteis-alojamento',
      title: 'Reservas de Hotéis e Alojamento',
      description:
        'Seleção cuidadosa de unidades hoteleiras, resorts de praia e estadias executivas com garantias de conforto, segurança e localização estratégica.',
      icon: Building2,
    },
    {
      id: 'pacotes-turisticos',
      title: 'Pacotes Turísticos Completos',
      description:
        'Criação e divulgação de pacotes completos integrando voo, hotel, transfers e excursões para destinos regionais e mundiais de sonho.',
      icon: Luggage,
    },
    {
      id: 'lazer-negocios',
      title: 'Viagens de Lazer e Negócios',
      description:
        'Soluções sob medida para deslocações individuais, férias familiares ou viagens corporativas, missões empresariais e participação em feiras.',
      icon: Briefcase,
    },
    {
      id: 'assistencia',
      title: 'Assistência ao Viajante 24/7',
      description:
        'Acompanhamento e suporte atencioso antes, durante e após a deslocação, garantindo tranquilidade em caso de imprevistos ou alterações de voo.',
      icon: Headphones,
    },
    {
      id: 'vistos-requisitos',
      title: 'Informação e Orientação sobre Vistos',
      description:
        'Orientação consultiva atualizada sobre procedimentos de entrada, documentação exigida, vacinas e requisitos alfandegários para o seu destino.',
      icon: FileCheck2,
    },
  ];

  return (
    <section id="servicos" className="py-16 sm:py-20 bg-[#FAF9F5] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5B00] bg-[#FFF4D6] border border-[#F8AE07]/40 px-3.5 py-1 rounded-full">
            Serviços Especializados
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#040303] tracking-tight">
            Soluções Completas para a Sua Viagem
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Mais do que organizar viagens, criamos oportunidades para descobrir o mundo com conforto, rigor e total segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-lg hover:border-[#F8AE07] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#040303] text-[#F8AE07] border border-[#F8AE07]/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-bold text-[#040303] transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">
                    Sujeito a termos e condições
                  </span>

                  <button
                    onClick={() => onRequestQuote(s.title)}
                    className="text-xs font-bold text-[#040303] hover:text-[#B87A00] flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Pedir Cotação</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F8AE07]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational transparent notice */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-stone-200 text-center text-xs text-stone-500 max-w-2xl mx-auto shadow-xs">
          A disponibilidade e os preços finais de voos, alojamento e serviços turísticos dependem das companhias operadoras e tarifas em vigor no momento da confirmação.
        </div>
      </div>
    </section>
  );
};
