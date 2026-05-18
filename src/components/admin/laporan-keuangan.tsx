'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, formatRupiah, MONTH_NAMES } from '@/lib/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BarChart3, TrendingUp, TrendingDown, Wallet, FileText,
  BookOpen, Calculator, Receipt, Users, Package, CreditCard, Landmark,
  Printer, Eye, Search
} from 'lucide-react';

// ============================================
// UTILITY FUNCTIONS & HOOKS
// ============================================

function usePeriodFilter() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const periodStr = `${year}-${String(month).padStart(2, '0')}`;
  const periodLabel = `${MONTH_NAMES[month - 1]} ${year}`;
  return { year, month, setYear, setMonth, periodStr, periodLabel };
}

function PeriodFilter({ year, month, setYear, setMonth }: ReturnType<typeof usePeriodFilter>) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <Select value={String(year)} onValueChange={v => setYear(Number(v))}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {MONTH_NAMES.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
  );
}

// ============================================
// 1. CHART OF ACCOUNTS
// ============================================

const CHART_OF_ACCOUNTS = [
  // ASET (1-)
  { kode: '1-1000', nama: 'Kas', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Lancar' },
  { kode: '1-1100', nama: 'Bank', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Lancar' },
  { kode: '1-1200', nama: 'Piutang Usaha', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Lancar' },
  { kode: '1-1300', nama: 'Persediaan Barang Dagang', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Lancar' },
  { kode: '1-2000', nama: 'Peralatan', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Tetap' },
  { kode: '1-2100', nama: 'Akumulasi Penyusutan Peralatan', tipe: 'Aset', saldoNormal: 'Kredit', kelompok: 'Aset Tetap' },
  { kode: '1-2200', nama: 'Kendaraan', tipe: 'Aset', saldoNormal: 'Debit', kelompok: 'Aset Tetap' },
  { kode: '1-2300', nama: 'Akumulasi Penyusutan Kendaraan', tipe: 'Aset', saldoNormal: 'Kredit', kelompok: 'Aset Tetap' },
  // LIABILITAS (2-)
  { kode: '2-1000', nama: 'Utang Usaha', tipe: 'Liabilitas', saldoNormal: 'Kredit', kelompok: 'Liabilitas Jangka Pendek' },
  { kode: '2-1100', nama: 'Utang Gaji', tipe: 'Liabilitas', saldoNormal: 'Kredit', kelompok: 'Liabilitas Jangka Pendek' },
  { kode: '2-2000', nama: 'Utang Bank', tipe: 'Liabilitas', saldoNormal: 'Kredit', kelompok: 'Liabilitas Jangka Panjang' },
  // EKUITAS (3-)
  { kode: '3-1000', nama: 'Modal Pemilik', tipe: 'Ekuitas', saldoNormal: 'Kredit', kelompok: 'Modal' },
  { kode: '3-1100', nama: 'Prive', tipe: 'Ekuitas', saldoNormal: 'Debit', kelompok: 'Modal' },
  { kode: '3-1200', nama: 'Laba Ditahan', tipe: 'Ekuitas', saldoNormal: 'Kredit', kelompok: 'Modal' },
  // PENDAPATAN (4-)
  { kode: '4-1000', nama: 'Penjualan Lokal', tipe: 'Pendapatan', saldoNormal: 'Kredit', kelompok: 'Pendapatan Operasional' },
  { kode: '4-1100', nama: 'Penjualan Ekspor', tipe: 'Pendapatan', saldoNormal: 'Kredit', kelompok: 'Pendapatan Operasional' },
  // BEBAN (5-)
  { kode: '5-1000', nama: 'Pembelian Barang Dagang', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Harga Pokok Penjualan' },
  { kode: '5-1100', nama: 'Beban Gaji', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
  { kode: '5-1200', nama: 'Beban Honor', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
  { kode: '5-1300', nama: 'Beban Sewa', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
  { kode: '5-1400', nama: 'Beban Listrik & Air', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
  { kode: '5-1500', nama: 'Beban Transportasi', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
  { kode: '5-1600', nama: 'Beban Administrasi', tipe: 'Beban', saldoNormal: 'Debit', kelompok: 'Beban Operasional' },
];

function ChartOfAccountsTab() {
  const [search, setSearch] = useState('');
  const [selectedTipe, setSelectedTipe] = useState<string>('all');

  const filteredAccounts = CHART_OF_ACCOUNTS.filter(acc => {
    const matchSearch = acc.nama.toLowerCase().includes(search.toLowerCase()) ||
        acc.kode.includes(search);
    const matchTipe = selectedTipe === 'all' || acc.tipe === selectedTipe;
    return matchSearch && matchTipe;
  });

  const groupedAccounts = filteredAccounts.reduce((groups, account) => {
    if (!groups[account.tipe]) groups[account.tipe] = [];
    groups[account.tipe].push(account);
    return groups;
  }, {} as Record<string, typeof CHART_OF_ACCOUNTS>);

  return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-2">
            <Input
                placeholder="Cari kode atau nama akun..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64"
            />
            <Select value={selectedTipe} onValueChange={setSelectedTipe}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semua Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Aset">Aset</SelectItem>
                <SelectItem value="Liabilitas">Liabilitas</SelectItem>
                <SelectItem value="Ekuitas">Ekuitas</SelectItem>
                <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                <SelectItem value="Beban">Beban</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {Object.entries(groupedAccounts).map(([tipe, accounts]) => (
            <Card key={tipe}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {tipe}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Kode</TableHead>
                      <TableHead>Nama Akun</TableHead>
                      <TableHead className="w-40">Kelompok</TableHead>
                      <TableHead className="w-24 text-center">Saldo Normal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map(acc => (
                        <TableRow key={acc.kode}>
                          <TableCell className="font-mono">{acc.kode}</TableCell>
                          <TableCell className="font-medium">{acc.nama}</TableCell>
                          <TableCell className="text-muted-foreground">{acc.kelompok}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={acc.saldoNormal === 'Debit' ? 'default' : 'secondary'}>
                              {acc.saldoNormal}
                            </Badge>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
        ))}
      </div>
  );
}

// ============================================
// 2. JURNAL UMUM
// ============================================

interface JurnalEntry {
  id: string;
  tanggal: string;
  keterangan: string;
  debit: { akun: string; nominal: number }[];
  kredit: { akun: string; nominal: number }[];
  ref: string;
}

function JurnalUmumTab() {
  const pf = usePeriodFilter();
  const { logPenjualans, logPembelians, logBebans, logGajiHonors } = useAdminStore();
  const [selectedEntry, setSelectedEntry] = useState<JurnalEntry | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const generateJurnalEntries = (): JurnalEntry[] => {
    const entries: JurnalEntry[] = [];

    // Penjualan
    logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr)).forEach(p => {
      entries.push({
        id: `PJ-${p.id}`,
        tanggal: p.tanggal,
        keterangan: `Penjualan ${p.jenisTransaksi} - ${p.namaPembeli}`,
        debit: [
          { akun: 'Kas', nominal: p.statusPembayaran === 'Lunas' ? p.totalPenjualan : p.totalPenjualan * 0.5 },
          { akun: 'Piutang Usaha', nominal: p.statusPembayaran !== 'Lunas' ? p.totalPenjualan * 0.5 : 0 },
        ].filter(d => d.nominal > 0),
        kredit: [
          { akun: p.jenisTransaksi === 'Lokal' ? 'Penjualan Lokal' : 'Penjualan Ekspor', nominal: p.totalPenjualan },
        ],
        ref: p.nomor,
      });
    });

    // Pembelian
    logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr)).forEach(p => {
      entries.push({
        id: `PB-${p.id}`,
        tanggal: p.tanggal,
        keterangan: `Pembelian - ${p.namaPemasok}`,
        debit: [
          { akun: 'Pembelian Barang Dagang', nominal: p.totalPembelian },
        ],
        kredit: [
          { akun: 'Kas', nominal: p.status === 'Lunas' ? p.totalPembelian : p.totalPembelian * 0.5 },
          { akun: 'Utang Usaha', nominal: p.status !== 'Lunas' ? p.totalPembelian * 0.5 : 0 },
        ].filter(k => k.nominal > 0),
        ref: p.nomor,
      });
    });

    // Beban
    logBebans.filter(b => b.tanggal.startsWith(pf.periodStr)).forEach(b => {
      entries.push({
        id: `BB-${b.id}`,
        tanggal: b.tanggal,
        keterangan: b.keterangan,
        debit: [{ akun: b.kategori, nominal: b.nominal }],
        kredit: [{ akun: 'Kas', nominal: b.nominal }],
        ref: `EXP-${b.id.slice(0, 8)}`,
      });
    });

    // Gaji & Honor
    logGajiHonors.filter(g => g.periode === pf.periodStr).forEach(g => {
      entries.push({
        id: `GJ-${g.id}`,
        tanggal: g.tanggal,
        keterangan: `${g.jenis} - ${g.nama}`,
        debit: [{ akun: g.jenis === 'Gaji' ? 'Beban Gaji' : 'Beban Honor', nominal: g.nominal }],
        kredit: [{ akun: 'Kas', nominal: g.nominal }],
        ref: `PAY-${g.id.slice(0, 8)}`,
      });
    });

    return entries.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  };

  const entries = generateJurnalEntries();
  const totalDebit = entries.reduce((s, e) => s + e.debit.reduce((a, d) => a + d.nominal, 0), 0);
  const totalKredit = entries.reduce((s, e) => s + e.kredit.reduce((a, k) => a + k.nominal, 0), 0);

  if (entries.length === 0) {
    return (
        <div className="space-y-4">
          <PeriodFilter {...pf} />
          <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">Tidak ada transaksi</p>
              <p className="text-sm">Belum ada transaksi pada periode ini</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>

        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Jurnal Umum
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead className="w-20">Ref</TableHead>
                    <TableHead className="text-right w-40">Debit</TableHead>
                    <TableHead className="text-right w-40">Kredit</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{new Date(entry.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</TableCell>
                        <TableCell>
                          <div className="font-medium">{entry.keterangan}</div>
                          <div className="text-xs text-muted-foreground">
                            {entry.debit.map(d => d.akun).join(', ')} / {entry.kredit.map(k => k.akun).join(', ')}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{entry.ref}</TableCell>
                        <TableCell className="text-right">
                          {entry.debit.map((d, i) => (
                              <div key={i} className="text-emerald-600">{formatRupiah(d.nominal)}</div>
                          ))}
                        </TableCell>
                        <TableCell className="text-right">
                          {entry.kredit.map((k, i) => (
                              <div key={i} className="text-red-600">{formatRupiah(k.nominal)}</div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedEntry(entry); setPreviewOpen(true); }}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={3} className="text-right">TOTAL</TableCell>
                    <TableCell className="text-right text-emerald-600">{formatRupiah(totalDebit)}</TableCell>
                    <TableCell className="text-right text-red-600">{formatRupiah(totalKredit)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Jurnal</DialogTitle>
            </DialogHeader>
            {selectedEntry && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Tanggal:</span> {new Date(selectedEntry.tanggal).toLocaleDateString('id-ID')}</div>
                    <div><span className="text-muted-foreground">Ref:</span> {selectedEntry.ref}</div>
                    <div className="col-span-2"><span className="text-muted-foreground">Keterangan:</span> {selectedEntry.keterangan}</div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Akun</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Kredit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEntry.debit.map((d, i) => (
                          <TableRow key={`d-${i}`}>
                            <TableCell>{d.akun}</TableCell>
                            <TableCell className="text-right text-emerald-600">{formatRupiah(d.nominal)}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                          </TableRow>
                      ))}
                      {selectedEntry.kredit.map((k, i) => (
                          <TableRow key={`k-${i}`}>
                            <TableCell className="pl-8">{k.akun}</TableCell>
                            <TableCell className="text-right">-</TableCell>
                            <TableCell className="text-right text-red-600">{formatRupiah(k.nominal)}</TableCell>
                          </TableRow>
                      ))}
                      <TableRow className="font-bold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right text-emerald-600">
                          {formatRupiah(selectedEntry.debit.reduce((s, d) => s + d.nominal, 0))}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatRupiah(selectedEntry.kredit.reduce((s, k) => s + k.nominal, 0))}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}

// ============================================
// 3. BUKU BESAR
// ============================================

function BukuBesarTab() {
  const pf = usePeriodFilter();
  const { logPenjualans, logPembelians, logBebans, logGajiHonors } = useAdminStore();
  const [selectedAkun, setSelectedAkun] = useState<string>('Kas');

  const generateLedgerEntries = (akun: string) => {
    const entries: { tanggal: string; keterangan: string; ref: string; debit: number; kredit: number }[] = [];
    let saldo = 0;
    const saldoEntries: { tanggal: string; keterangan: string; ref: string; debit: number; kredit: number; saldo: number }[] = [];

    // Penjualan
    logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr)).forEach(p => {
      if (akun === 'Kas' && p.statusPembayaran !== 'Belum Bayar') {
        const nominal = p.statusPembayaran === 'Lunas' ? p.totalPenjualan : p.totalPenjualan * 0.5;
        entries.push({ tanggal: p.tanggal, keterangan: `Penjualan - ${p.namaPembeli}`, ref: p.nomor, debit: nominal, kredit: 0 });
      }
      if (akun === 'Piutang Usaha' && p.statusPembayaran !== 'Lunas') {
        const nominal = p.totalPenjualan * 0.5;
        entries.push({ tanggal: p.tanggal, keterangan: `Piutang - ${p.namaPembeli}`, ref: p.nomor, debit: nominal, kredit: 0 });
      }
      if (akun === (p.jenisTransaksi === 'Lokal' ? 'Penjualan Lokal' : 'Penjualan Ekspor')) {
        entries.push({ tanggal: p.tanggal, keterangan: `Penjualan - ${p.namaPembeli}`, ref: p.nomor, debit: 0, kredit: p.totalPenjualan });
      }
    });

    // Pembelian
    logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr)).forEach(p => {
      if (akun === 'Pembelian Barang Dagang') {
        entries.push({ tanggal: p.tanggal, keterangan: `Pembelian - ${p.namaPemasok}`, ref: p.nomor, debit: p.totalPembelian, kredit: 0 });
      }
      if (akun === 'Kas') {
        const nominal = p.status === 'Lunas' ? p.totalPembelian : p.totalPembelian * 0.5;
        entries.push({ tanggal: p.tanggal, keterangan: `Pembayaran - ${p.namaPemasok}`, ref: p.nomor, debit: 0, kredit: nominal });
      }
      if (akun === 'Utang Usaha' && p.status !== 'Lunas') {
        entries.push({ tanggal: p.tanggal, keterangan: `Utang - ${p.namaPemasok}`, ref: p.nomor, debit: 0, kredit: p.totalPembelian * 0.5 });
      }
    });

    // Beban
    logBebans.filter(b => b.tanggal.startsWith(pf.periodStr)).forEach(b => {
      if (akun === b.kategori) {
        entries.push({ tanggal: b.tanggal, keterangan: b.keterangan, ref: `EXP-${b.id.slice(0, 8)}`, debit: b.nominal, kredit: 0 });
      }
      if (akun === 'Kas') {
        entries.push({ tanggal: b.tanggal, keterangan: b.keterangan, ref: `EXP-${b.id.slice(0, 8)}`, debit: 0, kredit: b.nominal });
      }
    });

    // Gaji & Honor
    logGajiHonors.filter(g => g.periode === pf.periodStr).forEach(g => {
      const akunBeban = g.jenis === 'Gaji' ? 'Beban Gaji' : 'Beban Honor';
      if (akun === akunBeban) {
        entries.push({ tanggal: g.tanggal, keterangan: `${g.jenis} ${g.nama}`, ref: `PAY-${g.id.slice(0, 8)}`, debit: g.nominal, kredit: 0 });
      }
      if (akun === 'Kas') {
        entries.push({ tanggal: g.tanggal, keterangan: `Pembayaran ${g.jenis} - ${g.nama}`, ref: `PAY-${g.id.slice(0, 8)}`, debit: 0, kredit: g.nominal });
      }
    });

    entries.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

    entries.forEach(e => {
      saldo = saldo + e.debit - e.kredit;
      saldoEntries.push({ ...e, saldo });
    });

    return saldoEntries;
  };

  const ledgerEntries = generateLedgerEntries(selectedAkun);
  const akunList = [...new Set(CHART_OF_ACCOUNTS.map(a => a.nama))].sort();
  const selectedAkunInfo = CHART_OF_ACCOUNTS.find(a => a.nama === selectedAkun);

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          <Select value={selectedAkun} onValueChange={setSelectedAkun}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {akunList.map(akun => (
                  <SelectItem key={akun} value={akun}>{akun}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Buku Besar: {selectedAkun}
              {selectedAkunInfo && (
                  <Badge variant="outline" className="ml-2">
                    Saldo Normal: {selectedAkunInfo.saldoNormal}
                  </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ledgerEntries.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">Tidak ada transaksi</p>
                  <p className="text-sm">Tidak ada transaksi untuk akun ini pada periode yang dipilih</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-24">Tanggal</TableHead>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="w-20">Ref</TableHead>
                      <TableHead className="text-right w-36">Debit</TableHead>
                      <TableHead className="text-right w-36">Kredit</TableHead>
                      <TableHead className="text-right w-36">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="font-medium">Saldo Awal</TableCell>
                      <TableCell className="text-right font-medium">Rp 0</TableCell>
                    </TableRow>
                    {ledgerEntries.map((entry, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{new Date(entry.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</TableCell>
                          <TableCell>{entry.keterangan}</TableCell>
                          <TableCell className="font-mono text-xs">{entry.ref}</TableCell>
                          <TableCell className="text-right text-emerald-600">{entry.debit > 0 ? formatRupiah(entry.debit) : '-'}</TableCell>
                          <TableCell className="text-right text-red-600">{entry.kredit > 0 ? formatRupiah(entry.kredit) : '-'}</TableCell>
                          <TableCell className={`text-right font-medium ${entry.saldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatRupiah(entry.saldo)}
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 4. NERACA SALDO
// ============================================

function NeracaSaldoTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors, logAsets } = useAdminStore();
  const pf = usePeriodFilter();

  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));
  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const beban = logBebans.filter(b => b.tanggal.startsWith(pf.periodStr));
  const gaji = logGajiHonors.filter(g => g.periode === pf.periodStr);
  const aset = logAsets.filter(a => a.tanggal.startsWith(pf.periodStr));

  const saldoAkun: Record<string, { debit: number; kredit: number }> = {};

  CHART_OF_ACCOUNTS.forEach(acc => { saldoAkun[acc.nama] = { debit: 0, kredit: 0 }; });

  penjualan.forEach(p => {
    const kasMasuk = p.statusPembayaran === 'Lunas' ? p.totalPenjualan : p.totalPenjualan * 0.5;
    const piutang = p.statusPembayaran !== 'Lunas' ? p.totalPenjualan * 0.5 : 0;
    saldoAkun['Kas'].debit += kasMasuk;
    if (piutang > 0) saldoAkun['Piutang Usaha'].debit += piutang;
    const akunPendapatan = p.jenisTransaksi === 'Lokal' ? 'Penjualan Lokal' : 'Penjualan Ekspor';
    saldoAkun[akunPendapatan].kredit += p.totalPenjualan;
  });

  pembelian.forEach(p => {
    saldoAkun['Pembelian Barang Dagang'].debit += p.totalPembelian;
    const kasKeluar = p.status === 'Lunas' ? p.totalPembelian : p.totalPembelian * 0.5;
    const utang = p.status !== 'Lunas' ? p.totalPembelian * 0.5 : 0;
    saldoAkun['Kas'].kredit += kasKeluar;
    if (utang > 0) saldoAkun['Utang Usaha'].kredit += utang;
  });

  beban.forEach(b => {
    if (saldoAkun[b.kategori]) saldoAkun[b.kategori].debit += b.nominal;
    saldoAkun['Kas'].kredit += b.nominal;
  });

  gaji.forEach(g => {
    const akunBeban = g.jenis === 'Gaji' ? 'Beban Gaji' : 'Beban Honor';
    if (saldoAkun[akunBeban]) saldoAkun[akunBeban].debit += g.nominal;
    saldoAkun['Kas'].kredit += g.nominal;
  });

  aset.forEach(a => {
    if (saldoAkun[a.kategori]) saldoAkun[a.kategori].debit += a.nilai;
    saldoAkun['Kas'].kredit += a.nilai;
  });

  const akunDenganSaldo = Object.entries(saldoAkun)
      .filter(([, saldo]) => saldo.debit > 0 || saldo.kredit > 0)
      .map(([nama, saldo]) => {
        const akunInfo = CHART_OF_ACCOUNTS.find(a => a.nama === nama);
        return { nama, ...saldo, akunInfo };
      });

  const totalDebit = akunDenganSaldo.reduce((s, a) => s + a.debit, 0);
  const totalKredit = akunDenganSaldo.reduce((s, a) => s + a.kredit, 0);

  if (akunDenganSaldo.length === 0) {
    return (
        <div className="space-y-4">
          <PeriodFilter {...pf} />
          <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">Tidak ada data</p>
              <p className="text-sm">Belum ada transaksi pada periode ini</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Neraca Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Kode</TableHead>
                  <TableHead>Nama Akun</TableHead>
                  <TableHead className="text-right w-40">Debit</TableHead>
                  <TableHead className="text-right w-40">Kredit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {akunDenganSaldo.map((akun, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono">{akun.akunInfo?.kode || '-'}</TableCell>
                      <TableCell className="font-medium">{akun.nama}</TableCell>
                      <TableCell className="text-right">{akun.debit > 0 ? formatRupiah(akun.debit) : '-'}</TableCell>
                      <TableCell className="text-right">{akun.kredit > 0 ? formatRupiah(akun.kredit) : '-'}</TableCell>
                    </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={2} className="text-right">TOTAL</TableCell>
                  <TableCell className="text-right">{formatRupiah(totalDebit)}</TableCell>
                  <TableCell className="text-right">{formatRupiah(totalKredit)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {totalDebit === totalKredit ? (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-md text-sm">
                  ✅ Neraca Saldo SEIMBANG (Debit = Kredit)
                </div>
            ) : (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  ⚠️ Neraca Saldo TIDAK SEIMBANG. Selisih: {formatRupiah(Math.abs(totalDebit - totalKredit))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 5 & 6. LAPORAN LABA RUGI
// ============================================

function LabaRugiTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors } = useAdminStore();
  const pf = usePeriodFilter();
  const [stepType, setStepType] = useState<'single' | 'multiple'>('multiple');

  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));
  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const beban = logBebans.filter(b => b.tanggal.startsWith(pf.periodStr));
  const gaji = logGajiHonors.filter(g => g.periode === pf.periodStr);

  const penjualanLokal = penjualan.filter(p => p.jenisTransaksi === 'Lokal').reduce((s, p) => s + p.totalPenjualan, 0);
  const penjualanEkspor = penjualan.filter(p => p.jenisTransaksi === 'Ekspor').reduce((s, p) => s + p.totalPenjualan, 0);
  const totalPendapatan = penjualanLokal + penjualanEkspor;
  const totalPembelian = pembelian.reduce((s, p) => s + p.totalPembelian, 0);
  const labaKotor = totalPendapatan - totalPembelian;
  const bebanGaji = gaji.filter(g => g.jenis === 'Gaji').reduce((s, g) => s + g.nominal, 0);
  const bebanHonor = gaji.filter(g => g.jenis === 'Honor').reduce((s, g) => s + g.nominal, 0);
  const bebanOperasional = beban.reduce((s, b) => s + b.nominal, 0);
  const totalBebanOperasional = bebanGaji + bebanHonor + bebanOperasional;
  const labaOperasional = labaKotor - totalBebanOperasional;
  const labaBersih = labaOperasional;

  if (totalPendapatan === 0 && totalPembelian === 0 && totalBebanOperasional === 0) {
    return (
        <div className="space-y-4">
          <PeriodFilter {...pf} />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          </div>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">Tidak ada data</p>
              <p className="text-sm">Belum ada transaksi pada periode ini</p>
            </CardContent>
          </Card>
        </div>
    );
  }

  const SingleStepView = () => (
      <Table>
        <TableBody>
          <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">PENDAPATAN</TableCell></TableRow>
          {penjualanLokal > 0 && <TableRow><TableCell className="pl-8">Penjualan Lokal</TableCell><td className="text-right">{formatRupiah(penjualanLokal)}</td></TableRow>}
          {penjualanEkspor > 0 && <TableRow><TableCell className="pl-8">Penjualan Ekspor</TableCell><td className="text-right">{formatRupiah(penjualanEkspor)}</td></TableRow>}
          <TableRow className="font-semibold"><TableCell>Total Pendapatan</TableCell><td className="text-right text-emerald-600">{formatRupiah(totalPendapatan)}</td></TableRow>

          <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">BEBAN-BEBAN</TableCell></TableRow>
          {totalPembelian > 0 && <TableRow><TableCell className="pl-8">Pembelian Barang Dagang</TableCell><td className="text-right text-red-600">({formatRupiah(totalPembelian)})</td></TableRow>}
          {bebanGaji > 0 && <TableRow><TableCell className="pl-8">Beban Gaji</TableCell><td className="text-right text-red-600">({formatRupiah(bebanGaji)})</td></TableRow>}
          {bebanHonor > 0 && <TableRow><TableCell className="pl-8">Beban Honor</TableCell><td className="text-right text-red-600">({formatRupiah(bebanHonor)})</td></TableRow>}
          {bebanOperasional > 0 && <TableRow><TableCell className="pl-8">Beban Operasional</TableCell><td className="text-right text-red-600">({formatRupiah(bebanOperasional)})</td></TableRow>}
          <TableRow className="font-semibold"><TableCell>Total Beban</TableCell><td className="text-right text-red-600">({formatRupiah(totalPembelian + totalBebanOperasional)})</td></TableRow>

          <TableRow className={`font-bold text-lg ${labaBersih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <TableCell>LABA BERSIH</TableCell>
            <td className="text-right">{formatRupiah(labaBersih)}</td>
          </TableRow>
        </TableBody>
      </Table>
  );

  const MultipleStepView = () => (
      <Table>
        <TableBody>
          <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">PENDAPATAN OPERASIONAL</TableCell></TableRow>
          {penjualanLokal > 0 && <TableRow><TableCell className="pl-8">Penjualan Lokal</TableCell><td className="text-right">{formatRupiah(penjualanLokal)}</td></TableRow>}
          {penjualanEkspor > 0 && <TableRow><TableCell className="pl-8">Penjualan Ekspor</TableCell><td className="text-right">{formatRupiah(penjualanEkspor)}</td></TableRow>}
          <TableRow className="font-semibold"><TableCell>Total Penjualan Bersih</TableCell><td className="text-right text-emerald-600">{formatRupiah(totalPendapatan)}</td></TableRow>

          <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">HARGA POKOK PENJUALAN</TableCell></TableRow>
          {totalPembelian > 0 && <TableRow><TableCell className="pl-8">Pembelian Barang Dagang</TableCell><td className="text-right text-red-600">({formatRupiah(totalPembelian)})</td></TableRow>}
          <TableRow className="font-semibold"><TableCell>Harga Pokok Penjualan</TableCell><td className="text-right text-red-600">({formatRupiah(totalPembelian)})</td></TableRow>

          <TableRow className="font-semibold"><TableCell className="pl-4">LABA KOTOR</TableCell><td className="text-right">{formatRupiah(labaKotor)}</td></TableRow>

          {(bebanGaji > 0 || bebanHonor > 0 || bebanOperasional > 0) && (
              <>
                <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">BEBAN OPERASIONAL</TableCell></TableRow>
                {bebanGaji > 0 && <TableRow><TableCell className="pl-8">Beban Gaji</TableCell><td className="text-right text-red-600">({formatRupiah(bebanGaji)})</td></TableRow>}
                {bebanHonor > 0 && <TableRow><TableCell className="pl-8">Beban Honor</TableCell><td className="text-right text-red-600">({formatRupiah(bebanHonor)})</td></TableRow>}
                {bebanOperasional > 0 && <TableRow><TableCell className="pl-8">Beban Operasional Lainnya</TableCell><td className="text-right text-red-600">({formatRupiah(bebanOperasional)})</td></TableRow>}
                <TableRow className="font-semibold"><TableCell>Total Beban Operasional</TableCell><td className="text-right text-red-600">({formatRupiah(totalBebanOperasional)})</td></TableRow>
              </>
          )}

          <TableRow className="font-semibold"><TableCell className="pl-4">LABA OPERASIONAL</TableCell><td className="text-right">{formatRupiah(labaOperasional)}</td></TableRow>

          <TableRow className={`font-bold text-lg ${labaBersih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            <TableCell>LABA BERSIH</TableCell>
            <td className="text-right">{formatRupiah(labaBersih)}</td>
          </TableRow>
        </TableBody>
      </Table>
  );

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          <Select value={stepType} onValueChange={(v: 'single' | 'multiple') => setStepType(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Step</SelectItem>
              <SelectItem value="multiple">Multiple Step</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Laporan Laba Rugi ({stepType === 'single' ? 'Single Step' : 'Multiple Step'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stepType === 'single' ? <SingleStepView /> : <MultipleStepView />}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 7. NERACA (LAPORAN POSISI KEUANGAN)
// ============================================

function NeracaTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors, logAsets } = useAdminStore();
  const pf = usePeriodFilter();
  const [format, setFormat] = useState<'staffel' | 't'>('staffel');

  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));
  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const beban = logBebans.filter(b => b.tanggal.startsWith(pf.periodStr));
  const gaji = logGajiHonors.filter(g => g.periode === pf.periodStr);
  const aset = logAsets.filter(a => a.tanggal.startsWith(pf.periodStr));

  const kasMasuk = penjualan.filter(p => p.statusPembayaran !== 'Belum Bayar').reduce((s, p) => {
    return s + (p.statusPembayaran === 'Lunas' ? p.totalPenjualan : p.totalPenjualan * 0.5);
  }, 0);

  const kasKeluar = pembelian.reduce((s, p) => s + (p.status === 'Lunas' ? p.totalPembelian : p.totalPembelian * 0.5), 0)
      + beban.reduce((s, b) => s + b.nominal, 0) + gaji.reduce((s, g) => s + g.nominal, 0) + aset.reduce((s, a) => s + a.nilai, 0);

  const kas = kasMasuk - kasKeluar;
  const piutang = penjualan.filter(p => p.statusPembayaran !== 'Lunas').reduce((s, p) => s + p.totalPenjualan * 0.5, 0);
  const totalAsetLancar = Math.max(0, kas) + piutang;
  const totalAsetTetap = aset.reduce((s, a) => s + a.nilai, 0);
  const totalAset = totalAsetLancar + totalAsetTetap;
  const utang = pembelian.filter(p => p.status !== 'Lunas').reduce((s, p) => s + p.totalPembelian * 0.5, 0);
  const totalLiabilitas = utang;

  const labaBersih = penjualan.reduce((s, p) => s + p.totalPenjualan, 0) - pembelian.reduce((s, p) => s + p.totalPembelian, 0)
      - beban.reduce((s, b) => s + b.nominal, 0) - gaji.reduce((s, g) => s + g.nominal, 0);

  const modalAwal = 100000000;
  const totalEkuitas = modalAwal + labaBersih;

  const StaffelView = () => (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">ASET</h3>
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground">Aset Lancar</div>
            <div className="flex justify-between pl-4"><span>Kas</span><span>{formatRupiah(Math.max(0, kas))}</span></div>
            <div className="flex justify-between pl-4"><span>Piutang Usaha</span><span>{formatRupiah(piutang)}</span></div>
            <div className="flex justify-between font-medium border-t pt-1 mt-1"><span>Total Aset Lancar</span><span>{formatRupiah(totalAsetLancar)}</span></div>
          </div>
          {totalAsetTetap > 0 && (
              <div className="space-y-1 mt-3">
                <div className="font-medium text-muted-foreground">Aset Tetap</div>
                <div className="flex justify-between pl-4"><span>Peralatan & Aset</span><span>{formatRupiah(totalAsetTetap)}</span></div>
                <div className="flex justify-between font-medium border-t pt-1 mt-1"><span>Total Aset Tetap</span><span>{formatRupiah(totalAsetTetap)}</span></div>
              </div>
          )}
          <div className="flex justify-between font-bold text-lg border-t-2 pt-2 mt-3"><span>TOTAL ASET</span><span>{formatRupiah(totalAset)}</span></div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">LIABILITAS</h3>
          <div className="space-y-1">
            <div className="font-medium text-muted-foreground">Liabilitas Jangka Pendek</div>
            <div className="flex justify-between pl-4"><span>Utang Usaha</span><span>{formatRupiah(utang)}</span></div>
            <div className="flex justify-between font-medium border-t pt-1 mt-1"><span>Total Liabilitas</span><span>{formatRupiah(totalLiabilitas)}</span></div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">EKUITAS</h3>
          <div className="space-y-1">
            <div className="flex justify-between"><span>Modal Pemilik</span><span>{formatRupiah(modalAwal)}</span></div>
            <div className="flex justify-between"><span>Laba Periode Berjalan</span><span className={labaBersih >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatRupiah(labaBersih)}</span></div>
            <div className="flex justify-between font-bold border-t pt-1 mt-1"><span>Total Ekuitas</span><span>{formatRupiah(totalEkuitas)}</span></div>
          </div>
        </div>

        <div className="flex justify-between font-bold text-lg border-t-2 pt-3">
          <span>TOTAL LIABILITAS & EKUITAS</span>
          <span>{formatRupiah(totalLiabilitas + totalEkuitas)}</span>
        </div>
      </div>
  );

  const TView = () => (
      <div className="grid grid-cols-2 gap-8">
        <div className="border-r pr-4">
          <h3 className="font-semibold text-lg mb-3 text-center">DEBIT (ASET)</h3>
          <div className="space-y-2">
            <div className="font-medium text-muted-foreground border-b pb-1">Aset Lancar</div>
            <div className="flex justify-between"><span>Kas</span><span>{formatRupiah(Math.max(0, kas))}</span></div>
            <div className="flex justify-between"><span>Piutang Usaha</span><span>{formatRupiah(piutang)}</span></div>
            {totalAsetTetap > 0 && (
                <>
                  <div className="font-medium text-muted-foreground border-b pb-1 mt-3">Aset Tetap</div>
                  <div className="flex justify-between"><span>Peralatan & Aset</span><span>{formatRupiah(totalAsetTetap)}</span></div>
                </>
            )}
            <div className="flex justify-between font-bold border-t-2 pt-2 mt-3 text-lg"><span>TOTAL ASET</span><span>{formatRupiah(totalAset)}</span></div>
          </div>
        </div>
        <div className="pl-4">
          <h3 className="font-semibold text-lg mb-3 text-center">KREDIT (LIABILITAS & EKUITAS)</h3>
          <div className="space-y-2">
            <div className="font-medium text-muted-foreground border-b pb-1">Liabilitas</div>
            <div className="flex justify-between"><span>Utang Usaha</span><span>{formatRupiah(utang)}</span></div>
            <div className="flex justify-between font-medium"><span>Total Liabilitas</span><span>{formatRupiah(totalLiabilitas)}</span></div>

            <div className="font-medium text-muted-foreground border-b pb-1 mt-3">Ekuitas</div>
            <div className="flex justify-between"><span>Modal Pemilik</span><span>{formatRupiah(modalAwal)}</span></div>
            <div className="flex justify-between"><span>Laba Periode Berjalan</span><span className={labaBersih >= 0 ? 'text-emerald-600' : 'text-red-600'}>{formatRupiah(labaBersih)}</span></div>
            <div className="flex justify-between font-medium"><span>Total Ekuitas</span><span>{formatRupiah(totalEkuitas)}</span></div>

            <div className="flex justify-between font-bold border-t-2 pt-2 mt-3 text-lg">
              <span>TOTAL LIABILITAS & EKUITAS</span>
              <span>{formatRupiah(totalLiabilitas + totalEkuitas)}</span>
            </div>
          </div>
        </div>
      </div>
  );

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Per tanggal: <strong>{pf.periodLabel}</strong></p>
          <Select value={format} onValueChange={(v: 'staffel' | 't') => setFormat(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staffel">Format Staffel</SelectItem>
              <SelectItem value="t">Format T</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Laporan Posisi Keuangan (Neraca)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {format === 'staffel' ? <StaffelView /> : <TView />}
            {totalAset === totalLiabilitas + totalEkuitas ? (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-md text-sm">
                  ✅ Neraca SEIMBANG (Aset = Liabilitas + Ekuitas)
                </div>
            ) : (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  ⚠️ Neraca TIDAK SEIMBANG. Selisih: {formatRupiah(Math.abs(totalAset - (totalLiabilitas + totalEkuitas)))}
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 8. LAPORAN PERUBAHAN MODAL
// ============================================

function PerubahanModalTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors } = useAdminStore();
  const pf = usePeriodFilter();

  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));
  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const beban = logBebans.filter(b => b.tanggal.startsWith(pf.periodStr));
  const gaji = logGajiHonors.filter(g => g.periode === pf.periodStr);

  const labaBersih = penjualan.reduce((s, p) => s + p.totalPenjualan, 0)
      - pembelian.reduce((s, p) => s + p.totalPembelian, 0)
      - beban.reduce((s, b) => s + b.nominal, 0)
      - gaji.reduce((s, g) => s + g.nominal, 0);

  const modalAwal = 100000000;
  const modalAkhir = modalAwal + labaBersih;

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Laporan Perubahan Modal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Modal Awal</TableCell>
                  <td className="text-right">{formatRupiah(modalAwal)}</td>
                </TableRow>
                <TableRow>
                  <TableCell className="pl-8">Laba Bersih Periode Berjalan</TableCell>
                  <td className={`text-right ${labaBersih >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatRupiah(labaBersih)}
                  </td>
                </TableRow>
                <TableRow className="border-t-2">
                  <TableCell className="font-bold">Modal Akhir</TableCell>
                  <td className="text-right font-bold">{formatRupiah(modalAkhir)}</td>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 9 & 10. ARUS KAS
// ============================================

function ArusKasTab() {
  const { logPenjualans, logPembelians, logBebans, logGajiHonors, logAsets } = useAdminStore();
  const pf = usePeriodFilter();
  const [method, setMethod] = useState<'langsung' | 'tidakLangsung'>('langsung');

  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));
  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const beban = logBebans.filter(b => b.tanggal.startsWith(pf.periodStr));
  const gaji = logGajiHonors.filter(g => g.periode === pf.periodStr);
  const aset = logAsets.filter(a => a.tanggal.startsWith(pf.periodStr));

  const kasDariPelanggan = penjualan.filter(p => p.statusPembayaran !== 'Belum Bayar').reduce((s, p) => {
    return s + (p.statusPembayaran === 'Lunas' ? p.totalPenjualan : p.totalPenjualan * 0.5);
  }, 0);
  const kasKePemasok = pembelian.reduce((s, p) => s + (p.status === 'Lunas' ? p.totalPembelian : p.totalPembelian * 0.5), 0);
  const kasBeban = beban.reduce((s, b) => s + b.nominal, 0);
  const kasGaji = gaji.reduce((s, g) => s + g.nominal, 0);
  const arusKasOperasi = kasDariPelanggan - kasKePemasok - kasBeban - kasGaji;
  const kasInvestasi = -aset.reduce((s, a) => s + a.nilai, 0);

  const labaBersih = penjualan.reduce((s, p) => s + p.totalPenjualan, 0)
      - pembelian.reduce((s, p) => s + p.totalPembelian, 0)
      - beban.reduce((s, b) => s + b.nominal, 0)
      - gaji.reduce((s, g) => s + g.nominal, 0);

  const perubahanPiutang = -penjualan.filter(p => p.statusPembayaran !== 'Lunas').reduce((s, p) => s + p.totalPenjualan * 0.5, 0);
  const perubahanUtang = pembelian.filter(p => p.status !== 'Lunas').reduce((s, p) => s + p.totalPembelian * 0.5, 0);
  const arusKasOperasiTidakLangsung = labaBersih + perubahanPiutang + perubahanUtang;

  const kenaikanKas = method === 'langsung' ? arusKasOperasi + kasInvestasi : arusKasOperasiTidakLangsung + kasInvestasi;

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>
          <Select value={method} onValueChange={(v: 'langsung' | 'tidakLangsung') => setMethod(v)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="langsung">Metode Langsung</SelectItem>
              <SelectItem value="tidakLangsung">Metode Tidak Langsung</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Laporan Arus Kas ({method === 'langsung' ? 'Metode Langsung' : 'Metode Tidak Langsung'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">ARUS KAS DARI AKTIVITAS OPERASI</TableCell></TableRow>
                {method === 'langsung' ? (
                    <>
                      <TableRow><TableCell className="pl-8">Penerimaan dari Pelanggan</TableCell><td className="text-right text-emerald-600">{formatRupiah(kasDariPelanggan)}</td></TableRow>
                      {kasKePemasok > 0 && <TableRow><TableCell className="pl-8">Pembayaran ke Pemasok</TableCell><td className="text-right text-red-600">({formatRupiah(kasKePemasok)})</td></TableRow>}
                      {kasBeban > 0 && <TableRow><TableCell className="pl-8">Pembayaran Beban Operasional</TableCell><td className="text-right text-red-600">({formatRupiah(kasBeban)})</td></TableRow>}
                      {kasGaji > 0 && <TableRow><TableCell className="pl-8">Pembayaran Gaji & Honor</TableCell><td className="text-right text-red-600">({formatRupiah(kasGaji)})</td></TableRow>}
                    </>
                ) : (
                    <>
                      <TableRow><TableCell className="pl-8">Laba Bersih</TableCell><td className="text-right">{formatRupiah(labaBersih)}</td></TableRow>
                      <TableRow><TableCell className="pl-8">Penyesuaian: Perubahan Piutang</TableCell><td className="text-right">{formatRupiah(perubahanPiutang)}</td></TableRow>
                      <TableRow><TableCell className="pl-8">Penyesuaian: Perubahan Utang</TableCell><td className="text-right">{formatRupiah(perubahanUtang)}</td></TableRow>
                    </>
                )}
                <TableRow className="font-semibold">
                  <TableCell>Arus Kas Bersih dari Operasi</TableCell>
                  <td className={`text-right ${(method === 'langsung' ? arusKasOperasi : arusKasOperasiTidakLangsung) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {formatRupiah(method === 'langsung' ? arusKasOperasi : arusKasOperasiTidakLangsung)}
                  </td>
                </TableRow>

                {aset.length > 0 && (
                    <>
                      <TableRow><TableCell colSpan={2} className="font-semibold bg-muted/50">ARUS KAS DARI AKTIVITAS INVESTASI</TableCell></TableRow>
                      <TableRow><TableCell className="pl-8">Pembelian Aset & Peralatan</TableCell><td className="text-right text-red-600">({formatRupiah(-kasInvestasi)})</td></TableRow>
                      <TableRow className="font-semibold">
                        <TableCell>Arus Kas Bersih dari Investasi</TableCell>
                        <td className={`text-right ${kasInvestasi >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRupiah(kasInvestasi)}</td>
                      </TableRow>
                    </>
                )}

                <TableRow className="font-bold bg-muted/30">
                  <TableCell>KENAIKAN/PENURUNAN KAS BERSIH</TableCell>
                  <td className={`text-right ${kenaikanKas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRupiah(kenaikanKas)}</td>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 11. PEREDARAN BRUTO (OMZET UMKM)
// ============================================

function PeredaranBrutoTab() {
  const { logPenjualans } = useAdminStore();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const monthlyData = MONTH_NAMES.map((name, idx) => {
    const month = idx + 1;
    const periodStr = `${selectedYear}-${String(month).padStart(2, '0')}`;
    const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(periodStr));
    const omzetLokal = penjualan.filter(p => p.jenisTransaksi === 'Lokal').reduce((s, p) => s + p.totalPenjualan, 0);
    const omzetEkspor = penjualan.filter(p => p.jenisTransaksi === 'Ekspor').reduce((s, p) => s + p.totalPenjualan, 0);
    return { month, name, omzetLokal, omzetEkspor, total: omzetLokal + omzetEkspor };
  });

  const yearlyTotal = monthlyData.reduce((acc, m) => acc + m.total, 0);
  const yearlyLokal = monthlyData.reduce((acc, m) => acc + m.omzetLokal, 0);
  const yearlyEkspor = monthlyData.reduce((acc, m) => acc + m.omzetEkspor, 0);

  const BATAS_UMKM = 4800000000;
  const statusUMKM = yearlyTotal <= BATAS_UMKM;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={String(selectedYear)} onValueChange={v => setSelectedYear(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Tahun: <strong>{selectedYear}</strong></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Omzet Tahun {selectedYear}</p>
              <p className="text-2xl font-bold text-emerald-600">{formatRupiah(yearlyTotal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Batas Omzet UMKM</p>
              <p className="text-2xl font-bold">{formatRupiah(BATAS_UMKM)}</p>
            </CardContent>
          </Card>
          <Card className={statusUMKM ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Status UMKM</p>
              <p className={`text-2xl font-bold ${statusUMKM ? 'text-emerald-600' : 'text-amber-600'}`}>
                {statusUMKM ? 'UMKM' : 'Non-UMKM'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {statusUMKM ? 'Memenuhi syarat tarif PPh Final 0.5%' : 'Dikenakan tarif PPh normal'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Rekap Peredaran Bruto Bulanan - {selectedYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bulan</TableHead>
                  <TableHead className="text-right">Omzet Lokal</TableHead>
                  <TableHead className="text-right">Omzet Ekspor</TableHead>
                  <TableHead className="text-right font-bold">Total Omzet</TableHead>
                  <TableHead className="text-right">Kumulatif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.map((m, idx) => {
                  const kumulatif = monthlyData.slice(0, idx + 1).reduce((s, d) => s + d.total, 0);
                  return (
                      <TableRow key={m.month}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <td className="text-right">{m.omzetLokal > 0 ? formatRupiah(m.omzetLokal) : '-'}</td>
                        <td className="text-right">{m.omzetEkspor > 0 ? formatRupiah(m.omzetEkspor) : '-'}</td>
                        <td className="text-right font-medium">{m.total > 0 ? formatRupiah(m.total) : '-'}</td>
                        <td className="text-right text-muted-foreground">{kumulatif > 0 ? formatRupiah(kumulatif) : '-'}</td>
                      </TableRow>
                  );
                })}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>TOTAL</TableCell>
                  <td className="text-right">{formatRupiah(yearlyLokal)}</td>
                  <td className="text-right">{formatRupiah(yearlyEkspor)}</td>
                  <td className="text-right">{formatRupiah(yearlyTotal)}</td>
                  <td className="text-right"></td>
                </TableRow>
              </TableBody>
            </Table>

            {yearlyTotal > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="font-medium text-blue-800">Informasi Pajak:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    {statusUMKM ? (
                        <>Omzet tahunan masih di bawah Rp 4.8 Miliar. Berlaku tarif PPh Final UMKM 0.5% dari omzet.<br />
                          Estimasi PPh Terutang: {formatRupiah(yearlyTotal * 0.005)}</>
                    ) : (
                        <>Omzet tahunan di atas Rp 4.8 Miliar. Wajib menggunakan tarif PPh normal Pasal 17.</>
                    )}
                  </p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 12, 13, 14. PAYROLL, SLIP GAJI, REGISTER NIK
// ============================================

function PayrollTab() {
  const pf = usePeriodFilter();
  const { logGajiHonors } = useAdminStore();
  const [selectedGaji, setSelectedGaji] = useState<any>(null);
  const [slipOpen, setSlipOpen] = useState(false);

  const gajiData = logGajiHonors.filter(g => g.periode === pf.periodStr);
  const totalGaji = gajiData.filter(g => g.jenis === 'Gaji').reduce((s, g) => s + g.nominal, 0);
  const totalHonor = gajiData.filter(g => g.jenis === 'Honor').reduce((s, g) => s + g.nominal, 0);
  const totalPayroll = totalGaji + totalHonor;

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>

        {gajiData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Tidak ada data payroll</p>
                <p className="text-sm">Belum ada data gaji/honor pada periode ini</p>
              </CardContent>
            </Card>
        ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Gaji</p><p className="text-xl font-bold">{formatRupiah(totalGaji)}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Honor</p><p className="text-xl font-bold">{formatRupiah(totalHonor)}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Payroll</p><p className="text-xl font-bold text-emerald-600">{formatRupiah(totalPayroll)}</p></CardContent></Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Daftar Payroll
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead className="text-right">Nominal</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gajiData.map(g => (
                          <TableRow key={g.id}>
                            <TableCell>{new Date(g.tanggal).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell className="font-medium">{g.nama}</TableCell>
                            <TableCell><Badge variant={g.jenis === 'Gaji' ? 'default' : 'secondary'}>{g.jenis}</Badge></TableCell>
                            <td className="text-right">{formatRupiah(g.nominal)}</td>
                            <td>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedGaji(g); setSlipOpen(true); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted/50">
                        <TableCell colSpan={3} className="text-right">TOTAL</TableCell>
                        <td className="text-right">{formatRupiah(totalPayroll)}</td>
                        <td></td>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
        )}

        {/* Slip Gaji Dialog */}
        <Dialog open={slipOpen} onOpenChange={setSlipOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Slip {selectedGaji?.jenis}</DialogTitle>
            </DialogHeader>
            {selectedGaji && (
                <div className="border p-4 space-y-3">
                  <div className="text-center border-b pb-2">
                    <p className="font-bold">PT MARVIRO EKSPOR INDONESIA</p>
                    <p className="text-sm">SLIP {selectedGaji.jenis.toUpperCase()}</p>
                    <p className="text-xs">Periode: {pf.periodLabel}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <p><strong>Nama:</strong> {selectedGaji.nama}</p>
                    <p><strong>Tanggal:</strong> {new Date(selectedGaji.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <Table>
                    <TableBody>
                      <TableRow><TableCell>Nominal {selectedGaji.jenis}</TableCell><td className="text-right font-bold">{formatRupiah(selectedGaji.nominal)}</td></TableRow>
                      <TableRow className="font-bold border-t"><TableCell>Total Diterima</TableCell><td className="text-right text-emerald-600">{formatRupiah(selectedGaji.nominal)}</td></TableRow>
                    </TableBody>
                  </Table>
                  <div className="text-center text-xs text-muted-foreground pt-2 border-t">
                    <p>Dicetak secara elektronik, sah tanpa tanda tangan</p>
                  </div>
                </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}

function RegisterNikTab() {
  const { logGajiHonors } = useAdminStore();
  const [search, setSearch] = useState('');

  // Get unique employees from gaji/honor data
  const karyawan = useMemo(() => {
    const uniqueNames = new Map();
    logGajiHonors.forEach(g => {
      if (!uniqueNames.has(g.nama)) {
        uniqueNames.set(g.nama, {
          id: g.id,
          nama: g.nama,
          jenis: g.jenis,
          lastPayment: g.tanggal,
          totalReceived: g.nominal,
          paymentCount: 1,
        });
      } else {
        const existing = uniqueNames.get(g.nama);
        existing.totalReceived += g.nominal;
        existing.paymentCount += 1;
        if (new Date(g.tanggal) > new Date(existing.lastPayment)) {
          existing.lastPayment = g.tanggal;
        }
      }
    });
    return Array.from(uniqueNames.values());
  }, [logGajiHonors]);

  const filteredKaryawan = karyawan.filter(k =>
      k.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
              placeholder="Cari nama..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              Register Karyawan & Tenaga Honor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredKaryawan.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Belum ada data karyawan/honor</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">No</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Pembayaran Terakhir</TableHead>
                      <TableHead className="text-center">Jumlah Pembayaran</TableHead>
                      <TableHead className="text-right">Total Diterima</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredKaryawan.map((k, idx) => (
                        <TableRow key={k.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">{k.nama}</TableCell>
                          <TableCell><Badge variant={k.jenis === 'Gaji' ? 'default' : 'secondary'}>{k.jenis}</Badge></TableCell>
                          <TableCell>{new Date(k.lastPayment).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell className="text-center">{k.paymentCount}x</TableCell>
                          <td className="text-right font-medium">{formatRupiah(k.totalReceived)}</td>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Total: {filteredKaryawan.length} orang
            </p>
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// 15, 16, 17. PERSEDIAAN, PIUTANG, UTANG
// ============================================

function PersediaanTab() {
  const { logPembelians, logPenjualans } = useAdminStore();
  const pf = usePeriodFilter();

  const pembelian = logPembelians.filter(p => p.tanggal.startsWith(pf.periodStr));
  const penjualan = logPenjualans.filter(p => p.tanggal.startsWith(pf.periodStr));

  const totalPembelian = pembelian.reduce((s, p) => s + p.totalPembelian, 0);
  const totalPenjualan = penjualan.reduce((s, p) => s + p.totalPenjualan, 0);
  const hpp = totalPenjualan * 0.6;
  const persediaanAkhir = totalPembelian - hpp;

  return (
      <div className="space-y-4">
        <PeriodFilter {...pf} />
        <p className="text-sm text-muted-foreground">Periode: <strong>{pf.periodLabel}</strong></p>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-5 w-5" />
              Kartu Persediaan (Metode Perpetual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {totalPembelian === 0 && totalPenjualan === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>Tidak ada aktivitas persediaan pada periode ini</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Keterangan</TableHead>
                      <TableHead className="text-right">Masuk</TableHead>
                      <TableHead className="text-right">Keluar</TableHead>
                      <TableHead className="text-right">Saldo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-muted/30">
                      <TableCell className="font-medium">Saldo Awal</TableCell>
                      <td className="text-right">-</td>
                      <td className="text-right">-</td>
                      <td className="text-right">{formatRupiah(0)}</td>
                    </TableRow>
                    {totalPembelian > 0 && (
                        <TableRow>
                          <TableCell>Pembelian Barang Dagang</TableCell>
                          <td className="text-right text-emerald-600">{formatRupiah(totalPembelian)}</td>
                          <td className="text-right">-</td>
                          <td className="text-right">{formatRupiah(totalPembelian)}</td>
                        </TableRow>
                    )}
                    {totalPenjualan > 0 && (
                        <TableRow>
                          <TableCell>Harga Pokok Penjualan (HPP)</TableCell>
                          <td className="text-right">-</td>
                          <td className="text-right text-red-600">{formatRupiah(hpp)}</td>
                          <td className="text-right">{formatRupiah(persediaanAkhir)}</td>
                        </TableRow>
                    )}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Saldo Akhir</TableCell>
                      <td className="text-right"></td>
                      <td className="text-right"></td>
                      <td className="text-right">{formatRupiah(persediaanAkhir)}</td>
                    </TableRow>
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

function RekapPiutangTab() {
  const { logPenjualans } = useAdminStore();

  const piutang = logPenjualans
      .filter(p => p.statusPembayaran !== 'Lunas')
      .map(p => ({
        ...p,
        sisaTagihan: p.totalPenjualan * (p.statusPembayaran === 'Belum Bayar' ? 1 : 0.5),
      }))
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const totalPiutang = piutang.reduce((s, p) => s + p.sisaTagihan, 0);

  return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Rekap Piutang Usaha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {piutang.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">Tidak ada piutang</p>
                  <p className="text-sm">Semua piutang sudah lunas</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Invoice</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Sisa Tagihan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {piutang.map(p => (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono">{p.nomor}</TableCell>
                          <TableCell>{new Date(p.tanggal).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{p.namaPembeli}</TableCell>
                          <td className="text-right">{formatRupiah(p.totalPenjualan)}</td>
                          <td>
                            <Badge variant={p.statusPembayaran === 'Belum Bayar' ? 'destructive' : 'secondary'}>
                              {p.statusPembayaran}
                            </Badge>
                          </td>
                          <td className="text-right font-medium text-amber-600">{formatRupiah(p.sisaTagihan)}</td>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={5} className="text-right">TOTAL PIUTANG</TableCell>
                      <td className="text-right text-amber-600">{formatRupiah(totalPiutang)}</td>
                    </TableRow>
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

function RekapUtangTab() {
  const { logPembelians } = useAdminStore();

  const utang = logPembelians
      .filter(p => p.status !== 'Lunas')
      .map(p => ({
        ...p,
        sisaUtang: p.totalPembelian * 0.5,
      }))
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const totalUtang = utang.reduce((s, u) => s + u.sisaUtang, 0);

  return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Rekap Utang Usaha
            </CardTitle>
          </CardHeader>
          <CardContent>
            {utang.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-lg font-medium">Tidak ada utang</p>
                  <p className="text-sm">Semua utang sudah lunas</p>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. PO</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pemasok</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Sisa Utang</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {utang.map(u => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono">{u.nomor}</TableCell>
                          <TableCell>{new Date(u.tanggal).toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{u.namaPemasok}</TableCell>
                          <td className="text-right">{formatRupiah(u.totalPembelian)}</td>
                          <td><Badge variant="secondary">{u.status}</Badge></td>
                          <td className="text-right font-medium text-red-600">{formatRupiah(u.sisaUtang)}</td>
                        </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={5} className="text-right">TOTAL UTANG</TableCell>
                      <td className="text-right text-red-600">{formatRupiah(totalUtang)}</td>
                    </TableRow>
                  </TableBody>
                </Table>
            )}
          </CardContent>
        </Card>
      </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function LaporanKeuanganPage() {
  const tabGroups = [
    { id: 'inti', label: '📊 SHEET INTI' },
    { id: 'laporan', label: '📈 LAPORAN' },
    { id: 'aruskas', label: '💰 ARUS KAS' },
    { id: 'pajak', label: '🧾 PAJAK' },
    { id: 'hr', label: '👥 HR & ADMIN' },
    { id: 'operasional', label: '📦 OPERASIONAL' },
  ];

  return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
          <p className="text-sm text-muted-foreground">Laporan keuangan lengkap dari data transaksi</p>
        </div>

        <Tabs defaultValue="inti">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
            {tabGroups.map(group => (
                <TabsTrigger key={group.id} value={group.id} className="text-xs">
                  {group.label}
                </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="inti" className="mt-4">
            <Tabs defaultValue="coa">
              <TabsList className="mb-4">
                <TabsTrigger value="coa">Chart of Accounts</TabsTrigger>
                <TabsTrigger value="jurnal">Jurnal Umum</TabsTrigger>
                <TabsTrigger value="bukubesar">Buku Besar</TabsTrigger>
                <TabsTrigger value="neracasaldo">Neraca Saldo</TabsTrigger>
              </TabsList>
              <TabsContent value="coa"><ChartOfAccountsTab /></TabsContent>
              <TabsContent value="jurnal"><JurnalUmumTab /></TabsContent>
              <TabsContent value="bukubesar"><BukuBesarTab /></TabsContent>
              <TabsContent value="neracasaldo"><NeracaSaldoTab /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="laporan" className="mt-4">
            <Tabs defaultValue="labarugi">
              <TabsList className="mb-4">
                <TabsTrigger value="labarugi">Laba Rugi</TabsTrigger>
                <TabsTrigger value="neraca">Neraca</TabsTrigger>
                <TabsTrigger value="perubahanmodal">Perubahan Modal</TabsTrigger>
              </TabsList>
              <TabsContent value="labarugi"><LabaRugiTab /></TabsContent>
              <TabsContent value="neraca"><NeracaTab /></TabsContent>
              <TabsContent value="perubahanmodal"><PerubahanModalTab /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="aruskas" className="mt-4">
            <ArusKasTab />
          </TabsContent>

          <TabsContent value="pajak" className="mt-4">
            <PeredaranBrutoTab />
          </TabsContent>

          <TabsContent value="hr" className="mt-4">
            <Tabs defaultValue="payroll">
              <TabsList className="mb-4">
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="registernik">Register Nama</TabsTrigger>
              </TabsList>
              <TabsContent value="payroll"><PayrollTab /></TabsContent>
              <TabsContent value="registernik"><RegisterNikTab /></TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="operasional" className="mt-4">
            <Tabs defaultValue="persediaan">
              <TabsList className="mb-4">
                <TabsTrigger value="persediaan">Persediaan</TabsTrigger>
                <TabsTrigger value="piutang">Rekap Piutang</TabsTrigger>
                <TabsTrigger value="utang">Rekap Utang</TabsTrigger>
              </TabsList>
              <TabsContent value="persediaan"><PersediaanTab /></TabsContent>
              <TabsContent value="piutang"><RekapPiutangTab /></TabsContent>
              <TabsContent value="utang"><RekapUtangTab /></TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
  );
}