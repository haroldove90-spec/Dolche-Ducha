import React from 'react';
import { UserRole } from '../types';
import { Sparkles, Scissors, Stethoscope, ShieldCheck } from 'lucide-react';

interface Props {
  onSelectRole: (role: UserRole) => void;
}

interface RoleCardConfig {
  id: UserRole;
  name: string;
  icon: React.ReactNode;
  accentColor: string;
  bgHover: string;
  textColor: string;
  borderColor: string;
}

const ROLES: RoleCardConfig[] = [
  {
    id: 'recepcion',
    name: 'Recepción',
    icon: <Sparkles className="w-8 h-8 text-[#FF8800]" />,
    accentColor: '#FF8800',
    bgHover: 'hover:border-[#FF8800] hover:shadow-orange-100',
    textColor: 'text-gray-900 group-hover:text-[#FF8800]',
    borderColor: 'border-orange-100',
  },
  {
    id: 'estilista',
    name: 'Estilista / Bañista',
    icon: <Scissors className="w-8 h-8 text-[#B33892]" />,
    accentColor: '#B33892',
    bgHover: 'hover:border-[#B33892] hover:shadow-pink-100',
    textColor: 'text-gray-900 group-hover:text-[#B33892]',
    borderColor: 'border-pink-100',
  },
  {
    id: 'veterinario',
    name: 'Médico Veterinario',
    icon: <Stethoscope className="w-8 h-8 text-[#0A523C]" />,
    accentColor: '#0A523C',
    bgHover: 'hover:border-[#0A523C] hover:shadow-emerald-100',
    textColor: 'text-gray-900 group-hover:text-[#0A523C]',
    borderColor: 'border-emerald-100',
  },
  {
    id: 'administrador',
    name: 'Administrador / Dueño',
    icon: <ShieldCheck className="w-8 h-8 text-black" />,
    accentColor: '#000000',
    bgHover: 'hover:border-black hover:shadow-gray-200',
    textColor: 'text-gray-900 group-hover:text-black',
    borderColor: 'border-gray-200',
  },
];

export const RoleSelector: React.FC<Props> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 select-none">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Unencapsulated Logo as requested */}
        <div className="mb-8 sm:mb-12 md:mb-16 flex items-center justify-center">
          <img
            src="https://appdesignproyectos.com/dolcheduchalogo.png"
            alt="Dolche Ducha"
            className="w-auto h-24 sm:h-32 md:h-44 object-contain max-w-full drop-shadow-sm"
          />
        </div>

        {/* Roles Grid: 2 Columns Mobile, 4 Columns Desktop */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-6">
          {ROLES.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`group relative flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-9 bg-white rounded-2xl border-2 ${role.borderColor} ${role.bgHover} shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 active:scale-95 cursor-pointer`}
              style={{
                outlineColor: role.accentColor,
              }}
            >
              {/* Subtle top indicator bar */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full transition-all duration-300 group-hover:w-20"
                style={{ backgroundColor: role.accentColor }}
              />

              {/* Minimal role icon */}
              <div className="mb-4 sm:mb-5 p-3 rounded-2xl bg-gray-50/80 group-hover:scale-110 transition-transform duration-300">
                {role.icon}
              </div>

              {/* Exact role name only - no descriptions, no header */}
              <span className={`text-base sm:text-lg md:text-xl font-bold tracking-tight ${role.textColor} transition-colors duration-200`}>
                {role.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
