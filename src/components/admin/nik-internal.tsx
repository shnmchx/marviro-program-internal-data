'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, NikInternal, JABATAN_DIVISI_OPTIONS, DIVISI_CODE_MAP } from '@/lib/store';
import { DataTable, Column } from './data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface FormState {
  namaLengkap: string;
  jabatanDivisi: string;
  status: 'Aktif' | 'Tidak Aktif';
  tipeHubungan: string;
  tglMulai: string;
  tglBerakhir: string;
  payroll: 'Ya' | 'Tidak';
  keterangan: string;
}

const emptyForm: FormState = {
  namaLengkap: '',
  jabatanDivisi: '',
  status: 'Aktif',
  tipeHubungan: '',
  tglMulai: '',
  tglBerakhir: '',
  payroll: 'Ya',
  keterangan: '',
};

export function NikInternalPage() {
  const { nikInternals, addNikInternal, updateNikInternal, deleteNikInternal } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NikInternal | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: NikInternal) => {
    setEditingItem(item);
    setForm({
      namaLengkap: item.namaLengkap,
      jabatanDivisi: item.jabatanDivisi,
      status: item.status,
      tipeHubungan: item.tipeHubungan,
      tglMulai: item.tglMulai,
      tglBerakhir: item.tglBerakhir,
      payroll: item.payroll,
      keterangan: item.keterangan,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.namaLengkap.trim() || !form.jabatanDivisi) {
      toast.error('Nama Lengkap dan Jabatan/Divisi wajib diisi');
      return;
    }

    if (editingItem) {
      updateNikInternal(editingItem.id, form);
      toast.success('Data NIK Internal berhasil diperbarui');
    } else {
      const newItem = addNikInternal(form);
      toast.success(`Data NIK Internal berhasil ditambahkan (${newItem.nik})`);
    }
    setDialogOpen(false);
  };

  const previewNik = useMemo(() => {
    if (editingItem) return editingItem.nik;
    if (!form.jabatanDivisi) return '';
    const code = DIVISI_CODE_MAP[form.jabatanDivisi] || 'XXX';
    const existing = nikInternals.filter((n) => n.nik.startsWith(`ME-${code}-INT-`));
    const maxSeq = existing.reduce((max, n) => {
      const parts = n.nik.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `ME-${code}-INT-${String(maxSeq + 1).padStart(3, '0')}`;
  }, [form.jabatanDivisi, editingItem, nikInternals]);

  const columns: Column<NikInternal>[] = [
    { key: 'nik', label: 'NIK Internal' },
    { key: 'namaLengkap', label: 'Nama Lengkap' },
    { key: 'jabatanDivisi', label: 'Jabatan/Divisi' },
    { key: 'status', label: 'Status' },
    { key: 'tipeHubungan', label: 'Tipe Hubungan' },
    { key: 'tglMulai', label: 'Tgl Mulai' },
    { key: 'tglBerakhir', label: 'Tgl Berakhir' },
    { key: 'payroll', label: 'Payroll' },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <>
      <DataTable<NikInternal>
        title="NIK Internal"
        columns={columns}
        data={nikInternals}
        searchKeys={['nik', 'namaLengkap', 'jabatanDivisi', 'tipeHubungan', 'keterangan']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(item) => {
          deleteNikInternal(item.id);
          toast.success('Data berhasil dihapus');
        }}
        statusKey="status"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit NIK Internal' : 'Tambah NIK Internal'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>NIK Internal (Auto)</Label>
                <Input value={previewNik} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap *</Label>
                <Input
                  value={form.namaLengkap}
                  onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jabatan/Divisi *</Label>
                <Select
                  value={form.jabatanDivisi}
                  onValueChange={(val) => setForm({ ...form, jabatanDivisi: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jabatan/Divisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {JABATAN_DIVISI_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val as 'Aktif' | 'Tidak Aktif' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipe Hubungan</Label>
                <Input
                  value={form.tipeHubungan}
                  onChange={(e) => setForm({ ...form, tipeHubungan: e.target.value })}
                  placeholder="Contoh: Karyawan Tetap"
                />
              </div>
              <div className="space-y-2">
                <Label>Payroll</Label>
                <Select
                  value={form.payroll}
                  onValueChange={(val) => setForm({ ...form, payroll: val as 'Ya' | 'Tidak' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ya">Ya</SelectItem>
                    <SelectItem value="Tidak">Tidak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tgl Mulai</Label>
                <Input
                  type="date"
                  value={form.tglMulai}
                  onChange={(e) => setForm({ ...form, tglMulai: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tgl Berakhir</Label>
                <Input
                  type="date"
                  value={form.tglBerakhir}
                  onChange={(e) => setForm({ ...form, tglBerakhir: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Keterangan</Label>
              <Textarea
                value={form.keterangan}
                onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                placeholder="Keterangan tambahan"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'Simpan Perubahan' : 'Tambah Data'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
