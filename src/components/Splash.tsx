import React, { useEffect, useState } from 'react';

interface Props {
  onFinish?: () => void;
}

export const Splash: React.FC<Props> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center max-w-md w-full px-6 text-center">
        {/* Logo unencapsulated as explicitly requested: no container box/circle */}
        <img
          src="https://appdesignproyectos.com/dolcheduchalogo.png"
          alt="Dolche Ducha"
          className="w-auto h-28 sm:h-36 md:h-44 object-contain animate-pulse drop-shadow-sm"
        />

        <div className="mt-8 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF8800] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#B33892] animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A523C] animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};
