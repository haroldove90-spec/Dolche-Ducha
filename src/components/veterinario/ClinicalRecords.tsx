import React, { useState } from 'react';
import {
  MedicalRecord,
  VaccinationRecord,
  Pet,
  Client,
} from '../../types';
import {
  getMedicalRecords,
  saveMedicalRecords,
  getVaccinations,
  saveVaccinations,
  getPets,
  getClients,
} from '../../data/storage';
import {
  Stethoscope,
  Plus,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Printer,
  Calendar,
  Heart,
  Thermometer,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  User,
  X,
} from 'lucide-react';

export const ClinicalRecords: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(getMedicalRecords());
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(getVaccinations());
  const [pets] = useState<Pet[]>(getPets());
  const [clients] = useState<Client[]>(getClients());

  const [activeTab, setActiveTab] = useState<'expedientes' | 'vacunacion'>('expedientes');
  const [search, setSearch] = useState('');

  // New Consultation Form Modal
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || '');
  const [reason, setReason] = useState('');
  const [temp, setTemp] = useState<number>(38.5);
  const [weight, setWeight] = useState<number>(10.0);
  const [heartRate, setHeartRate] = useState<number>(115);
  const [skinCondition, setSkinCondition] = useState('Piel íntegra, sin eritema ni alopecia.');
  const [coatCondition, setCoatCondition] = useState('Pelaje brillante y denso.');
  const [bodyScore, setBodyScore] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [dermatologicalNotes, setDermatologicalNotes] = useState('');

  // Prescription Print Modal
  const [printedRecord, setPrintedRecord] = useState<MedicalRecord | null>(null);

  // New Vaccination modal
  const [isNewVacOpen, setIsNewVacOpen] = useState(false);
  const [vacPetId, setVacPetId] = useState<string>(pets[0]?.id || '');
  const [rabiesDate, setRabiesDate] = useState('2026-03-01');
  const [rabiesStatus, setRabiesStatus] = useState<'Vigente' | 'Por vencer' | 'Vencida'>('Vigente');
  const [dhppDate, setDhppDate] = useState('2026-03-01');
  const [dhppStatus, setDhppStatus] = useState<'Vigente' | 'Por vencer' | 'Vencida'>('Vigente');
  const [bordetellaDate, setBordetellaDate] = useState('2026-04-01');
  const [bordetellaStatus, setBordetellaStatus] = useState<'Vigente' | 'Por vencer' | 'Vencida'>('Vigente');
  const [dewormingInternal, setDewormingInternal] = useState('2026-09-01');
  const [dewormingExternal, setDewormingExternal] = useState('2026-10-01');
  const [extProduct, setExtProduct] = useState('Simparica Trío');
  const [vacNotice, setVacNotice] = useState('Al corriente');

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === selectedPetId);
    if (!pet) return;

    const newRecord: MedicalRecord = {
      id: `med-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      clientName: pet.clientName,
      date: new Date().toISOString().split('T')[0],
      consultationReason: reason,
      temperature: temp,
      weight,
      heartRate,
      skinCondition,
      coatCondition,
      bodyConditionScore: bodyScore,
      diagnosis,
      treatmentAndPrescription: treatment,
      dermatologicalRecommendations: dermatologicalNotes,
      vetName: 'Dra. Elena Silva (Céd. Prof. 849201)',
    };

    const updated = [newRecord, ...medicalRecords];
    setMedicalRecords(updated);
    saveMedicalRecords(updated);
    setIsNewRecordOpen(false);
    setReason('');
    setDiagnosis('');
    setTreatment('');
    setDermatologicalNotes('');
  };

  const handleCreateVac = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === vacPetId);
    if (!pet) return;

    const newVac: VaccinationRecord = {
      id: `vac-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      clientName: pet.clientName,
      rabiesDate,
      rabiesStatus,
      dhppDate,
      dhppStatus,
      bordetellaDate,
      bordetellaStatus,
      dewormingInternalDate: dewormingInternal,
      dewormingExternalDate: dewormingExternal,
      externalProductUsed: extProduct,
      nextAppointmentNotice: vacNotice,
    };

    const updated = [newVac, ...vaccinations.filter((v) => v.petId !== pet.id)];
    setVaccinations(updated);
    saveVaccinations(updated);
    setIsNewVacOpen(false);
  };

  const getStatusColor = (status: 'Vigente' | 'Por vencer' | 'Vencida') => {
    switch (status) {
      case 'Vigente':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Por vencer':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Vencida':
        return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#0A523C]" />
            Clínica Veterinaria & Expediente Canino
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Dermatología veterinaria, recetas médicas digitales y control estricto de cartilla de vacunación.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('expedientes')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'expedientes'
                ? 'bg-[#0A523C] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Expedientes & Recetas ({medicalRecords.length})
          </button>
          <button
            onClick={() => setActiveTab('vacunacion')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === 'vacunacion'
                ? 'bg-[#0A523C] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Cartilla de Vacunación ({vaccinations.length})
          </button>
        </div>
      </div>

      {/* Sub actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico o dueño..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0A523C]"
          />
        </div>

        {activeTab === 'expedientes' ? (
          <button
            onClick={() => setIsNewRecordOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Consulta / Receta</span>
          </button>
        ) : (
          <button
            onClick={() => setIsNewVacOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Actualizar Cartilla de Vacunas</span>
          </button>
        )}
      </div>

      {/* Tab 1: Expedientes Clínicos */}
      {activeTab === 'expedientes' && (
        <div className="space-y-4">
          {medicalRecords.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
              <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-700">No hay expedientes médicos registrados</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Crea una nueva consulta para registrar signos vitales, exploración dermatológica y emitir la receta.
              </p>
            </div>
          ) : (
            medicalRecords.map((rec) => {
              const pet = pets.find((p) => p.id === rec.petId);

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all p-5 space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A523C] flex items-center justify-center font-bold">
                        <Heart className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 font-heading">
                          {rec.petName} {pet ? `(${pet.breed})` : ''}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          Tutor: {rec.clientName} • Fecha: {rec.date} • Médico: {rec.vetName}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setPrintedRecord(rec)}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0A523C] border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-center transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Ver Receta Digital</span>
                    </button>
                  </div>

                  {/* Motivo de consulta */}
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
                    <span className="font-bold text-gray-700 block mb-0.5">
                      Motivo de Consulta / Dermatológico:
                    </span>
                    <p className="text-gray-800">{rec.consultationReason}</p>
                  </div>

                  {/* Signos Vitales & Exploración física básica */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/70">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-[#0A523C]" />
                        Temperatura
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {rec.temperature} °C
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/70">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3 text-[#0A523C]" />
                        Peso Actual
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {rec.weight} kg
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/70">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        Frec. Cardíaca
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {rec.heartRate} lpm
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/70">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">
                        Condición Corporal
                      </span>
                      <span className="font-bold text-gray-900 text-sm">
                        {rec.bodyConditionScore} / 5 (Ideal)
                      </span>
                    </div>
                  </div>

                  {/* Diagnóstico y Tratamiento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-orange-50/40 p-3 rounded-xl border border-orange-200/70 space-y-1">
                      <span className="font-bold text-orange-950 block">
                        Diagnóstico Presuntivo / Definitivo:
                      </span>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {rec.diagnosis}
                      </p>
                    </div>

                    <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-200/70 space-y-1">
                      <span className="font-bold text-purple-950 block">
                        Tratamiento & Receta Médica:
                      </span>
                      <p className="text-gray-800 leading-relaxed font-medium">
                        {rec.treatmentAndPrescription}
                      </p>
                    </div>
                  </div>

                  {/* Recomendaciones Dermatológicas para el Spa */}
                  {rec.dermatologicalRecommendations && (
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block mb-0.5">Indicaciones para el Área de Estética & Baño:</strong>
                        <span>{rec.dermatologicalRecommendations}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Cartilla de Vacunación y Desparasitación */}
      {activeTab === 'vacunacion' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 text-[#FF8800] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Filtro Sanitario del Salón de Spa</span>
              El control de vacunas (Rabia, Óctuple y Bordetella) garantiza que ningún perrito con riesgo de contagio comparta tina de hidromasaje o cubículo de secado.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaccinations.map((vac) => {
              const pet = pets.find((p) => p.id === vac.petId);

              return (
                <div
                  key={vac.id}
                  className="bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4.5 space-y-3.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base font-heading">
                          {vac.petName}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          Tutor: {vac.clientName}
                        </p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-semibold">
                        {pet?.breed || 'Canino'}
                      </span>
                    </div>

                    {/* Vaccines Checklist */}
                    <div className="space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <span className="font-bold text-gray-900 block">Antirrábica</span>
                          <span className="text-[10px] text-gray-500">Última: {vac.rabiesDate}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(vac.rabiesStatus)}`}>
                          {vac.rabiesStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <span className="font-bold text-gray-900 block">Óctuple (DHPP)</span>
                          <span className="text-[10px] text-gray-500">Última: {vac.dhppDate}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(vac.dhppStatus)}`}>
                          {vac.dhppStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100">
                        <div>
                          <span className="font-bold text-gray-900 block">Bordetella (Tos)</span>
                          <span className="text-[10px] text-gray-500">Última: {vac.bordetellaDate}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(vac.bordetellaStatus)}`}>
                          {vac.bordetellaStatus}
                        </span>
                      </div>
                    </div>

                    {/* Deworming */}
                    <div className="mt-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Desparasitación Int:</span>
                        <span className="font-semibold">{vac.dewormingInternalDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Externa ({vac.externalProductUsed}):</span>
                        <span className="font-semibold">{vac.dewormingExternalDate}</span>
                      </div>
                    </div>
                  </div>

                  {vac.nextAppointmentNotice && (
                    <div className="pt-2 text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                      <strong>Aviso:</strong> {vac.nextAppointmentNotice}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* New Consultation Modal */}
      {isNewRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0A523C] text-white">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    Nuevo Expediente Clínico & Receta Médica
                  </h3>
                  <p className="text-xs text-gray-500">
                    Exploración física veterinaria y recomendaciones dermatológicas
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewRecordOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Pet selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Paciente Canino *
                </label>
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                  required
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed}) — Tutor: {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Motivo de Consulta / Revisión Dermatológica *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Prurito intenso, descamación en lomo, revisión pre-spa..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                />
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Temperatura (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(parseFloat(e.target.value) || 38)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Peso Actual (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 5)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Frec. Cardíaca (lpm)
                  </label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(e) => setHeartRate(parseInt(e.target.value) || 100)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-600 uppercase mb-1">
                    Cond. Corporal (1-5)
                  </label>
                  <select
                    value={bodyScore}
                    onChange={(e) => setBodyScore(parseInt(e.target.value) as any)}
                    className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value={1}>1 - Muy caquéctico</option>
                    <option value={2}>2 - Bajo peso</option>
                    <option value={3}>3 - Ideal</option>
                    <option value={4}>4 - Sobrepeso</option>
                    <option value={5}>5 - Obeso</option>
                  </select>
                </div>
              </div>

              {/* Skin & Coat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Estado de la Piel
                  </label>
                  <input
                    type="text"
                    value={skinCondition}
                    onChange={(e) => setSkinCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    Estado del Pelaje
                  </label>
                  <input
                    type="text"
                    value={coatCondition}
                    onChange={(e) => setCoatCondition(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Diagnosis & Prescription */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Diagnóstico Médico *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Dermatitis por Malassezia, otitis ceruminosa..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Tratamiento Farmacológico & Receta *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej: Gotas óticas cada 12 horas por 8 días, baño medicinal..."
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Recomendaciones Dermatológicas para el Spa
                </label>
                <input
                  type="text"
                  placeholder="Ej: Usar shampoo con clorhexidina 2%, evitar secador muy caliente"
                  value={dermatologicalNotes}
                  onChange={(e) => setDermatologicalNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A523C] focus:outline-none"
                />
              </div>

              {/* Submit */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewRecordOpen(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Guardar Expediente & Generar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Digital Prescription Modal */}
      {printedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative">
            <button
              onClick={() => setPrintedRecord(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div id="printable-area" className="p-7 space-y-4 text-xs font-sans text-gray-800">
              {/* Prescription Header */}
              <div className="flex items-center justify-between pb-4 border-b-2 border-[#0A523C]">
                <div>
                  <img
                    src="https://appdesignproyectos.com/dolcheduchalogo.png"
                    alt="Dolche Ducha"
                    className="h-12 w-auto object-contain mb-1"
                  />
                  <h2 className="font-bold text-sm text-[#0A523C] tracking-wide">
                    RECETA MÉDICA VETERINARIA
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Dolche Ducha Spa & Clínica Dermatológica Canina
                  </p>
                </div>
                <div className="text-right text-[11px] text-gray-500">
                  <p className="font-bold text-gray-800">{printedRecord.vetName}</p>
                  <p>Medicina Canina & Dermatología</p>
                  <p className="text-gray-400">Fecha: {printedRecord.date}</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-500">Paciente:</span>{' '}
                  <strong className="text-gray-900">{printedRecord.petName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Tutor:</span>{' '}
                  <strong>{printedRecord.clientName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Peso:</span>{' '}
                  <strong>{printedRecord.weight} kg</strong>
                </div>
                <div>
                  <span className="text-gray-500">Temperatura:</span>{' '}
                  <strong>{printedRecord.temperature} °C</strong>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="border-l-4 border-[#0A523C] pl-3 py-1">
                <span className="font-bold text-gray-900 uppercase text-[10px] tracking-wider block">
                  Diagnóstico:
                </span>
                <p className="text-gray-800 font-medium">{printedRecord.diagnosis}</p>
              </div>

              {/* Prescription Body (Rx) */}
              <div className="pt-2">
                <span className="text-base font-bold text-[#0A523C] font-heading block mb-1">
                  Rp. / Prescripción Médica:
                </span>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-800 text-xs leading-relaxed whitespace-pre-line font-medium">
                  {printedRecord.treatmentAndPrescription}
                </div>
              </div>

              {/* Dermatological Recommendations */}
              {printedRecord.dermatologicalRecommendations && (
                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200 text-[11px] text-emerald-950">
                  <strong>Recomendaciones para el Baño:</strong>{' '}
                  {printedRecord.dermatologicalRecommendations}
                </div>
              )}

              {/* Doctor signature line */}
              <div className="pt-10 flex flex-col items-center justify-center text-center">
                <div className="w-48 border-t border-gray-400 mb-1" />
                <p className="font-bold text-xs text-gray-800">{printedRecord.vetName}</p>
                <p className="text-[10px] text-gray-500">Firma y Sello del Médico Veterinario</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Receta</span>
              </button>
              <button
                onClick={() => setPrintedRecord(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Vaccination Record Modal */}
      {isNewVacOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#0A523C] text-white">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    Actualizar Cartilla de Vacunación
                  </h3>
                  <p className="text-xs text-gray-500">
                    Control de Rabia, DHPP, Bordetella y Desparasitaciones
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewVacOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVac} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Mascota
                </label>
                <select
                  value={vacPetId}
                  onChange={(e) => setVacPetId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed}) — Tutor: {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rabies */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Vacuna Rabia (Fecha)
                  </label>
                  <input
                    type="date"
                    value={rabiesDate}
                    onChange={(e) => setRabiesDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Estado
                  </label>
                  <select
                    value={rabiesStatus}
                    onChange={(e) => setRabiesStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Vigente">Vigente</option>
                    <option value="Por vencer">Por vencer</option>
                    <option value="Vencida">Vencida</option>
                  </select>
                </div>
              </div>

              {/* DHPP */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Óctuple / Múltiple (Fecha)
                  </label>
                  <input
                    type="date"
                    value={dhppDate}
                    onChange={(e) => setDhppDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Estado
                  </label>
                  <select
                    value={dhppStatus}
                    onChange={(e) => setDhppStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Vigente">Vigente</option>
                    <option value="Por vencer">Por vencer</option>
                    <option value="Vencida">Vencida</option>
                  </select>
                </div>
              </div>

              {/* Bordetella */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Bordetella Tos (Fecha)
                  </label>
                  <input
                    type="date"
                    value={bordetellaDate}
                    onChange={(e) => setBordetellaDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Estado
                  </label>
                  <select
                    value={bordetellaStatus}
                    onChange={(e) => setBordetellaStatus(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                  >
                    <option value="Vigente">Vigente</option>
                    <option value="Por vencer">Por vencer</option>
                    <option value="Vencida">Vencida</option>
                  </select>
                </div>
              </div>

              {/* Deworming */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Desparasitación Interna
                  </label>
                  <input
                    type="date"
                    value={dewormingInternal}
                    onChange={(e) => setDewormingInternal(e.target.value)}
                    className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                    Desparasitación Externa
                  </label>
                  <input
                    type="date"
                    value={dewormingExternal}
                    onChange={(e) => setDewormingExternal(e.target.value)}
                    className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                  Producto Externo Utilizado
                </label>
                <input
                  type="text"
                  value={extProduct}
                  onChange={(e) => setExtProduct(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                  placeholder="Ej: Simparica, NexGard, Bravecto"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewVacOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A523C] hover:bg-[#083e2e] text-white font-semibold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Guardar Cartilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
