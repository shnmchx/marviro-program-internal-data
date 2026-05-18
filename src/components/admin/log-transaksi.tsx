'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, formatRupiah, MONTH_NAMES, LogPenjualan, LogPembelian, LogBeban, LogGajiHonor, LogAset } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, BookOpen, Calculator } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

function PaginatedTable<T extends { id: string }>({ data, columns, onEdit, onDelete, pageSize = PAGE_SIZE }: {
  data: T[]; columns: { key: string; label: string; render?: (item: T, idx: number) => React.ReactNode }[];
  onEdit: (item: T) => void; onDelete: (item: T) => void; pageSize?: number;
}) {
  const [page, setPage] = useState(1);
  const [delItem, setDelItem] = useState<T | null>(null);
  const total = Math.max(1, Math.ceil(data.length / pageSize));
  const paged = data.slice((page - 1) * pageSize, page * pageSize);

  const handleDel = () => { if (delItem) { onDelete(delItem); setDelItem(null); } };

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">No</TableHead>
                  {columns.map(c => <TableHead key={c.key} className="whitespace-nowrap">{c.label}</TableHead>)}
                  <TableHead className="w-20 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.length === 0 ? (
                  <TableRow><TableCell colSpan={columns.length + 2} className="text-center py-12 text-muted-foreground">Tidak ada data</TableCell></TableRow>
                ) : paged.map((item, idx) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground">{(page - 1) * pageSize + idx + 1}</TableCell>
                    {columns.map(c => <TableCell key={c.key} className="whitespace-nowrap">{c.render ? c.render(item, idx) : String((item as Record<string, unknown>)[c.key] ?? '-')}</TableCell>)}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDelItem(item)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {total > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">Halaman {page} dari {total} ({data.length} data)</p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={!!delItem} onOpenChange={o => !o && setDelItem(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Data</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ===== Penjualan Tab =====
function PenjualanTab() {
  const { logPenjualans, addLogPenjualan, updateLogPenjualan, deleteLogPenjualan } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LogPenjualan | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ tanggal: new Date().toISOString().split('T')[0], jenisTransaksi: '', produk: '', satuan: '', qty: 0, hargaJual: 0, buyer: '', statusPembayaran: '', metode: '', bukti: '' });

  const filtered = useMemo(() => {
    if (!search.trim()) return logPenjualans;
    const q = search.toLowerCase();
    return logPenjualans.filter(p => p.produk.toLowerCase().includes(q) || p.buyer.toLowerCase().includes(q) || p.jenisTransaksi.toLowerCase().includes(q));
  }, [logPenjualans, search]);

  const handleAdd = () => { setEdit(null); setForm({ tanggal: new Date().toISOString().split('T')[0], jenisTransaksi: '', produk: '', satuan: '', qty: 0, hargaJual: 0, buyer: '', statusPembayaran: '', metode: '', bukti: '' }); setOpen(true); };
  const handleEdit = (item: LogPenjualan) => { setEdit(item); setForm({ tanggal: item.tanggal, jenisTransaksi: item.jenisTransaksi, produk: item.produk, satuan: item.satuan, qty: item.qty, hargaJual: item.hargaJual, buyer: item.buyer, statusPembayaran: item.statusPembayaran, metode: item.metode, bukti: item.bukti }); setOpen(true); };
  const handleSave = () => {
    if (!form.produk.trim()) { toast.error('Produk wajib diisi'); return; }
    if (edit) { updateLogPenjualan(edit.id, form); toast.success('Data diperbarui'); } else { addLogPenjualan(form); toast.success('Data ditambahkan'); }
    setOpen(false);
  };

  const columns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'jenisTransaksi', label: 'Jenis Transaksi' },
    { key: 'produk', label: 'Produk' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'qty', label: 'Qty', render: (i: LogPenjualan) => i.qty.toLocaleString() },
    { key: 'hargaJual', label: 'Harga Jual', render: (i: LogPenjualan) => formatRupiah(i.hargaJual) },
    { key: 'totalPenjualan', label: 'Total', render: (i: LogPenjualan) => <span className="font-semibold text-emerald-600">{formatRupiah(i.totalPenjualan)}</span> },
    { key: 'buyer', label: 'Buyer' },
    { key: 'statusPembayaran', label: 'Status Bayar', render: (i: LogPenjualan) => <Badge variant="outline" className="text-xs">{i.statusPembayaran || '-'}</Badge> },
    { key: 'metode', label: 'Metode' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>
      <PaginatedTable data={filtered} columns={columns} onEdit={handleEdit} onDelete={deleteLogPenjualan} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader><DialogTitle>{edit ? 'Edit' : 'Tambah'} Penjualan</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
              <div className="space-y-1"><Label>Jenis Transaksi</Label><Select value={form.jenisTransaksi} onValueChange={v => setForm({ ...form, jenisTransaksi: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Ekspor">Ekspor</SelectItem><SelectItem value="Lokal">Lokal</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Produk *</Label><Input value={form.produk} onChange={e => setForm({ ...form, produk: e.target.value })} /></div>
              <div className="space-y-1"><Label>Satuan</Label><Input value={form.satuan} onChange={e => setForm({ ...form, satuan: e.target.value })} placeholder="Kg, Ton, dll" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Qty</Label><Input type="number" value={form.qty || ''} onChange={e => setForm({ ...form, qty: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Harga Jual</Label><Input type="number" value={form.hargaJual || ''} onChange={e => setForm({ ...form, hargaJual: Number(e.target.value) || 0 })} /></div>
            </div>
            <p className="text-sm">Total: <strong>{formatRupiah((Number(form.qty) || 0) * (Number(form.hargaJual) || 0))}</strong></p>
            <div className="space-y-1"><Label>Buyer</Label><Input value={form.buyer} onChange={e => setForm({ ...form, buyer: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Status Pembayaran</Label><Select value={form.statusPembayaran} onValueChange={v => setForm({ ...form, statusPembayaran: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Lunas">Lunas</SelectItem><SelectItem value="Belum Lunas">Belum Lunas</SelectItem><SelectItem value="Sebagian">Sebagian</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Metode</Label><Input value={form.metode} onChange={e => setForm({ ...form, metode: e.target.value })} placeholder="Transfer, Tunai, dll" /></div>
            </div>
            <div className="space-y-1"><Label>Bukti</Label><Input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} placeholder="Link bukti / keterangan" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Pembelian Tab =====
function PembelianTab() {
  const { logPembelians, addLogPembelian, updateLogPembelian, deleteLogPembelian } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LogPembelian | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ tanggal: '', produk: '', supplier: '', satuan: '', qty: 0, hargaBeli: 0, metodeBayar: '', status: '', bukti: '' });

  const filtered = useMemo(() => { if (!search.trim()) return logPembelians; const q = search.toLowerCase(); return logPembelians.filter(p => p.produk.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q)); }, [logPembelians, search]);

  const handleAdd = () => { setEdit(null); setForm({ tanggal: new Date().toISOString().split('T')[0], produk: '', supplier: '', satuan: '', qty: 0, hargaBeli: 0, metodeBayar: '', status: '', bukti: '' }); setOpen(true); };
  const handleEdit = (item: LogPembelian) => { setEdit(item); setForm({ tanggal: item.tanggal, produk: item.produk, supplier: item.supplier, satuan: item.satuan, qty: item.qty, hargaBeli: item.hargaBeli, metodeBayar: item.metodeBayar, status: item.status, bukti: item.bukti }); setOpen(true); };
  const handleSave = () => { if (!form.produk.trim()) { toast.error('Produk wajib diisi'); return; } if (edit) { updateLogPembelian(edit.id, form); toast.success('Data diperbarui'); } else { addLogPembelian(form); toast.success('Data ditambahkan'); } setOpen(false); };

  const columns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'produk', label: 'Produk' },
    { key: 'supplier', label: 'Supplier' },
    { key: 'satuan', label: 'Satuan' },
    { key: 'qty', label: 'Qty', render: (i: LogPembelian) => i.qty.toLocaleString() },
    { key: 'hargaBeli', label: 'Harga Beli', render: (i: LogPembelian) => formatRupiah(i.hargaBeli) },
    { key: 'totalPembelian', label: 'Total', render: (i: LogPembelian) => <span className="font-semibold text-red-600">{formatRupiah(i.totalPembelian)}</span> },
    { key: 'metodeBayar', label: 'Metode Bayar' },
    { key: 'status', label: 'Status', render: (i: LogPembelian) => <Badge variant="outline" className="text-xs">{i.status || '-'}</Badge> },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>
      <PaginatedTable data={filtered} columns={columns} onEdit={handleEdit} onDelete={deleteLogPembelian} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader><DialogTitle>{edit ? 'Edit' : 'Tambah'} Pembelian</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Produk *</Label><Input value={form.produk} onChange={e => setForm({ ...form, produk: e.target.value })} /></div>
              <div className="space-y-1"><Label>Supplier</Label><Input value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1"><Label>Satuan</Label><Input value={form.satuan} onChange={e => setForm({ ...form, satuan: e.target.value })} /></div>
              <div className="space-y-1"><Label>Qty</Label><Input type="number" value={form.qty || ''} onChange={e => setForm({ ...form, qty: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Harga Beli</Label><Input type="number" value={form.hargaBeli || ''} onChange={e => setForm({ ...form, hargaBeli: Number(e.target.value) || 0 })} /></div>
            </div>
            <p className="text-sm">Total: <strong>{formatRupiah((Number(form.qty) || 0) * (Number(form.hargaBeli) || 0))}</strong></p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Metode Bayar</Label><Input value={form.metodeBayar} onChange={e => setForm({ ...form, metodeBayar: e.target.value })} /></div>
              <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Lunas">Lunas</SelectItem><SelectItem value="Belum Lunas">Belum Lunas</SelectItem><SelectItem value="Sebagian">Sebagian</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1"><Label>Bukti</Label><Input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Beban Tab =====
function BebanTab() {
  const { logBebans, addLogBeban, updateLogBeban, deleteLogBeban } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LogBeban | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ tanggal: '', jenisBeban: '', kategori: '', nominal: 0, metodeBayar: '', keterangan: '', bukti: '' });

  const filtered = useMemo(() => { if (!search.trim()) return logBebans; const q = search.toLowerCase(); return logBebans.filter(b => b.jenisBeban.toLowerCase().includes(q) || b.kategori.toLowerCase().includes(q)); }, [logBebans, search]);

  const handleAdd = () => { setEdit(null); setForm({ tanggal: new Date().toISOString().split('T')[0], jenisBeban: '', kategori: '', nominal: 0, metodeBayar: '', keterangan: '', bukti: '' }); setOpen(true); };
  const handleEdit = (item: LogBeban) => { setEdit(item); setForm({ tanggal: item.tanggal, jenisBeban: item.jenisBeban, kategori: item.kategori, nominal: item.nominal, metodeBayar: item.metodeBayar, keterangan: item.keterangan, bukti: item.bukti }); setOpen(true); };
  const handleSave = () => { if (!form.jenisBeban.trim()) { toast.error('Jenis beban wajib diisi'); return; } if (edit) { updateLogBeban(edit.id, form); toast.success('Data diperbarui'); } else { addLogBeban(form); toast.success('Data ditambahkan'); } setOpen(false); };

  const columns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'jenisBeban', label: 'Jenis Beban' },
    { key: 'kategori', label: 'Kategori' },
    { key: 'nominal', label: 'Nominal', render: (i: LogBeban) => <span className="text-red-600">{formatRupiah(i.nominal)}</span> },
    { key: 'metodeBayar', label: 'Metode Bayar' },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>
      <PaginatedTable data={filtered} columns={columns} onEdit={handleEdit} onDelete={deleteLogBeban} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{edit ? 'Edit' : 'Tambah'} Beban Operasional</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Jenis Beban *</Label><Input value={form.jenisBeban} onChange={e => setForm({ ...form, jenisBeban: e.target.value })} placeholder="Sewa, Listrik, dll" /></div>
              <div className="space-y-1"><Label>Kategori</Label><Input value={form.kategori} onChange={e => setForm({ ...form, kategori: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nominal</Label><Input type="number" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Metode Bayar</Label><Input value={form.metodeBayar} onChange={e => setForm({ ...form, metodeBayar: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label>Keterangan</Label><Textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} rows={2} /></div>
            <div className="space-y-1"><Label>Bukti</Label><Input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Gaji/Honor Tab =====
function GajiHonorTab() {
  const { logGajiHonors, addLogGajiHonor, updateLogGajiHonor, deleteLogGajiHonor } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LogGajiHonor | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ periode: '', nama: '', jabatan: '', jenisPembayaran: '', nominal: 0, metode: '', status: '', bukti: '' });

  const filtered = useMemo(() => { if (!search.trim()) return logGajiHonors; const q = search.toLowerCase(); return logGajiHonors.filter(g => g.nama.toLowerCase().includes(q) || g.jabatan.toLowerCase().includes(q)); }, [logGajiHonors, search]);

  const handleAdd = () => { setEdit(null); setForm({ periode: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`, nama: '', jabatan: '', jenisPembayaran: '', nominal: 0, metode: '', status: '', bukti: '' }); setOpen(true); };
  const handleEdit = (item: LogGajiHonor) => { setEdit(item); setForm({ periode: item.periode, nama: item.nama, jabatan: item.jabatan, jenisPembayaran: item.jenisPembayaran, nominal: item.nominal, metode: item.metode, status: item.status, bukti: item.bukti }); setOpen(true); };
  const handleSave = () => { if (!form.nama.trim()) { toast.error('Nama wajib diisi'); return; } if (edit) { updateLogGajiHonor(edit.id, form); toast.success('Data diperbarui'); } else { addLogGajiHonor(form); toast.success('Data ditambahkan'); } setOpen(false); };

  const columns = [
    { key: 'periode', label: 'Periode' },
    { key: 'nama', label: 'Nama' },
    { key: 'jabatan', label: 'Jabatan' },
    { key: 'jenisPembayaran', label: 'Jenis' },
    { key: 'nominal', label: 'Nominal', render: (i: LogGajiHonor) => formatRupiah(i.nominal) },
    { key: 'metode', label: 'Metode' },
    { key: 'status', label: 'Status', render: (i: LogGajiHonor) => <Badge variant="outline" className="text-xs">{i.status || '-'}</Badge> },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>
      <PaginatedTable data={filtered} columns={columns} onEdit={handleEdit} onDelete={deleteLogGajiHonor} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{edit ? 'Edit' : 'Tambah'} Gaji/Honor/Fee</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Periode</Label><Input type="month" value={form.periode} onChange={e => setForm({ ...form, periode: e.target.value })} /></div>
              <div className="space-y-1"><Label>Nama *</Label><Input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Jabatan</Label><Input value={form.jabatan} onChange={e => setForm({ ...form, jabatan: e.target.value })} /></div>
              <div className="space-y-1"><Label>Jenis Pembayaran</Label><Select value={form.jenisPembayaran} onValueChange={v => setForm({ ...form, jenisPembayaran: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Gaji">Gaji</SelectItem><SelectItem value="Honor">Honor</SelectItem><SelectItem value="Fee">Fee</SelectItem><SelectItem value="Lembur">Lembur</SelectItem><SelectItem value="THR">THR</SelectItem><SelectItem value="Lainnya">Lainnya</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nominal</Label><Input type="number" value={form.nominal || ''} onChange={e => setForm({ ...form, nominal: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Metode</Label><Input value={form.metode} onChange={e => setForm({ ...form, metode: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Lunas">Lunas</SelectItem><SelectItem value="Belum Bayar">Belum Bayar</SelectItem></SelectContent></Select></div>
              <div className="space-y-1"><Label>Bukti</Label><Input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Aset Tab =====
function AsetTab() {
  const { logAsets, addLogAset, updateLogAset, deleteLogAset } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<LogAset | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ tanggal: '', namaAset: '', jenis: '', nilai: 0, metodeBayar: '', keterangan: '', bukti: '' });

  const filtered = useMemo(() => { if (!search.trim()) return logAsets; const q = search.toLowerCase(); return logAsets.filter(a => a.namaAset.toLowerCase().includes(q) || a.jenis.toLowerCase().includes(q)); }, [logAsets, search]);

  const handleAdd = () => { setEdit(null); setForm({ tanggal: new Date().toISOString().split('T')[0], namaAset: '', jenis: '', nilai: 0, metodeBayar: '', keterangan: '', bukti: '' }); setOpen(true); };
  const handleEdit = (item: LogAset) => { setEdit(item); setForm({ tanggal: item.tanggal, namaAset: item.namaAset, jenis: item.jenis, nilai: item.nilai, metodeBayar: item.metodeBayar, keterangan: item.keterangan, bukti: item.bukti }); setOpen(true); };
  const handleSave = () => { if (!form.namaAset.trim()) { toast.error('Nama aset wajib diisi'); return; } if (edit) { updateLogAset(edit.id, form); toast.success('Data diperbarui'); } else { addLogAset(form); toast.success('Data ditambahkan'); } setOpen(false); };

  const columns = [
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'namaAset', label: 'Nama Aset' },
    { key: 'jenis', label: 'Jenis' },
    { key: 'nilai', label: 'Nilai', render: (i: LogAset) => formatRupiah(i.nilai) },
    { key: 'metodeBayar', label: 'Metode Bayar' },
    { key: 'keterangan', label: 'Keterangan' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        <Button onClick={handleAdd} size="sm"><Plus className="h-4 w-4 mr-1" />Tambah</Button>
      </div>
      <PaginatedTable data={filtered} columns={columns} onEdit={handleEdit} onDelete={deleteLogAset} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{edit ? 'Edit' : 'Tambah'} Aset & Peralatan</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1"><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={e => setForm({ ...form, tanggal: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nama Aset *</Label><Input value={form.namaAset} onChange={e => setForm({ ...form, namaAset: e.target.value })} /></div>
              <div className="space-y-1"><Label>Jenis</Label><Select value={form.jenis} onValueChange={v => setForm({ ...form, jenis: v })}><SelectTrigger><SelectValue placeholder="Pilih" /></SelectTrigger><SelectContent><SelectItem value="Kendaraan">Kendaraan</SelectItem><SelectItem value="Peralatan">Peralatan</SelectItem><SelectItem value="Elektronik">Elektronik</SelectItem><SelectItem value="Properti">Properti</SelectItem><SelectItem value="Lainnya">Lainnya</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nilai</Label><Input type="number" value={form.nilai || ''} onChange={e => setForm({ ...form, nilai: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Metode Bayar</Label><Input value={form.metodeBayar} onChange={e => setForm({ ...form, metodeBayar: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label>Keterangan</Label><Textarea value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} rows={2} /></div>
            <div className="space-y-1"><Label>Bukti</Label><Input value={form.bukti} onChange={e => setForm({ ...form, bukti: e.target.value })} /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== Rekap Periode Tab =====
function RekapPeriodeTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors, logAsets } = useAdminStore();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const monthStr = String(month).padStart(2, '0');
  const periodFilter = `${year}-${monthStr}`;

  const penjualanFiltered = logPenjualans.filter(p => p.tanggal.startsWith(periodFilter));
  const pembelianFiltered = logPembelians.filter(p => p.tanggal.startsWith(periodFilter));
  const bebanFiltered = logBebans.filter(b => b.tanggal.startsWith(periodFilter));
  const gajiFiltered = logGajiHonors.filter(g => g.periode === periodFilter);
  const asetFiltered = logAsets.filter(a => a.tanggal.startsWith(periodFilter));

  const totalPenjualan = penjualanFiltered.reduce((s, p) => s + p.totalPenjualan, 0);
  const totalPembelian = pembelianFiltered.reduce((s, p) => s + p.totalPembelian, 0);
  const totalBeban = bebanFiltered.reduce((s, b) => s + b.nominal, 0);
  const totalGaji = gajiFiltered.reduce((s, g) => s + g.nominal, 0);
  const totalAset = asetFiltered.reduce((s, a) => s + a.nilai, 0);
  const kasMasuk = totalPenjualan;
  const kasKeluar = totalPembelian + totalBeban + totalGaji + totalAset;
  const saldo = kasMasuk - kasKeluar;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTH_NAMES.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}</SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">{MONTH_NAMES[month - 1]} {year}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Penjualan</p><p className="text-xl font-bold text-emerald-600">{formatRupiah(totalPenjualan)}</p><p className="text-xs text-muted-foreground">{penjualanFiltered.length} transaksi</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Pembelian</p><p className="text-xl font-bold text-red-600">{formatRupiah(totalPembelian)}</p><p className="text-xs text-muted-foreground">{pembelianFiltered.length} transaksi</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Beban</p><p className="text-xl font-bold text-orange-600">{formatRupiah(totalBeban)}</p><p className="text-xs text-muted-foreground">{bebanFiltered.length} entri</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Gaji/Honor</p><p className="text-xl font-bold text-amber-600">{formatRupiah(totalGaji)}</p><p className="text-xs text-muted-foreground">{gajiFiltered.length} entri</p></CardContent></Card>
      </div>

      <Card className={saldo >= 0 ? 'border-emerald-300' : 'border-red-300'}>
        <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-5 w-5" />Rekap Kas Periode</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Kas Masuk (Penjualan)</span><span className="font-medium text-emerald-600">{formatRupiah(kasMasuk)}</span></div>
            <div className="flex justify-between"><span>Kas Keluar (Pembelian)</span><span className="font-medium text-red-600">-{formatRupiah(totalPembelian)}</span></div>
            <div className="flex justify-between"><span>Kas Keluar (Beban)</span><span className="font-medium text-red-600">-{formatRupiah(totalBeban)}</span></div>
            <div className="flex justify-between"><span>Kas Keluar (Gaji/Honor)</span><span className="font-medium text-red-600">-{formatRupiah(totalGaji)}</span></div>
            <div className="flex justify-between"><span>Kas Keluar (Aset)</span><span className="font-medium text-red-600">-{formatRupiah(totalAset)}</span></div>
            <div className="border-t pt-2 mt-2 flex justify-between text-base font-bold">
              <span>Saldo</span>
              <span className={saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatRupiah(saldo)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== Main Component =====
export function LogTransaksiPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Log Transaksi</h1>
        <p className="text-sm text-muted-foreground">Catatan semua transaksi keuangan perusahaan</p>
      </div>
      <Tabs defaultValue="penjualan">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50">
          <TabsTrigger value="penjualan" className="text-xs">Penjualan</TabsTrigger>
          <TabsTrigger value="pembelian" className="text-xs">Pembelian</TabsTrigger>
          <TabsTrigger value="beban" className="text-xs">Beban Operasional</TabsTrigger>
          <TabsTrigger value="gaji" className="text-xs">Gaji/Honor/Fee</TabsTrigger>
          <TabsTrigger value="aset" className="text-xs">Aset & Peralatan</TabsTrigger>
          <TabsTrigger value="rekap" className="text-xs">Rekap Periode</TabsTrigger>
        </TabsList>
        <TabsContent value="penjualan"><PenjualanTab /></TabsContent>
        <TabsContent value="pembelian"><PembelianTab /></TabsContent>
        <TabsContent value="beban"><BebanTab /></TabsContent>
        <TabsContent value="gaji"><GajiHonorTab /></TabsContent>
        <TabsContent value="aset"><AsetTab /></TabsContent>
        <TabsContent value="rekap"><RekapPeriodeTab /></TabsContent>
      </Tabs>
    </div>
  );
}
