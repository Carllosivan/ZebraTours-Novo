import React from 'react';
import { Target, Eye, HeartHandshake, Award, ShieldCheck, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const values = [
    { title: 'Confiança', desc: 'Relações transparentes e fiáveis em cada reserva.' },
    { title: 'Profissionalismo', desc: 'Rigor técnico na emissão de passagens e organização de roteiros.' },
    { title: 'Qualidade', desc: 'Seleção dos melhores parceiros de transporte e hotelaria.' },
    { title: 'Transparência', desc: 'Preços claros em meticais e informação objetiva.' },
    { title: 'Compromisso com o Cliente', desc: 'As suas necessidades no centro de tudo o que fazemos.' },
    { title: 'Paixão por Viajar', desc: 'Entusiasmo genuíno em conectar pessoas a novos destinos.' },
  ];

  return (
    <section id="sobre" className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8F5B00] bg-[#FFF4D6] border border-[#F8AE07]/40 px-3.5 py-1 rounded-full">
              Sobre a Zebra Tours Moçambique
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#040303] tracking-tight leading-tight">
              Mais do que Organizar Viagens, Criamos Oportunidades para Descobrir o Mundo.
            </h2>

            <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed">
              <p>
                A <strong>Zebra Tours Moçambique</strong> é uma agência dedicada à prestação de serviços de viagens e turismo, com foco em soluções práticas e personalizadas para deslocações nacionais e internacionais.
              </p>

              <p>
                Sediada em Maputo, a nossa agência nasceu da vontade de simplificar o acesso a viagens de lazer, negócios e escapadinhas, prestando uma consultoria de proximidade que acompanha o viajante em cada etapa da sua jornada.
              </p>

              <p className="p-4 bg-[#FFF9ED] border-l-4 border-[#F8AE07] rounded-r-xl text-stone-900 font-medium text-sm">
                <strong className="text-[#040303]">O Nosso Compromisso:</strong> Colocar as necessidades dos clientes no centro do trabalho, oferecendo atendimento atencioso e profissional.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-[#FAF9F5] p-8 sm:p-10 flex flex-col items-center justify-center text-center">
              <img
                src="/assets/aistudio/ZebraTours_Logo_c3eb31fa.svg"
                alt="Logótipo Oficial da Zebra Tours Moçambique"
                className="w-full max-w-sm sm:max-w-md h-64 sm:h-72 object-contain transition-transform hover:scale-105 duration-300"
              />

              <div className="mt-4 pt-4 border-t border-stone-200 w-full space-y-1">
                <div className="flex items-center justify-center gap-2 text-[#8F5B00] text-xs font-bold uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#F8AE07]" />
                  <span>Maputo, Moçambique</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-[#040303]">
                  O seu próximo destino começa aqui!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision Cards - Light editorial style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl bg-white border border-stone-200 border-t-4 border-t-[#F8AE07] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#040303] text-[#F8AE07] flex items-center justify-center font-bold shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#040303]">A Nossa Missão</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Proporcionar experiências de viagem seguras, cómodas e acessíveis, oferecendo soluções personalizadas em passagens aéreas, alojamento, pacotes turísticos e assistência ao viajante.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-stone-200 border-t-4 border-t-[#040303] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#FFF4D6] text-[#8F5B00] border border-[#F8AE07]/40 flex items-center justify-center font-bold shadow-xs">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#040303]">A Nossa Visão</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Ser uma agência de viagens de referência em Moçambique, reconhecida pela qualidade dos serviços, pela confiança dos clientes e pela capacidade de conectar pessoas a destinos nacionais e internacionais.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#040303]">
              Os Nossos Valores
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Princípios que guiam cada contacto, itinerário e consultoria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-stone-200 bg-white hover:border-[#F8AE07] hover:shadow-md shadow-xs transition-all space-y-1.5 group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F8AE07]" />
                  <h4 className="text-sm font-bold text-[#040303]">{v.title}</h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
