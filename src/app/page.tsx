'use client';

import { useState, useEffect } from 'react';
import { useAdminStore, PageType } from '@/lib/store';
import { Dashboard } from '@/components/admin/dashboard';
import { NikInternalPage } from '@/components/admin/nik-internal';
import { NikEksternalPage } from '@/components/admin/nik-eksternal';
import { VendorRegisterPage } from '@/components/admin/vendor-register';
import { BuyerRegisterPage } from '@/components/admin/buyer-register';
import { BuyerDatabasePage } from '@/components/admin/buyer-database';
import { KontrakRegisterPage } from '@/components/admin/kontrak-register';
import { PermohonanVendorPage } from '@/components/admin/permohonan-vendor';
import { PermintaanBarangPage } from '@/components/admin/permintaan-barang';
import { LogTransaksiPage } from '@/components/admin/log-transaksi';
import { LaporanKeuanganPage } from '@/components/admin/laporan-keuangan';
import { PayrollPage } from '@/components/admin/payroll';
import { RegisterInvoicePage } from '@/components/admin/register-invoice';
import { RegisterPembayaranPage } from '@/components/admin/register-pembayaran';
import { AgtManagementPage } from '@/components/admin/agt-management';
import { DataProyekPage } from '@/components/admin/data-proyek';
import { InputInvestorPage } from '@/components/admin/input-investor';
import { SettingsPage } from '@/components/admin/settings';
import { LoginModal } from '@/components/admin/login-modal';
import { SyncButton } from '@/components/admin/sync-button';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarInset, SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, Users, UserPlus, Store, ShoppingBag,
  Database, FileText, Send, Settings, PackageSearch,
  BookOpen, BarChart3, Wallet, Receipt, CreditCard,
  FolderKanban, UserCheck, Target, LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ==================== NAV ITEMS ====================

const navItems: { key: PageType; label: string; icon: React.ElementType; section: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Menu Utama' },
  { key: 'nik-internal', label: 'NIK Internal', icon: Users, section: 'Menu Utama' },
  { key: 'nik-eksternal', label: 'NIK Eksternal', icon: UserPlus, section: 'Menu Utama' },
  { key: 'vendor', label: 'Vendor', icon: Store, section: 'Menu Utama' },
  { key: 'buyer', label: 'Buyer Register', icon: ShoppingBag, section: 'Data Pembeli' },
  { key: 'db-buyer', label: 'Database Buyer', icon: Database, section: 'Data Pembeli' },
  { key: 'projects', label: 'Data Proyek', icon: FolderKanban, section: 'Proyek & Investasi' },
  { key: 'investors-input', label: 'Input Investor', icon: UserCheck, section: 'Proyek & Investasi' },
  { key: 'agt-management', label: 'AGT / Trader', icon: Target, section: 'Agen & Trader' },
  { key: 'kontrak', label: 'Kontrak', icon: FileText, section: 'Transaksi' },
  { key: 'permohonan', label: 'Permohonan', icon: Send, section: 'Transaksi' },
  { key: 'permintaan-barang', label: 'Permintaan Barang', icon: PackageSearch, section: 'Transaksi' },
  { key: 'log-transaksi', label: 'Log Transaksi', icon: BookOpen, section: 'Keuangan' },
  { key: 'laporan-keuangan', label: 'Laporan Keuangan', icon: BarChart3, section: 'Keuangan' },
  { key: 'register-invoice', label: 'Register Invoice', icon: Receipt, section: 'Keuangan' },
  { key: 'register-pembayaran', label: 'Register Pembayaran', icon: CreditCard, section: 'Keuangan' },
  { key: 'payroll', label: 'Payroll', icon: Wallet, section: 'Keuangan' },
];

const sections = ['Menu Utama', 'Data Pembeli', 'Proyek & Investasi', 'Agen & Trader', 'Transaksi', 'Keuangan'];

// ==================== APP SIDEBAR ====================

function AppSidebar() {
  const store = useAdminStore();
  const { activePage, setActivePage } = store;
  const permohonans = store.permohonans || [];
  const buyerDatabases = store.buyerDatabases || [];
  const invoiceRegisters = store.invoiceRegisters || [];
  const pembayaranRegisters = store.pembayaranRegisters || [];
  const investors = store.investors || [];
  const projects = store.projects || [];
  const agtEntries = store.agtEntries || [];

  const pendingCount = permohonans.filter((p: any) => p.statusPermohonan === 'Pending').length;
  const invoiceBelumLunas = invoiceRegisters.filter((i: any) => i.statusPembayaran === 'Belum Lunas').length;
  const pembayaranPending = pembayaranRegisters.filter((p: any) => p.status === 'Pending').length;
  const activeAgtCount = agtEntries.filter((a: any) => a.statusAgt === 'Aktif').length;
  const activeInvestorCount = investors.filter((inv: any) => inv.statusInvestasi === 'Aktif').length;
  const activeProjectCount = projects.filter((p: any) => p.statusProyek === 'Berjalan').length;

  const followUpAlertCount = (() => {
    const now = new Date();
    return buyerDatabases.filter((b: any) => {
      if (['Closing', 'Continue', 'Scam', 'Rejected'].includes(b.status)) return false;
      if (!b.lastFollowUp) return false;
      const daysDiff = Math.floor((now.getTime() - new Date(b.lastFollowUp).getTime()) / (1000 * 60 * 60 * 24));
      if (b.status === 'New Lead' && daysDiff >= 3) return true;
      if (b.status === 'Follow Up' && daysDiff >= 5) return true;
      if (b.status === 'Negotiation' && daysDiff >= 7) return true;
      if (b.status === 'Belum Closing' && daysDiff >= 7) return true;
      if (b.status === 'No Response' && daysDiff >= 3) return true;
      if (b.nextFollowUp && new Date(b.nextFollowUp) < now) return true;
      return false;
    }).length;
  })();

  return (
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">MRV</div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-semibold">PT Marviro</span>
              <span className="text-xs text-muted-foreground">Ekspor Indonesia</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {sections.map(section => (
              <SidebarGroup key={section}>
                <SidebarGroupLabel>{section}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navItems.filter(n => n.section === section).map(item => (
                        <SidebarMenuItem key={item.key}>
                          <SidebarMenuButton isActive={activePage === item.key} onClick={() => setActivePage(item.key)} tooltip={item.label}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                            {item.key === 'permohonan' && pendingCount > 0 && <Badge variant="destructive" className="ml-auto text-xs">{pendingCount}</Badge>}
                            {item.key === 'db-buyer' && followUpAlertCount > 0 && <Badge className="ml-auto text-xs bg-orange-500 text-white">{followUpAlertCount}</Badge>}
                            {item.key === 'register-invoice' && invoiceBelumLunas > 0 && <Badge className="ml-auto text-xs bg-red-500 text-white">{invoiceBelumLunas}</Badge>}
                            {item.key === 'register-pembayaran' && pembayaranPending > 0 && <Badge className="ml-auto text-xs bg-yellow-500 text-white">{pembayaranPending}</Badge>}
                            {item.key === 'projects' && activeProjectCount > 0 && <Badge className="ml-auto text-xs bg-blue-500 text-white">{activeProjectCount}</Badge>}
                            {item.key === 'investors-input' && activeInvestorCount > 0 && <Badge className="ml-auto text-xs bg-emerald-500 text-white">{activeInvestorCount}</Badge>}
                            {item.key === 'agt-management' && activeAgtCount > 0 && <Badge className="ml-auto text-xs bg-amber-500 text-white">{activeAgtCount}</Badge>}
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          ))}
          <SidebarGroup>
            <SidebarGroupLabel>Sistem</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive={activePage === 'settings'} onClick={() => setActivePage('settings')} tooltip="Pengaturan">
                    <Settings className="h-4 w-4" /><span>Pengaturan</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}

// ==================== PAGE CONTENT ====================

function PageContent() {
  const { activePage } = useAdminStore();
  switch (activePage) {
    case 'dashboard': return <Dashboard />;
    case 'nik-internal': return <NikInternalPage />;
    case 'nik-eksternal': return <NikEksternalPage />;
    case 'vendor': return <VendorRegisterPage />;
    case 'buyer': return <BuyerRegisterPage />;
    case 'db-buyer': return <BuyerDatabasePage />;
    case 'projects': return <DataProyekPage />;
    case 'investors-input': return <InputInvestorPage />;
    case 'kontrak': return <KontrakRegisterPage />;
    case 'permohonan': return <PermohonanVendorPage />;
    case 'permintaan-barang': return <PermintaanBarangPage />;
    case 'log-transaksi': return <LogTransaksiPage />;
    case 'laporan-keuangan': return <LaporanKeuanganPage />;
    case 'register-invoice': return <RegisterInvoicePage />;
    case 'register-pembayaran': return <RegisterPembayaranPage />;
    case 'payroll': return <PayrollPage />;
    case 'agt-management': return <AgtManagementPage />;
    case 'settings': return <SettingsPage />;
    default: return <Dashboard />;
  }
}

// ==================== HOME PAGE ====================

export default function HomePage() {
  const { activePage } = useAdminStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('marviro-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    localStorage.setItem('marviro-auth', 'true');
    setIsAuthenticated(true);
    setShowLogin(false);
    toast.success('Selamat datang!');
  };

  const handleLogout = () => {
    localStorage.removeItem('marviro-auth');
    setIsAuthenticated(false);
    toast.success('Berhasil logout');
  };

  const pageTitle: Record<PageType, string> = {
    dashboard: 'Dashboard',
    'nik-internal': 'NIK Internal',
    'nik-eksternal': 'NIK Eksternal',
    vendor: 'Vendor Register',
    buyer: 'Buyer Register',
    'db-buyer': 'Database Buyer',
    projects: 'Data Proyek',
    'investors-input': 'Input Investor',
    kontrak: 'Kontrak Register',
    permohonan: 'Permohonan Vendor',
    'permintaan-barang': 'Permintaan Barang',
    'log-transaksi': 'Log Transaksi',
    'laporan-keuangan': 'Laporan Keuangan',
    'register-invoice': 'Register Invoice',
    'register-pembayaran': 'Register Pembayaran',
    payroll: 'Payroll',
    'agt-management': 'AGT / Trader Management',
    settings: 'Pengaturan',
  };

  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200">
          <div className="text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl mx-auto mb-4">MRV</div>
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 p-4">
            <div className="text-center w-full max-w-md">
              <div className="flex justify-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-3xl shadow-lg">MRV</div>
              </div>
              <h1 className="text-2xl font-bold mb-2">PT Marviro Ekspor Indonesia</h1>
              <p className="text-muted-foreground mb-6">Sistem Administrasi & Monitoring</p>
              <Button size="lg" onClick={() => setShowLogin(true)} className="px-8">Masuk ke Sistem</Button>
            </div>
          </div>
          <LoginModal open={showLogin} onOpenChange={setShowLogin} onLoginSuccess={handleLoginSuccess} />
        </>
    );
  }

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h2 className="text-sm font-medium">{pageTitle[activePage]}</h2>
            </div>
            <div className="flex items-center gap-3">
              <SyncButton />
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs">
                <LogOut className="h-3 w-3 mr-1" />Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <PageContent />
          </main>
        </SidebarInset>
        <SidebarRail />
      </SidebarProvider>
  );
}