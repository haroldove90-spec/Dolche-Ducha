import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // If already installed, show small badge or nothing
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#0A523C] bg-emerald-50 border border-emerald-200 rounded-full">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalada</span>
      </span>
    );
  }

  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`group relative inline-flex items-center gap-2 font-semibold transition-all duration-200 active:scale-95 cursor-pointer shadow-sm ${
          variant === 'header'
            ? 'px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-[#FF8800] to-[#e67a00] text-white hover:brightness-105 rounded-xl border border-amber-400/30'
            : variant === 'compact'
            ? 'p-2 text-[#FF8800] bg-orange-50 hover:bg-orange-100 rounded-xl'
            : 'px-5 py-2.5 text-sm bg-[#FF8800] text-white rounded-xl shadow-md hover:shadow-lg'
        }`}
        title="Instalar Dolche Ducha en tu dispositivo"
      >
        <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        <span className="font-medium tracking-tight">Instalar App</span>
        <span className="hidden md:inline-block text-[10px] uppercase font-bold bg-white/20 text-white px-1.5 py-0.5 rounded tracking-wider">
          PWA
        </span>
      </button>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://appdesignproyectos.com/dolcheduchaicono.png"
                alt="Dolche Ducha"
                className="w-12 h-12 rounded-xl object-contain shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Instalar en iOS</h3>
                <p className="text-xs text-gray-500">iPhone o iPad (Safari)</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <div className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8800] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <p>
                  Presiona el botón <strong className="text-gray-900 inline-flex items-center gap-1 font-semibold">Compartir <Share2 className="w-3.5 h-3.5 inline text-blue-600" /></strong> en la barra inferior de Safari.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8800] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <p>
                  Desliza hacia abajo y selecciona <strong className="text-gray-900 inline-flex items-center gap-1 font-semibold">"Agregar al inicio" <PlusSquare className="w-3.5 h-3.5 inline text-gray-700" /></strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF8800] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <p>
                  Toca <strong className="text-gray-900 font-semibold">Agregar</strong> en la esquina superior derecha. ¡Listo!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 text-center bg-[#0A523C] text-white font-semibold rounded-xl hover:bg-[#083e2e] transition text-sm cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Generic Modal for Desktop/Android when already prompted or standalone instruction */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setShowGenericModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://appdesignproyectos.com/dolcheduchaicono.png"
                alt="Dolche Ducha"
                className="w-12 h-12 rounded-xl object-contain shadow-sm"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Instalar Dolche Ducha</h3>
                <p className="text-xs text-gray-500">Android, Windows o Mac</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Puedes instalar esta aplicación directamente desde la barra de direcciones de tu navegador haciendo clic en el icono de <strong className="text-[#FF8800]">Instalar (computadora o celular)</strong> o en el menú de tres puntos <strong className="text-gray-900">"Instalar aplicación"</strong>.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2 mb-4">
              <Smartphone className="w-4 h-4 flex-shrink-0 text-[#FF8800]" />
              <span>Accede sin barras de navegación, con máxima rapidez y soporte offline.</span>
            </div>
            <button
              onClick={() => setShowGenericModal(false)}
              className="w-full py-2.5 text-center bg-[#FF8800] text-white font-semibold rounded-xl hover:bg-[#e67a00] transition text-sm cursor-pointer shadow-sm"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
