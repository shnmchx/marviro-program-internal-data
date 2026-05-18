'use client';

import { useAdminStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserPlus,
  Store,
  ShoppingBag,
  FileText,
  Send,
  Clock,
  TrendingUp,
  AlertTriangle,
  Database,
  PackageSearch,
  BookOpen,
  CreditCard,
  Wallet,
  BarChart3,
} from 'lucide-react';
import { MONTH_NAMES } from '@/lib/store';

export function Dashboard() {
  const {
    nikInternals,
    nikEksternals,
    vendors,
    buyers,
    buyerDatabases,
    kontraks,
    permohonans,
    permintaanBarangs,
    logPenjualans,
    logPembelians,
    logBebans,
    logGajiHonors,
    logAsets,
    invoiceRegisters,
    pembayaranRegisters,
    payrollEntries,
  } = useAdminStore();

  const aktifNikInternal = nikInternals.filter(n => n.status === 'Aktif').length;
  const aktifNikEksternal = nikEksternals.filter(n => n.status === 'Aktif').length;
  const aktifVendor = vendors.filter(v => v.status === 'Aktif').length;
  const aktifBuyer = buyers.filter(b => b.status === 'Aktif').length;
  const aktifKontrak = kontraks.filter(k => k.status === 'Aktif').length;
  const pendingPermohonan = permohonans.filter(p => p.statusPermohonan === 'Pending').length;
  const activePermintaan = permintaanBarangs.filter(p => p.status === 'Terbit').length;
  const invoiceBelumLunas = invoiceRegisters.filter(i => i.statusPembayaran === 'Belum Lunas').length;
  const pembayaranPending = pembayaranRegisters.filter(p => p.status === 'Pending').length;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const periodStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

  const thisMonthLogPenjualan = logPenjualans.filter(p => p.tanggal.startsWith(periodStr)).length;
  const thisMonthLogPembelian = logPembelians.filter(p => p.tanggal.startsWith(periodStr)).length;
  const totalLogTransaksi = logPenjualans.length + logPembelians.length + logBebans.length + logGajiHonors.length + logAsets.length;

  // Buyer database stats
  const thisMonthEntries = buyerDatabases.filter(b => b.year === currentYear && b.month === currentMonth);
  const totalDbBuyer = buyerDatabases.length;
  const closingThisMonth = buyerDatabases.filter(b => b.year === currentYear && b.month === currentMonth && b.status === 'Closing').length;
  const scamTotal = buyerDatabases.filter(b => b.status === 'Scam').length;

  // Follow-up alerts
  const followUpAlerts = (() => {
    return buyerDatabases.filter(b => {
      if (b.status === 'Closing' || b.status === 'Continue' || b.status === 'Scam' || b.status === 'Rejected') return false;
      if (!b.lastFollowUp) return false;
      const last = new Date(b.lastFollowUp);
      const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (b.status === 'New Lead' && daysDiff >= 3) return true;
      if (b.status === 'Follow Up' && daysDiff >= 5) return true;
      if (b.status === 'Negotiation' && daysDiff >= 7) return true;
      if (b.status === 'Belum Closing' && daysDiff >= 7) return true;
      if (b.status === 'No Response' && daysDiff >= 3) return true;
      if (b.nextFollowUp && new Date(b.nextFollowUp) < now) return true;
      return false;
    });
  })();

  const stats = [
    { title: 'NIK Internal Aktif', value: aktifNikInternal, total: nikInternals.length, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { title: 'NIK Eksternal Aktif', value: aktifNikEksternal, total: nikEksternals.length, icon: UserPlus, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Vendor Aktif', value: aktifVendor, total: vendors.length, icon: Store, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Buyer Aktif', value: aktifBuyer, total: buyers.length, icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
    { title: 'Kontrak Aktif', value: aktifKontrak, total: kontraks.length, icon: FileText, color: 'text-violet-600 bg-violet-50' },
    { title: 'Permohonan Pending', value: pendingPermohonan, total: permohonans.length, icon: Send, color: 'text-orange-600 bg-orange-50' },
    { title: 'Permintaan Barang Aktif', value: activePermintaan, total: permintaanBarangs.length, icon: PackageSearch, color: 'text-cyan-600 bg-cyan-50' },
    { title: 'Log Transaksi Bulan Ini', value: thisMonthLogPenjualan + thisMonthLogPembelian, total: totalLogTransaksi, icon: BookOpen, color: 'text-teal-600 bg-teal-50' },
    { title: 'Invoice Belum Lunas', value: invoiceBelumLunas, total: invoiceRegisters.length, icon: CreditCard, color: 'text-red-600 bg-red-50' },
  ];

  const recentEntries: { type: string; name: string; date: string; status: string }[] = [
    ...nikInternals.slice(-2).reverse().map(n => ({ type: 'NIK Internal', name: `${n.nik} - ${n.namaLengkap}`, date: n.createdAt, status: n.status })),
    ...nikEksternals.slice(-2).reverse().map(n => ({ type: 'NIK Eksternal', name: `${n.nik} - ${n.namaLengkap}`, date: n.createdAt, status: n.status })),
    ...vendors.slice(-2).reverse().map(v => ({ type: 'Vendor', name: `${v.vendorId} - ${v.namaSupplier}`, date: v.createdAt, status: v.status })),
    ...buyers.slice(-2).reverse().map(b => ({ type: 'Buyer', name: `${b.buyerId} - ${b.namaPerusahaan}`, date: b.createdAt, status: b.status })),
    ...kontraks.slice(-2).reverse().map(k => ({ type: 'Kontrak', name: `${k.nomorKontrak} - ${k.namaPihak}`, date: k.createdAt, status: k.status })),
    ...permohonans.slice(-2).reverse().map(p => ({ type: 'Permohonan', name: `${p.nomorSuratVendor} - ${p.namaVendor}`, date: p.createdAt, status: p.statusPermohonan })),
    ...permintaanBarangs.slice(-2).reverse().map(p => ({ type: 'Permintaan', name: `${p.nomor} - ${p.produk}`, date: p.createdAt, status: p.status })),
    ...logPenjualans.slice(-2).reverse().map(p => ({ type: 'Penjualan', name: `${p.produk} - ${p.buyer}`, date: p.createdAt, status: p.statusPembayaran })),
    ...invoiceRegisters.slice(-2).reverse().map(i => ({ type: 'Invoice', name: `${i.nomorInvoice} - ${i.customerId}`, date: i.createdAt, status: i.statusPembayaran })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const formatDate = (dateStr: string) => {
    try { return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return dateStr; }
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === 'Permohonan') {
      if (status === 'Accept') return 'bg-emerald-100 text-emerald-700';
      if (status === 'Reject') return 'bg-red-100 text-red-700';
      return 'bg-yellow-100 text-yellow-700';
    }
    if (status === 'Aktif') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Tidak Aktif' || status === 'Dibatalkan') return 'bg-red-100 text-red-700';
    if (status === 'Trial' || status === 'Pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Selesai' || status === 'Lunas') return 'bg-blue-100 text-blue-700';
    if (status === 'Belum Lunas' || status === 'Draft') return 'bg-red-100 text-red-700';
    if (status === 'Terbit') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Sebagian') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan data PT Marviro Ekspor Indonesia</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(stat => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <span className="text-sm text-muted-foreground">dari {stat.total} total</span>
                  </div>
                </div>
                <div className={`rounded-xl p-3 ${stat.color}`}><stat.icon className="h-6 w-6" /></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Database Buyer - {MONTH_NAMES[currentMonth - 1]} {currentYear}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50"><p className="text-3xl font-bold">{thisMonthEntries.length}</p><p className="text-xs text-muted-foreground">Buyer Bulan Ini</p></div>
              <div className="text-center p-3 rounded-lg bg-emerald-50"><p className="text-3xl font-bold text-emerald-600">{closingThisMonth}</p><p className="text-xs text-muted-foreground">Closing Bulan Ini</p></div>
              <div className="text-center p-3 rounded-lg bg-red-50"><p className="text-3xl font-bold text-red-600">{scamTotal}</p><p className="text-xs text-muted-foreground">Total Scam</p></div>
              <div className="text-center p-3 rounded-lg bg-blue-50"><p className="text-3xl font-bold text-blue-600">{totalDbBuyer}</p><p className="text-xs text-muted-foreground">Total Database</p></div>
            </div>
          </CardContent>
        </Card>

        <Card className={followUpAlerts.length > 0 ? 'border-orange-300' : ''}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${followUpAlerts.length > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
              <CardTitle className="text-lg">Follow-Up Alert</CardTitle>
              {followUpAlerts.length > 0 && <Badge className="bg-orange-500 text-white">{followUpAlerts.length} perlu follow-up</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {followUpAlerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground"><p className="text-sm">Semua buyer sudah di-follow up.</p></div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {followUpAlerts.map(entry => {
                  const daysDiff = entry.lastFollowUp ? Math.floor((now.getTime() - new Date(entry.lastFollowUp).getTime()) / (1000 * 60 * 60 * 24)) : 0;
                  return (
                    <div key={entry.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                      <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{entry.company}</p><p className="text-xs text-muted-foreground">{MONTH_NAMES[entry.month - 1]} {entry.year}</p></div>
                      <div className="text-right shrink-0"><Badge variant="destructive" className="text-xs">{entry.status}</Badge><p className="text-xs text-orange-700 mt-1 font-medium">{daysDiff} hari</p></div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><CardTitle className="text-lg">Entri Terbaru</CardTitle></div>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground"><TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>Belum ada data. Mulai tambahkan data dari menu di sebelah kiri.</p></div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2 px-3 font-medium text-muted-foreground">Tipe</th><th className="text-left py-2 px-3 font-medium text-muted-foreground">Nama / ID</th><th className="text-left py-2 px-3 font-medium text-muted-foreground">Tanggal</th><th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th></tr></thead>
                <tbody>
                  {recentEntries.map((entry, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-2.5 px-3"><Badge variant="outline" className="text-xs font-normal">{entry.type}</Badge></td>
                      <td className="py-2.5 px-3 font-medium">{entry.name}</td>
                      <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">{formatDate(entry.date)}</td>
                      <td className="py-2.5 px-3"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(entry.status, entry.type)}`}>{entry.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
