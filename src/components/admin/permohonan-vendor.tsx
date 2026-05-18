'use client';

import { useState } from 'react';
import { useAdminStore, PermohonanVendor } from '@/lib/store';
import { DataTable, Column } from './data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface FormState {
  tglKirimSurat: string;
  nomorSuratVendor: string;
  namaVendor: string;
  jenisVendor: string;
  statusPermohonan: 'Accept' | 'Reject' | 'Pending';
  statusPihak: string;
  idVendor: string;
}

const emptyForm: FormState = {
  tglKirimSurat: new Date().toISOString().split('T')[0],
  nomorSuratVendor: '',
  namaVendor: '',
  jenisVendor: '',
  statusPermohonan: 'Pending',
  statusPihak: '',
  idVendor: '',
};

export function PermohonanVendorPage() {
  const { permohonans, addPermohonan, updatePermohonan, deletePermohonan } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PermohonanVendor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: PermohonanVendor) => {
    setEditingItem(item);
    setForm({
      tglKirimSurat: item.tglKirimSurat,
      nomorSuratVendor: item.nomorSuratVendor,
      namaVendor: item.namaVendor,
      jenisVendor: item.jenisVendor,
      statusPermohonan: item.statusPermohonan,
      statusPihak: item.statusPihak,
      idVendor: item.idVendor,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nomorSuratVendor.trim() || !form.namaVendor.trim()) {
      toast.error('Nomor Surat dan Nama Vendor wajib diisi');
      return;
    }

    if (editingItem) {
      updatePermohonan(editingItem.id, form);
      toast.success('Data Permohonan berhasil diperbarui');
    } else {
      addPermohonan(form);
      toast.success('Data Permohonan berhasil ditambahkan');
    }
    setDialogOpen(false);
  };

  const columns: Column<PermohonanVendor>[] = [
    { key: 'tglKirimSurat', label: 'Tgl Kirim Surat' },
    { key: 'nomorSuratVendor', label: 'Nomor Surat Vendor' },
    { key: 'namaVendor', label: 'Nama Vendor' },
    { key: 'jenisVendor', label: 'Jenis Vendor' },
    { key: 'statusPermohonan', label: 'Status', render: (item) => {
      const color = {
        Accept: 'bg-emerald-100 text-emerald-700',
        Reject: 'bg-red-100 text-red-700',
        Pending: 'bg-yellow-100 text-yellow-700',
      }[item.statusPermohonan] || 'bg-gray-100 text-gray-700';
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
          {item.statusPermohonan}
        </span>
      );
    }},
    { key: 'statusPihak', label: 'Status Pihak' },
    { key: 'idVendor', label: 'ID Vendor' },
  ];

  return (
    <>
      <DataTable<PermohonanVendor>
        title="Permohonan Vendor"
        columns={columns}
        data={permohonans}
        searchKeys={['nomorSuratVendor', 'namaVendor', 'jenisVendor', 'statusPihak', 'idVendor']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(item) => {
          deletePermohonan(item.id);
          toast.success('Data berhasil dihapus');
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Permohonan Vendor' : 'Tambah Permohonan Vendor'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tgl Kirim Surat</Label>
                <Input
                  type="date"
                  value={form.tglKirimSurat}
                  onChange={(e) => setForm({ ...form, tglKirimSurat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Nomor Surat Vendor *</Label>
                <Input
                  value={form.nomorSuratVendor}
                  onChange={(e) => setForm({ ...form, nomorSuratVendor: e.target.value })}
                  placeholder="Masukkan nomor surat"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nama Vendor *</Label>
                <Input
                  value={form.namaVendor}
                  onChange={(e) => setForm({ ...form, namaVendor: e.target.value })}
                  placeholder="Masukkan nama vendor"
                />
              </div>
              <div className="space-y-2">
                <Label>Jenis Vendor</Label>
                <Input
                  value={form.jenisVendor}
                  onChange={(e) => setForm({ ...form, jenisVendor: e.target.value })}
                  placeholder="Contoh: Supplier Kopi"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status Permohonan</Label>
                <Select
                  value={form.statusPermohonan}
                  onValueChange={(val) => setForm({ ...form, statusPermohonan: val as 'Accept' | 'Reject' | 'Pending' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Accept">Accept</SelectItem>
                    <SelectItem value="Reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Pihak</Label>
                <Input
                  value={form.statusPihak}
                  onChange={(e) => setForm({ ...form, statusPihak: e.target.value })}
                  placeholder="Contoh: Dalam Proses"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ID Vendor</Label>
              <Input
                value={form.idVendor}
                onChange={(e) => setForm({ ...form, idVendor: e.target.value })}
                placeholder="Masukkan ID Vendor jika sudah ada"
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
