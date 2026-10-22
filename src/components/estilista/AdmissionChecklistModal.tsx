import React, { useState } from 'react';
import { Appointment, AdmissionChecklist } from '../../types';
import {
  X,
  ClipboardCheck,
  Bug,
  Activity,
  Scissors,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Smile,
  Shield,
} from 'lucide-react';

interface Props {
  appointment: Appointment;
  onClose: () => void;
  onSave: (aptId: string, checklist: AdmissionChecklist) => void;
}

export const AdmissionChecklistModal: React.FC<Props> = ({
  appointment,
  onClose,
  onSave,
}) => {
  const existing = appointment.checklist;

  const [hasParasites, setHasParasites] = useState<boolean>(existing?.hasParasites ?? false);
  const [parasitesDetail, setParasitesDetail] = useState<string>(
    existing?.parasitesDetail || 'Limpio, sin pulgas ni garrapatas visibles'
  );

  const [hasWoundsOrLumps, setHasWoundsOrLumps] = useState<boolean>(
    existing?.hasWoundsOrLumps ?? false
  );
  const [woundsDetail, setWoundsDetail] = useState<string>(
    existing?.woundsDetail || 'Piel íntegra sin lesiones aparentes'
  );

  const [temperament, setTemperament] = useState<AdmissionChecklist['temperament']>(
    existing?.temperament || 'Tranquilo'
  );

  const [mattingLevel, setMattingLevel] = useState<AdmissionChecklist['mattingLevel']>(
    existing?.mattingLevel || 'Bajo'
  );

  const [earsCondition, setEarsCondition] = useState<AdmissionChecklist['earsCondition']>(
    existing?.earsCondition || 'Limpio'
  );

  const [nailsCondition, setNailsCondition] = useState<AdmissionChecklist['nailsCondition']>(
    existing?.nailsCondition || 'Largas (requiere corte)'
  );

  const [skinCondition, setSkinCondition] = useState<AdmissionChecklist['skinCondition']>(
    existing?.skinCondition || 'Sana'
  );

  const [bladeNumber, setBladeNumber] = useState<string>(
    existing?.bladeNumber || 'Cuchilla #7F en manto + #10 zonas higiénicas'
  );

  const [selectedShampoo, setSelectedShampoo] = useState<string>(
    existing?.selectedShampoo || 'Shampoo Avena Coloidal Hipoalergénico'
  );

  const [selectedAromatherapy, setSelectedAromatherapy] = useState<string>(
    existing?.selectedAromatherapy || 'Brisa Relajante de Lavanda'
  );

  const [stylistNotes, setStylistNotes] = useState<string>(
    existing?.stylistNotes || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checklist: AdmissionChecklist = {
      hasParasites,
      parasitesDetail,
      hasWoundsOrLumps,
      woundsDetail,
      temperament,
      mattingLevel,
      earsCondition,
      nailsCondition,
      skinCondition,
      bladeNumber,
      selectedShampoo,
      selectedAromatherapy,
      stylistNotes,
      completedAt: new Date().toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    onSave(appointment.id, checklist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-pink-50/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#B33892] text-white">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-heading">
                Checklist de Ingreso: {appointment.petName} ({appointment.petBreed})
              </h2>
              <p className="text-xs text-gray-500">
                Ficha de admisión rápida de control físico y temperamento antes del baño
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Question 1: Parasites */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 flex items-center gap-2">
                <Bug className="w-4 h-4 text-amber-600" />
                1. ¿Viene con pulgas o garrapatas?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasParasites(false);
                    setParasitesDetail('Limpio, sin pulgas ni garrapatas visibles');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    !hasParasites
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  No (Limpio)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasParasites(true);
                    setParasitesDetail('Presencia visible de pulgas en lomo y cola. Aplicar baño antiparasitario.');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    hasParasites
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  Sí (Detectadas)
                </button>
              </div>
            </div>
            <input
              type="text"
              value={parasitesDetail}
              onChange={(e) => setParasitesDetail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none text-xs"
              placeholder="Detalle de parásitos..."
            />
          </div>

          {/* Question 2: Wounds / Skin lumps */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-500" />
                2. ¿Tiene alguna herida, bulto, lesión o dolor?
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setHasWoundsOrLumps(false);
                    setWoundsDetail('Piel íntegra sin lesiones aparentes');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    !hasWoundsOrLumps
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  No presenta heridas
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasWoundsOrLumps(true);
                    setWoundsDetail('Costra o enrojecimiento detectado');
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer ${
                    hasWoundsOrLumps
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  Sí presenta
                </button>
              </div>
            </div>
            <input
              type="text"
              value={woundsDetail}
              onChange={(e) => setWoundsDetail(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none text-xs"
              placeholder="Ubicación de la lesión o bulto..."
            />
          </div>

          {/* Question 3: Temperament / Dryer behavior */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
            <label className="font-bold text-gray-900 flex items-center gap-2">
              <Smile className="w-4 h-4 text-[#FF8800]" />
              3. ¿Comportamiento con el secador, agua o manipulación?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  'Tranquilo',
                  'Nervioso',
                  'Agresivo con secador / agua',
                  'Requiere bozal',
                ] as const
              ).map((temp) => (
                <button
                  key={temp}
                  type="button"
                  onClick={() => setTemperament(temp)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center cursor-pointer ${
                    temperament === temp
                      ? 'bg-gray-900 text-white border-black shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Quick grid: Matting, Ears, Nails */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Nivel de Nudos
              </label>
              <select
                value={mattingLevel}
                onChange={(e) => setMattingLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#B33892] focus:outline-none"
              >
                <option value="Bajo">Bajo (Fácil peinado)</option>
                <option value="Medio">Medio (Nudos en orejas/patas)</option>
                <option value="Alto">Alto (Apelmazado / Rastra)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Estado de Oídos
              </label>
              <select
                value={earsCondition}
                onChange={(e) => setEarsCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#B33892] focus:outline-none"
              >
                <option value="Limpio">Limpio</option>
                <option value="Enrojecido / Sucio">Enrojecido / Sucio</option>
                <option value="Sospecha de otitis">Sospecha de otitis</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                Estado de Uñas
              </label>
              <select
                value={nailsCondition}
                onChange={(e) => setNailsCondition(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#B33892] focus:outline-none"
              >
                <option value="Cortas">Cortas</option>
                <option value="Largas (requiere corte)">Largas (requiere corte)</option>
                <option value="Encarnadas">Encarnadas</option>
              </select>
            </div>
          </div>

          {/* Styling technical details to store for next time */}
          <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-200 space-y-3">
            <h4 className="font-bold text-[#B33892] text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5" />
              Parámetros Técnicos de Estética Canina
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Cuchilla / Tijera a Emplear
                </label>
                <input
                  type="text"
                  value={bladeNumber}
                  onChange={(e) => setBladeNumber(e.target.value)}
                  placeholder="Ej: Cuchilla #7F, #10 higiénica"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Shampoo Empleado
                </label>
                <input
                  type="text"
                  value={selectedShampoo}
                  onChange={(e) => setSelectedShampoo(e.target.value)}
                  placeholder="Ej: Hipoalergénico Avena"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Aromaterapia / Perfume
                </label>
                <input
                  type="text"
                  value={selectedAromatherapy}
                  onChange={(e) => setSelectedAromatherapy(e.target.value)}
                  placeholder="Ej: Brisa de Lavanda"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Observaciones del Estilista (Guardar para próximos servicios)
              </label>
              <textarea
                rows={2}
                value={stylistNotes}
                onChange={(e) => setStylistNotes(e.target.value)}
                placeholder="Ej: Muy dócil con tijeras pero requiere ayuda al secar patas traseras..."
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#B33892] focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#B33892] hover:bg-[#922b75] text-white font-semibold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Ficha & Iniciar Servicio</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
