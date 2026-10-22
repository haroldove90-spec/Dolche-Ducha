import React, { useState } from 'react';
import {
  Appointment,
  AppointmentStatus,
  Pet,
  Client,
  ProductOrService,
} from '../../types';
import {
  getAppointments,
  saveAppointments,
  getPets,
  getClients,
  getProducts,
} from '../../data/storage';
import {
  Calendar,
  Clock,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertCircle,
  User,
  Scissors,
  Phone,
  MessageSquare,
  Search,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface Props {
  onOpenWhatsAppModal?: (appointment: Appointment) => void;
}

const STATUS_CONFIG: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  Agendada: {
    label: 'Agendada',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Clock,
  },
  'En proceso': {
    label: 'En Proceso',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: PlayCircle,
  },
  Finalizada: {
    label: 'Finalizada',
    bg: 'bg-emerald-50',
    text: 'text-[#0A523C]',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  Cancelada: {
    label: 'Cancelada',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
  'No asistió': {
    label: 'No asistió',
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    icon: AlertCircle,
  },
};

const CUBICULOS = [
  'Todos',
  'Cubículo 1 - Baño Express',
  'Cubículo 2 - Spa Estilismo',
  'Cubículo 3 - Corte Especial',
  'Cubículo 4 - Ozono & Relax',
];

const STYLISTS = ['Todos', 'Carlos M.', 'Sofía R.', 'Andrea P.', 'Laura G.'];

export const AppointmentsCalendar: React.FC<Props> = ({ onOpenWhatsAppModal }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [pets] = useState<Pet[]>(getPets());
  const [clients] = useState<Client[]>(getClients());
  const [services] = useState<ProductOrService[]>(
    getProducts().filter((p) => p.type === 'servicio')
  );

  const [selectedDate, setSelectedDate] = useState<string>('2026-10-22');
  const [selectedCubicle, setSelectedCubicle] = useState<string>('Todos');
  const [selectedStylist, setSelectedStylist] = useState<string>('Todos');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal new appointment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPetId, setNewPetId] = useState<string>(pets[0]?.id || '');
  const [newCubicle, setNewCubicle] = useState<string>(CUBICULOS[1]);
  const [newStylist, setNewStylist] = useState<string>(STYLISTS[1]);
  const [newDate, setNewDate] = useState<string>('2026-10-22');
  const [newTime, setNewTime] = useState<string>('12:00');
  const [newServiceId, setNewServiceId] = useState<string>(services[0]?.id || '');
  const [newNotes, setNewNotes] = useState<string>('');

  const reloadData = () => {
    setAppointments(getAppointments());
  };

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map((apt) =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === newPetId);
    const service = services.find((s) => s.id === newServiceId);
    if (!pet || !service) return;

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      clientId: pet.clientId,
      clientName: pet.clientName,
      petBreed: pet.breed,
      petPhotoUrl: pet.photoUrl,
      cubicle: newCubicle,
      stylist: newStylist,
      date: newDate,
      time: newTime,
      serviceName: service.name,
      servicePrice: service.price,
      status: 'Agendada',
      notes: newNotes,
    };

    const updated = [newApt, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);
    setIsModalOpen(false);
    setNewNotes('');
  };

  // Filter logic
  const filteredAppointments = appointments.filter((apt) => {
    const matchDate = !selectedDate || apt.date === selectedDate;
    const matchCubicle =
      selectedCubicle === 'Todos' || apt.cubicle === selectedCubicle;
    const matchStylist =
      selectedStylist === 'Todos' || apt.stylist === selectedStylist;
    const matchStatus =
      statusFilter === 'Todos' || apt.status === statusFilter;
    const matchSearch =
      searchQuery === '' ||
      apt.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchDate && matchCubicle && matchStylist && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#FF8800]" />
            Agenda de Citas & Cubículos
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Gestión en tiempo real de turnos, estilistas asignados y estado de atención.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF8800] hover:bg-[#e67a00] text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nueva Cita</span>
        </button>
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Date Picker */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
            />
          </div>

          {/* Cubicle Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Cubículo
            </label>
            <select
              value={selectedCubicle}
              onChange={(e) => setSelectedCubicle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
            >
              {CUBICULOS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stylist Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Estilista
            </label>
            <select
              value={selectedStylist}
              onChange={(e) => setSelectedStylist(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
            >
              {STYLISTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Agendada">Agendada</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizada">Finalizada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="No asistió">No asistió</option>
            </select>
          </div>

          {/* Search Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Buscar Cita
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Perrito, dueño..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List / Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No hay citas registradas para este filtro</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Selecciona otra fecha o haz clic en "Agendar Nueva Cita" para programar el servicio de un canino.
          </p>
          <button
            onClick={() => {
              setSelectedDate('');
              setSelectedCubicle('Todos');
              setSelectedStylist('Todos');
              setStatusFilter('Todos');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => {
            const statusConfig = STATUS_CONFIG[apt.status] || STATUS_CONFIG.Agendada;
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-200 p-4.5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header: Time, Cubicle, Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-base">
                      <Clock className="w-4 h-4 text-[#FF8800]" />
                      <span>{apt.time}</span>
                      <span className="text-xs font-normal text-gray-500">
                        ({apt.date})
                      </span>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Pet & Owner Info */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <img
                      src={apt.petPhotoUrl}
                      alt={apt.petName}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-100 shadow-xs flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {apt.petName}
                        </h3>
                        <span className="text-xs font-bold text-[#0A523C] bg-emerald-50 px-2 py-0.5 rounded-md">
                          ${apt.servicePrice} MXN
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium truncate">
                        {apt.petBreed}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1 truncate">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>Dueño: {apt.clientName}</span>
                      </p>
                    </div>
                  </div>

                  {/* Service & Assignment info */}
                  <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-100 space-y-1.5 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Servicio:</span>
                      <span className="font-semibold text-gray-900 text-right truncate max-w-[180px]">
                        {apt.serviceName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Estilista:</span>
                      <span className="font-semibold text-[#B33892]">
                        {apt.stylist}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Ubicación:</span>
                      <span className="font-medium text-gray-700">
                        {apt.cubicle}
                      </span>
                    </div>
                    {apt.notes && (
                      <div className="pt-1.5 mt-1 border-t border-gray-200/60 text-[11px] text-gray-600 italic">
                        "{apt.notes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions: Status quick switch & WhatsApp reminder */}
                <div className="pt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                      Cambiar Estado:
                    </span>
                    <div className="flex items-center gap-1">
                      {(['Agendada', 'En proceso', 'Finalizada', 'Cancelada'] as AppointmentStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(apt.id, st)}
                          className={`px-2 py-1 rounded-lg font-semibold transition cursor-pointer ${
                            apt.status === st
                              ? 'bg-gray-900 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {st === 'En proceso' ? 'En Proc.' : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Reminder Button */}
                  {onOpenWhatsAppModal && (
                    <button
                      onClick={() => onOpenWhatsAppModal(apt)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#0A523C] border border-emerald-200 rounded-xl transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Recordatorio por WhatsApp</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-[#FF8800]">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    Agendar Nueva Cita
                  </h3>
                  <p className="text-xs text-gray-500">
                    Programa el servicio de estética para un perrito registrado
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4 text-xs sm:text-sm">
              {/* Pet Select */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                  Mascota Canina
                </label>
                <select
                  value={newPetId}
                  onChange={(e) => setNewPetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  required
                >
                  {pets.length === 0 ? (
                    <option value="">No hay mascotas registradas (agrega una primero)</option>
                  ) : (
                    pets.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.breed}) — Dueño: {p.clientName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Service Select */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                  Servicio de Estética / Spa
                </label>
                <select
                  value={newServiceId}
                  onChange={(e) => setNewServiceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ${s.price} MXN
                    </option>
                  ))}
                </select>
              </div>

              {/* Cubicle & Stylist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                    Cubículo
                  </label>
                  <select
                    value={newCubicle}
                    onChange={(e) => setNewCubicle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  >
                    {CUBICULOS.filter((c) => c !== 'Todos').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                    Estilista Asignado
                  </label>
                  <select
                    value={newStylist}
                    onChange={(e) => setNewStylist(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  >
                    {STYLISTS.filter((s) => s !== 'Todos').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                    Fecha de Cita
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-1">
                  Notas de Ingreso / Petición del Cliente
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Cuidar oídos con algodón, corte osito, aroma a lavanda..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#FF8800] hover:bg-[#e67a00] text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-sm cursor-pointer"
                >
                  Guardar Cita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
