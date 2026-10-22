import React, { useState, useEffect } from 'react';
import { UserRole, Appointment } from './types';
import { Splash } from './components/Splash';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { DataManagementModal } from './components/DataManagementModal';

// Reception Modules
import { AppointmentsCalendar } from './components/recepcion/AppointmentsCalendar';
import { ClientsAndPets } from './components/recepcion/ClientsAndPets';
import { POSRegister } from './components/recepcion/POSRegister';

// Stylist Modules
import { StylistWorkspace } from './components/estilista/StylistWorkspace';

// Veterinarian Modules
import { ClinicalRecords } from './components/veterinario/ClinicalRecords';

// Admin Modules
import { AdminDashboard } from './components/admin/AdminDashboard';

// Extras
import { WhatsAppRemindersModal } from './components/extras/WhatsAppRemindersModal';
import { BeforeAfterGallery } from './components/extras/BeforeAfterGallery';
import { getAppointments } from './data/storage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [currentModule, setCurrentModule] = useState<string>('agenda');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // WhatsApp Reminder Modal
  const [selectedAptForWhatsApp, setSelectedAptForWhatsApp] = useState<Appointment | null>(null);

  // Sync default module when changing role
  const handleSelectRole = (role: UserRole) => {
    setActiveRole(role);
    switch (role) {
      case 'recepcion':
        setCurrentModule('agenda');
        break;
      case 'estilista':
        setCurrentModule('operativo');
        break;
      case 'veterinario':
        setCurrentModule('expedientes');
        break;
      case 'administrador':
        setCurrentModule('caja');
        break;
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
  };

  // Render active module component
  const renderCurrentModule = () => {
    switch (activeRole) {
      case 'recepcion':
        switch (currentModule) {
          case 'agenda':
            return (
              <AppointmentsCalendar
                onOpenWhatsAppModal={(apt) => setSelectedAptForWhatsApp(apt)}
              />
            );
          case 'clientes':
            return <ClientsAndPets />;
          case 'pos':
            return <POSRegister />;
          case 'recordatorios': {
            const apts = getAppointments();
            return (
              <div className="space-y-4">
                <AppointmentsCalendar
                  onOpenWhatsAppModal={(apt) => setSelectedAptForWhatsApp(apt)}
                />
              </div>
            );
          }
          case 'galeria':
            return <BeforeAfterGallery />;
          default:
            return (
              <AppointmentsCalendar
                onOpenWhatsAppModal={(apt) => setSelectedAptForWhatsApp(apt)}
              />
            );
        }

      case 'estilista':
        switch (currentModule) {
          case 'operativo':
          case 'admision':
          case 'historial':
            return <StylistWorkspace />;
          case 'galeria':
            return <BeforeAfterGallery />;
          default:
            return <StylistWorkspace />;
        }

      case 'veterinario':
        switch (currentModule) {
          case 'expedientes':
          case 'receta':
          case 'vacunacion':
            return <ClinicalRecords />;
          case 'clientes':
            return <ClientsAndPets />;
          default:
            return <ClinicalRecords />;
        }

      case 'administrador':
        switch (currentModule) {
          case 'caja':
          case 'estadisticas':
          case 'permisos':
            return <AdminDashboard onOpenDataModal={() => setIsDataModalOpen(true)} />;
          case 'catalogo':
            return <POSRegister />;
          case 'datos':
            return <AdminDashboard onOpenDataModal={() => setIsDataModalOpen(true)} />;
          default:
            return <AdminDashboard onOpenDataModal={() => setIsDataModalOpen(true)} />;
        }

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#FF8800]/20 selection:text-[#0A523C]">
      {/* Splash Screen */}
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}

      {/* Screen 1: Role Selector Home (No header, clean 2-col mobile / 4-col desktop grid) */}
      {!activeRole ? (
        <RoleSelector onSelectRole={handleSelectRole} />
      ) : (
        /* Screen 2: Role Active Layout with Unified Header & Navigation */
        <div className="min-h-screen flex flex-col">
          {/* Institutional Header */}
          <Header
            activeRole={activeRole}
            onLogout={handleLogout}
            onOpenDataModal={() => setIsDataModalOpen(true)}
            onSwitchRole={handleSelectRole}
          />

          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Collapsible Sidebar */}
            <Sidebar
              activeRole={activeRole}
              currentModule={currentModule}
              onSelectModule={setCurrentModule}
              onLogout={handleLogout}
              onOpenDataModal={() => setIsDataModalOpen(true)}
              collapsed={sidebarCollapsed}
              onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Main Content Area - Clean without duplicated horizontal tabs */}
            <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
              {renderCurrentModule()}
            </main>
          </div>

          {/* Mobile & Tablet Bottom Bar */}
          <BottomBar
            activeRole={activeRole}
            currentModule={currentModule}
            onSelectModule={setCurrentModule}
          />
        </div>
      )}

      {/* Global Modals */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      <WhatsAppRemindersModal
        appointment={selectedAptForWhatsApp}
        onClose={() => setSelectedAptForWhatsApp(null)}
      />
    </div>
  );
}
