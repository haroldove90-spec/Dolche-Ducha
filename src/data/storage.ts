import {
  Pet,
  Client,
  Appointment,
  ProductOrService,
  SaleTransaction,
  MedicalRecord,
  VaccinationRecord,
  BeforeAfterPhoto,
  RolePermissions,
  SupabaseConfig,
} from '../types';
import {
  INITIAL_CLIENTS,
  INITIAL_PETS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRODUCTS_SERVICES,
  INITIAL_SALES,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_VACCINATIONS,
  INITIAL_BEFORE_AFTER,
  DEFAULT_PERMISSIONS,
} from './mockData';

const KEYS = {
  SAMPLE_CLEARED: 'dolche_sample_cleared',
  CLIENTS: 'dolche_clients',
  PETS: 'dolche_pets',
  APPOINTMENTS: 'dolche_appointments',
  PRODUCTS: 'dolche_products',
  SALES: 'dolche_sales',
  MEDICAL: 'dolche_medical',
  VACCINATIONS: 'dolche_vaccinations',
  BEFORE_AFTER: 'dolche_before_after',
  PERMISSIONS: 'dolche_permissions',
  SUPABASE: 'dolche_supabase_config',
};

// Check if sample data has been permanently cleared by the user
export function isSampleDataCleared(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.SAMPLE_CLEARED) === 'true';
}

// Helper to get array from localStorage or fallback
function getItem<T>(key: string, fallback: T[]): T[] {
  if (typeof window === 'undefined') return fallback;
  const cleared = isSampleDataCleared();
  const raw = localStorage.getItem(key);
  if (raw !== null) {
    try {
      return JSON.parse(raw);
    } catch {
      return cleared ? [] : fallback;
    }
  }
  return cleared ? [] : fallback;
}

function setItem<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('dolche_data_changed'));
}

// Data Getters
export function getClients(): Client[] {
  return getItem<Client>(KEYS.CLIENTS, INITIAL_CLIENTS);
}

export function saveClients(clients: Client[]) {
  setItem(KEYS.CLIENTS, clients);
}

export function getPets(): Pet[] {
  return getItem<Pet>(KEYS.PETS, INITIAL_PETS);
}

export function savePets(pets: Pet[]) {
  setItem(KEYS.PETS, pets);
}

export function getAppointments(): Appointment[] {
  return getItem<Appointment>(KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
}

export function saveAppointments(appointments: Appointment[]) {
  setItem(KEYS.APPOINTMENTS, appointments);
}

export function getProducts(): ProductOrService[] {
  return getItem<ProductOrService>(KEYS.PRODUCTS, INITIAL_PRODUCTS_SERVICES);
}

export function saveProducts(products: ProductOrService[]) {
  setItem(KEYS.PRODUCTS, products);
}

export function getSales(): SaleTransaction[] {
  return getItem<SaleTransaction>(KEYS.SALES, INITIAL_SALES);
}

export function saveSales(sales: SaleTransaction[]) {
  setItem(KEYS.SALES, sales);
}

export function getMedicalRecords(): MedicalRecord[] {
  return getItem<MedicalRecord>(KEYS.MEDICAL, INITIAL_MEDICAL_RECORDS);
}

export function saveMedicalRecords(records: MedicalRecord[]) {
  setItem(KEYS.MEDICAL, records);
}

export function getVaccinations(): VaccinationRecord[] {
  return getItem<VaccinationRecord>(KEYS.VACCINATIONS, INITIAL_VACCINATIONS);
}

export function saveVaccinations(vaccinations: VaccinationRecord[]) {
  setItem(KEYS.VACCINATIONS, vaccinations);
}

export function getBeforeAfterPhotos(): BeforeAfterPhoto[] {
  return getItem<BeforeAfterPhoto>(KEYS.BEFORE_AFTER, INITIAL_BEFORE_AFTER);
}

export function saveBeforeAfterPhotos(photos: BeforeAfterPhoto[]) {
  setItem(KEYS.BEFORE_AFTER, photos);
}

export function getPermissions(): Record<string, RolePermissions> {
  if (typeof window === 'undefined') return DEFAULT_PERMISSIONS;
  const raw = localStorage.getItem(KEYS.PERMISSIONS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_PERMISSIONS;
    }
  }
  return DEFAULT_PERMISSIONS;
}

export function savePermissions(perms: Record<string, RolePermissions>) {
  setItem(KEYS.PERMISSIONS, perms);
}

export function getSupabaseConfig(): SupabaseConfig {
  const fallback: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false,
    syncEnabled: false,
  };
  if (typeof window === 'undefined') return fallback;
  const raw = localStorage.getItem(KEYS.SUPABASE);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export function saveSupabaseConfig(config: SupabaseConfig) {
  setItem(KEYS.SUPABASE, config);
}

// Complete clear of sample data permanently
export function clearAllSampleData() {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SAMPLE_CLEARED, 'true');
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify([]));
  localStorage.setItem(KEYS.PETS, JSON.stringify([]));
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify([]));
  // Preserve default catalog for convenient use, or reset to empty if chosen
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS_SERVICES));
  localStorage.setItem(KEYS.SALES, JSON.stringify([]));
  localStorage.setItem(KEYS.MEDICAL, JSON.stringify([]));
  localStorage.setItem(KEYS.VACCINATIONS, JSON.stringify([]));
  localStorage.setItem(KEYS.BEFORE_AFTER, JSON.stringify([]));
  window.dispatchEvent(new Event('dolche_data_changed'));
}

// Restore default demo sample data
export function restoreSampleData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.SAMPLE_CLEARED);
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(INITIAL_CLIENTS));
  localStorage.setItem(KEYS.PETS, JSON.stringify(INITIAL_PETS));
  localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS_SERVICES));
  localStorage.setItem(KEYS.SALES, JSON.stringify(INITIAL_SALES));
  localStorage.setItem(KEYS.MEDICAL, JSON.stringify(INITIAL_MEDICAL_RECORDS));
  localStorage.setItem(KEYS.VACCINATIONS, JSON.stringify(INITIAL_VACCINATIONS));
  localStorage.setItem(KEYS.BEFORE_AFTER, JSON.stringify(INITIAL_BEFORE_AFTER));
  localStorage.setItem(KEYS.PERMISSIONS, JSON.stringify(DEFAULT_PERMISSIONS));
  window.dispatchEvent(new Event('dolche_data_changed'));
}
