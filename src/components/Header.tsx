import React from 'react';
import { UserRole } from '../types';
import { PWAInstallButton } from './pwa/PWAInstallButton';
import { LogOut, Database, RefreshCw, Sparkles, Scissors, Stethoscope, ShieldCheck, ChevronDown } from 'lucide-react';
import { isSampleDataCleared } from '../data/storage';

interface Props {
  activeRole: UserRole;
  onLogout: () => void;
  onOpenDataModal: () => void;
  onSwitchRole: (role: UserRole) => void;
}

const ROLE_INFO: Record<UserRole, { name: string; color: string; bg: string; icon: React.ReactNode }> = {
  recepcion: {
    name: 'Recepción',
    color: '#FF8800',
    bg: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: <Sparkles className="w-4 h-4 text-[#FF8800]" />,
  },
  estilista: {
    name: 'Estilista / Bañista',
    color: '#B33892',
    bg: 'bg-pink-50 text-pink-700 border-pink-200',
    icon: <Scissors className="w-4 h-4 text-[#B33892]" />,
  },
  veterinario: {
    name: 'Médico Veterinario',
    color: '#0A523C',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <Stethoscope className="w-4 h-4 text-[#0A523C]" />,
  },
  administrador: {
    name: 'Administrador / Dueño',
    color: '#000000',
    bg: 'bg-gray-100 text-gray-900 border-gray-300',
    icon: <ShieldCheck className="w-4 h-4 text-black" />,
  },
};

export const Header: React.FC<Props> = ({
  activeRole,
  onLogout,
  onOpenDataModal,
  onSwitchRole,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const cleared = isSampleDataCleared();
  const currentRole = ROLE_INFO[activeRole];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Institutional Logo - NOT encapsulated */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLogout}
            title="Ir al inicio / Cambiar de Rol"
            className="flex items-center cursor-pointer transition hover:opacity-90 active:scale-98"
          >
            <img
              src="https://appdesignproyectos.com/dolcheduchalogo.png"
              alt="Dolche Ducha"
              className="h-9 sm:h-11 md:h-12 w-auto object-contain"
            />
          </button>
        </div>

        {/* Right Section: Role Badge + PWA Install + Data Tool + Logout */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Active Role Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs ${currentRole.bg}`}
              title="Cambiar rol activo"
            >
              {currentRole.icon}
              <span className="hidden xs:inline">{currentRole.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-gray-100 text-[11px] font-bold tracking-wider uppercase text-gray-400">
                  Cambiar de Perfil
                </div>
                {(['recepcion', 'estilista', 'veterinario', 'administrador'] as UserRole[]).map((r) => {
                  const info = ROLE_INFO[r];
                  return (
                    <button
                      key={r}
                      onClick={() => onSwitchRole(r)}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold hover:bg-gray-50 transition cursor-pointer ${
                        activeRole === r ? 'text-[#FF8800] bg-orange-50/50' : 'text-gray-700'
                      }`}
                    >
                      {info.icon}
                      <span>{info.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Data Management Button */}
          <button
            onClick={onOpenDataModal}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-xl border transition cursor-pointer ${
              cleared
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
            title="Configuración de base de datos y borrado de datos de muestra"
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {cleared ? 'Datos limpios' : 'Datos muestra'}
            </span>
          </button>

          {/* PWA Quick Install Button */}
          <PWAInstallButton variant="header" />

          {/* Logout / Switch Role Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-red-600 bg-gray-100/80 hover:bg-red-50 rounded-xl transition border border-gray-200 hover:border-red-200 cursor-pointer"
            title="Cerrar sesión / Volver al menú de roles"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};
