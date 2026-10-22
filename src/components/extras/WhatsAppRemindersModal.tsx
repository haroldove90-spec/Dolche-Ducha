import React, { useState } from 'react';
import { Appointment, Client } from '../../types';
import { getClients } from '../../data/storage';
import {
  X,
  MessageCircle,
  Copy,
  ExternalLink,
  Check,
  Send,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
}

export const WhatsAppRemindersModal: React.FC<Props> = ({
  appointment,
  onClose,
}) => {
  if (!appointment) return null;

  const clients = getClients();
  const owner = clients.find((c) => c.id === appointment.clientId);

  const rawPhone = owner?.whatsapp || owner?.phone?.replace(/\D/g, '') || '';
  const [phoneNumber, setPhoneNumber] = useState(rawPhone);
  const [copied, setCopied] = useState(false);

  const defaultMessage = `¡Hola ${appointment.clientName}! 🐾\n\nTe recordamos desde *Dolche Ducha Spa Canino* que mañana tenemos consentidera programada para *${appointment.petName}*:\n\n📅 *Fecha:* ${appointment.date}\n⏰ *Hora:* ${appointment.time}\n🛁 *Servicio:* ${appointment.serviceName}\n📍 *Ubicación:* ${appointment.cubicle}\n✂️ *Estilista:* ${appointment.stylist}\n\nPor favor indícanos si confirmas tu asistencia. ¡Nos vemos pronto! ✨`;

  const [message, setMessage] = useState(defaultMessage);

  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base font-heading">
                Recordatorio Automático por WhatsApp
              </h3>
              <p className="text-xs text-gray-500">
                Confirmación de cita 24h antes para {appointment.petName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
              Número de WhatsApp (con código de país, ej. 52...)
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="525512345678"
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-600">
                Mensaje Personalizado
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
              </button>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl font-sans text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>
              Al dar clic en <strong>Enviar por WhatsApp</strong>, se abrirá la aplicación oficial o WhatsApp Web con el texto prellenado listo para enviar.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold cursor-pointer"
          >
            Cerrar
          </button>

          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar por WhatsApp</span>
            </a>
          ) : (
            <button
              disabled
              className="px-5 py-2.5 bg-gray-300 text-gray-500 font-semibold rounded-xl text-xs sm:text-sm cursor-not-allowed"
            >
              Ingresa un teléfono válido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
