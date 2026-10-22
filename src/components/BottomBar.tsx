import React from 'react';
import { UserRole } from '../types';
import { MODULES_BY_ROLE, NavItem } from '../navigation/navConfig';

interface Props {
  activeRole: UserRole;
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
}

const ROLE_ACTIVE_COLORS: Record<UserRole, { text: string; bg: string; dot: string }> = {
  recepcion: {
    text: 'text-[#FF8800]',
    bg: 'bg-orange-50/80',
    dot: 'bg-[#FF8800]',
  },
  estilista: {
    text: 'text-[#B33892]',
    bg: 'bg-pink-50/80',
    dot: 'bg-[#B33892]',
  },
  veterinario: {
    text: 'text-[#0A523C]',
    bg: 'bg-emerald-50/80',
    dot: 'bg-[#0A523C]',
  },
  administrador: {
    text: 'text-black',
    bg: 'bg-gray-100',
    dot: 'bg-black',
  },
};

export const BottomBar: React.FC<Props> = ({
  activeRole,
  currentModule,
  onSelectModule,
}) => {
  const items = MODULES_BY_ROLE[activeRole] || [];
  const activeColor = ROLE_ACTIVE_COLORS[activeRole];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 pb-safe shadow-lg">
      <div className="flex items-center justify-around px-1 py-1.5 max-w-lg mx-auto">
        {items.map((item: NavItem) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive ? `${activeColor.text} ${activeColor.bg}` : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span
                    className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${activeColor.dot}`}
                  />
                )}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1 font-semibold truncate max-w-[70px] leading-tight ${isActive ? 'font-bold' : ''}`}>
                {item.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
