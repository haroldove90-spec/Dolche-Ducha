import React, { useState } from 'react';
import { Client, Pet } from '../../types';
import {
  getClients,
  saveClients,
  getPets,
  savePets,
} from '../../data/storage';
import {
  Users,
  Plus,
  Search,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  AlertTriangle,
  Heart,
  Dog,
  ShieldCheck,
  Edit,
  Trash2,
} from 'lucide-react';

export const ClientsAndPets: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(getClients());
  const [pets, setPets] = useState<Pet[]>(getPets());
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWhatsapp, setClientWhatsapp] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // Pet form fields
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petSex, setPetSex] = useState<'Macho' | 'Hembra'>('Macho');
  const [petWeight, setPetWeight] = useState<number>(5.0);
  const [petPhotoUrl, setPetPhotoUrl] = useState('');
  const [behaviorAlert, setBehaviorAlert] = useState('');
  const [medicalAlert, setMedicalAlert] = useState('');

  const defaultDogPhotos = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80',
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !petName.trim()) return;

    const newClientId = `cli-${Date.now()}`;
    const newPetId = `pet-${Date.now()}`;

    const chosenPhoto =
      petPhotoUrl.trim() ||
      defaultDogPhotos[Math.floor(Math.random() * defaultDogPhotos.length)];

    const newClient: Client = {
      id: newClientId,
      name: clientName,
      phone: clientPhone,
      whatsapp: clientWhatsapp.replace(/\D/g, '') || clientPhone.replace(/\D/g, ''),
      address: clientAddress,
      email: clientEmail,
      totalVisits: 1,
      totalSpent: 0,
      pets: [newPetId],
    };

    const newPet: Pet = {
      id: newPetId,
      clientId: newClientId,
      clientName: clientName,
      name: petName,
      breed: petBreed,
      age: petAge,
      sex: petSex,
      weight: Number(petWeight),
      photoUrl: chosenPhoto,
      behavioralAlerts: behaviorAlert.trim() ? [behaviorAlert.trim()] : [],
      medicalAlerts: medicalAlert.trim() ? [medicalAlert.trim()] : [],
      preferredShampoo: 'Shampoo Hipoalergénico Dolche',
      preferredAroma: 'Bruma Dulce Canela',
    };

    const updatedClients = [newClient, ...clients];
    const updatedPets = [newPet, ...pets];

    setClients(updatedClients);
    setPets(updatedPets);
    saveClients(updatedClients);
    savePets(updatedPets);

    // Reset
    setIsModalOpen(false);
    setClientName('');
    setClientPhone('');
    setClientWhatsapp('');
    setClientAddress('');
    setClientEmail('');
    setPetName('');
    setPetBreed('');
    setPetAge('');
    setPetPhotoUrl('');
    setBehaviorAlert('');
    setMedicalAlert('');
  };

  const filteredPets = pets.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <Users className="w-6 h-6 text-[#FF8800]" />
            Registro de Clientes & Mascotas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Ficha rápida de dueños y perritos con contacto directo a WhatsApp y expediente básico.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF8800] hover:bg-[#e67a00] text-white font-semibold rounded-xl text-sm transition shadow-sm cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cliente & Canino</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por nombre de perrito, raza o nombre del dueño..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-gray-400 hover:text-gray-700 font-semibold"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Pets and Owners Grid */}
      {filteredPets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <Dog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No se encontraron mascotas</h3>
          <p className="text-xs text-gray-500 mt-1">
            Usa el botón "Nuevo Cliente & Canino" para registrar un nuevo perfil en el spa.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPets.map((pet) => {
            const owner = clients.find((c) => c.id === pet.clientId);
            const waNumber = owner?.whatsapp || owner?.phone?.replace(/\D/g, '') || '';
            const waUrl = waNumber
              ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
                  `¡Hola ${pet.clientName}! Te saludamos de Dolche Ducha Spa Canino respecto a ${pet.name}.`
                )}`
              : null;

            return (
              <div
                key={pet.id}
                className="bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Sex & Weight badge */}
                  <div className="relative h-44 bg-gray-100 overflow-hidden">
                    <img
                      src={pet.photoUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-gray-800 shadow-xs flex items-center gap-1">
                      <span>{pet.sex}</span>
                      <span>•</span>
                      <span>{pet.weight} kg</span>
                    </div>

                    <div className="absolute top-3 right-3 bg-[#FF8800] text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-xs">
                      {pet.age}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4.5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 font-heading">
                          {pet.name}
                        </h3>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                          {pet.breed}
                        </span>
                      </div>
                    </div>

                    {/* Alerts Pills */}
                    {(pet.behavioralAlerts.length > 0 || pet.medicalAlerts.length > 0) && (
                      <div className="space-y-1.5 pt-1">
                        {pet.behavioralAlerts.map((alert, i) => (
                          <div
                            key={i}
                            className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1.5 font-medium"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-[#FF8800] flex-shrink-0" />
                            <span className="truncate">{alert}</span>
                          </div>
                        ))}
                        {pet.medicalAlerts.map((alert, i) => (
                          <div
                            key={i}
                            className="bg-pink-50 text-pink-800 text-xs px-2.5 py-1 rounded-lg border border-pink-200/60 flex items-center gap-1.5 font-medium"
                          >
                            <Heart className="w-3.5 h-3.5 text-[#B33892] flex-shrink-0" />
                            <span className="truncate">{alert}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Owner Card Section */}
                    <div className="pt-2 border-t border-gray-100 text-xs text-gray-600 space-y-1.5 bg-gray-50/70 p-3 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          {pet.clientName}
                        </span>
                        {owner && (
                          <span className="text-[11px] text-gray-500">
                            {owner.totalVisits} visitas
                          </span>
                        )}
                      </div>

                      {owner?.address && (
                        <p className="flex items-start gap-1.5 text-gray-500 text-[11px] truncate">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{owner.address}</span>
                        </p>
                      )}

                      {owner?.phone && (
                        <p className="flex items-center gap-1.5 text-gray-600 text-[11px]">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{owner.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action: WhatsApp direct button */}
                <div className="p-4 pt-0">
                  {waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat por WhatsApp</span>
                    </a>
                  ) : (
                    <div className="text-center text-xs text-gray-400 py-2">
                      Sin número de WhatsApp registrado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Client & Pet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-[#FF8800]">
                  <Dog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    Registro Rápido de Cliente y Mascota
                  </h3>
                  <p className="text-xs text-gray-500">
                    Ingresa los datos del dueño y del canino
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

            <form onSubmit={handleRegister} className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              {/* Owner Info Box */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FF8800]" />
                  Datos del Dueño / Tutor
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Sofia Navarro"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Teléfono Móvil
                    </label>
                    <input
                      type="tel"
                      placeholder="+52 55 1234 5678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      WhatsApp (con lada) *
                    </label>
                    <input
                      type="text"
                      placeholder="525512345678"
                      value={clientWhatsapp}
                      onChange={(e) => setClientWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="cliente@ejemplo.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    placeholder="Calle, número, colonia"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  />
                </div>
              </div>

              {/* Pet Info Box */}
              <div className="space-y-3 bg-orange-50/40 p-4 rounded-xl border border-orange-200/60">
                <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Dog className="w-3.5 h-3.5 text-[#FF8800]" />
                  Datos del Canino
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Nombre del Canino *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Max"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Raza *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Beagle, Mestizo, Schnauzer"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Edad
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: 2 años"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Sexo
                    </label>
                    <select
                      value={petSex}
                      onChange={(e) => setPetSex(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    >
                      <option value="Macho">Macho</option>
                      <option value="Hembra">Hembra</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="6.5"
                      value={petWeight}
                      onChange={(e) => setPetWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    URL de Fotografía para identificación (opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={petPhotoUrl}
                    onChange={(e) => setPetPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Alerta Conductual
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Nervioso con la máquina, dócil"
                      value={behaviorAlert}
                      onChange={(e) => setBehaviorAlert(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Alerta Médica / Alergias
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Alérgico a fragancia cítrica"
                      value={medicalAlert}
                      onChange={(e) => setMedicalAlert(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF8800] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
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
                  Registrar Cliente y Mascota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
