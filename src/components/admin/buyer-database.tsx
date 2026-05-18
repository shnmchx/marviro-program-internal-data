// components/admin/buyer-database.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, BuyerDatabaseEntry, BUYER_STATUS_OPTIONS, MONTH_NAMES } from '@/lib/store';
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
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle, CalendarDays, Building2, Mail, Phone, Globe, Clock, MessageSquare, Users, Target } from 'lucide-react';
import { toast } from 'sonner';

const PAGE_SIZE = 10;

const STATUS_COLOR_MAP: Record<string, string> = {};
BUYER_STATUS_OPTIONS.forEach(o => { STATUS_COLOR_MAP[o.value] = o.color; });

// Sumber data options
const SUMBER_DATA_OPTIONS = [
  { value: 'PT Marviro', label: 'PT Marviro', color: 'bg-blue-100 text-blue-700' },
  { value: 'Agent/Trader', label: 'Agent/Trader', color: 'bg-amber-100 text-amber-700' },
  { value: 'Website/Email', label: 'Website/Email', color: 'bg-green-100 text-green-700' },
  { value: 'Pameran', label: 'Pameran', color: 'bg-violet-100 text-violet-700' },
  { value: 'Referensi', label: 'Referensi', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'LinkedIn', label: 'LinkedIn', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'Lainnya', label: 'Lainnya', color: 'bg-gray-100 text-gray-700' },
] as const;

interface FormState {
  year: number;
  month: number;
  company: string;
  contact: string;
  country: string;
  productInterest: string;
  quantity: string;
  terms: string;
  email: string;
  phone: string;
  status: BuyerDatabaseEntry['status'];
  lastFollowUp: string;
  nextFollowUp: string;
  catatan: string;
  catatanDetail: string;
  sumberData: string;
  linkedAgtId: string;
}

const now = new Date();
const emptyForm: FormState = {
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  company: '',
  contact: '',
  country: '',
  productInterest: '',
  quantity: '',
  terms: '',
  email: '',
  phone: '',
  status: 'New Lead',
  lastFollowUp: now.toISOString().split('T')[0],
  nextFollowUp: '',
  catatan: '',
  catatanDetail: '',
  sumberData: 'PT Marviro',
  linkedAgtId: '',
};

function daysBetween(dateStr: string): number {
  if (!dateStr) return 999;
  const d = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function BuyerDatabasePage() {
  const store = useAdminStore() || {};
  const {
    buyerDatabases = [],
    addBuyerDatabase,
    updateBuyerDatabase,
    deleteBuyerDatabase,
    agtEntries = [],
  } = store;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BuyerDatabaseEntry | null>(null);
  const [editingItem, setEditingItem] = useState<BuyerDatabaseEntry | null>(null);
  const [detailItem, setDetailItem] = useState<BuyerDatabaseEntry | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterYear, setFilterYear] = useState(now.getFullYear());
  const [filterMonth, setFilterMonth] = useState(0);
  const [filterSumber, setFilterSumber] = useState('all');
  const [filterAgt, setFilterAgt] = useState('all');

  const availableYears = useMemo(() => {
    const years = new Set(buyerDatabases.map(b => b.year));
    years.add(now.getFullYear());
    years.add(now.getFullYear() - 1);
    return Array.from(years).sort((a, b) => b - a);
  }, [buyerDatabases]);

  const filteredData = useMemo(() => {
    let data = buyerDatabases;
    if (filterYear) data = data.filter(b => b.year === filterYear);
    if (filterMonth) data = data.filter(b => b.month === filterMonth);
    if (filterSumber !== 'all') data = data.filter(b => b.sumberData === filterSumber);
    if (filterAgt !== 'all') data = data.filter(b => b.linkedAgtId === filterAgt);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(b =>
          b.company.toLowerCase().includes(q) ||
          b.contact.toLowerCase().includes(q) ||
          b.country.toLowerCase().includes(q) ||
          b.productInterest.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.terms.toLowerCase().includes(q)
      );
    }
    return data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [buyerDatabases, filterYear, filterMonth, filterSumber, filterAgt, search]);

  // Alert entries
  const alertEntries = useMemo(() => {
    return buyerDatabases.filter(b => {
      if (['Closing', 'Continue', 'Scam', 'Rejected'].includes(b.status)) return false;
      const daysSinceLastFollowUp = daysBetween(b.lastFollowUp);
      if (b.status === 'New Lead' && daysSinceLastFollowUp >= 3) return true;
      if (b.status === 'Follow Up' && daysSinceLastFollowUp >= 5) return true;
      if (b.status === 'Negotiation' && daysSinceLastFollowUp >= 7) return true;
      if (b.status === 'Belum Closing' && daysSinceLastFollowUp >= 7) return true;
      if (b.status === 'No Response' && daysSinceLastFollowUp >= 3) return true;
      if (b.nextFollowUp && new Date(b.nextFollowUp) < new Date()) return true;
      return false;
    });
  }, [buyerDatabases]);

  const monthlySummary = useMemo(() => {
    const currentYear = filterYear || now.getFullYear();
    const monthsOfYear = buyerDatabases.filter(b => b.year === currentYear);
    return MONTH_NAMES.map((name, idx) => {
      const m = idx + 1;
      const entries = monthsOfYear.filter(b => b.month === m);
      const closing = entries.filter(b => b.status === 'Closing').length;
      const scam = entries.filter(b => b.status === 'Scam').length;
      const active = entries.filter(b => !['Closing', 'Scam', 'Rejected'].includes(b.status)).length;
      return { month: m, name, total: entries.length, closing, scam, active };
    });
  }, [buyerDatabases, filterYear]);

  // Stats by sumber data
  const statsBySumber = useMemo(() => {
    return SUMBER_DATA_OPTIONS.map(s => ({
      ...s,
      count: buyerDatabases.filter(b => b.sumberData === s.value).length,
    }));
  }, [buyerDatabases]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Parse linked AGT dari catatan
  const parseLinkedAgt = (catatan: string): string => {
    if (!catatan) return '';
    try {
      const lines = catatan.split('\n');
      for (const line of lines) {
        if (line.startsWith('LINKED_AGT:')) return line.split(':')[1]?.trim() || '';
      }
    } catch {}
    return '';
  };

  const getAgtName = (agtId: string): string => {
    if (!agtId) return '-';
    const agt = agtEntries.find(a => a.id === agtId);
    return agt ? `${agt.kodeAgt} - ${agt.namaAgt}` : '-';
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ ...emptyForm, year: filterYear || now.getFullYear(), month: filterMonth || now.getMonth() + 1 });
    setDialogOpen(true);
  };

  const handleEdit = (item: BuyerDatabaseEntry) => {
    setEditingItem(item);
    const linkedAgtId = parseLinkedAgt(item.catatanDetail || item.catatan || '');
    setForm({
      year: item.year, month: item.month, company: item.company, contact: item.contact,
      country: item.country, productInterest: item.productInterest, quantity: item.quantity,
      terms: item.terms, email: item.email, phone: item.phone || '', status: item.status,
      lastFollowUp: item.lastFollowUp, nextFollowUp: item.nextFollowUp,
      catatan: item.catatan, catatanDetail: item.catatanDetail,
      sumberData: item.sumberData || 'PT Marviro',
      linkedAgtId: linkedAgtId,
    });
    setDialogOpen(true);
  };

  const handleViewDetail = (item: BuyerDatabaseEntry) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const handleSumberChange = (val: string) => {
    if (val === 'Agent/Trader') {
      setForm({ ...form, sumberData: val });
    } else {
      setForm({ ...form, sumberData: val, linkedAgtId: '' });
    }
  };

  const handleSave = () => {
    if (!form.company.trim() || !form.contact.trim()) {
      toast.error('Company dan Contact wajib diisi');
      return;
    }

    // Build catatanDetail dengan linked AGT
    let catatanDetail = form.catatanDetail || '';
    if (form.linkedAgtId) {
      const cleanDetail = catatanDetail
          .split('\n')
          .filter(line => !line.startsWith('LINKED_AGT:'))
          .join('\n');
      catatanDetail = `${cleanDetail}\nLINKED_AGT:${form.linkedAgtId}`.trim();
    }

    const saveData = {
      ...form,
      catatanDetail,
      sumberData: form.sumberData,
      linkedAgtId: form.linkedAgtId,
    };

    if (editingItem) {
      updateBuyerDatabase(editingItem.id, saveData);
      toast.success('Data buyer database berhasil diperbarui');
    } else {
      addBuyerDatabase(saveData);
      toast.success('Data buyer database berhasil ditambahkan');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      deleteBuyerDatabase(deleteItem.id);
      toast.success('Data berhasil dihapus');
      setDeleteItem(null);
    }
  };

  const getDaysLabel = (item: BuyerDatabaseEntry) => {
    if (['Closing', 'Continue', 'Scam', 'Rejected'].includes(item.status)) return null;
    const days = daysBetween(item.lastFollowUp);
    if (days >= 7) return { days, urgent: true };
    if (days >= 3) return { days, urgent: false };
    return null;
  };

  const getSumberColor = (sumber: string) => {
    const found = SUMBER_DATA_OPTIONS.find(o => o.value === sumber);
    return found?.color || 'bg-gray-100 text-gray-700';
  };

  return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Database Buyer</h1>
            <p className="text-sm text-muted-foreground">Tracking buyer prospek per bulan &middot; {filteredData.length} data</p>
          </div>
          <Button onClick={handleAdd} className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Tambah Buyer
          </Button>
        </div>

        {/* Sumber Data Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {statsBySumber.map(s => (
              <button
                  key={s.value}
                  onClick={() => setFilterSumber(filterSumber === s.value ? 'all' : s.value)}
                  className={`text-left p-2 rounded-lg border transition-all ${
                      filterSumber === s.value
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-muted/50'
                  }`}
              >
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-lg font-bold ${s.color.split(' ')[1]}`}>{s.count}</p>
              </button>
          ))}
        </div>

        {/* Alert Banner */}
        {alertEntries.length > 0 && (
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-orange-800">
                      {alertEntries.length} buyer perlu follow-up segera!
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {alertEntries.slice(0, 5).map(entry => (
                          <button
                              key={entry.id}
                              onClick={() => handleViewDetail(entry)}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-orange-100 text-orange-800 hover:bg-orange-200"
                          >
                            {entry.company}
                            {getDaysLabel(entry) && <span>({getDaysLabel(entry)!.days}d)</span>}
                          </button>
                      ))}
                      {alertEntries.length > 5 && (
                          <span className="text-xs text-orange-600 self-center">+{alertEntries.length - 5} lainnya</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {monthlySummary.map(ms => (
              <button
                  key={ms.month}
                  onClick={() => {
                    setFilterMonth(filterMonth === ms.month ? 0 : ms.month);
                    setCurrentPage(1);
                  }}
                  className={`text-left p-3 rounded-lg border transition-all ${
                      filterMonth === ms.month
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/30 hover:bg-muted/50'
                  }`}
              >
                <p className="text-xs text-muted-foreground font-medium">{ms.name}</p>
                <p className="text-xl font-bold mt-1">{ms.total}</p>
                <div className="flex gap-2 mt-1">
                  {ms.closing > 0 && <span className="text-xs text-emerald-600">{ms.closing} closing</span>}
                  {ms.active > 0 && <span className="text-xs text-blue-600">{ms.active} aktif</span>}
                  {ms.scam > 0 && <span className="text-xs text-red-600">{ms.scam} scam</span>}
                </div>
              </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Cari company, contact, country..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={String(filterYear)} onValueChange={v => { setFilterYear(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>{availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={String(filterMonth)} onValueChange={v => { setFilterMonth(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Semua Bulan" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Semua Bulan</SelectItem>
                {MONTH_NAMES.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterSumber} onValueChange={v => { setFilterSumber(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Semua Sumber" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Sumber</SelectItem>
                {SUMBER_DATA_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {filterSumber === 'Agent/Trader' && (
                <Select value={filterAgt} onValueChange={v => { setFilterAgt(v); setCurrentPage(1); }}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Semua AGT" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua AGT</SelectItem>
                    {agtEntries.filter(a => a.statusAgt === 'Aktif').map(a => (
                        <SelectItem key={a.id} value={a.id}>{a.kodeAgt} - {a.namaAgt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            )}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-center">No</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Sumber</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Follow Up</TableHead>
                    <TableHead className="w-24 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-12">
                          <div className="text-muted-foreground">
                            <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                            <p className="text-lg font-medium">Tidak ada data buyer</p>
                            <p className="text-sm">Klik "Tambah Buyer" untuk menambahkan data baru</p>
                          </div>
                        </TableCell>
                      </TableRow>
                  ) : (
                      paginatedData.map((item, index) => {
                        const daysInfo = getDaysLabel(item);
                        const agtId = parseLinkedAgt(item.catatanDetail || item.catatan || '');
                        return (
                            <TableRow
                                key={item.id}
                                className={`hover:bg-muted/50 cursor-pointer ${daysInfo?.urgent ? 'bg-red-50/50' : ''}`}
                                onClick={() => handleViewDetail(item)}
                            >
                              <TableCell className="text-center text-muted-foreground text-sm">
                                {(currentPage - 1) * PAGE_SIZE + index + 1}
                              </TableCell>
                              <TableCell className="font-medium whitespace-nowrap">{item.company || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap">{item.contact || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap">{item.country || '-'}</TableCell>
                              <TableCell>
                                <Badge className={`text-xs ${getSumberColor(item.sumberData || 'PT Marviro')}`}>
                                  {item.sumberData || 'PT Marviro'}
                                </Badge>
                                {agtId && (
                                    <Badge variant="outline" className="text-xs ml-1">
                                      <Users className="h-2 w-2 mr-1" />
                                      {getAgtName(agtId).split(' - ')[0]}
                                    </Badge>
                                )}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{item.productInterest || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{item.quantity || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{item.email || '-'}</TableCell>
                              <TableCell className="whitespace-nowrap text-sm">{item.phone || '-'}</TableCell>
                              <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR_MAP[item.status] || 'bg-gray-100 text-gray-700'}`}>
                                                        {item.status}
                                                    </span>
                                {daysInfo && (
                                    <span className={`ml-1 inline-flex items-center text-xs ${daysInfo.urgent ? 'text-red-600 font-bold' : 'text-orange-600'}`}>
                                                            {daysInfo.days}d
                                                        </span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                {item.lastFollowUp || '-'}
                                {item.nextFollowUp && (
                                    <div className="text-orange-600">Next: {item.nextFollowUp}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center gap-1" onClick={e => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewDetail(item)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteItem(item)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                        );
                      })
                  )}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">Halaman {currentPage} dari {totalPages}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Buyer Database' : 'Tambah Buyer Database'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tahun *</Label>
                  <Select value={String(form.year)} onValueChange={v => setForm({ ...form, year: Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bulan *</Label>
                  <Select value={String(form.month)} onValueChange={v => setForm({ ...form, month: Number(v) })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{MONTH_NAMES.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sumber Data</Label>
                  <Select value={form.sumberData} onValueChange={handleSumberChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SUMBER_DATA_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Jika sumber = Agent/Trader, tampilkan pilihan AGT */}
              {form.sumberData === 'Agent/Trader' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <Label className="flex items-center gap-2 text-amber-700 mb-2">
                      <Target className="h-4 w-4" />
                      Pilih Agent/Trader
                    </Label>
                    <Select value={form.linkedAgtId || 'none'} onValueChange={v => setForm({ ...form, linkedAgtId: v === 'none' ? '' : v })}>
                      <SelectTrigger><SelectValue placeholder="Pilih AGT" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">-- Pilih AGT --</SelectItem>
                        {agtEntries.filter(a => a.statusAgt === 'Aktif').map(a => (
                            <SelectItem key={a.id} value={a.id}>
                              [{a.kodeAgt}] {a.namaAgt}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.linkedAgtId && (() => {
                      const agt = agtEntries.find(a => a.id === form.linkedAgtId);
                      return agt ? (
                          <div className="text-xs text-amber-700 mt-2 space-y-1">
                            <p>Produk: {(agt.fokusProduk || []).join(', ') || '-'}</p>
                            <p>Market: {(agt.fokusMarket || []).join(', ') || '-'}</p>
                            <p>Wilayah: {(agt.wilayahFokus || []).join(', ') || '-'}</p>
                          </div>
                      ) : null;
                    })()}
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Nama perusahaan buyer" />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person *</Label>
                  <Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="Nama kontak" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Negara" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+62 812-3456-7890" />
                </div>
                <div className="space-y-2">
                  <Label>Terms</Label>
                  <Input value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="FOB, CIF, dll" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Product Interest</Label>
                  <Input value={form.productInterest} onChange={e => setForm({ ...form, productInterest: e.target.value })} placeholder="Contoh: Kopi Robusta" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="Contoh: 50 Ton" />
                </div>
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v as BuyerDatabaseEntry['status'] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {BUYER_STATUS_OPTIONS.map(o => (
                          <SelectItem key={o.value} value={o.value}>
                                                <span className="flex items-center gap-2">
                                                    <span className={`inline-block w-2 h-2 rounded-full ${o.color.split(' ')[0]}`} />
                                                  {o.label}
                                                </span>
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Last Follow Up</Label>
                  <Input type="date" value={form.lastFollowUp} onChange={e => setForm({ ...form, lastFollowUp: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Next Follow Up</Label>
                  <Input type="date" value={form.nextFollowUp} onChange={e => setForm({ ...form, nextFollowUp: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan Singkat</Label>
                <Input value={form.catatan} onChange={e => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan singkat" />
              </div>
              <div className="space-y-2">
                <Label>Catatan Detail</Label>
                <Textarea value={form.catatanDetail} onChange={e => setForm({ ...form, catatanDetail: e.target.value })} placeholder="Detail pembahasan, riwayat komunikasi, dll" rows={4} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>{editingItem ? 'Simpan Perubahan' : 'Tambah Data'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Popup */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar">
            {detailItem && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <DialogTitle>{detailItem.company}</DialogTitle>
                        <p className="text-sm text-muted-foreground">{MONTH_NAMES[detailItem.month - 1]} {detailItem.year}</p>
                      </div>
                    </div>
                  </DialogHeader>
                  <div className="space-y-4 py-2">
                    {/* Sumber & Status */}
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getSumberColor(detailItem.sumberData || 'PT Marviro')}`}>
                        {detailItem.sumberData || 'PT Marviro'}
                      </Badge>
                      {(() => {
                        const agtId = parseLinkedAgt(detailItem.catatanDetail || detailItem.catatan || '');
                        if (agtId) {
                          return (
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {getAgtName(agtId)}
                              </Badge>
                          );
                        }
                        return null;
                      })()}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLOR_MAP[detailItem.status]}`}>
                                        {detailItem.status}
                                    </span>
                      {(() => {
                        const daysInfo = getDaysLabel(detailItem);
                        if (!daysInfo) return null;
                        return (
                            <Badge variant={daysInfo.urgent ? 'destructive' : 'outline'} className="gap-1">
                              <Clock className="h-3 w-3" />
                              {daysInfo.days} hari tanpa follow-up
                            </Badge>
                        );
                      })()}
                    </div>

                    {/* Contact Info */}
                    <div className="grid gap-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact Person</p>
                          <p className="font-medium">{detailItem.contact || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Country</p>
                            <p className="font-medium text-sm">{detailItem.country || '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium text-sm break-all">{detailItem.email || '-'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{detailItem.phone || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Informasi Produk</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Product</p>
                          <p className="text-sm font-medium mt-0.5">{detailItem.productInterest || '-'}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="text-sm font-medium mt-0.5">{detailItem.quantity || '-'}</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-muted/30">
                          <p className="text-xs text-muted-foreground">Terms</p>
                          <p className="text-sm font-medium mt-0.5">{detailItem.terms || '-'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Follow Up */}
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Follow Up</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span>Last: {detailItem.lastFollowUp || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-orange-500" />
                          <span>Next: {detailItem.nextFollowUp || '-'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Catatan</p>
                      {detailItem.catatan && <p className="text-sm">{detailItem.catatan}</p>}
                      {detailItem.catatanDetail && (
                          <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap">
                            {detailItem.catatanDetail
                                .split('\n')
                                .filter(line => !line.startsWith('LINKED_AGT:'))
                                .join('\n')}
                          </div>
                      )}
                      {!detailItem.catatan && !detailItem.catatanDetail && (
                          <p className="text-sm text-muted-foreground italic">Tidak ada catatan</p>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="border-t pt-3 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Aktivitas</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Dibuat: {new Date(detailItem.createdAt).toLocaleString('id-ID')}</p>
                        <p>Diubah: {new Date(detailItem.updatedAt).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setDetailOpen(false); handleEdit(detailItem); }}>
                      <Edit className="h-4 w-4 mr-2" />Edit
                    </Button>
                    <Button variant="destructive" onClick={() => { setDetailOpen(false); setDeleteItem(detailItem); }}>
                      <Trash2 className="h-4 w-4 mr-2" />Hapus
                    </Button>
                  </DialogFooter>
                </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteItem} onOpenChange={open => !open && setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Data Buyer</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus data buyer &quot;{deleteItem?.company}&quot;? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}