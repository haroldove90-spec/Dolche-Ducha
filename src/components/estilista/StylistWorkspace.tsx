import React, { useState } from 'react';
import { Appointment, Pet, AdmissionChecklist } from '../../types';
import {
  getAppointments,
  saveAppointments,
  getPets,
  savePets,
} from '../../data/storage';
import {
  Scissors,
  AlertTriangle,
  Heart,
  ClipboardCheck,
  History,
  CheckCircle2,
  Clock,
  Sparkles,
  Bath,
  Wind,
  ShieldAlert,
  Info,
  ChevronRight,
} from 'lucide-react';
import { AdmissionChecklistModal } from './AdmissionChecklistModal';

export const StylistWorkspace: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());
  const [pets] = useState<Pet[]>(getPets());
  const [selectedAptForChecklist, setSelectedAptForChecklist] = useState<Appointment | null>(null);
  const [activeTab, setActiveTab] = useState<'cola' | 'finalizadas'>('cola');

  const reloadData = () => {
    setAppointments(getAppointments());
  };

  const handleSaveChecklist = (aptId: string, checklist: AdmissionChecklist) => {
    const updated = appointments.map((apt) => {
      if (apt.id === aptId) {
        return {
          ...apt,
          checklist,
          status: 'En proceso' as const,
        };
      }
      return apt;
    });
    setAppointments(updated);
    saveAppointments(updated);

    // Also update pet's last service info for historical lookup
    const apt = appointments.find((a) => a.id === aptId);
    if (apt) {
      const allPets = getPets();
      const updatedPets = allPets.map((p) => {
        if (p.id === apt.petId) {
          return {
            ...p,
            lastServiceDate: new Date().toISOString().split('T')[0],
            lastBladeNumber: checklist.bladeNumber || p.lastBladeNumber,
            preferredShampoo: checklist.selectedShampoo || p.preferredShampoo,
            preferredAroma: checklist.selectedAromatherapy || p.preferredAroma,
          };
        }
        return p;
      });
      savePets(updatedPets);
    }
  };

  const handleFinishService = (aptId: string) => {
    const updated = appointments.map((apt) =>
      apt.id === aptId ? { ...apt, status: 'Finalizada' as const } : apt
    );
    setAppointments(updated);
    saveAppointments(updated);
  };

  const queueAppointments = appointments.filter(
    (a) => a.status === 'Agendada' || a.status === 'En proceso'
  );

  const finishedAppointments = appointments.filter((a) => a.status === 'Finalizada');

  return (
    <div className="space-y-6">
      {/* Stylist Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Scissors className="w-6 h-6 text-[#B33892]" />
            Panel Operativo: Estilista & Bañista
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Inspección de admisión, alertas críticas de conducta y consulta de cuchillas y aromas anteriores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cola')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'cola'
                ? 'bg-[#B33892] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            En Servicio / Cola ({queueAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('finalizadas')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'finalizadas'
                ? 'bg-[#0A523C] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Finalizadas Hoy ({finishedAppointments.length})
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-5">
        {(activeTab === 'cola' ? queueAppointments : finishedAppointments).length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <Bath className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-700">
              {activeTab === 'cola' ? 'No hay caninos en cola de espera' : 'No hay servicios finalizados aún'}
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Cuando recepción agende una cita o asigne un turno, aparecerá aquí con su ficha de admisión rápida.
            </p>
          </div>
        ) : (
          (activeTab === 'cola' ? queueAppointments : finishedAppointments).map((apt) => {
            const pet = pets.find((p) => p.id === apt.petId);

            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl border-2 border-gray-200/90 hover:border-pink-300 shadow-sm transition-all duration-200 p-5 space-y-4"
              >
                {/* Top Bar: Pet Avatar + Name + Cubicle & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={apt.petPhotoUrl}
                      alt={apt.petName}
                      className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-xs flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-extrabold text-gray-900 font-heading">
                          {apt.petName}
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md">
                          {apt.petBreed}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">
                        Dueño: <span className="text-gray-800 font-semibold">{apt.clientName}</span> • Turno: <span className="font-bold text-gray-900">{apt.time}</span>
                      </p>
                      <p className="text-xs text-[#B33892] font-semibold mt-0.5">
                        {apt.serviceName} • {apt.cubicle} • Estilista: {apt.stylist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        apt.status === 'En proceso'
                          ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                          : apt.status === 'Finalizada'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>

                {/* CRITICAL FEATURE: Visualización de Alertas Médicas y Conductuales en Avisos GRANDES */}
                {((pet?.behavioralAlerts && pet.behavioralAlerts.length > 0) ||
                  (pet?.medicalAlerts && pet.medicalAlerts.length > 0)) && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Alertas Críticas de Manejo y Seguridad Canina</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {pet?.behavioralAlerts.map((alert, i) => (
                        <div
                          key={`b-${i}`}
                          className="bg-amber-100/80 border-2 border-amber-400 text-amber-950 p-3 rounded-xl flex items-start gap-3 shadow-xs"
                        >
                          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-amber-800 block">
                              Alerta Conductual
                            </span>
                            <span className="text-sm font-bold leading-tight">
                              {alert}
                            </span>
                          </div>
                        </div>
                      ))}

                      {pet?.medicalAlerts.map((alert, i) => (
                        <div
                          key={`m-${i}`}
                          className="bg-red-100/80 border-2 border-red-400 text-red-950 p-3 rounded-xl flex items-start gap-3 shadow-xs"
                        >
                          <Heart className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-red-800 block">
                              Condición Médica / Alergia
                            </span>
                            <span className="text-sm font-bold leading-tight">
                              {alert}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CRITICAL FEATURE: Historial de Servicios Previos (Cuchillas, Aromas, Cortes) */}
                <div className="bg-purple-50/50 border border-purple-200/70 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#B33892] flex items-center gap-1.5">
                      <History className="w-4 h-4" />
                      Historial de Estilismo Previo de {apt.petName}
                    </h4>
                    {pet?.lastServiceDate && (
                      <span className="text-[11px] font-medium text-gray-500">
                        Último servicio: {pet.lastServiceDate}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Cuchilla / Técnica Anterior
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet?.lastBladeNumber || 'Tijera curva + #10 higiénica'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Shampoo Preferido
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet?.preferredShampoo || 'Shampoo Avena Coloidal'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-purple-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Aromaterapia Favorita
                      </span>
                      <span className="font-bold text-gray-800">
                        {pet?.preferredAroma || 'Brisa Relajante de Lavanda'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checklist Summary if already filled */}
                {apt.checklist && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0A523C]" />
                      <span className="font-bold">
                        Ficha de Admisión Completada
                      </span>
                      <span className="text-emerald-700">
                        (Temperamento: {apt.checklist.temperament} • Nudos: {apt.checklist.mattingLevel} • Piel: {apt.checklist.skinCondition})
                      </span>
                    </div>
                    {apt.checklist.stylistNotes && (
                      <span className="text-gray-600 italic">
                        "{apt.checklist.stylistNotes}"
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons for Stylist */}
                <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                  <button
                    onClick={() => setSelectedAptForChecklist(apt)}
                    className="px-4 py-2.5 bg-gradient-to-r from-[#B33892] to-[#922b75] hover:brightness-105 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    <span>
                      {apt.checklist ? 'Editar Ficha de Admisión' : 'Llenar Checklist de Ingreso'}
                    </span>
                  </button>

                  {apt.status === 'En proceso' && (
                    <button
                      onClick={() => handleFinishService(apt.id)}
                      className="px-4 py-2.5 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completar y Entregar Mascota</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Admission Checklist Modal */}
      {selectedAptForChecklist && (
        <AdmissionChecklistModal
          appointment={selectedAptForChecklist}
          onClose={() => setSelectedAptForChecklist(null)}
          onSave={handleSaveChecklist}
        />
      )}
    </div>
  );
};
