import React, { useEffect } from 'react';
import { X, ShieldCheck, HelpCircle, FileText } from 'lucide-react';

interface InfoModalProps {
  type: 'privacy' | 'terms' | 'faq' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [type, onClose]);

  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#0B1E36] text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {type === 'privacy' && <ShieldCheck className="w-6 h-6 text-amber-400" />}
            {type === 'terms' && <FileText className="w-6 h-6 text-amber-400" />}
            {type === 'faq' && <HelpCircle className="w-6 h-6 text-amber-400" />}
            <div>
              <h2 className="text-xl font-black">
                {type === 'privacy' && 'Política de Privacidade'}
                {type === 'terms' && 'Termos e Condições'}
                {type === 'faq' && 'Perguntas Frequentes (FAQ)'}
              </h2>
              <span className="text-xs text-slate-300">Zebra Tours Moçambique</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 overflow-y-auto text-sm text-slate-700 leading-relaxed">
          {type === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                1. Compromisso com a Privacidade
              </h3>
              <p>
                A <strong>Zebra Tours Moçambique</strong> valoriza a confiança e a privacidade dos seus clientes e utilizadores. Esta política explica de que forma recolhemos, utilizamos e salvaguardamos os seus dados pessoais quando solicita cotações ou interage com a nossa agência.
              </p>
              <h3 className="text-base font-bold text-slate-900">
                2. Dados Recolhidos
              </h3>
              <p>
                Recolhemos apenas os dados estritamente necessários para o tratamento de pedidos de cotação e prestação de serviços turísticos: nome completo, contacto telefónico/WhatsApp, endereço de email (opcional), destino pretendido, datas de viagem e número de passageiros. Não recolhemos dados de cartões bancários nesta plataforma.
              </p>
              <h3 className="text-base font-bold text-slate-900">
                3. Finalidade do Tratamento
              </h3>
              <p>
                Os dados são utilizados exclusivamente para responder aos pedidos de cotação, prestar esclarecimentos, elaborar itinerários personalizados e prestar assistência durante a deslocação.
              </p>
            </div>
          )}

          {type === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                1. Condições Gerais e Pedidos de Cotação
              </h3>
              <p>
                A submissão de formulários de contacto ou de pedidos de cotação através deste website constitui uma manifestação de interesse e <strong>não representa uma reserva automática ou confirmada</strong>.
              </p>
              <h3 className="text-base font-bold text-slate-900">
                2. Preços e Tarifas em Meticais (MT)
              </h3>
              <p>
                Os preços apresentados para pacotes e destinos possuem carácter indicativo e baseiam-se em ocupação dupla em classe económica, sujeitos a disponibilidade e alteração cambial ou de taxas aeroportuárias pelos fornecedores no momento da confirmação.
              </p>
              <h3 className="text-base font-bold text-slate-900">
                3. Responsabilidade e Documentação de Viagem
              </h3>
              <p>
                É da responsabilidade exclusiva do viajante assegurar que possui passaporte com validade mínima de 6 meses, vistos de entrada exigidos pelo país de destino e eventuais certificados sanitários aplicáveis. A Zebra Tours presta apoio informativo e consultivo sem garantir aprovações de autoridades consulares.
              </p>
            </div>
          )}

          {type === 'faq' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Como posso solicitar uma cotação para um voo ou pacote?
                </h4>
                <p className="text-xs text-slate-600">
                  Pode utilizar o formulário "Solicitar Cotação" no topo do website, utilizar o motor de pesquisa indicando origem, destino e datas, ou contactar-nos diretamente pelo WhatsApp (+258 85 104 1826).
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Os valores anunciados são fixos ou podem variar?
                </h4>
                <p className="text-xs text-slate-600">
                  Os valores indicados correspondem a tarifas de referência em Meticais (MT). As tarifas definitivas são calculadas com base nas datas exatas, classe de voo e disponibilidade hoteleira real.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">
                  Qual é o horário e localização da Zebra Tours?
                </h4>
                <p className="text-xs text-slate-600">
                  A nossa agência está sediada em Maputo, Moçambique. Atendemos de Segunda a Sexta das 08:00 às 17:00 e aos Sábados das 08:30 às 13:00, mantendo linha de assistência no WhatsApp para viajantes com reservas ativas.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wide cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
