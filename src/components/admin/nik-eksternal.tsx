// components/admin/nik-eksternal.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, NikEksternal, KLASIFIKASI_OPTIONS } from '@/lib/store';
import { DataTable, Column } from './data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  PauseCircle,
  FileCheck,
  Building2,
  CalendarDays,
  FileText,
} from 'lucide-react';

// Status options untuk NIK Eksternal
const NIK_STATUS_OPTIONS = [
  { value: 'Aktif', label: 'Aktif', color: 'bg-emerald-100 text-emerald-700', icon: UserCheck },
  { value: 'Tidak Aktif', label: 'Tidak Aktif', color: 'bg-gray-100 text-gray-700', icon: UserX },
  { value: 'Ditangguhkan', label: 'Ditangguhkan', color: 'bg-orange-100 text-orange-700', icon: PauseCircle },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700', icon: FileCheck },
] as const;

interface FormState {
  namaLengkap: string;
  klasifikasi: NikEksternal['klasifikasi'];
  peran: string;
  dasarKontrak: string;
  nomorKontrak: string;
  tglMulai: string;
  tglBerakhir: string;
  status: 'Aktif' | 'Tidak Aktif' | 'Ditangguhkan' | 'Selesai';
  keterangan: string;
}

const emptyForm: FormState = {
  namaLengkap: '',
  klasifikasi: 'AGT',
  peran: '',
  dasarKontrak: '',
  nomorKontrak: '',
  tglMulai: '',
  tglBerakhir: '',
  status: 'Aktif',
  keterangan: '',
};

export function NikEksternalPage() {
  const store = useAdminStore() || {};

  const { nikEksternals = [] } = store;
  const addNikEksternal = store.addNikEksternal || (() => ({ nik: '' }));
  const updateNikEksternal = store.updateNikEksternal || (() => {});
  const deleteNikEksternal = store.deleteNikEksternal || (() => {});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NikEksternal | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  // Statistics
  const stats = useMemo(() => {
    const total = nikEksternals.length;
    const aktif = nikEksternals.filter(n => n.status === 'Aktif').length;
    const ditangguhkan = nikEksternals.filter(n => n.status === 'Ditangguhkan').length;
    const tidakAktif = nikEksternals.filter(n => n.status === 'Tidak Aktif').length;
    const selesai = nikEksternals.filter(n => n.status === 'Selesai').length;
    return { total, aktif, ditangguhkan, tidakAktif, selesai };
  }, [nikEksternals]);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: NikEksternal) => {
    setEditingItem(item);
    setForm({
      namaLengkap: item.namaLengkap,
      klasifikasi: item.klasifikasi,
      peran: item.peran,
      dasarKontrak: item.dasarKontrak,
      nomorKontrak: item.nomorKontrak,
      tglMulai: item.tglMulai,
      tglBerakhir: item.tglBerakhir,
      status: item.status as FormState['status'],
      keterangan: item.keterangan,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.namaLengkap.trim()) {
      toast.error('Nama Lengkap wajib diisi');
      return;
    }

    const saveData = {
      ...form,
      skemaImbalan: '',
      pajak: '',
    };

    if (editingItem) {
      updateNikEksternal(editingItem.id, saveData);
      toast.success('Data NIK Eksternal berhasil diperbarui');
    } else {
      const newItem = addNikEksternal(saveData);
      if (newItem && newItem.nik) {
        toast.success(`NIK Eksternal berhasil ditambahkan (${newItem.nik})`);
      }
    }
    setDialogOpen(false);
  };

  // Preview NIK dengan format MRV
  const previewNik = useMemo(() => {
    if (editingItem) return editingItem.nik;
    if (!form.klasifikasi) return '';
    const year = new Date().getFullYear();
    const prefix = `MRV-EXT-${form.klasifikasi}-${year}-`;
    const existing = nikEksternals.filter((n) => n.nik.startsWith(prefix));
    const maxSeq = existing.reduce((max, n) => {
      const parts = n.nik.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  }, [form.klasifikasi, editingItem, nikEksternals]);

  const getStatusColor = (status: string) => {
    const found = NIK_STATUS_OPTIONS.find(o => o.value === status);
    return found?.color || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: string) => {
    const found = NIK_STATUS_OPTIONS.find(o => o.value === status);
    if (!found) return <Users className="h-3 w-3" />;
    const Icon = found.icon;
    return <Icon className="h-3 w-3" />;
  };

  const columns: Column<NikEksternal>[] = [
    { key: 'nik', label: 'NIK Eksternal' },
    { key: 'namaLengkap', label: 'Nama Lengkap' },
    { key: 'klasifikasi', label: 'Klasifikasi' },
    { key: 'peran', label: 'Peran' },
    { key: 'dasarKontrak', label: 'Dasar Kontrak' },
    { key: 'nomorKontrak', label: 'Nomor Kontrak' },
    { key: 'tglMulai', label: 'Tgl Mulai' },
    { key: 'tglBerakhir', label: 'Tgl Berakhir' },
    {
      key: 'status',
      label: 'Status',
      render: (item: NikEksternal) => (
          <Badge className={`text-xs gap-1 ${getStatusColor(item.status)}`}>
            {getStatusIcon(item.status)}
            {item.status}
          </Badge>
      )
    },
  ];

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">NIK Eksternal</h1>
            <p className="text-sm text-muted-foreground">
              Sistem administrasi identitas partner eksternal PT Marviro
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-slate-600" />
                <p className="text-xs font-medium text-slate-600">Total</p>
              </div>
              <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <p className="text-xs font-medium text-emerald-600">Aktif</p>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{stats.aktif}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PauseCircle className="h-4 w-4 text-orange-600" />
                <p className="text-xs font-medium text-orange-600">Ditangguhkan</p>
              </div>
              <p className="text-2xl font-bold text-orange-700">{stats.ditangguhkan}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserX className="h-4 w-4 text-gray-600" />
                <p className="text-xs font-medium text-gray-600">Tidak Aktif</p>
              </div>
              <p className="text-2xl font-bold text-gray-700">{stats.tidakAktif}</p>
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
        </div>

        {/* Data Table */}
        <DataTable<NikEksternal>
            title="Daftar NIK Eksternal"
            columns={columns}
            data={nikEksternals}
            searchKeys={['nik', 'namaLengkap', 'klasifikasi', 'peran', 'nomorKontrak']}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={(item) => { deleteNikEksternal(item.id); toast.success('Data berhasil dihapus'); }}
            statusKey="status"
        />

        {/* Dialog Form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle>
                    {editingItem ? 'Edit NIK Eksternal' : 'Registrasi NIK Eksternal'}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">Administrasi identitas partner</p>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* NIK Auto & Nama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>NIK Eksternal (Auto)</Label>
                  <Input value={previewNik} readOnly className="bg-muted font-mono text-sm" />
                  <p className="text-xs text-muted-foreground">Format: MRV-EXT-[Klasifikasi]-[Tahun]-[Urut]</p>
                </div>
                <div className="space-y-2">
                  <Label>Nama Lengkap *</Label>
                  <Input value={form.namaLengkap} onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })} placeholder="Nama lengkap partner" />
                </div>
              </div>

              {/* Klasifikasi & Peran */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Klasifikasi</Label>
                  <Select value={form.klasifikasi} onValueChange={(val) => setForm({ ...form, klasifikasi: val as NikEksternal['klasifikasi'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {KLASIFIKASI_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Peran</Label>
                  <Input value={form.peran} onChange={(e) => setForm({ ...form, peran: e.target.value })} placeholder="Peran / jabatan" />
                </div>
              </div>

              {/* Dasar Kontrak & Nomor Kontrak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Dasar Kontrak</Label>
                  <Input value={form.dasarKontrak} onChange={(e) => setForm({ ...form, dasarKontrak: e.target.value })} placeholder="Contoh: Perjanjian Kerja Sama" />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Kontrak</Label>
                  <Input value={form.nomorKontrak} onChange={(e) => setForm({ ...form, nomorKontrak: e.target.value })} placeholder="Nomor kontrak terkait" />
                </div>
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
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val as FormState['status'] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {NIK_STATUS_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="h-4 w-4" />
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
                <Textarea value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Catatan administrasi" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Simpan Perubahan' : 'Registrasi'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
  );
}