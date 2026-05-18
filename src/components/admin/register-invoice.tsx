'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, InvoiceRegister, formatRupiah } from '@/lib/store';
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
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const STATUS_COLORS: Record<string, string> = {
  'Belum Lunas': 'bg-red-100 text-red-700',
  'Sebagian': 'bg-yellow-100 text-yellow-700',
  'Lunas': 'bg-emerald-100 text-emerald-700',
};

export function RegisterInvoicePage() {
  const { invoiceRegisters, addInvoice, updateInvoice, deleteInvoice } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<InvoiceRegister | null>(null);
  const [editingItem, setEditingItem] = useState<InvoiceRegister | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({ tanggal: '', customerId: '', nomorKontrak: '', nilai: '', statusPembayaran: 'Belum Lunas' as InvoiceRegister['statusPembayaran'], tanggalBayar: '', keterangan: '' });

  const filteredData = useMemo(() => {
    if (!search.trim()) return invoiceRegisters;
    const q = search.toLowerCase();
    return invoiceRegisters.filter(i => i.nomorInvoice.toLowerCase().includes(q) || i.customerId.toLowerCase().includes(q) || i.nomorKontrak.toLowerCase().includes(q));
  }, [invoiceRegisters, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleAdd = () => { setEditingItem(null); setForm({ tanggal: new Date().toISOString().split('T')[0], customerId: '', nomorKontrak: '', nilai: '', statusPembayaran: 'Belum Lunas', tanggalBayar: '', keterangan: '' }); setDialogOpen(true); };
  const handleEdit = (item: InvoiceRegister) => { setEditingItem(item); setForm({ tanggal: item.tanggal, customerId: item.customerId, nomorKontrak: item.nomorKontrak, nilai: item.nilai, statusPembayaran: item.statusPembayaran, tanggalBayar: item.tanggalBayar, keterangan: item.keterangan }); setDialogOpen(true); };
  const handleSave = () => {
    if (!form.customerId.trim()) { toast.error('Customer ID wajib diisi'); return; }
    if (editingItem) { updateInvoice(editingItem.id, form); toast.success('Invoice diperbarui'); } else { addInvoice(form); toast.success('Invoice ditambahkan'); }
    setDialogOpen(false);
  };
  const handleDelete = () => { if (deleteItem) { deleteInvoice(deleteItem.id); toast.success('Invoice dihapus'); setDeleteItem(null); } };

  const totalBelumLunas = invoiceRegisters.filter(i => i.statusPembayaran === 'Belum Lunas').length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Register Invoice</h1>
          <p className="text-sm text-muted-foreground">{filteredData.length} invoice &middot; {totalBelumLunas} belum lunas</p>
        </div>
        <Button onClick={handleAdd} className="shrink-0"><Plus className="h-4 w-4 mr-2" />Tambah Invoice</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari nomor invoice, customer, kontrak..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">No</TableHead>
                  <TableHead>Nomor Invoice</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>No. Kontrak</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tgl Bayar</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="w-20 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow><TableCell colSpan={10} className="text-center py-12"><div className="text-muted-foreground"><FileText className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-lg font-medium">Tidak ada invoice</p></div></TableCell></TableRow>
                ) : paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground">{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{item.nomorInvoice}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.tanggal || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.customerId}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.nomorKontrak || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.nilai ? formatRupiah(Number(item.nilai)) : '-'}</TableCell>
                    <TableCell><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.statusPembayaran] || 'bg-gray-100 text-gray-700'}`}>{item.statusPembayaran}</span></TableCell>
                    <TableCell className="whitespace-nowrap">{item.tanggalBayar || '-'}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{item.keterangan || '-'}</TableCell>
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
          <DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Invoice</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
              <div className="space-y-1"><Label>Customer ID *</Label><Input value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} placeholder="ID customer" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nomor Kontrak</Label><Input value={form.nomorKontrak} onChange={e => setForm({ ...form, nomorKontrak: e.target.value })} /></div>
              <div className="space-y-1"><Label>Nilai (Rp)</Label><Input type="number" value={form.nilai} onChange={e => setForm({ ...form, nilai: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Status Pembayaran</Label><Select value={form.statusPembayaran} onValueChange={v => setForm({ ...form, statusPembayaran: v as InvoiceRegister['statusPembayaran'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Belum Lunas">Belum Lunas</SelectItem><SelectItem value="Sebagian">Sebagian</SelectItem><SelectItem value="Lunas">Lunas</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Tanggal Bayar</Label><Input type="date" value={form.tanggalBayar} onChange={e => setForm({ ...form, tanggalBayar: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label>Keterangan</Label><Textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} rows={2} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={o => !o && setDeleteItem(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Invoice</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
