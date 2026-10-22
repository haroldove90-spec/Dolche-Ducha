import React, { useState } from 'react';
import {
  SaleTransaction,
  Client,
  Pet,
  Appointment,
  RolePermissions,
} from '../../types';
import {
  getSales,
  getClients,
  getPets,
  getAppointments,
  getPermissions,
  savePermissions,
} from '../../data/storage';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Banknote,
  Repeat,
  ShieldCheck,
  Calendar,
  Users,
  Award,
  Lock,
  Unlock,
  Save,
  Check,
  Dog,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';

interface Props {
  onOpenDataModal: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onOpenDataModal }) => {
  const [sales] = useState<SaleTransaction[]>(getSales());
  const [clients] = useState<Client[]>(getClients());
  const [pets] = useState<Pet[]>(getPets());
  const [appointments] = useState<Appointment[]>(getAppointments());
  const [permissions, setPermissions] = useState<Record<string, RolePermissions>>(
    getPermissions()
  );
  const [savedPerms, setSavedPerms] = useState(false);

  // Calculations for Caja & Ventas
  const totalIncome = sales.reduce((acc, s) => acc + s.total, 0);

  let servicesIncome = 0;
  let productsIncome = 0;

  sales.forEach((s) => {
    s.items.forEach((item) => {
      if (item.type === 'servicio') {
        servicesIncome += item.price * item.quantity;
      } else {
        productsIncome += item.price * item.quantity;
      }
    });
  });

  const cashIncome = sales
    .filter((s) => s.paymentMethod === 'Efectivo')
    .reduce((acc, s) => acc + s.total, 0);

  const cardIncome = sales
    .filter((s) => s.paymentMethod === 'Tarjeta')
    .reduce((acc, s) => acc + s.total, 0);

  const transferIncome = sales
    .filter((s) => s.paymentMethod === 'Transferencia')
    .reduce((acc, s) => acc + s.total, 0);

  // Frequent pets and clients
  const sortedClients = [...clients].sort((a, b) => b.totalVisits - a.totalVisits);

  const handleTogglePerm = (roleKey: string, permKey: keyof RolePermissions) => {
    const roleCurrent = permissions[roleKey];
    if (!roleCurrent) return;
    const updated = {
      ...permissions,
      [roleKey]: {
        ...roleCurrent,
        [permKey]: !roleCurrent[permKey],
      },
    };
    setPermissions(updated);
  };

  const handleSavePerms = () => {
    savePermissions(permissions);
    setSavedPerms(true);
    setTimeout(() => setSavedPerms(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-black" />
            Control Total & Finanzas Dolche Ducha
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Corte de caja diario, ingresos por estética vs productos, recurrencia y permisos de personal.
          </p>
        </div>

        <button
          onClick={onOpenDataModal}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-98"
        >
          Administrar Base de Datos
        </button>
      </div>

      {/* Financial Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Ingresos Totales (Caja)
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-[#0A523C]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 font-heading">
              ${totalIncome.toLocaleString()} MXN
            </span>
            <p className="text-[11px] text-gray-500 mt-1">
              {sales.length} tickets emitidos
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Servicios de Estética & Spa
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-[#FF8800]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#FF8800] font-heading">
              ${servicesIncome.toLocaleString()} MXN
            </span>
            <p className="text-[11px] text-gray-500 mt-1">
              Baños, cortes especializados, hidroterapia
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Venta de Productos & Snacks
            </span>
            <div className="p-2 rounded-xl bg-pink-50 text-[#B33892]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-[#B33892] font-heading">
              ${productsIncome.toLocaleString()} MXN
            </span>
            <p className="text-[11px] text-gray-500 mt-1">
              Accesorios, champús y premios caninos
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">
              Ticket Promedio
            </span>
            <div className="p-2 rounded-xl bg-gray-100 text-gray-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-gray-900 font-heading">
              ${sales.length ? Math.round(totalIncome / sales.length) : 0} MXN
            </span>
            <p className="text-[11px] text-gray-500 mt-1">
              Por cliente atendido en el mostrador
            </p>
          </div>
        </div>
      </div>

      {/* Corte de caja por método de pago */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-3">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-[#FF8800]" />
          Desglose de Caja por Método de Cobro
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs sm:text-sm">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs block font-semibold">Tarjeta (Terminal TPV)</span>
              <span className="text-lg font-bold text-gray-900">${cardIncome.toLocaleString()} MXN</span>
            </div>
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs block font-semibold">Efectivo en Caja</span>
              <span className="text-lg font-bold text-gray-900">${cashIncome.toLocaleString()} MXN</span>
            </div>
            <Banknote className="w-6 h-6 text-[#0A523C]" />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-gray-500 text-xs block font-semibold">Transferencia / SPEI</span>
              <span className="text-lg font-bold text-gray-900">${transferIncome.toLocaleString()} MXN</span>
            </div>
            <Repeat className="w-6 h-6 text-[#B33892]" />
          </div>
        </div>
      </div>

      {/* Demand & Clients Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most frequent clients & pets */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF8800]" />
              Clientes & Mascotas Más Frecuentes
            </h3>
            <span className="text-xs text-gray-400 font-semibold">Top Fidelidad</span>
          </div>

          <div className="space-y-3">
            {sortedClients.slice(0, 4).map((cli, idx) => (
              <div
                key={cli.id}
                className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl border border-gray-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-orange-100 text-[#FF8800] font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-gray-900">{cli.name}</h4>
                    <p className="text-[11px] text-gray-500">{cli.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-[#0A523C] block">
                    {cli.totalVisits} visitas
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ${cli.totalSpent.toLocaleString()} MXN total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Days with Peak Demand */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0A523C]" />
              Días con Mayor Demanda de Citas
            </h3>
            <span className="text-xs text-gray-400 font-semibold">Ocupación Spa</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { day: 'Sábado (Pico Máximo)', percent: 95, color: 'bg-[#FF8800]', text: '42 citas promedio' },
              { day: 'Domingo', percent: 85, color: 'bg-[#B33892]', text: '35 citas promedio' },
              { day: 'Viernes', percent: 78, color: 'bg-[#0A523C]', text: '28 citas promedio' },
              { day: 'Jueves', percent: 60, color: 'bg-gray-800', text: '19 citas promedio' },
              { day: 'Lunes a Miércoles', percent: 45, color: 'bg-gray-400', text: '14 citas promedio' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-gray-800">{item.day}</span>
                  <span className="text-gray-500">{item.text}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control de Permisos de Usuarios */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-black" />
              Control de Permisos de Usuarios y Roles
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Configura qué módulos y acciones puede realizar cada perfil (ej. evitar que recepción vea reportes financieros o altere precios).
            </p>
          </div>

          <button
            onClick={handleSavePerms}
            className="px-4 py-2 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            {savedPerms ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedPerms ? '¡Permisos Guardados!' : 'Guardar Cambios'}</span>
          </button>
        </div>

        {/* Permissions Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Rol / Cargo</th>
                <th className="py-2.5 px-3 text-center">Ver Finanzas y Caja</th>
                <th className="py-2.5 px-3 text-center">Modificar Precios</th>
                <th className="py-2.5 px-3 text-center">Eliminar Registros</th>
                <th className="py-2.5 px-3 text-center">Editar Expedientes Médicos</th>
                <th className="py-2.5 px-3 text-center">Cobrar en POS</th>
                <th className="py-2.5 px-3 text-center">Administrar Usuarios</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { key: 'recepcion', name: 'Recepción (Mostrador)', badge: 'bg-orange-100 text-orange-800' },
                { key: 'estilista', name: 'Estilista / Bañista', badge: 'bg-pink-100 text-pink-800' },
                { key: 'veterinario', name: 'Médico Veterinario', badge: 'bg-emerald-100 text-emerald-800' },
                { key: 'administrador', name: 'Administrador / Dueño', badge: 'bg-gray-100 text-gray-900 font-bold' },
              ].map((role) => {
                const perms = permissions[role.key] || {
                  viewFinancials: false,
                  modifyPrices: false,
                  deleteRecords: false,
                  editMedicalRecords: false,
                  accessPOS: false,
                  manageUsers: false,
                };

                return (
                  <tr key={role.key} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] ${role.badge}`}>
                        {role.name}
                      </span>
                    </td>

                    {(
                      [
                        'viewFinancials',
                        'modifyPrices',
                        'deleteRecords',
                        'editMedicalRecords',
                        'accessPOS',
                        'manageUsers',
                      ] as (keyof RolePermissions)[]
                    ).map((permKey) => {
                      const enabled = perms[permKey];
                      return (
                        <td key={permKey} className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePerm(role.key, permKey)}
                            disabled={role.key === 'administrador'}
                            className={`p-1.5 rounded-lg border transition cursor-pointer ${
                              role.key === 'administrador'
                                ? 'opacity-80 cursor-not-allowed bg-emerald-50 border-emerald-200 text-[#0A523C]'
                                : enabled
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : 'bg-gray-100 text-gray-400 border-gray-200 hover:border-gray-400'
                            }`}
                            title={enabled ? 'Permitido' : 'Denegado'}
                          >
                            {enabled ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
