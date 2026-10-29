import React, { useEffect } from 'react';
import { X, BookOpen, Calendar, ArrowRight, Share2, Compass } from 'lucide-react';
import { CmsPage } from '../types/travel.ts';

interface EditorialPageModalProps {
  page: CmsPage | null;
  onClose: () => void;
  onRequestQuote?: () => void;
}

export const EditorialPageModal: React.FC<EditorialPageModalProps> = ({
  page,
  onClose,
  onRequestQuote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (page) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [page, onClose]);

  if (!page) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-[#071629]/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-[#071629] text-white p-5 sm:p-6 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B2545] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                Editorial & Informação
              </span>
              <h2 className="text-lg sm:text-xl font-normal font-editorial tracking-tight text-white line-clamp-1">
                {page.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto">
          {/* Optional Cover Image */}
          {page.cover_image && (
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-stone-900">
              <img
                src={page.cover_image}
                alt={page.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                  Guia Zebra Tours
                </span>
                <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-white">
                  {page.title}
                </h1>
              </div>
            </div>
          )}

          {/* Editorial Content */}
          <div className="p-6 sm:p-10 space-y-6">
            {page.excerpt && (
              <p className="text-base sm:text-lg text-stone-700 font-editorial italic border-l-2 border-[#D4AF37] pl-4 py-1 leading-relaxed">
                {page.excerpt}
              </p>
            )}

            <div className="prose prose-stone max-w-none text-stone-800 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-sans">
              {page.content}
            </div>

            {/* SEO & Meta info */}
            {page.seo_description && (
              <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-stone-500 bg-[#FAF9F6] p-4 rounded-xl border">
                <div>
                  <span className="font-semibold text-stone-700 block">Resumo do documento:</span>
                  <span>{page.seo_description}</span>
                </div>
                {onRequestQuote && (
                  <button
                    onClick={() => {
                      onClose();
                      onRequestQuote();
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-[#071629] text-[#D4AF37] hover:bg-[#0B2545] rounded-lg text-xs font-semibold transition-colors"
                  >
                    <span>Falar com Especialista</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
