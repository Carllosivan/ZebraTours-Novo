import React from 'react';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'footer';
  className?: string;
  showSlogan?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  className = '',
  showSlogan = false,
}) => {
  const isDark = variant === 'dark' || variant === 'footer';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Logótipo Oficial Vetorial da Zebra Tours Moçambique */}
      <div
        className={`relative shrink-0 transition-transform hover:scale-105 duration-300 ${
          isDark
            ? 'bg-white rounded-xl p-1.5 shadow-sm'
            : ''
        }`}
      >
        <img
          src="/assets/aistudio/ZebraTours_Logo_c3eb31fa.svg"
          alt="Zebra Tours Moçambique"
          className="h-11 sm:h-13 w-auto object-contain"
          loading="eager"
        />
      </div>

      {showSlogan && (
        <span
          className={`text-[11px] font-medium italic border-l pl-3 hidden lg:inline-block leading-tight ${
            isDark ? 'text-stone-300 border-stone-700' : 'text-slate-600 border-slate-300'
          }`}
        >
          O seu próximo destino começa aqui!
        </span>
      )}
    </div>
  );
};
