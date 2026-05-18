'use client';

import { useState, useMemo, useRef } from 'react';
import { useAdminStore, PayrollEntry, formatRupiah, MONTH_NAMES } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Wallet, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

interface FormState {
  periode: string;
  nama: string;
  nik: string;
  jabatan: string;
  tipeKaryawan: PayrollEntry['tipeKaryawan'];
  gajiPokok: number;
  lembur: number;
  tunjanganJamsostek: number;
  tunjanganJamkes: number;
  iuranJamsostek: number;
  iuranJamkes: number;
  pinjaman: number;
  pph21: number;
}

const emptyForm: FormState = {
  periode: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  nama: '', nik: '', jabatan: '', tipeKaryawan: 'Non-Magang',
  gajiPokok: 0, lembur: 0, tunjanganJamsostek: 0, tunjanganJamkes: 0,
  iuranJamsostek: 0, iuranJamkes: 0, pinjaman: 0, pph21: 0,
};

export function PayrollPage() {
  const { payrollEntries, addPayroll, updatePayroll, deletePayroll, companyLogo, setCompanyLogo } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<PayrollEntry | null>(null);
  const [editingItem, setEditingItem] = useState<PayrollEntry | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterTipe, setFilterTipe] = useState<'Semua' | 'Magang' | 'Non-Magang'>('Semua');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    let data = payrollEntries;
    const periodStr = `${filterYear}-${String(filterMonth).padStart(2, '0')}`;
    data = data.filter(p => p.periode === periodStr);
    if (filterTipe !== 'Semua') data = data.filter(p => p.tipeKaryawan === filterTipe);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p => p.nama.toLowerCase().includes(q) || p.nik.toLowerCase().includes(q) || p.jabatan.toLowerCase().includes(q));
    }
    return data;
  }, [payrollEntries, filterYear, filterMonth, filterTipe, search]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totals = useMemo(() => {
    const gajiKotor = filteredData.reduce((s, p) => s + p.gajiKotor, 0);
    const totalPotongan = filteredData.reduce((s, p) => s + p.totalPotongan, 0);
    const gajiBersih = filteredData.reduce((s, p) => s + p.gajiBersih, 0);
    return { gajiKotor, totalPotongan, gajiBersih };
  }, [filteredData]);

  const calcPreview = () => {
    const gajiKotor = form.gajiPokok + form.lembur + form.tunjanganJamsostek + form.tunjanganJamkes;
    const totalPotongan = form.iuranJamsostek + form.iuranJamkes + form.pinjaman + form.pph21;
    const gajiBersih = gajiKotor - totalPotongan;
    return { gajiKotor, totalPotongan, gajiBersih };
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ ...emptyForm, periode: `${filterYear}-${String(filterMonth).padStart(2, '0')}` });
    setDialogOpen(true);
  };

  const handleEdit = (item: PayrollEntry) => {
    setEditingItem(item);
    setForm({
      periode: item.periode, nama: item.nama, nik: item.nik, jabatan: item.jabatan, tipeKaryawan: item.tipeKaryawan,
      gajiPokok: item.gajiPokok, lembur: item.lembur, tunjanganJamsostek: item.tunjanganJamsostek, tunjanganJamkes: item.tunjanganJamkes,
      iuranJamsostek: item.iuranJamsostek, iuranJamkes: item.iuranJamkes, pinjaman: item.pinjaman, pph21: item.pph21,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.nama.trim()) { toast.error('Nama wajib diisi'); return; }
    if (editingItem) { updatePayroll(editingItem.id, form); toast.success('Data payroll diperbarui'); }
    else { addPayroll(form); toast.success('Data payroll ditambahkan'); }
    setDialogOpen(false);
  };

  const handleDelete = () => { if (deleteItem) { deletePayroll(deleteItem.id); toast.success('Data dihapus'); setDeleteItem(null); } };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Ukuran file maksimal 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setCompanyLogo(result);
      toast.success('Logo berhasil diupload');
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const periodStr = `${MONTH_NAMES[filterMonth - 1]} ${filterYear}`;
    const calc = calcPreview();
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Slip Gaji - ${periodStr}</title>
<style>
body{font-family:Arial,sans-serif;padding:40px;max-width:1000px;margin:0 auto;color:#333}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:20px}
.header img{max-height:80px;margin-bottom:10px}
.header h1{font-size:20px;margin:5px 0}
.header h2{font-size:14px;color:#666;font-weight:normal;margin:5px 0}
table{width:100%;border-collapse:collapse;margin:20px 0;font-size:12px}
th,td{border:1px solid #ddd;padding:8px;text-align:left}
th{background:#f5f5f5;font-weight:600}
.right{text-align:right}
.total-row{font-weight:bold;background:#f0f9ff}
.signature{display:flex;justify-content:space-between;margin-top:60px}
.sig-box{text-align:center;width:200px}
.sig-box .line{border-bottom:1px solid #333;margin-top:70px}
</style></head><body>
<div class="header">
${companyLogo ? `<img src="${companyLogo}" alt="Logo" />` : ''}
<h1>PT MARVIRO EKSPOR INDONESIA</h1>
<h2>SLIP GAJI / PAYROLL - ${periodStr}</h2>
</div>
<table>
<thead><tr><th>No</th><th>Nama</th><th>NIK</th><th>Jabatan</th><th>Tipe</th><th>Gaji Pokok</th><th>Lembur</th><th>Tunj. JS</th><th>Tunj. JK</th><th>Gaji Kotor</th><th>Iuran JS</th><th>Iuran JK</th><th>Pinjaman</th><th>PPh 21</th><th>Total Pot.</th><th>Gaji Bersih</th></tr></thead>
<tbody>
${filteredData.map((p, i) => `<tr>
<td>${i + 1}</td><td>${p.nama}</td><td>${p.nik || '-'}</td><td>${p.jabatan || '-'}</td><td>${p.tipeKaryawan}</td>
<td class="right">${p.gajiPokok.toLocaleString()}</td><td class="right">${p.lembur.toLocaleString()}</td><td class="right">${p.tunjanganJamsostek.toLocaleString()}</td><td class="right">${p.tunjanganJamkes.toLocaleString()}</td>
<td class="right" style="font-weight:600">${p.gajiKotor.toLocaleString()}</td>
<td class="right">${p.iuranJamsostek.toLocaleString()}</td><td class="right">${p.iuranJamkes.toLocaleString()}</td><td class="right">${p.pinjaman.toLocaleString()}</td><td class="right">${p.pph21.toLocaleString()}</td>
<td class="right" style="color:#c00">${p.totalPotongan.toLocaleString()}</td><td class="right" style="font-weight:700;color:#060">${p.gajiBersih.toLocaleString()}</td>
</tr>`).join('')}
<tr class="total-row"><td colspan="9" style="text-align:right"><strong>TOTAL</strong></td>
<td class="right">${totals.gajiKotor.toLocaleString()}</td><td colspan="4"></td>
<td class="right">${totals.totalPotongan.toLocaleString()}</td>
<td class="right">${totals.gajiBersih.toLocaleString()}</td></tr>
</tbody></table>
<div class="signature">
<div class="sig-box"><p>HRD / Payroll</p><div class="line"></div></div>
<div class="sig-box"><p>Karyawan</p><div class="line"></div></div>
<div class="sig-box"><p>Direktur Utama</p><div class="line"></div></div>
</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${filterYear}-${String(filterMonth).padStart(2, '0')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File payroll berhasil didownload');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
          <p className="text-sm text-muted-foreground">{filteredData.length} data karyawan</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" />{companyLogo ? 'Ganti Logo' : 'Upload Logo'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />Download
          </Button>
          <Button size="sm" onClick={handleAdd}><Plus className="h-4 w-4 mr-1" />Tambah Karyawan</Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
        <Select value={String(filterYear)} onValueChange={v => { setFilterYear(Number(v)); setCurrentPage(1); }}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>{[2024, 2025, 2026, 2027].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={String(filterMonth)} onValueChange={v => { setFilterMonth(Number(v)); setCurrentPage(1); }}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{MONTH_NAMES.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={filterTipe} onValueChange={v => { setFilterTipe(v as 'Semua' | 'Magang' | 'Non-Magang'); setCurrentPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Semua">Semua</SelectItem><SelectItem value="Magang">Magang</SelectItem><SelectItem value="Non-Magang">Non-Magang</SelectItem></SelectContent>
        </Select>
        <div className="relative max-w-sm flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari nama, NIK..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Gaji Kotor</p><p className="text-lg font-bold">{formatRupiah(totals.gajiKotor)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Potongan</p><p className="text-lg font-bold text-red-600">{formatRupiah(totals.totalPotongan)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Gaji Bersih</p><p className="text-lg font-bold text-emerald-600">{formatRupiah(totals.gajiBersih)}</p></CardContent></Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10 text-center">No</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead className="text-right">Gaji Pokok</TableHead>
                  <TableHead className="text-right">Lembur</TableHead>
                  <TableHead className="text-right">Tunj. JS</TableHead>
                  <TableHead className="text-right">Tunj. JK</TableHead>
                  <TableHead className="text-right font-semibold">Gaji Kotor</TableHead>
                  <TableHead className="text-right">Iuran JS</TableHead>
                  <TableHead className="text-right">Iuran JK</TableHead>
                  <TableHead className="text-right">Pinjaman</TableHead>
                  <TableHead className="text-right">PPh 21</TableHead>
                  <TableHead className="text-right font-semibold">Potongan</TableHead>
                  <TableHead className="text-right font-bold">Gaji Bersih</TableHead>
                  <TableHead className="w-20 text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow><TableCell colSpan={17} className="text-center py-12"><div className="text-muted-foreground"><Wallet className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-lg font-medium">Tidak ada data payroll</p></div></TableCell></TableRow>
                ) : paginatedData.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="text-center text-muted-foreground">{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.nik || '-'}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.jabatan || '-'}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{item.tipeKaryawan}</Badge></TableCell>
                    <TableCell className="text-right whitespace-nowrap">{item.gajiPokok.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.lembur.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.tunjanganJamsostek.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.tunjanganJamkes.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold whitespace-nowrap">{item.gajiKotor.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.iuranJamsostek.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.iuranJamkes.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.pinjaman.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.pph21.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-red-600 whitespace-nowrap">{item.totalPotongan.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 whitespace-nowrap">{item.gajiBersih.toLocaleString()}</TableCell>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader><DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Data Payroll</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1"><Label>Periode</Label><Input type="month" value={form.periode} onChange={e => setForm({ ...form, periode: e.target.value })} /></div>
              <div className="space-y-1"><Label>Nama *</Label><Input value={form.nama} onChange={e => setForm({ ...form, nama: e.target.value })} /></div>
              <div className="space-y-1"><Label>NIK</Label><Input value={form.nik} onChange={e => setForm({ ...form, nik: e.target.value })} /></div>
              <div className="space-y-1"><Label>Tipe</Label><Select value={form.tipeKaryawan} onValueChange={v => setForm({ ...form, tipeKaryawan: v as PayrollEntry['tipeKaryawan'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Non-Magang">Non-Magang</SelectItem><SelectItem value="Magang">Magang</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-1"><Label>Jabatan</Label><Input value={form.jabatan} onChange={e => setForm({ ...form, jabatan: e.target.value })} /></div>

            <div className="space-y-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendapatan</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1"><Label>Gaji Pokok</Label><Input type="number" value={form.gajiPokok || ''} onChange={e => setForm({ ...form, gajiPokok: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Lembur</Label><Input type="number" value={form.lembur || ''} onChange={e => setForm({ ...form, lembur: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Tunj. Jamsostek</Label><Input type="number" value={form.tunjanganJamsostek || ''} onChange={e => setForm({ ...form, tunjanganJamsostek: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Tunj. Jamkes</Label><Input type="number" value={form.tunjanganJamkes || ''} onChange={e => setForm({ ...form, tunjanganJamkes: Number(e.target.value) || 0 })} /></div>
            </div>

            <div className="space-y-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Potongan</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1"><Label>Iuran Jamsostek</Label><Input type="number" value={form.iuranJamsostek || ''} onChange={e => setForm({ ...form, iuranJamsostek: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Iuran Jamkes</Label><Input type="number" value={form.iuranJamkes || ''} onChange={e => setForm({ ...form, iuranJamkes: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>Pinjaman</Label><Input type="number" value={form.pinjaman || ''} onChange={e => setForm({ ...form, pinjaman: Number(e.target.value) || 0 })} /></div>
              <div className="space-y-1"><Label>PPh 21</Label><Input type="number" value={form.pph21 || ''} onChange={e => setForm({ ...form, pph21: Number(e.target.value) || 0 })} /></div>
            </div>

            {/* Auto-calc preview */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
              <div><p className="text-xs text-muted-foreground">Gaji Kotor</p><p className="font-bold text-emerald-600">{formatRupiah(calcPreview().gajiKotor)}</p></div>
              <div><p className="text-xs text-muted-foreground">Total Potongan</p><p className="font-bold text-red-600">{formatRupiah(calcPreview().totalPotongan)}</p></div>
              <div><p className="text-xs text-muted-foreground">Gaji Bersih</p><p className="font-bold">{formatRupiah(calcPreview().gajiBersih)}</p></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button><Button onClick={handleSave}>Simpan</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={o => !o && setDeleteItem(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hapus Data Payroll</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
