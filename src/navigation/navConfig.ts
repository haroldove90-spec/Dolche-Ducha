import { UserRole } from '../types';
import {
  CalendarDays,
  Users,
  CreditCard,
  MessageSquare,
  Image,
  ClipboardList,
  History,
  Stethoscope,
  FileText,
  ShieldAlert,
  BarChart3,
  TrendingUp,
  KeyRound,
  Database,
  ShoppingBag,
  Scissors,
} from 'lucide-react';


export interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: any;
  color?: string;
}

export const MODULES_BY_ROLE: Record<UserRole, NavItem[]> = {
  recepcion: [
    { id: 'agenda', label: 'Agenda de Citas', shortLabel: 'Agenda', icon: CalendarDays },
    { id: 'clientes', label: 'Clientes y Mascotas', shortLabel: 'Clientes', icon: Users },
    { id: 'pos', label: 'Venta y Cobro (POS)', shortLabel: 'Cobro POS', icon: CreditCard },
    { id: 'recordatorios', label: 'Recordatorios WhatsApp', shortLabel: 'WhatsApp', icon: MessageSquare },
    { id: 'galeria', label: 'Antes y Después', shortLabel: 'Galería', icon: Image },
  ],
  estilista: [
    { id: 'operativo', label: 'Servicio en Curso', shortLabel: 'En Servicio', icon: Scissors },
    { id: 'admision', label: 'Checklist de Ingreso', shortLabel: 'Checklist', icon: ClipboardList },
    { id: 'historial', label: 'Historial Estilismo', shortLabel: 'Historial', icon: History },
    { id: 'galeria', label: 'Galería de Cortes', shortLabel: 'Galería', icon: Image },
  ],
  veterinario: [
    { id: 'expedientes', label: 'Expediente Clínico', shortLabel: 'Expediente', icon: Stethoscope },
    { id: 'receta', label: 'Diagnósticos y Recetas', shortLabel: 'Recetas', icon: FileText },
    { id: 'vacunacion', label: 'Vacunas y Desparasitación', shortLabel: 'Vacunas', icon: ShieldAlert },
    { id: 'clientes', label: 'Directorio Canino', shortLabel: 'Pacientes', icon: Users },
  ],
  administrador: [
    { id: 'caja', label: 'Reportes y Finanzas', shortLabel: 'Caja & Ventas', icon: BarChart3 },
    { id: 'estadisticas', label: 'Estadísticas de Clientes', shortLabel: 'Demanda', icon: TrendingUp },
    { id: 'catalogo', label: 'Servicios y Productos', shortLabel: 'Catálogo', icon: ShoppingBag },
    { id: 'permisos', label: 'Control de Permisos', shortLabel: 'Permisos', icon: KeyRound },
    { id: 'datos', label: 'Base de Datos & Supabase', shortLabel: 'BD & Datos', icon: Database },
  ],
};
