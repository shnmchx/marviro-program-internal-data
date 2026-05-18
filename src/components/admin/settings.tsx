'use client';

import { useRef, useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Download, Upload, RotateCcw, Database } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const store = useAdminStore();
  const [resetOpen, setResetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    nikInternals, nikEksternals, vendors, buyers, buyerDatabases, kontraks, permohonans,
    permintaanBarangs, logPenjualans, logPembelians, logBebans, logGajiHonors, logAsets,
    invoiceRegisters, pembayaranRegisters, payrollEntries,
    exportAllData, importAllData, resetAllData,
  } = store;

  const handleExport = () => {
    try {
      const json = exportAllData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marviro-admin-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data berhasil diekspor ke file JSON');
    } catch {
      toast.error('Gagal mengekspor data');
    }
  };

  const handleImport = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.json')) { toast.error('File harus berformat JSON'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importAllData(content);
      if (success) { toast.success('Data berhasil diimpor'); } else { toast.error('Gagal mengimpor data'); }
    };
    reader.readAsText(file);
    if (fileInputRef.current) { fileInputRef.current.value = ''; }
  };

  const handleReset = () => { resetAllData(); setResetOpen(false); toast.success('Semua data berhasil direset'); };

  const totalRecords = nikInternals.length + nikEksternals.length + vendors.length + buyers.length +
    buyerDatabases.length + kontraks.length + permohonans.length + permintaanBarangs.length +
    logPenjualans.length + logPembelians.length + logBebans.length + logGajiHonors.length + logAsets.length +
    invoiceRegisters.length + pembayaranRegisters.length + payrollEntries.length;

  const stats = [
    { label: 'NIK Internal', count: nikInternals.length },
    { label: 'NIK Eksternal', count: nikEksternals.length },
    { label: 'Vendor', count: vendors.length },
    { label: 'Buyer Register', count: buyers.length },
    { label: 'Database Buyer', count: buyerDatabases.length },
    { label: 'Kontrak', count: kontraks.length },
    { label: 'Permohonan', count: permohonans.length },
    { label: 'Permintaan Barang', count: permintaanBarangs.length },
    { label: 'Log Penjualan', count: logPenjualans.length },
    { label: 'Log Pembelian', count: logPembelians.length },
    { label: 'Log Beban', count: logBebans.length },
    { label: 'Log Gaji/Honor', count: logGajiHonors.length },
    { label: 'Log Aset', count: logAsets.length },
    { label: 'Invoice', count: invoiceRegisters.length },
    { label: 'Pembayaran', count: pembayaranRegisters.length },
    { label: 'Payroll', count: payrollEntries.length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola data, ekspor, impor, dan reset sistem</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /><CardTitle className="text-lg">Ringkasan Data</CardTitle></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Total semua data: <span className="font-semibold text-foreground">{totalRecords} entri</span></p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleExport}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600"><Download className="h-6 w-6" /></div>
              <div className="flex-1"><h3 className="font-semibold">Ekspor JSON</h3><p className="text-sm text-muted-foreground mt-1">Download semua data sebagai file backup JSON</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleImport}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600"><Upload className="h-6 w-6" /></div>
              <div className="flex-1"><h3 className="font-semibold">Impor JSON</h3><p className="text-sm text-muted-foreground mt-1">Muat data dari file backup JSON</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-destructive/30" onClick={() => setResetOpen(true)}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-red-50 p-3 text-red-600"><RotateCcw className="h-6 w-6" /></div>
              <div className="flex-1"><h3 className="font-semibold text-destructive">Reset Semua Data</h3><p className="text-sm text-muted-foreground mt-1">Hapus semua data dan kembalikan ke data awal</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />

      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Semua Data?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini akan menghapus semua data yang ada dan mengembalikan sistem ke data awal.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ya, Reset Semua Data</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
