'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, KontrakRegister, KONTRAK_KLASIFIKASI_OPTIONS, KONTRAK_STATUS_OPTIONS, KONTRAK_JENIS_OPTIONS } from '@/lib/store';
import { DataTable, Column } from './data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  FileText,
  Link2,
  CalendarDays,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PenLine,
} from 'lucide-react';

// ==================== FORM STATE ====================

interface FormState {
  nomorKontrak: string;
  jenisKontrak: KontrakRegister['jenisKontrak'];
  klasifikasi: KontrakRegister['klasifikasi'];
  namaPihak: string;
  referensiId: string;
  objekKontrak: string;
  komoditas: string;
  tglMulai: string;
  tglBerakhir: string;
  status: KontrakRegister['status'];
  keterangan: string;
  selectedNikId: string;
}

const emptyForm: FormState = {
  nomorKontrak: '',
  jenisKontrak: 'Supplier',
  klasifikasi: 'SUP',
  namaPihak: '',
  referensiId: '',
  objekKontrak: '',
  komoditas: '',
  tglMulai: '',
  tglBerakhir: '',
  status: 'Draft',
  keterangan: '',
  selectedNikId: '',
};

export function KontrakRegisterPage() {
  const store = useAdminStore() || {};

  const {
    kontraks = [],
    nikEksternals = [],
    nikInternals = [],
    vendors = [],
    buyers = [],
    investors = [],
  } = store;

  const addKontrak = store.addKontrak || (() => {});
  const updateKontrak = store.updateKontrak || (() => {});
  const deleteKontrak = store.deleteKontrak || (() => {});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KontrakRegister | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  // ==================== HELPER FUNCTIONS ====================

  const generateNomorKontrak = (klasifikasi: string) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    // Format: KTR/[KLASIFIKASI]/MRV/[TAHUN]/[BULAN]/[URUT]
    const prefix = `KTR/${klasifikasi}/MRV/${year}/${month}/`;
    const existing = kontraks.filter(k => k.nomorKontrak.startsWith(prefix));
    const maxSeq = existing.reduce((max, k) => {
      const parts = k.nomorKontrak.split('/');
      const seq = parseInt(parts[parts.length - 1] || '0', 10);
      return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  };

  const parseNikLinks = (nik: any) => {
    if (!nik || !nik.keterangan) return { vendorId: '', buyerId: '', investorId: '' };
    const result = { vendorId: '', buyerId: '', investorId: '' };
    try {
      const lines = nik.keterangan.split('\n');
      for (const line of lines) {
        if (line.startsWith('LINKED_VENDOR:')) result.vendorId = line.split(':')[1]?.trim() || '';
        if (line.startsWith('LINKED_BUYER:')) result.buyerId = line.split(':')[1]?.trim() || '';
        if (line.startsWith('LINKED_INVESTOR:')) result.investorId = line.split(':')[1]?.trim() || '';
      }
    } catch {}
    return result;
  };

  const availableNiks = useMemo(() => {
    return [
      ...nikEksternals.map(n => ({ ...n, source: 'Eksternal' as const })),
      ...nikInternals.map(n => ({ ...n, source: 'Internal' as const, nik: n.nik, namaLengkap: n.namaLengkap, klasifikasi: 'INT' as any, peran: n.jabatanDivisi, keterangan: '' })),
    ];
  }, [nikEksternals, nikInternals]);

  // ==================== STATISTICS ====================

  const stats = useMemo(() => {
    const total = kontraks.length;
    const aktif = kontraks.filter(k => k.status === 'Aktif').length;
    const draft = kontraks.filter(k => k.status === 'Draft').length;
    const prosesTtd = kontraks.filter(k => k.status === 'Proses TTD').length;
    const selesai = kontraks.filter(k => k.status === 'Selesai').length;
    const dibatalkan = kontraks.filter(k => k.status === 'Dibatalkan').length;
    const ditunda = kontraks.filter(k => k.status === 'Ditunda').length;

    // Kontrak yang akan berakhir dalam 30 hari
    const akanBerakhir = kontraks.filter(k => {
      if (k.status !== 'Aktif' || !k.tglBerakhir) return false;
      const end = new Date(k.tglBerakhir);
      const now = new Date();
      const days = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return days <= 30 && days >= 0;
    });

    // Kontrak overdue
    const overdue = kontraks.filter(k => {
      if (k.status !== 'Aktif' || !k.tglBerakhir) return false;
      const end = new Date(k.tglBerakhir);
      const now = new Date();
      return end < now;
    });

    return { total, aktif, draft, prosesTtd, selesai, dibatalkan, ditunda, akanBerakhir, overdue };
  }, [kontraks]);

  // ==================== HANDLERS ====================

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: KontrakRegister) => {
    setEditingItem(item);
    setForm({
      nomorKontrak: item.nomorKontrak,
      jenisKontrak: item.jenisKontrak,
      klasifikasi: item.klasifikasi,
      namaPihak: item.namaPihak,
      referensiId: item.referensiId,
      objekKontrak: item.objekKontrak,
      komoditas: item.komoditas,
      tglMulai: item.tglMulai,
      tglBerakhir: item.tglBerakhir,
      status: item.status,
      keterangan: item.keterangan,
      selectedNikId: '',
    });
    setDialogOpen(true);
  };

  const handleNikSelect = (nikId: string) => {
    if (!nikId || nikId === 'none') {
      setForm({ ...form, selectedNikId: '', referensiId: '', namaPihak: '', objekKontrak: '', komoditas: '' });
      return;
    }

    const selectedNik = availableNiks.find(n => n.id === nikId);
    if (!selectedNik) return;

    const linked = parseNikLinks(selectedNik);
    let namaPihak = selectedNik.namaLengkap;
    let referensiId = selectedNik.nik;
    let komoditas = '';
    let objek = selectedNik.peran || '';
    let jenisKontrak: KontrakRegister['jenisKontrak'] = 'Internal';
    let klasifikasi: KontrakRegister['klasifikasi'] = 'INT';

    if (linked.vendorId) {
      const vendor = vendors.find(v => v.id === linked.vendorId);
      if (vendor) {
        jenisKontrak = 'Supplier';
        klasifikasi = 'SUP';
        namaPihak = vendor.namaSupplier;
        referensiId = vendor.vendorId;
        komoditas = vendor.komoditas;
        objek = `Supply - ${vendor.komoditas}`;
      }
    } else if (linked.buyerId) {
      const buyer = buyers.find(b => b.id === linked.buyerId);
      if (buyer) {
        jenisKontrak = 'Buyer';
        klasifikasi = 'BUY';
        namaPihak = buyer.namaPerusahaan;
        referensiId = buyer.buyerId;
        komoditas = buyer.komoditasMinat;
        objek = `Pembelian - ${buyer.komoditasMinat}`;
      }
    } else if (linked.investorId) {
      const investor = investors.find(inv => inv.id === linked.investorId);
      if (investor) {
        jenisKontrak = 'Investor';
        klasifikasi = 'INV';
        namaPihak = investor.namaInvestor;
        referensiId = investor.nomorSurat;
        objek = 'Perjanjian Investasi';
      }
    } else if (selectedNik.klasifikasi === 'AGT') {
      jenisKontrak = 'AGT/Trader';
      klasifikasi = 'AGT';
    }

    const nomorKontrak = generateNomorKontrak(klasifikasi);

    setForm({
      ...form,
      selectedNikId: nikId,
      jenisKontrak, klasifikasi, namaPihak,
      referensiId,
      objekKontrak: objek,
      komoditas,
      nomorKontrak,
    });
  };

  const handleKlasifikasiChange = (val: string) => {
    const klasifikasi = val as KontrakRegister['klasifikasi'];
    let jenisKontrak: KontrakRegister['jenisKontrak'] = 'Internal';

    if (klasifikasi === 'BUY') jenisKontrak = 'Buyer';
    else if (klasifikasi === 'SUP') jenisKontrak = 'Supplier';
    else if (klasifikasi === 'INV') jenisKontrak = 'Investor';
    else if (klasifikasi === 'AGT') jenisKontrak = 'AGT/Trader';
    else if (klasifikasi === 'INT') jenisKontrak = 'Internal';

    const nomorKontrak = generateNomorKontrak(klasifikasi);
    setForm({ ...form, klasifikasi, jenisKontrak, nomorKontrak });
  };

  const handleJenisChange = (val: string) => {
    const jenis = val as KontrakRegister['jenisKontrak'];
    let klasifikasi: KontrakRegister['klasifikasi'] = 'INT';

    if (jenis === 'Buyer') klasifikasi = 'BUY';
    else if (jenis === 'Supplier') klasifikasi = 'SUP';
    else if (jenis === 'Investor') klasifikasi = 'INV';
    else if (jenis === 'AGT/Trader') klasifikasi = 'AGT';
    else if (jenis === 'Internal') klasifikasi = 'INT';

    const nomorKontrak = generateNomorKontrak(klasifikasi);
    setForm({ ...form, jenisKontrak: jenis, klasifikasi, nomorKontrak });
  };

  const handleSave = () => {
    if (!form.nomorKontrak.trim() || !form.namaPihak.trim()) {
      toast.error('Nomor Kontrak dan Nama Pihak wajib diisi');
      return;
    }

    if (editingItem) {
      updateKontrak(editingItem.id, form);
      toast.success('Kontrak berhasil diperbarui');
    } else {
      addKontrak(form);
      toast.success('Kontrak berhasil ditambahkan');
    }
    setDialogOpen(false);
  };

  // ==================== STATUS HELPERS ====================

  const getStatusColor = (status: string) => {
    const found = KONTRAK_STATUS_OPTIONS.find(o => o.value === status);
    return found?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Draft': return <PenLine className="h-3 w-3" />;
      case 'Proses TTD': return <Clock className="h-3 w-3" />;
      case 'Aktif': return <CheckCircle2 className="h-3 w-3" />;
      case 'Ditunda': return <PauseCircle className="h-3 w-3" />;
      case 'Selesai': return <FileCheck className="h-3 w-3" />;
      case 'Dibatalkan': return <XCircle className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const getJenisColor = (jenis: string) => {
    const found = KONTRAK_JENIS_OPTIONS.find(o => o.value === jenis);
    return found?.color || 'bg-gray-100 text-gray-700';
  };

  const getDaysRemaining = (tglBerakhir: string) => {
    if (!tglBerakhir) return null;
    const end = new Date(tglBerakhir);
    const now = new Date();
    return Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  // ==================== COLUMNS ====================

  const columns: Column<KontrakRegister>[] = [
    {
      key: 'nomorKontrak',
      label: 'Nomor Kontrak',
      render: (item: KontrakRegister) => (
          <span className="font-mono text-xs font-medium">{item.nomorKontrak}</span>
      )
    },
    {
      key: 'jenisKontrak',
      label: 'Jenis',
      render: (item: KontrakRegister) => (
          <Badge className={`text-xs font-normal ${getJenisColor(item.jenisKontrak)}`}>
            {item.jenisKontrak}
          </Badge>
      )
    },
    { key: 'namaPihak', label: 'Nama Pihak' },
    { key: 'referensiId', label: 'Ref. ID' },
    { key: 'objekKontrak', label: 'Objek Kontrak' },
    { key: 'komoditas', label: 'Komoditas/Produk' },
    { key: 'tglMulai', label: 'Tgl Mulai' },
    {
      key: 'tglBerakhir',
      label: 'Tgl Berakhir',
      render: (item: KontrakRegister) => {
        const days = getDaysRemaining(item.tglBerakhir);
        if (!item.tglBerakhir) return <span className="text-muted-foreground">-</span>;
        if (item.status === 'Selesai' || item.status === 'Dibatalkan') return <span>{item.tglBerakhir}</span>;
        if (days !== null && days <= 30 && days >= 0) {
          return <span className="text-orange-600 font-medium">{item.tglBerakhir} ({days} hari)</span>;
        }
        if (days !== null && days < 0) {
          return <span className="text-red-600 font-medium">{item.tglBerakhir} (Lewat)</span>;
        }
        return <span>{item.tglBerakhir}</span>;
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: KontrakRegister) => (
          <Badge className={`text-xs gap-1 ${getStatusColor(item.status)}`}>
            {getStatusIcon(item.status)}
            {item.status}
          </Badge>
      )
    },
  ];

  const selectedNikInfo = form.selectedNikId ? availableNiks.find(n => n.id === form.selectedNikId) : null;

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Kontrak Register</h1>
            <p className="text-sm text-muted-foreground">
              Sistem administrasi & monitoring dokumen kontrak
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-slate-600" />
                <p className="text-xs font-medium text-slate-600">Total</p>
              </div>
              <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-medium text-emerald-600">Aktif</p>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{stats.aktif}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <p className="text-xs font-medium text-yellow-600">Proses TTD</p>
              </div>
              <p className="text-2xl font-bold text-yellow-700">{stats.prosesTtd}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PenLine className="h-4 w-4 text-gray-600" />
                <p className="text-xs font-medium text-gray-600">Draft</p>
              </div>
              <p className="text-2xl font-bold text-gray-700">{stats.draft}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <p className="text-xs font-medium text-blue-600">Selesai</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.selesai}</p>
            </CardContent>
          </Card>
          <Card className={`bg-gradient-to-br ${stats.akanBerakhir.length > 0 || stats.overdue.length > 0 ? 'from-orange-50 to-red-50' : 'from-gray-50 to-slate-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`h-4 w-4 ${stats.akanBerakhir.length > 0 || stats.overdue.length > 0 ? 'text-orange-600' : 'text-gray-400'}`} />
                <p className={`text-xs font-medium ${stats.akanBerakhir.length > 0 || stats.overdue.length > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                  Perlu Perhatian
                </p>
              </div>
              <p className={`text-2xl font-bold ${stats.akanBerakhir.length > 0 || stats.overdue.length > 0 ? 'text-orange-700' : 'text-gray-500'}`}>
                {stats.akanBerakhir.length + stats.overdue.length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert akan berakhir */}
        {stats.akanBerakhir.length > 0 && (
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-800">
                      {stats.akanBerakhir.length} kontrak akan berakhir dalam 30 hari
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stats.akanBerakhir.slice(0, 5).map(k => {
                        const days = getDaysRemaining(k.tglBerakhir);
                        return (
                            <Badge key={k.id} variant="outline" className="text-xs border-orange-300 text-orange-700">
                              {k.nomorKontrak} ({days} hari)
                            </Badge>
                        );
                      })}
                      {stats.akanBerakhir.length > 5 && (
                          <span className="text-xs text-orange-600 self-center">+{stats.akanBerakhir.length - 5} lainnya</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Alert overdue */}
        {stats.overdue.length > 0 && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-800">
                      {stats.overdue.length} kontrak sudah melewati tanggal berakhir
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {stats.overdue.slice(0, 5).map(k => (
                          <Badge key={k.id} variant="outline" className="text-xs border-red-300 text-red-700">
                            {k.nomorKontrak}
                          </Badge>
                      ))}
                      {stats.overdue.length > 5 && (
                          <span className="text-xs text-red-600 self-center">+{stats.overdue.length - 5} lainnya</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Data Table */}
        <DataTable<KontrakRegister>
            title="Daftar Kontrak"
            columns={columns}
            data={kontraks}
            searchKeys={['nomorKontrak', 'namaPihak', 'referensiId', 'objekKontrak', 'komoditas']}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => { deleteKontrak(item.id); toast.success('Kontrak berhasil dihapus'); }}
            statusKey="status"
        />

        {/* Dialog Form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>
                    {editingItem ? 'Edit Kontrak' : 'Tambah Kontrak Baru'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">Sistem administrasi dokumen kontrak</p>
                </div>
              </div>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Pilih NIK - Auto-fill */}
              {!editingItem && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-blue-700">
                        <Link2 className="h-4 w-4" />
                        Pilih NIK (Auto-fill Data)
                      </Label>
                      <Select value={form.selectedNikId || 'none'} onValueChange={handleNikSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih NIK yang sudah terdaftar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">-- Input manual --</SelectItem>
                          {availableNiks.map(nik => {
                            const linked = parseNikLinks(nik);
                            let tag = '';
                            if (linked.vendorId) tag = ' [Vendor]';
                            else if (linked.buyerId) tag = ' [Buyer]';
                            else if (linked.investorId) tag = ' [Investor]';
                            return (
                                <SelectItem key={nik.id} value={nik.id}>
                                  [{nik.source}] {nik.nik} - {nik.namaLengkap}{tag}
                                </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
              )}

              {/* Nomor Kontrak & Jenis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor Kontrak *</Label>
                  <Input
                      value={form.nomorKontrak}
                      onChange={(e) => setForm({ ...form, nomorKontrak: e.target.value })}
                      className="font-mono text-sm"
                      placeholder="KTR/KLASIFIKASI/MRV/TAHUN/BULAN/URUT"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: KTR/[Klasifikasi]/MRV/[Tahun]/[Bulan]/[Urut]
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kontrak</Label>
                  <Select value={form.jenisKontrak} onValueChange={handleJenisChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {KONTRAK_JENIS_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Klasifikasi & Nama Pihak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Klasifikasi</Label>
                  <Select value={form.klasifikasi} onValueChange={handleKlasifikasiChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {KONTRAK_KLASIFIKASI_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nama Pihak *</Label>
                  <Input value={form.namaPihak} onChange={(e) => setForm({ ...form, namaPihak: e.target.value })} placeholder="Nama perusahaan/individu" />
                </div>
              </div>

              {/* Referensi ID & Objek */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Referensi ID</Label>
                  <Input value={form.referensiId} onChange={(e) => setForm({ ...form, referensiId: e.target.value })} placeholder="NIK / Vendor ID / Buyer ID" />
                </div>
                <div className="space-y-2">
                  <Label>Objek Kontrak</Label>
                  <Input value={form.objekKontrak} onChange={(e) => setForm({ ...form, objekKontrak: e.target.value })} placeholder="Deskripsi objek kontrak" />
                </div>
              </div>

              {/* Komoditas */}
              <div className="space-y-2">
                <Label>Komoditas / Produk</Label>
                <Input value={form.komoditas} onChange={(e) => setForm({ ...form, komoditas: e.target.value })} placeholder="Contoh: Kopi Robusta" />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input type="date" value={form.tglMulai} onChange={(e) => setForm({ ...form, tglMulai: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Berakhir</Label>
                  <Input type="date" value={form.tglBerakhir} onChange={(e) => setForm({ ...form, tglBerakhir: e.target.value })} />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status Kontrak</Label>
                <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val as KontrakRegister['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {KONTRAK_STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${opt.color.split(' ')[0]}`} />
                        {opt.label}
                      </span>
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Keterangan */}
              <div className="space-y-2">
                <Label>Keterangan</Label>
                <Textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Catatan administrasi, progress dokumen, dll." rows={3} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Simpan Perubahan' : 'Simpan Kontrak'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}