'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, VendorRegister } from '@/lib/store';
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
  tglRegistrasi: string;
  namaSupplier: string;
  pic: string;
  provinsi: string;
  komoditas: string;
  kapasitasBulan: string;
  noHp: string;
  hasilAudit: string;
  status: 'Aktif' | 'Trial' | 'Tidak Aktif';
  keterangan: string;
}

const emptyForm: FormState = {
  tglRegistrasi: new Date().toISOString().split('T')[0],
  namaSupplier: '',
  pic: '',
  provinsi: '',
  komoditas: '',
  kapasitasBulan: '',
  noHp: '',
  hasilAudit: '',
  status: 'Trial',
  keterangan: '',
};

export function VendorRegisterPage() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<VendorRegister | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: VendorRegister) => {
    setEditingItem(item);
    setForm({
      tglRegistrasi: item.tglRegistrasi,
      namaSupplier: item.namaSupplier,
      pic: item.pic,
      provinsi: item.provinsi,
      komoditas: item.komoditas,
      kapasitasBulan: item.kapasitasBulan,
      noHp: item.noHp,
      hasilAudit: item.hasilAudit,
      status: item.status,
      keterangan: item.keterangan,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.namaSupplier.trim() || !form.provinsi.trim()) {
      toast.error('Nama Supplier dan Provinsi wajib diisi');
      return;
    }

    if (editingItem) {
      updateVendor(editingItem.id, form);
      toast.success('Data Vendor berhasil diperbarui');
    } else {
      const newItem = addVendor(form);
      toast.success(`Data Vendor berhasil ditambahkan (${newItem.vendorId})`);
    }
    setDialogOpen(false);
  };

  const previewVendorId = useMemo(() => {
    if (editingItem) return editingItem.vendorId;
    if (!form.provinsi) return '';
    const year = new Date().getFullYear();
    const provCode = form.provinsi.substring(0, 3).toUpperCase();
    const prefix = `MEI-VEN-${provCode}-${year}-`;
    const existing = vendors.filter((v) => v.vendorId.startsWith(prefix));
    const maxSeq = existing.reduce((max, v) => {
      const parts = v.vendorId.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  }, [form.provinsi, editingItem, vendors]);

  const columns: Column<VendorRegister>[] = [
    { key: 'tglRegistrasi', label: 'Tgl Registrasi' },
    { key: 'vendorId', label: 'Vendor ID' },
    { key: 'namaSupplier', label: 'Nama Supplier' },
    { key: 'pic', label: 'PIC' },
    { key: 'provinsi', label: 'Provinsi' },
    { key: 'komoditas', label: 'Komoditas' },
    { key: 'kapasitasBulan', label: 'Kapasitas/Bulan' },
    { key: 'noHp', label: 'No. HP' },
    { key: 'hasilAudit', label: 'Hasil Audit' },
    { key: 'status', label: 'Status' },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <>
      <DataTable<VendorRegister>
        title="Vendor Register"
        columns={columns}
        data={vendors}
        searchKeys={['vendorId', 'namaSupplier', 'pic', 'provinsi', 'komoditas', 'keterangan']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(item) => {
          deleteVendor(item.id);
          toast.success('Data berhasil dihapus');
        }}
        statusKey="status"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Vendor' : 'Tambah Vendor'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor ID (Auto)</Label>
                <Input value={previewVendorId} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Tgl Registrasi</Label>
                <Input
                  type="date"
                  value={form.tglRegistrasi}
                  onChange={(e) => setForm({ ...form, tglRegistrasi: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Supplier *</Label>
                <Input
                  value={form.namaSupplier}
                  onChange={(e) => setForm({ ...form, namaSupplier: e.target.value })}
                  placeholder="Masukkan nama supplier"
                />
              </div>
              <div className="space-y-2">
                <Label>PIC</Label>
                <Input
                  value={form.pic}
                  onChange={(e) => setForm({ ...form, pic: e.target.value })}
                  placeholder="Masukkan nama PIC"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provinsi *</Label>
                <Input
                  value={form.provinsi}
                  onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
                  placeholder="Contoh: Sulawesi Selatan"
                />
              </div>
              <div className="space-y-2">
                <Label>Komoditas</Label>
                <Input
                  value={form.komoditas}
                  onChange={(e) => setForm({ ...form, komoditas: e.target.value })}
                  placeholder="Contoh: Kopi Robusta"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Kapasitas/Bulan</Label>
                <Input
                  value={form.kapasitasBulan}
                  onChange={(e) => setForm({ ...form, kapasitasBulan: e.target.value })}
                  placeholder="Contoh: 50 Ton"
                />
              </div>
              <div className="space-y-2">
                <Label>No. HP</Label>
                <Input
                  value={form.noHp}
                  onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-2">
                <Label>Hasil Audit</Label>
                <Input
                  value={form.hasilAudit}
                  onChange={(e) => setForm({ ...form, hasilAudit: e.target.value })}
                  placeholder="Lulus / Tidak Lulus"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => setForm({ ...form, status: val as 'Aktif' | 'Trial' | 'Tidak Aktif' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
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
