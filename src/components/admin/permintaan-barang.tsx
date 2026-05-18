'use client';

import { useState, useMemo, useRef } from 'react';
import { useAdminStore, PermintaanBarang, formatRupiah } from '@/lib/store';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, PackageSearch, Download, Upload, X, FileText, Building2, User, AlertTriangle, CheckCircle, XCircle, Clock, Shield, Ban } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const PAGE_SIZE = 10;

type BuyerType = 'perusahaan' | 'perorangan';
type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'suspicious' | 'scam';

interface FormState {
  produk: string;
  kuantitas: string;
  tujuanPengiriman: string;
  kualitas: string;
  kondisi: string;
  warna: string;
  hargaTarget: string;
  catatanHarga: string;
  dataStok: boolean;
  dataLokasi: boolean;
  dataKualitas: boolean;
  dataDokumentasi: boolean;
  dataEstimasi: boolean;
  sistemPengiriman: string;
  prioritas: string;
  verifikasi: string;
  disclaimer: string;
  status: PermintaanBarang['status'];
  // Tipe buyer
  buyerType: BuyerType;
  // Data buyer (perusahaan atau perorangan)
  buyerCompany: string;
  buyerNIB: string;
  buyerAddress: string;
  buyerPhone: string;
  buyerEmail: string;
  buyerPIC: string;
  buyerPosition: string;
  buyerIdentityNumber: string; // KTP/SIM untuk perorangan
  buyerIdentityType: string; // Jenis identitas
  buyerLogo?: string;
  buyerSignature?: string;
  buyerNIBDocument?: string;
  buyerIdentityDocument?: string; // Dokumen KTP/SIM
  // Verifikasi status
  verificationStatus: VerificationStatus;
  verificationNotes: string;
  // Data seller
  sellerCompany: string;
  sellerNIB: string;
  sellerAddress: string;
  sellerPhone: string;
  sellerEmail: string;
  sellerPIC: string;
  sellerPosition: string;
  sellerLogo?: string;
  sellerSignature?: string;
}

const emptyForm: FormState = {
  produk: '', kuantitas: '', tujuanPengiriman: '', kualitas: '', kondisi: '', warna: '',
  hargaTarget: '', catatanHarga: '', dataStok: false, dataLokasi: false, dataKualitas: false,
  dataDokumentasi: false, dataEstimasi: false, sistemPengiriman: '', prioritas: '', verifikasi: '',
  disclaimer: '', status: 'Draft',
  buyerType: 'perusahaan',
  buyerCompany: '', buyerNIB: '', buyerAddress: '', buyerPhone: '', buyerEmail: '',
  buyerPIC: '', buyerPosition: '', buyerIdentityNumber: '', buyerIdentityType: 'KTP',
  buyerLogo: '', buyerSignature: '', buyerNIBDocument: '', buyerIdentityDocument: '',
  verificationStatus: 'pending', verificationNotes: '',
  sellerCompany: 'PT MARVIRO EKSPOR INDONESIA', sellerNIB: '', sellerAddress: '', sellerPhone: '',
  sellerEmail: '', sellerPIC: '', sellerPosition: '', sellerLogo: '', sellerSignature: '',
};

const STATUS_COLORS: Record<string, string> = {
  Draft: 'bg-gray-100 text-gray-700',
  Terbit: 'bg-emerald-100 text-emerald-700',
  Ditutup: 'bg-red-100 text-red-700',
};

const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  verified: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  suspicious: 'bg-orange-100 text-orange-700',
  scam: 'bg-red-200 text-red-800 border-red-400',
};

const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  verified: 'Terverifikasi',
  pending: 'Menunggu',
  rejected: 'Ditolak',
  suspicious: 'Mencurigakan',
  scam: 'SCAM / PENIPUAN',
};

export function PermintaanBarangPage() {
  const { permintaanBarangs, addPermintaanBarang, updatePermintaanBarang, deletePermintaanBarang } = useAdminStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<PermintaanBarang | null>(null);
  const [editingItem, setEditingItem] = useState<PermintaanBarang | null>(null);
  const [previewItem, setPreviewItem] = useState<PermintaanBarang | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('produk');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');

  const previewRef = useRef<HTMLDivElement>(null);
  const buyerLogoInputRef = useRef<HTMLInputElement>(null);
  const buyerSignatureInputRef = useRef<HTMLInputElement>(null);
  const buyerNIBInputRef = useRef<HTMLInputElement>(null);
  const buyerIdentityInputRef = useRef<HTMLInputElement>(null);
  const sellerLogoInputRef = useRef<HTMLInputElement>(null);
  const sellerSignatureInputRef = useRef<HTMLInputElement>(null);

  const filteredData = useMemo(() => {
    let data = permintaanBarangs;

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
          p.nomor.toLowerCase().includes(q) ||
          p.produk.toLowerCase().includes(q) ||
          p.tujuanPengiriman?.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.buyerCompany?.toLowerCase().includes(q) ||
          p.buyerPIC?.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      data = data.filter(p => p.status === filterStatus);
    }

    if (filterVerification !== 'all') {
      data = data.filter(p => (p.verificationStatus || 'pending') === filterVerification);
    }

    return data;
  }, [permintaanBarangs, search, filterStatus, filterVerification]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field: keyof FormState) => {
    setForm({ ...form, [field]: '' });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setForm({ ...emptyForm });
    setActiveTab('produk');
    setDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setForm({
      produk: item.produk || '',
      kuantitas: item.kuantitas || '',
      tujuanPengiriman: item.tujuanPengiriman || '',
      kualitas: item.kualitas || '',
      kondisi: item.kondisi || '',
      warna: item.warna || '',
      hargaTarget: item.hargaTarget || '',
      catatanHarga: item.catatanHarga || '',
      dataStok: item.dataStok || false,
      dataLokasi: item.dataLokasi || false,
      dataKualitas: item.dataKualitas || false,
      dataDokumentasi: item.dataDokumentasi || false,
      dataEstimasi: item.dataEstimasi || false,
      sistemPengiriman: item.sistemPengiriman || '',
      prioritas: item.prioritas || '',
      verifikasi: item.verifikasi || '',
      disclaimer: item.disclaimer || '',
      status: item.status || 'Draft',
      buyerType: item.buyerType || 'perusahaan',
      buyerCompany: item.buyerCompany || '',
      buyerNIB: item.buyerNIB || '',
      buyerAddress: item.buyerAddress || '',
      buyerPhone: item.buyerPhone || '',
      buyerEmail: item.buyerEmail || '',
      buyerPIC: item.buyerPIC || '',
      buyerPosition: item.buyerPosition || '',
      buyerIdentityNumber: item.buyerIdentityNumber || '',
      buyerIdentityType: item.buyerIdentityType || 'KTP',
      buyerLogo: item.buyerLogo || '',
      buyerSignature: item.buyerSignature || '',
      buyerNIBDocument: item.buyerNIBDocument || '',
      buyerIdentityDocument: item.buyerIdentityDocument || '',
      verificationStatus: item.verificationStatus || 'pending',
      verificationNotes: item.verificationNotes || '',
      sellerCompany: item.sellerCompany || 'PT MARVIRO EKSPOR INDONESIA',
      sellerNIB: item.sellerNIB || '',
      sellerAddress: item.sellerAddress || '',
      sellerPhone: item.sellerPhone || '',
      sellerEmail: item.sellerEmail || '',
      sellerPIC: item.sellerPIC || '',
      sellerPosition: item.sellerPosition || '',
      sellerLogo: item.sellerLogo || '',
      sellerSignature: item.sellerSignature || '',
    });
    setActiveTab('produk');
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.produk.trim()) { toast.error('Produk wajib diisi'); return; }

    if (form.buyerType === 'perusahaan') {
      if (!form.buyerCompany.trim()) { toast.error('Nama perusahaan buyer wajib diisi'); return; }
    } else {
      if (!form.buyerPIC.trim()) { toast.error('Nama buyer perorangan wajib diisi'); return; }
    }

    if (editingItem) {
      updatePermintaanBarang(editingItem.id, form);
      toast.success('Data berhasil diperbarui');
    } else {
      addPermintaanBarang(form);
      toast.success('Permintaan Barang berhasil ditambahkan');
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deleteItem) {
      deletePermintaanBarang(deleteItem.id);
      toast.success('Data berhasil dihapus');
      setDeleteItem(null);
    }
  };

  const handleMarkAsScam = (item: PermintaanBarang) => {
    updatePermintaanBarang(item.id, {
      ...item,
      verificationStatus: 'scam',
      verificationNotes: 'Ditandai sebagai scam/penipuan'
    });
    toast.error('Permintaan ditandai sebagai SCAM');
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return d; }
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    try {
      toast.loading('Membuat PDF...');
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const fileName = `Permintaan_Barang_${previewItem?.nomor || 'draft'}.pdf`;
      pdf.save(fileName);

      toast.dismiss();
      toast.success('PDF berhasil diunduh');
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal membuat PDF');
      console.error('PDF Error:', error);
    }
  };

  const getBuyerDisplayName = (item: any) => {
    if (item.buyerType === 'perorangan') {
      return item.buyerPIC || '-';
    }
    return item.buyerCompany || '-';
  };

  return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Permintaan Ketersediaan Barang</h1>
            <p className="text-sm text-muted-foreground">{filteredData.length} data ditemukan</p>
          </div>
          <Button onClick={handleAdd} className="shrink-0"><Plus className="h-4 w-4 mr-2" />Tambah Permintaan</Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari nomor, produk, buyer..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Terbit">Terbit</SelectItem>
              <SelectItem value="Ditutup">Ditutup</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterVerification} onValueChange={(v) => { setFilterVerification(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Verifikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Verifikasi</SelectItem>
              <SelectItem value="verified">Terverifikasi</SelectItem>
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
              <SelectItem value="suspicious">Mencurigakan</SelectItem>
              <SelectItem value="scam">SCAM</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto custom-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 text-center">No</TableHead>
                    <TableHead>Nomor</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kuantitas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verifikasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="w-36 text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                      <TableRow><TableCell colSpan={10} className="text-center py-12"><div className="text-muted-foreground"><PackageSearch className="h-10 w-10 mx-auto mb-2 opacity-30" /><p className="text-lg font-medium">Tidak ada data</p><p className="text-sm">Klik tombol tambah untuk menambahkan data baru</p></div></TableCell></TableRow>
                  ) : paginatedData.map((item, index) => (
                      <TableRow key={item.id} className={`hover:bg-muted/50 ${item.verificationStatus === 'scam' ? 'bg-red-50' : ''}`}>
                        <TableCell className="text-center text-muted-foreground">{(currentPage - 1) * PAGE_SIZE + index + 1}</TableCell>
                        <TableCell className="font-medium whitespace-nowrap">{item.nomor}</TableCell>
                        <TableCell className="whitespace-nowrap">{item.produk}</TableCell>
                        <TableCell className="whitespace-nowrap">{getBuyerDisplayName(item)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.buyerType === 'perusahaan' ? 'Perusahaan' : 'Perorangan'}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.kuantitas}</TableCell>
                        <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-700'}`}>
                        {item.status}
                      </span>
                        </TableCell>
                        <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${VERIFICATION_STATUS_COLORS[item.verificationStatus || 'pending']}`}>
                        {VERIFICATION_STATUS_LABELS[item.verificationStatus || 'pending']}
                      </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">{formatDate(item.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setPreviewItem(item); setPreviewOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {(item.verificationStatus !== 'scam' && item.verificationStatus !== 'verified') && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => handleMarkAsScam(item)} title="Tandai sebagai SCAM">
                                  <Ban className="h-4 w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteItem(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <DialogHeader><DialogTitle>{editingItem ? 'Edit Permintaan Barang' : 'Tambah Permintaan Barang'}</DialogTitle></DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="produk">Info Produk</TabsTrigger>
                <TabsTrigger value="buyer">Data Buyer</TabsTrigger>
                <TabsTrigger value="seller">Data Seller</TabsTrigger>
                <TabsTrigger value="ketentuan">Ketentuan</TabsTrigger>
                <TabsTrigger value="verifikasi">Verifikasi</TabsTrigger>
              </TabsList>

              <TabsContent value="produk" className="space-y-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Info Produk</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label>Produk *</Label><Input value={form.produk} onChange={e => setForm({ ...form, produk: e.target.value })} placeholder="Nama produk" /></div>
                    <div className="space-y-1"><Label>Kuantitas</Label><Input value={form.kuantitas} onChange={e => setForm({ ...form, kuantitas: e.target.value })} placeholder="Contoh: 50 Ton" /></div>
                    <div className="space-y-1"><Label>Tujuan Pengiriman</Label><Input value={form.tujuanPengiriman} onChange={e => setForm({ ...form, tujuanPengiriman: e.target.value })} placeholder="Kota/tujuan" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Spesifikasi</h3>
                  <div className="space-y-1"><Label>Kualitas</Label><Textarea value={form.kualitas} onChange={e => setForm({ ...form, kualitas: e.target.value })} placeholder="Detail kualitas" rows={2} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Kondisi</Label><Input value={form.kondisi} onChange={e => setForm({ ...form, kondisi: e.target.value })} placeholder="Kondisi barang" /></div>
                    <div className="space-y-1"><Label>Warna</Label><Input value={form.warna} onChange={e => setForm({ ...form, warna: e.target.value })} placeholder="Warna barang" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Harga Target</h3>
                  <div className="space-y-1"><Label>Harga</Label><Input value={form.hargaTarget} onChange={e => setForm({ ...form, hargaTarget: e.target.value })} placeholder="Harga target per unit" /></div>
                  <div className="space-y-1"><Label>Catatan Harga</Label><Textarea value={form.catatanHarga} onChange={e => setForm({ ...form, catatanHarga: e.target.value })} placeholder="Catatan tambahan harga" rows={2} /></div>
                </div>
              </TabsContent>

              <TabsContent value="buyer" className="space-y-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Tipe Buyer</h3>
                  <Select value={form.buyerType} onValueChange={(v: BuyerType) => setForm({ ...form, buyerType: v })}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="perusahaan">Perusahaan / Badan Usaha</SelectItem>
                      <SelectItem value="perorangan">Perorangan / Individu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {form.buyerType === 'perusahaan' ? (
                    <>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Data Perusahaan Buyer
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Nama Perusahaan *</Label><Input value={form.buyerCompany} onChange={e => setForm({ ...form, buyerCompany: e.target.value })} placeholder="PT. Contoh Jaya" /></div>
                          <div className="space-y-1"><Label>NIB</Label><Input value={form.buyerNIB} onChange={e => setForm({ ...form, buyerNIB: e.target.value })} placeholder="Nomor Induk Berusaha (opsional)" /></div>
                          <div className="space-y-1 md:col-span-2"><Label>Alamat</Label><Textarea value={form.buyerAddress} onChange={e => setForm({ ...form, buyerAddress: e.target.value })} placeholder="Alamat lengkap perusahaan" rows={2} /></div>
                          <div className="space-y-1"><Label>No. Telepon</Label><Input value={form.buyerPhone} onChange={e => setForm({ ...form, buyerPhone: e.target.value })} placeholder="Nomor telepon" /></div>
                          <div className="space-y-1"><Label>Email</Label><Input value={form.buyerEmail} onChange={e => setForm({ ...form, buyerEmail: e.target.value })} placeholder="Email perusahaan" type="email" /></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Data PIC
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Nama PIC</Label><Input value={form.buyerPIC} onChange={e => setForm({ ...form, buyerPIC: e.target.value })} placeholder="Nama lengkap" /></div>
                          <div className="space-y-1"><Label>Jabatan</Label><Input value={form.buyerPosition} onChange={e => setForm({ ...form, buyerPosition: e.target.value })} placeholder="Jabatan" /></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dokumen (Opsional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label>Logo Perusahaan</Label>
                            <FileUploadField
                                value={form.buyerLogo}
                                onUpload={(e) => handleFileUpload(e, 'buyerLogo')}
                                onRemove={() => removeFile('buyerLogo')}
                                inputRef={buyerLogoInputRef}
                                accept="image/*"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Tanda Tangan</Label>
                            <FileUploadField
                                value={form.buyerSignature}
                                onUpload={(e) => handleFileUpload(e, 'buyerSignature')}
                                onRemove={() => removeFile('buyerSignature')}
                                inputRef={buyerSignatureInputRef}
                                accept="image/*"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Dokumen NIB</Label>
                            <FileUploadField
                                value={form.buyerNIBDocument}
                                onUpload={(e) => handleFileUpload(e, 'buyerNIBDocument')}
                                onRemove={() => removeFile('buyerNIBDocument')}
                                inputRef={buyerNIBInputRef}
                                accept=".pdf,image/*"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Dokumen bersifat opsional, dapat dikosongkan</p>
                      </div>
                    </>
                ) : (
                    <>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Data Perorangan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1"><Label>Nama Lengkap *</Label><Input value={form.buyerPIC} onChange={e => setForm({ ...form, buyerPIC: e.target.value })} placeholder="Nama lengkap" /></div>
                          <div className="space-y-1">
                            <Label>Jenis Identitas</Label>
                            <Select value={form.buyerIdentityType} onValueChange={v => setForm({ ...form, buyerIdentityType: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="KTP">KTP</SelectItem>
                                <SelectItem value="SIM">SIM</SelectItem>
                                <SelectItem value="Paspor">Paspor</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1"><Label>Nomor Identitas</Label><Input value={form.buyerIdentityNumber} onChange={e => setForm({ ...form, buyerIdentityNumber: e.target.value })} placeholder="Nomor KTP/SIM/Paspor" /></div>
                          <div className="space-y-1"><Label>No. Telepon/WA *</Label><Input value={form.buyerPhone} onChange={e => setForm({ ...form, buyerPhone: e.target.value })} placeholder="Nomor yang bisa dihubungi" /></div>
                          <div className="space-y-1 md:col-span-2"><Label>Alamat</Label><Textarea value={form.buyerAddress} onChange={e => setForm({ ...form, buyerAddress: e.target.value })} placeholder="Alamat lengkap" rows={2} /></div>
                          <div className="space-y-1"><Label>Email</Label><Input value={form.buyerEmail} onChange={e => setForm({ ...form, buyerEmail: e.target.value })} placeholder="Email (opsional)" type="email" /></div>
                          <div className="space-y-1"><Label>Pekerjaan</Label><Input value={form.buyerPosition} onChange={e => setForm({ ...form, buyerPosition: e.target.value })} placeholder="Pekerjaan (opsional)" /></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dokumen (Opsional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label>Foto/Logo (Opsional)</Label>
                            <FileUploadField
                                value={form.buyerLogo}
                                onUpload={(e) => handleFileUpload(e, 'buyerLogo')}
                                onRemove={() => removeFile('buyerLogo')}
                                inputRef={buyerLogoInputRef}
                                accept="image/*"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>Tanda Tangan (Opsional)</Label>
                            <FileUploadField
                                value={form.buyerSignature}
                                onUpload={(e) => handleFileUpload(e, 'buyerSignature')}
                                onRemove={() => removeFile('buyerSignature')}
                                inputRef={buyerSignatureInputRef}
                                accept="image/*"
                            />
                          </div>
                          <div className="space-y-1 md:col-span-2">
                            <Label>Dokumen Identitas (Opsional)</Label>
                            <FileUploadField
                                value={form.buyerIdentityDocument}
                                onUpload={(e) => handleFileUpload(e, 'buyerIdentityDocument')}
                                onRemove={() => removeFile('buyerIdentityDocument')}
                                inputRef={buyerIdentityInputRef}
                                accept=".pdf,image/*"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Semua dokumen bersifat opsional, dapat dikosongkan</p>
                      </div>
                    </>
                )}
              </TabsContent>

              <TabsContent value="seller" className="space-y-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Data Perusahaan Seller
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Nama Perusahaan</Label><Input value={form.sellerCompany} onChange={e => setForm({ ...form, sellerCompany: e.target.value })} placeholder="PT MARVIRO EKSPOR INDONESIA" /></div>
                    <div className="space-y-1"><Label>NIB</Label><Input value={form.sellerNIB} onChange={e => setForm({ ...form, sellerNIB: e.target.value })} placeholder="Nomor Induk Berusaha" /></div>
                    <div className="space-y-1 md:col-span-2"><Label>Alamat</Label><Textarea value={form.sellerAddress} onChange={e => setForm({ ...form, sellerAddress: e.target.value })} placeholder="Alamat lengkap perusahaan" rows={2} /></div>
                    <div className="space-y-1"><Label>No. Telepon</Label><Input value={form.sellerPhone} onChange={e => setForm({ ...form, sellerPhone: e.target.value })} placeholder="Nomor telepon" /></div>
                    <div className="space-y-1"><Label>Email</Label><Input value={form.sellerEmail} onChange={e => setForm({ ...form, sellerEmail: e.target.value })} placeholder="Email perusahaan" type="email" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Data PIC Seller
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Nama PIC</Label><Input value={form.sellerPIC} onChange={e => setForm({ ...form, sellerPIC: e.target.value })} placeholder="Nama lengkap" /></div>
                    <div className="space-y-1"><Label>Jabatan</Label><Input value={form.sellerPosition} onChange={e => setForm({ ...form, sellerPosition: e.target.value })} placeholder="Jabatan" /></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Dokumen Seller</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Logo Perusahaan</Label>
                      <FileUploadField
                          value={form.sellerLogo}
                          onUpload={(e) => handleFileUpload(e, 'sellerLogo')}
                          onRemove={() => removeFile('sellerLogo')}
                          inputRef={sellerLogoInputRef}
                          accept="image/*"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Tanda Tangan</Label>
                      <FileUploadField
                          value={form.sellerSignature}
                          onUpload={(e) => handleFileUpload(e, 'sellerSignature')}
                          onRemove={() => removeFile('sellerSignature')}
                          inputRef={sellerSignatureInputRef}
                          accept="image/*"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ketentuan" className="space-y-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Data yang Diminta</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      { key: 'dataStok' as const, label: 'Kapasitas Stok' },
                      { key: 'dataLokasi' as const, label: 'Lokasi Asal' },
                      { key: 'dataKualitas' as const, label: 'Detail Kualitas' },
                      { key: 'dataDokumentasi' as const, label: 'Dokumentasi' },
                      { key: 'dataEstimasi' as const, label: 'Estimasi Pengiriman' },
                    ].map(c => (
                        <div key={c.key} className="flex items-center gap-2">
                          <Checkbox checked={form[c.key]} onCheckedChange={checked => setForm({ ...form, [c.key]: !!checked })} />
                          <Label className="text-sm">{c.label}</Label>
                        </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Ketentuan</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Sistem Pengiriman</Label><Input value={form.sistemPengiriman} onChange={e => setForm({ ...form, sistemPengiriman: e.target.value })} placeholder="FOB, CIF, dll" /></div>
                    <div className="space-y-1"><Label>Prioritas</Label><Select value={form.prioritas} onValueChange={v => setForm({ ...form, prioritas: v })}><SelectTrigger><SelectValue placeholder="Pilih prioritas" /></SelectTrigger><SelectContent><SelectItem value="Rendah">Rendah</SelectItem><SelectItem value="Sedang">Sedang</SelectItem><SelectItem value="Tinggi">Tinggi</SelectItem><SelectItem value="Urgent">Urgent</SelectItem></SelectContent></Select></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status Dokumen</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Verifikator</Label><Input value={form.verifikasi} onChange={e => setForm({ ...form, verifikasi: e.target.value })} placeholder="Nama verifikator" /></div>
                    <div className="space-y-1"><Label>Status</Label><Select value={form.status} onValueChange={v => setForm({ ...form, status: v as PermintaanBarang['status'] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Draft">Draft</SelectItem><SelectItem value="Terbit">Terbit</SelectItem><SelectItem value="Ditutup">Ditutup</SelectItem></SelectContent></Select></div>
                  </div>
                  <div className="space-y-1"><Label>Disclaimer</Label><Textarea value={form.disclaimer} onChange={e => setForm({ ...form, disclaimer: e.target.value })} placeholder="Disclaimer" rows={2} /></div>
                </div>
              </TabsContent>

              <TabsContent value="verifikasi" className="space-y-4 py-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Status Verifikasi Buyer
                  </h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label>Status Verifikasi</Label>
                      <Select value={form.verificationStatus} onValueChange={(v: VerificationStatus) => setForm({ ...form, verificationStatus: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="verified">Terverifikasi</SelectItem>
                          <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                          <SelectItem value="suspicious">Mencurigakan</SelectItem>
                          <SelectItem value="scam">SCAM / PENIPUAN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Catatan Verifikasi</Label>
                      <Textarea
                          value={form.verificationNotes}
                          onChange={e => setForm({ ...form, verificationNotes: e.target.value })}
                          placeholder="Catatan hasil verifikasi, alasan penolakan, atau indikasi scam"
                          rows={3}
                      />
                    </div>

                    {form.verificationStatus === 'scam' && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm font-medium text-red-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Peringatan SCAM
                          </p>
                          <p className="text-xs text-red-700 mt-1">
                            Data ini ditandai sebagai penipuan. Harap berhati-hati dan jangan melanjutkan transaksi.
                          </p>
                        </div>
                    )}

                    {form.verificationStatus === 'suspicious' && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                          <p className="text-sm font-medium text-orange-800 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Data Mencurigakan
                          </p>
                          <p className="text-xs text-orange-700 mt-1">
                            Data ini memiliki indikasi mencurigakan. Lakukan verifikasi lebih lanjut sebelum transaksi.
                          </p>
                        </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave}>{editingItem ? 'Simpan Perubahan' : 'Tambah Data'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            {previewItem && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    Preview Dokumen
                    {previewItem.verificationStatus === 'scam' && (
                        <Badge variant="destructive" className="ml-2">SCAM</Badge>
                    )}
                    {previewItem.verificationStatus === 'suspicious' && (
                        <Badge className="bg-orange-500">MENCURIGAKAN</Badge>
                    )}
                  </span>
                      <Button onClick={handleDownloadPDF} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </DialogTitle>
                  </DialogHeader>

                  {previewItem.verificationStatus === 'scam' && (
                      <div className="bg-red-100 border-2 border-red-500 p-3 rounded-md mb-3">
                        <p className="font-bold text-red-800 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          PERINGATAN: DATA INI DITANDAI SEBAGAI SCAM / PENIPUAN
                        </p>
                        {previewItem.verificationNotes && (
                            <p className="text-sm text-red-700 mt-1">{previewItem.verificationNotes}</p>
                        )}
                      </div>
                  )}

                  <div ref={previewRef} className="border p-6 bg-white text-black space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4">
                      <div className="flex items-center gap-3">
                        {previewItem.sellerLogo && (
                            <img src={previewItem.sellerLogo} alt="Seller Logo" className="h-16 w-16 object-contain" />
                        )}
                        <div>
                          <p className="font-bold text-lg">{previewItem.sellerCompany || 'PT MARVIRO EKSPOR INDONESIA'}</p>
                          {previewItem.sellerNIB && <p className="text-xs">NIB: {previewItem.sellerNIB}</p>}
                          {previewItem.sellerAddress && <p className="text-xs">{previewItem.sellerAddress}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">PERMINTAAN BARANG</p>
                        <p className="text-xs">No: {previewItem.nomor}</p>
                        <p className="text-xs">Tanggal: {formatDate(previewItem.createdAt)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="font-semibold mb-1">
                        DATA BUYER ({previewItem.buyerType === 'perusahaan' ? 'Perusahaan' : 'Perorangan'})
                      </p>
                      {previewItem.buyerType === 'perusahaan' ? (
                          <div className="grid grid-cols-2 gap-1">
                            <p><strong>Perusahaan:</strong> {previewItem.buyerCompany || '-'}</p>
                            <p><strong>NIB:</strong> {previewItem.buyerNIB || '-'}</p>
                            <p><strong>Alamat:</strong> {previewItem.buyerAddress || '-'}</p>
                            <p><strong>Telepon:</strong> {previewItem.buyerPhone || '-'} | <strong>Email:</strong> {previewItem.buyerEmail || '-'}</p>
                            <p><strong>PIC:</strong> {previewItem.buyerPIC || '-'}</p>
                            <p><strong>Jabatan:</strong> {previewItem.buyerPosition || '-'}</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 gap-1">
                            <p><strong>Nama:</strong> {previewItem.buyerPIC || '-'}</p>
                            <p><strong>Identitas:</strong> {previewItem.buyerIdentityType || '-'} {previewItem.buyerIdentityNumber || ''}</p>
                            <p><strong>Telepon/WA:</strong> {previewItem.buyerPhone || '-'}</p>
                            <p><strong>Email:</strong> {previewItem.buyerEmail || '-'}</p>
                            <p><strong>Alamat:</strong> {previewItem.buyerAddress || '-'}</p>
                            <p><strong>Pekerjaan:</strong> {previewItem.buyerPosition || '-'}</p>
                          </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1">
                      <p><strong>Status:</strong> <Badge variant="outline">{previewItem.status}</Badge></p>
                      <p><strong>Prioritas:</strong> {previewItem.prioritas || '-'}</p>
                      <p><strong>Verifikasi:</strong>
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${VERIFICATION_STATUS_COLORS[previewItem.verificationStatus || 'pending']}`}>
                      {VERIFICATION_STATUS_LABELS[previewItem.verificationStatus || 'pending']}
                    </span>
                      </p>
                    </div>

                    <table className="w-full border-collapse border text-xs mt-2">
                      <thead><tr className="bg-gray-100"><th className="border p-2 text-left">Info Produk</th><th className="border p-2 text-left">Detail</th></tr></thead>
                      <tbody>
                      <tr><td className="border p-2 font-medium">Produk</td><td className="border p-2">{previewItem.produk}</td></tr>
                      <tr><td className="border p-2 font-medium">Kuantitas</td><td className="border p-2">{previewItem.kuantitas}</td></tr>
                      <tr><td className="border p-2 font-medium">Tujuan Pengiriman</td><td className="border p-2">{previewItem.tujuanPengiriman}</td></tr>
                      <tr><td className="border p-2 font-medium">Kualitas</td><td className="border p-2">{previewItem.kualitas || '-'}</td></tr>
                      <tr><td className="border p-2 font-medium">Kondisi</td><td className="border p-2">{previewItem.kondisi || '-'}</td></tr>
                      <tr><td className="border p-2 font-medium">Warna</td><td className="border p-2">{previewItem.warna || '-'}</td></tr>
                      <tr><td className="border p-2 font-medium">Harga Target</td><td className="border p-2">{previewItem.hargaTarget || '-'}</td></tr>
                      <tr><td className="border p-2 font-medium">Sistem Pengiriman</td><td className="border p-2">{previewItem.sistemPengiriman || '-'}</td></tr>
                      </tbody>
                    </table>

                    <div className="mt-2">
                      <p className="font-semibold mb-1">Data yang Diminta:</p>
                      <div className="flex flex-wrap gap-2">
                        {previewItem.dataStok && <Badge variant="secondary">Kapasitas Stok</Badge>}
                        {previewItem.dataLokasi && <Badge variant="secondary">Lokasi Asal</Badge>}
                        {previewItem.dataKualitas && <Badge variant="secondary">Detail Kualitas</Badge>}
                        {previewItem.dataDokumentasi && <Badge variant="secondary">Dokumentasi</Badge>}
                        {previewItem.dataEstimasi && <Badge variant="secondary">Estimasi Pengiriman</Badge>}
                        {!previewItem.dataStok && !previewItem.dataLokasi && !previewItem.dataKualitas && !previewItem.dataDokumentasi && !previewItem.dataEstimasi && <span className="text-muted-foreground">-</span>}
                      </div>
                    </div>

                    {previewItem.disclaimer && <div className="mt-3 p-2 bg-gray-50 rounded text-xs italic">{previewItem.disclaimer}</div>}

                    {previewItem.verificationNotes && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                          <strong>Catatan Verifikasi:</strong> {previewItem.verificationNotes}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-8 mt-6 pt-4 border-t">
                      <div className="text-center">
                        <p className="font-medium">Buyer</p>
                        <p className="text-xs">{previewItem.buyerType === 'perusahaan' ? (previewItem.buyerCompany || '_________________') : (previewItem.buyerPIC || '_________________')}</p>
                        {previewItem.buyerSignature && (
                            <img src={previewItem.buyerSignature} alt="Buyer Signature" className="h-12 mx-auto mt-4 object-contain" />
                        )}
                        <div className="mt-2 border-b border-black w-40 mx-auto" />
                        <p className="mt-1 text-xs">{previewItem.buyerPIC || '_________________'}</p>
                        <p className="text-xs text-gray-600">{previewItem.buyerPosition || ''}</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Seller</p>
                        <p className="text-xs">{previewItem.sellerCompany || 'PT MARVIRO EKSPOR INDONESIA'}</p>
                        {previewItem.sellerSignature && (
                            <img src={previewItem.sellerSignature} alt="Seller Signature" className="h-12 mx-auto mt-4 object-contain" />
                        )}
                        <div className="mt-2 border-b border-black w-40 mx-auto" />
                        <p className="mt-1 text-xs">{previewItem.sellerPIC || '_________________'}</p>
                        <p className="text-xs text-gray-600">{previewItem.sellerPosition || ''}</p>
                      </div>
                    </div>

                    {(previewItem.buyerNIB || previewItem.sellerNIB) && (
                        <div className="mt-4 pt-3 border-t text-center text-gray-500 text-[10px]">
                          <p>Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah</p>
                          <p>Buyer NIB: {previewItem.buyerNIB || '-'} | Seller NIB: {previewItem.sellerNIB || '-'}</p>
                        </div>
                    )}
                  </div>
                </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteItem} onOpenChange={open => !open && setDeleteItem(null)}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>Hapus Data</AlertDialogTitle><AlertDialogDescription>Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Hapus</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  );
}

interface FileUploadFieldProps {
  value?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  accept: string;
}

function FileUploadField({ value, onUpload, onRemove, inputRef, accept }: FileUploadFieldProps) {
  return (
      <div className="space-y-2">
        <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={onUpload}
            className="hidden"
        />
        {value ? (
            <div className="relative border rounded p-2">
              <img src={value} alt="Preview" className="h-20 w-full object-contain" />
              <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-white rounded-full"
                  onClick={onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
        ) : (
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
        )}
      </div>
  );
}