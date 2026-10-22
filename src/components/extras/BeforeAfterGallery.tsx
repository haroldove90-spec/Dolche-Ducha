import React, { useState } from 'react';
import { BeforeAfterPhoto, Pet } from '../../types';
import {
  getBeforeAfterPhotos,
  saveBeforeAfterPhotos,
  getPets,
} from '../../data/storage';
import {
  Image as ImageIcon,
  Plus,
  Share2,
  Sparkles,
  Scissors,
  CheckCircle,
  Calendar,
  User,
  ArrowRight,
  X,
} from 'lucide-react';

export const BeforeAfterGallery: React.FC = () => {
  const [photos, setPhotos] = useState<BeforeAfterPhoto[]>(getBeforeAfterPhotos());
  const [pets] = useState<Pet[]>(getPets());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [petId, setPetId] = useState(pets[0]?.id || '');
  const [service, setService] = useState('Corte de Raza & Spa');
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [stylistName, setStylistName] = useState('Sofía R.');
  const [notes, setNotes] = useState('');

  const samplePresets = [
    {
      before: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    },
    {
      before: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    },
    {
      before: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    const pet = pets.find((p) => p.id === petId);
    const chosenBefore =
      beforeUrl.trim() || samplePresets[0].before;
    const chosenAfter =
      afterUrl.trim() || samplePresets[0].after;

    const newEntry: BeforeAfterPhoto = {
      id: `ba-${Date.now()}`,
      petId: pet?.id || 'pet-custom',
      petName: pet?.name ? `${pet.name} (${pet.breed})` : 'Perrito Dolche',
      clientName: pet?.clientName || 'Cliente Spa',
      date: new Date().toISOString().split('T')[0],
      service,
      beforeUrl: chosenBefore,
      afterUrl: chosenAfter,
      stylistName,
      notes: notes || 'Transformación estética realizada con éxito.',
    };

    const updated = [newEntry, ...photos];
    setPhotos(updated);
    saveBeforeAfterPhotos(updated);
    setIsModalOpen(false);
    setBeforeUrl('');
    setAfterUrl('');
    setNotes('');
  };

  const handleShare = (entry: BeforeAfterPhoto) => {
    const text = `¡Mira la increíble transformación de ${entry.petName} en Dolche Ducha Spa Canino! 🐾✨ Servicio: ${entry.service} por ${entry.stylistName}.`;
    if (navigator.share) {
      navigator.share({
        title: 'Dolche Ducha - Antes y Después',
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#B33892]" />
            Galería "Antes y Después" Dolche Ducha
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Registro visual de transformaciones de corte, deslanado y estilismo para compartir con el dueño y redes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B33892] hover:bg-[#922b75] text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-xs cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Subir Nueva Transformación</span>
        </button>
      </div>

      {/* Gallery Cards */}
      {photos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No hay fotos en la galería</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Sube fotos del antes y el después para mostrar la calidad del estilismo a los clientes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-200/90 hover:border-pink-200 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Images Comparison Grid */}
                <div className="grid grid-cols-2 gap-1 p-2 bg-gray-100 relative">
                  {/* Before */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
                    <img
                      src={item.beforeUrl}
                      alt="Antes"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      ANTES
                    </span>
                  </div>

                  {/* After */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-200">
                    <img
                      src={item.afterUrl}
                      alt="Después"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#0A523C] text-white text-[10px] font-bold rounded-md shadow-xs">
                      DESPUÉS ✨
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4.5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base font-heading">
                        {item.petName}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Tutor: {item.clientName} • Estilista: {item.stylistName}
                      </p>
                    </div>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {item.date}
                    </span>
                  </div>

                  <div className="bg-pink-50/60 text-[#B33892] px-2.5 py-1 rounded-lg text-xs font-semibold inline-block">
                    {item.service}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{item.notes}"
                  </p>
                </div>
              </div>

              {/* Card Footer: Share */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => handleShare(item)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold bg-gray-100 hover:bg-[#FF8800] hover:text-white text-gray-700 rounded-xl transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Compartir con el Dueño / Redes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-pink-50/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#B33892] text-white">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base font-heading">
                    Nueva Foto Antes y Después
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sube las fotografías de la sesión de estética
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

            <form onSubmit={handleAddPhoto} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Mascota
                </label>
                <select
                  value={petId}
                  onChange={(e) => setPetId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.breed}) — Tutor: {p.clientName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Servicio Realizado
                </label>
                <input
                  type="text"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="Ej: Corte Osito Boo + Spa Hidratante"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    URL Foto "Antes" (Ingreso)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={beforeUrl}
                    onChange={(e) => setBeforeUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                    URL Foto "Después" (Final)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={afterUrl}
                    onChange={(e) => setAfterUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Estilista a Cargo
                </label>
                <select
                  value={stylistName}
                  onChange={(e) => setStylistName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <option value="Sofía R.">Sofía R.</option>
                  <option value="Carlos M.">Carlos M.</option>
                  <option value="Andrea P.">Andrea P.</option>
                  <option value="Laura G.">Laura G.</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  Observaciones de la Transformación
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalles del corte, textura de pelo, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B33892] hover:bg-[#922b75] text-white font-semibold rounded-xl transition shadow-xs cursor-pointer"
                >
                  Guardar en Galería
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
