'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, PembayaranRegister, formatRupiah } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Diterima': 'bg-emerald-100 text-emerald-700',
  'Gagal': 'bg-red-100 text-red-700',
};

export function RegisterPembayaranPage() {
  const { pembayaranRegisters, invoiceRegisters, addPembayaran, updatePembayaran, deletePembayaran } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<PembayaranRegister | null>(null);
  const [editingItem, setEditingItem] = useState<PembayaranRegister | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ tanggal: '', referensiInvoice: '', customerId: '', jumlah: '', metode: '', buktiTransfer: '', status: 'Pending' as PembayaranRegister['status'] });

  const filteredData = useMemo(() => {
    if (!search.trim()) return pembayaranRegisters;
    const q = search.toLowerCase();
    return pembayaranRegisters.filter(p => p.referensiInvoice.toLowerCase().includes(q) || p.customerId.toLowerCase().includes(q));
  }, [pembayaranRegisters, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAdd = () => { setEditingItem(null); setForm({ tanggal: new Date().toISOString().split('T')[0], referensiInvoice: '', customerId: '', jumlah: '', metode: '', buktiTransfer: '', status: 'Pending' }); setDialogOpen(true); };
  const handleEdit = (item: PembayaranRegister) => { setEditingItem(item); setForm({ tanggal: item.tanggal, referensiInvoice: item.referensiInvoice, customerId: item.customerId, jumlah: item.jumlah, metode: item.metode, buktiTransfer: item.buktiTransfer, status: item.status }); setDialogOpen(true); };
  const handleSave = () => {
    if (!form.customerId.trim()) { toast.error('Customer ID wajib diisi'); return; }
    if (editingItem) { updatePembayaran(editingItem.id, form); toast.success('Pembayaran diperbarui'); } else { addPembayaran(form); toast.success('Pembayaran ditambahkan'); }
    setDialogOpen(false);
  };
  const handleDelete = () => { if (deleteItem) { deletePembayaran(deleteItem.id); toast.success('Data dihapus'); setDeleteItem(null); } };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Register Pembayaran</h1>
          <p className="text-sm text-muted-foreground">{filteredData.length} pembayaran</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0"><Plus className="h-4 w-4 mr-2" />Tambah Pembayaran</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari referensi invoice, customer..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Ref. Invoice</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Bukti Transfer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center py-12"><div className="text-muted-foreground"><CreditCard className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-lg font-medium">Tidak ada data</p></div></TableCell></TableRow>
                ) : paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground">{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.tanggal || '-'}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{item.referensiInvoice || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.customerId}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.jumlah ? formatRupiah(Number(item.jumlah)) : '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.metode || '-'}</TableCell>
                    <TableCell className="max-w-[120px] truncate text-xs">{item.buktiTransfer || '-'}</TableCell>
                    <TableCell><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-700'}`}>{item.status}</span></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteItem(item)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">Halaman {currentPage} dari {totalPages}</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Pembayaran</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
              <div className="space-y-1"><Label>Customer ID *</Label><Input value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} /></div>
            </div>
            <div className="space-y-1">
              <Label>Referensi Invoice</Label>
              <Select value={form.referensiInvoice} onValueChange={v => setForm({ ...form, referensiInvoice: v })}>
                <SelectTrigger><SelectValue placeholder="Pilih invoice (opsional)" /></SelectTrigger>
                <SelectContent>
                  {invoiceRegisters.map(inv => <SelectItem key={inv.id} value={inv.nomorInvoice}>{inv.nomorInvoice} - {inv.customerId}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Jumlah (Rp)</Label><Input type="number" value={form.jumlah} onChange={e => setForm({ ...form, jumlah: e.target.value })} /></div>
              <div className="space-y-1"><Label>Metode</Label><Input value={form.metode} onChange={e => setForm({ ...form, metode: e.target.value })} placeholder="Transfer, Tunai, dll" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v as PembayaranRegister['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Diterima">Diterima</SelectItem><SelectItem value="Gagal">Gagal</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Bukti Transfer</Label><Input value={form.buktiTransfer} onChange={e => setForm({ ...form, buktiTransfer: e.target.value })} placeholder="Link / No. referensi" /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={o => !o && setDeleteItem(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Pembayaran</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
