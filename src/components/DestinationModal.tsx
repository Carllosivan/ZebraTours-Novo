import React, { useEffect } from 'react';
import { X, MapPin, Compass, ArrowRight } from 'lucide-react';
import { Destination, TravelPackage } from '../types/travel.ts';
import { PackageCard } from './PackageCard.tsx';

interface DestinationModalProps {
  destination: Destination | null;
  packages: TravelPackage[];
  onClose: () => void;
  onViewPackageDetails: (pkg: TravelPackage) => void;
  onRequestQuote: (pkg: TravelPackage) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  packages,
  onClose,
  onViewPackageDetails,
  onRequestQuote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!destination) return null;

  const relatedPackages = packages.filter(
    (p) => p.primary_destination_id === destination.id
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-destination-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image of destination */}
        <div className="relative h-60 sm:h-72 w-full shrink-0">
          <img
            src={destination.cover_image}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
              {destination.country}
            </span>
            <h2 id="modal-destination-title" className="text-2xl sm:text-3xl font-black">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Destination Content & Related Packages */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Sobre o Destino
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {destination.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Pacotes Disponíveis para {destination.name}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {relatedPackages.length} {relatedPackages.length === 1 ? 'pacote encontrado' : 'pacotes encontrados'}
              </span>
            </div>

            {relatedPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onViewDetails={onViewPackageDetails}
                    onRequestQuote={onRequestQuote}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Compass className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">
                  De momento não existem pacotes fixos listados para este destino.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Contacte a nossa equipa para desenhar um itinerário sob medida.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
