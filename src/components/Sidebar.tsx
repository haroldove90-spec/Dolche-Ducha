import React from 'react';
import { UserRole } from '../types';
import { MODULES_BY_ROLE, NavItem } from '../navigation/navConfig';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles,
  Scissors,
  Stethoscope,
  ShieldCheck,
  Database,
  ExternalLink,
} from 'lucide-react';

interface Props {
  activeRole: UserRole;
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  onLogout: () => void;
  onOpenDataModal: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ROLE_THEMES: Record<UserRole, { border: string; activeBg: string; text: string; label: string }> = {
  recepcion: {
    border: 'border-[#FF8800]',
    activeBg: 'bg-[#FF8800] text-white shadow-md shadow-orange-500/20',
    text: 'text-[#FF8800]',
    label: 'Recepción',
  },
  estilista: {
    border: 'border-[#B33892]',
    activeBg: 'bg-[#B33892] text-white shadow-md shadow-pink-500/20',
    text: 'text-[#B33892]',
    label: 'Estilista / Bañista',
  },
  veterinario: {
    border: 'border-[#0A523C]',
    activeBg: 'bg-[#0A523C] text-white shadow-md shadow-emerald-700/20',
    text: 'text-[#0A523C]',
    label: 'Médico Veterinario',
  },
  administrador: {
    border: 'border-black',
    activeBg: 'bg-black text-white shadow-md shadow-gray-900/20',
    text: 'text-black',
    label: 'Administrador',
  },
};

export const Sidebar: React.FC<Props> = ({
  activeRole,
  currentModule,
  onSelectModule,
  onLogout,
  onOpenDataModal,
  collapsed,
  onToggleCollapse,
}) => {
  const items = MODULES_BY_ROLE[activeRole] || [];
  const theme = ROLE_THEMES[activeRole];

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-gray-200/90 transition-all duration-300 relative select-none z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse / Expand toggle button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white border border-gray-300 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer z-40 transition"
        title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Role Sub-Header inside Sidebar */}
      <div className={`p-4 border-b border-gray-100 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed ? (
          <div>
            <div className="text-[11px] uppercase font-bold tracking-wider text-gray-400">
              Módulos del Rol
            </div>
            <div className={`font-bold text-sm tracking-tight ${theme.text}`}>
              {theme.label}
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
            {theme.label.charAt(0)}
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2.5 space-y-1.5 overflow-y-auto">
        {items.map((item: NavItem) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? theme.activeBg
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              {!collapsed && (
                <span className="truncate tracking-tight">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions inside Sidebar */}
      <div className="p-3 border-t border-gray-100 space-y-1 bg-gray-50/50">
        <button
          onClick={onOpenDataModal}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-white rounded-xl transition cursor-pointer border border-transparent hover:border-gray-200 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Gestión de Datos y Supabase"
        >
          <Database className="w-4 h-4 text-gray-500 flex-shrink-0" />
          {!collapsed && <span>Datos & Supabase</span>}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer ${
            collapsed ? 'justify-center px-0' : ''
          }`}
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Salir al Inicio</span>}
        </button>
      </div>
    </aside>
  );
};
