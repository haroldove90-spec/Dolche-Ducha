export type UserRole = 'recepcion' | 'estilista' | 'veterinario' | 'administrador';

export interface Pet {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  breed: string;
  age: string;
  sex: 'Macho' | 'Hembra';
  weight: number; // in kg
  photoUrl: string;
  behavioralAlerts: string[]; // e.g., 'Se estresa con la máquina', 'Mordedor en secado'
  medicalAlerts: string[]; // e.g., 'Alérgico al shampoo de almendras', 'Cuidado con las orejas'
  lastServiceDate?: string;
  lastBladeNumber?: string; // e.g., 'Cuchilla #7F cuerpo, #10 zonas sensibles'
  preferredShampoo?: string; // e.g., 'Avena coloidal hipoalergénico'
  preferredAroma?: string; // e.g., 'Lavanda relajante'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address: string;
  email?: string;
  totalVisits: number;
  totalSpent: number;
  pets: string[]; // Pet IDs
}

export type AppointmentStatus = 'Agendada' | 'En proceso' | 'Finalizada' | 'Cancelada' | 'No asistió';

export interface AdmissionChecklist {
  hasParasites: boolean;
  parasitesDetail: string;
  hasWoundsOrLumps: boolean;
  woundsDetail: string;
  temperament: 'Tranquilo' | 'Nervioso' | 'Agresivo con secador / agua' | 'Requiere bozal';
  mattingLevel: 'Bajo' | 'Medio' | 'Alto';
  earsCondition: 'Limpio' | 'Enrojecido / Sucio' | 'Sospecha de otitis';
  nailsCondition: 'Cortas' | 'Largas (requiere corte)' | 'Encarnadas';
  skinCondition: 'Sana' | 'Reseca' | 'Dermatitis visible' | 'Alergia activa';
  selectedShampoo: string;
  selectedAromatherapy: string;
  bladeNumber: string;
  stylistNotes: string;
  completedAt?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  clientId: string;
  clientName: string;
  petBreed: string;
  petPhotoUrl: string;
  cubicle: string; // 'Cubículo 1 - Baño Express', 'Cubículo 2 - Spa Estilismo', 'Cubículo 3 - Corte Especial', 'Cubículo 4 - Ozono & Relax'
  stylist: string; // 'Carlos M.', 'Sofía R.', 'Andrea P.', 'Laura G.'
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  serviceName: string;
  servicePrice: number;
  status: AppointmentStatus;
  notes?: string;
  checklist?: AdmissionChecklist;
}

export interface ProductOrService {
  id: string;
  name: string;
  category: 'Servicio de Estética' | 'Accesorio' | 'Snack & Premio' | 'Higiene & Cosmética';
  type: 'servicio' | 'producto';
  price: number;
  description: string;
  stock?: number;
  image?: string;
}

export interface CartItem {
  item: ProductOrService;
  quantity: number;
}

export interface SaleTransaction {
  id: string;
  ticketNumber: string;
  date: string;
  time: string;
  clientName: string;
  petName?: string;
  items: {
    id: string;
    name: string;
    type: 'servicio' | 'producto';
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia';
  cashier: string;
}

export interface MedicalRecord {
  id: string;
  petId: string;
  petName: string;
  clientName: string;
  date: string;
  consultationReason: string;
  temperature: number; // °C
  weight: number; // kg
  heartRate: number; // lpm
  skinCondition: string;
  coatCondition: string;
  bodyConditionScore: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  diagnosis: string;
  treatmentAndPrescription: string;
  dermatologicalRecommendations: string;
  vetName: string;
}

export interface VaccinationRecord {
  id: string;
  petId: string;
  petName: string;
  clientName: string;
  rabiesDate: string;
  rabiesStatus: 'Vigente' | 'Por vencer' | 'Vencida';
  dhppDate: string;
  dhppStatus: 'Vigente' | 'Por vencer' | 'Vencida';
  bordetellaDate: string;
  bordetellaStatus: 'Vigente' | 'Por vencer' | 'Vencida';
  dewormingInternalDate: string;
  dewormingExternalDate: string;
  externalProductUsed: string; // e.g., 'Simparica Trío', 'Bravecto'
  nextAppointmentNotice: string;
}

export interface RolePermissions {
  viewFinancials: boolean;
  modifyPrices: boolean;
  deleteRecords: boolean;
  editMedicalRecords: boolean;
  accessPOS: boolean;
  manageUsers: boolean;
}

export interface BeforeAfterPhoto {
  id: string;
  petId: string;
  petName: string;
  clientName: string;
  date: string;
  service: string;
  beforeUrl: string;
  afterUrl: string;
  stylistName: string;
  notes: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
  syncEnabled: boolean;
}
