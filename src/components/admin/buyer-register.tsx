'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, BuyerRegister } from '@/lib/store';
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
  namaPerusahaan: string;
  pic: string;
  negara: string;
  alamatLengkap: string;
  email: string;
  noHp: string;
  komoditasMinat: string;
  metodePembayaran: string;
  status: 'Aktif' | 'Trial' | 'Tidak Aktif';
  keterangan: string;
}

const emptyForm: FormState = {
  tglRegistrasi: new Date().toISOString().split('T')[0],
  namaPerusahaan: '',
  pic: '',
  negara: '',
  alamatLengkap: '',
  email: '',
  noHp: '',
  komoditasMinat: '',
  metodePembayaran: '',
  status: 'Trial',
  keterangan: '',
};

export function BuyerRegisterPage() {
  const { buyers, addBuyer, updateBuyer, deleteBuyer } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BuyerRegister | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const handleAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (item: BuyerRegister) => {
    setEditingItem(item);
    setForm({
      tglRegistrasi: item.tglRegistrasi,
      namaPerusahaan: item.namaPerusahaan,
      pic: item.pic,
      negara: item.negara,
      alamatLengkap: item.alamatLengkap,
      email: item.email,
      noHp: item.noHp,
      komoditasMinat: item.komoditasMinat,
      metodePembayaran: item.metodePembayaran,
      status: item.status,
      keterangan: item.keterangan,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.namaPerusahaan.trim() || !form.negara.trim()) {
      toast.error('Nama Perusahaan dan Negara wajib diisi');
      return;
    }

    if (editingItem) {
      updateBuyer(editingItem.id, form);
      toast.success('Data Buyer berhasil diperbarui');
    } else {
      const newItem = addBuyer(form);
      toast.success(`Data Buyer berhasil ditambahkan (${newItem.buyerId})`);
    }
    setDialogOpen(false);
  };

  const previewBuyerId = useMemo(() => {
    if (editingItem) return editingItem.buyerId;
    if (!form.negara) return '';
    const year = new Date().getFullYear();
    const countryCode = form.negara.substring(0, 3).toUpperCase();
    const prefix = `BID-${countryCode}-${year}-`;
    const existing = buyers.filter((b) => b.buyerId.startsWith(prefix));
    const maxSeq = existing.reduce((max, b) => {
      const parts = b.buyerId.split('-');
      const seq = parseInt(parts[parts.length - 1], 10);
      return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  }, [form.negara, editingItem, buyers]);

  const columns: Column<BuyerRegister>[] = [
    { key: 'tglRegistrasi', label: 'Tgl Registrasi' },
    { key: 'buyerId', label: 'Buyer ID' },
    { key: 'namaPerusahaan', label: 'Nama Perusahaan' },
    { key: 'pic', label: 'PIC' },
    { key: 'negara', label: 'Negara' },
    { key: 'alamatLengkap', label: 'Alamat Lengkap' },
    { key: 'email', label: 'Email' },
    { key: 'noHp', label: 'No. HP' },
    { key: 'komoditasMinat', label: 'Komoditas Minat' },
    { key: 'metodePembayaran', label: 'Metode Pembayaran' },
    { key: 'status', label: 'Status' },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <>
      <DataTable<BuyerRegister>
        title="Buyer Register"
        columns={columns}
        data={buyers}
        searchKeys={['buyerId', 'namaPerusahaan', 'pic', 'negara', 'email', 'komoditasMinat', 'keterangan']}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={(item) => {
          deleteBuyer(item.id);
          toast.success('Data berhasil dihapus');
        }}
        statusKey="status"
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Buyer' : 'Tambah Buyer'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Buyer ID (Auto)</Label>
                <Input value={previewBuyerId} readOnly className="bg-muted" />
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
                <Label>Nama Perusahaan *</Label>
                <Input
                  value={form.namaPerusahaan}
                  onChange={(e) => setForm({ ...form, namaPerusahaan: e.target.value })}
                  placeholder="Masukkan nama perusahaan"
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
                <Label>Negara *</Label>
                <Input
                  value={form.negara}
                  onChange={(e) => setForm({ ...form, negara: e.target.value })}
                  placeholder="Contoh: Japan"
                />
              </div>
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
              <Label>Alamat Lengkap</Label>
              <Textarea
                value={form.alamatLengkap}
                onChange={(e) => setForm({ ...form, alamatLengkap: e.target.value })}
                placeholder="Masukkan alamat lengkap"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@company.com"
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Komoditas Minat</Label>
                <Input
                  value={form.komoditasMinat}
                  onChange={(e) => setForm({ ...form, komoditasMinat: e.target.value })}
                  placeholder="Contoh: Kopi Robusta, Kelapa"
                />
              </div>
              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Input
                  value={form.metodePembayaran}
                  onChange={(e) => setForm({ ...form, metodePembayaran: e.target.value })}
                  placeholder="Contoh: L/C, TT"
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
