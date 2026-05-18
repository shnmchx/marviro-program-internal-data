import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==================== DATA TYPES ====================

export interface NikInternal {
  id: string;
  nik: string;
  namaLengkap: string;
  jabatanDivisi: string;
  status: 'Aktif' | 'Tidak Aktif';
  tipeHubungan: string;
  tglMulai: string;
  tglBerakhir: string;
  payroll: 'Ya' | 'Tidak';
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface NikEksternal {
  id: string;
  nik: string;
  namaLengkap: string;
  klasifikasi: 'OPS' | 'CON' | 'QC' | 'BOR' | 'BPK' | 'BLG' | 'AGT' | 'MDT' | 'FOP' | 'KSL';
  peran: string;
  dasarKontrak: string;
  nomorKontrak: string;
  tglMulai: string;
  tglBerakhir: string;
  skemaImbalan: string;
  pajak: string;
  status: 'Aktif' | 'Tidak Aktif' | 'Ditangguhkan' | 'Selesai';
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface VendorRegister {
  id: string;
  vendorId: string;
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
  createdAt: string;
}

export interface BuyerRegister {
  id: string;
  buyerId: string;
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
  createdAt: string;
}

export interface KontrakRegister {
  id: string;
  nomorKontrak: string;
  jenisKontrak: 'Buyer' | 'Supplier' | 'Investor' | 'AGT/Trader' | 'Internal';
  klasifikasi: 'BUY' | 'SUP' | 'INV' | 'AGT' | 'INT';
  namaPihak: string;
  referensiId: string;
  objekKontrak: string;
  komoditas: string;
  tglMulai: string;
  tglBerakhir: string;
  status: 'Draft' | 'Proses TTD' | 'Aktif' | 'Ditunda' | 'Selesai' | 'Dibatalkan';
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermohonanVendor {
  id: string;
  tglKirimSurat: string;
  nomorSuratVendor: string;
  namaVendor: string;
  jenisVendor: string;
  statusPermohonan: 'Accept' | 'Reject' | 'Pending';
  statusPihak: string;
  idVendor: string;
  createdAt: string;
}

export interface BuyerDatabaseEntry {
  id: string;
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
  status: 'New Lead' | 'Follow Up' | 'Negotiation' | 'Belum Closing' | 'Closing' | 'Continue' | 'Scam' | 'Rejected' | 'No Response';
  lastFollowUp: string;
  nextFollowUp: string;
  catatan: string;
  catatanDetail: string;
  sumberData?: string;
  linkedAgtId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEntry {
  id: string;
  namaProyek: string;
  deskripsi: string;
  kodeProyek: string;
  minInvestor: number;
  maxInvestor: number;
  minInvestasiPerInvestor: number;
  maxInvestasiPerInvestor: number;
  totalNilaiProyek: number;
  omzetKotor: number;
  biayaOperasional: number;
  labaBersih: number;
  statusProyek: 'Persiapan' | 'Berjalan' | 'Selesai' | 'Ditunda';
  tanggalMulai: string;
  tanggalSelesai: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorEntry {
  id: string;
  projectId: string;
  nomorSurat: string;
  namaInvestor: string;
  company?: string;
  email: string;
  phone: string;
  alamat: string;
  npwp?: string;
  nilaiInvestasi: number;
  persentaseBagiHasil: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  statusInvestasi: 'Aktif' | 'Selesai' | 'Diperpanjang' | 'Terminasi';
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestorContract {
  id: string;
  investorId: string;
  projectId: string;
  nomorKontrak: string;
  nomorSuratInvestor: string;
  nilaiInvestasi: number;
  persentaseBagiHasil: number;
  jangkaWaktu: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  caraPembayaran: 'Transfer' | 'Cash' | 'Bertahap';
  statusKontrak: 'Draft' | 'Aktif' | 'Selesai' | 'Terminasi' | 'Diperpanjang';
  syaratKetentuan: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgtEntry {
  id: string;
  kodeAgt: string;
  namaAgt: string;
  nikEksternal: string;
  nomorKontrak: string;
  fokusProduk: string[];
  fokusMarket: string[];
  wilayahFokus: string[];
  statusAgt: 'Aktif' | 'Evaluasi' | 'Ditangguhkan' | 'Tidak Aktif' | 'Selesai';
  tanggalBergabung: string;
  catatan: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermintaanBarang {
  id: string;
  nomor: string;
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
  status: 'Draft' | 'Terbit' | 'Ditutup';
  createdAt: string;
  updatedAt: string;
}

export interface LogPenjualan {
  id: string;
  tanggal: string;
  jenisTransaksi: string;
  produk: string;
  satuan: string;
  qty: number;
  hargaJual: number;
  totalPenjualan: number;
  buyer: string;
  statusPembayaran: string;
  metode: string;
  bukti: string;
  createdAt: string;
}

export interface LogPembelian {
  id: string;
  tanggal: string;
  produk: string;
  supplier: string;
  satuan: string;
  qty: number;
  hargaBeli: number;
  totalPembelian: number;
  metodeBayar: string;
  status: string;
  bukti: string;
  createdAt: string;
}

export interface LogBeban {
  id: string;
  tanggal: string;
  jenisBeban: string;
  kategori: string;
  nominal: number;
  metodeBayar: string;
  keterangan: string;
  bukti: string;
  createdAt: string;
}

export interface LogGajiHonor {
  id: string;
  periode: string;
  nama: string;
  jabatan: string;
  jenisPembayaran: string;
  nominal: number;
  metode: string;
  status: string;
  bukti: string;
  createdAt: string;
}

export interface LogAset {
  id: string;
  tanggal: string;
  namaAset: string;
  jenis: string;
  nilai: number;
  metodeBayar: string;
  keterangan: string;
  bukti: string;
  createdAt: string;
}

export interface InvoiceRegister {
  id: string;
  nomorInvoice: string;
  tanggal: string;
  customerId: string;
  nomorKontrak: string;
  nilai: string;
  statusPembayaran: 'Belum Lunas' | 'Sebagian' | 'Lunas';
  tanggalBayar: string;
  keterangan: string;
  createdAt: string;
}

export interface PembayaranRegister {
  id: string;
  tanggal: string;
  referensiInvoice: string;
  customerId: string;
  jumlah: string;
  metode: string;
  buktiTransfer: string;
  status: 'Pending' | 'Diterima' | 'Gagal';
  createdAt: string;
}

export interface PayrollEntry {
  id: string;
  periode: string;
  nama: string;
  nik: string;
  jabatan: string;
  tipeKaryawan: 'Magang' | 'Non-Magang';
  gajiPokok: number;
  lembur: number;
  tunjanganJamsostek: number;
  tunjanganJamkes: number;
  gajiKotor: number;
  iuranJamsostek: number;
  iuranJamkes: number;
  pinjaman: number;
  pph21: number;
  totalPotongan: number;
  gajiBersih: number;
  createdAt: string;
}

// ==================== CONSTANTS ====================

export const BUYER_STATUS_OPTIONS = [
  { value: 'New Lead', label: 'New Lead', color: 'bg-blue-100 text-blue-700' },
  { value: 'Follow Up', label: 'Follow Up', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'Negotiation', label: 'Negotiation', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Belum Closing', label: 'Belum Closing', color: 'bg-orange-100 text-orange-700' },
  { value: 'Closing', label: 'Closing', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Continue', label: 'Continue', color: 'bg-teal-100 text-teal-700' },
  { value: 'Scam', label: 'Scam', color: 'bg-red-100 text-red-700' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-gray-200 text-gray-700' },
  { value: 'No Response', label: 'No Response', color: 'bg-purple-100 text-purple-700' },
] as const;

export const CARA_PEMBAYARAN_OPTIONS = [
  { value: 'Transfer', label: 'Transfer Bank' },
  { value: 'Cash', label: 'Tunai' },
  { value: 'Bertahap', label: 'Bertahap' },
] as const;

export const CONTRACT_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'Aktif', label: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700' },
  { value: 'Terminasi', label: 'Terminasi', color: 'bg-red-100 text-red-700' },
  { value: 'Diperpanjang', label: 'Diperpanjang', color: 'bg-indigo-100 text-indigo-700' },
] as const;

export const KONTRAK_STATUS_OPTIONS = [
  { value: 'Draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'Proses TTD', label: 'Proses Tanda Tangan', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Aktif', label: 'Aktif / Terbit', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Ditunda', label: 'Ditunda', color: 'bg-orange-100 text-orange-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700' },
  { value: 'Dibatalkan', label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
] as const;

export const KONTRAK_JENIS_OPTIONS = [
  { value: 'Buyer', label: 'Buyer', color: 'bg-blue-100 text-blue-700' },
  { value: 'Supplier', label: 'Supplier', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Investor', label: 'Investor', color: 'bg-violet-100 text-violet-700' },
  { value: 'AGT/Trader', label: 'AGT / Trader', color: 'bg-amber-100 text-amber-700' },
  { value: 'Internal', label: 'Internal', color: 'bg-slate-100 text-slate-700' },
] as const;

export const INVESTOR_STATUS_OPTIONS = [
  { value: 'Aktif', label: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700' },
  { value: 'Diperpanjang', label: 'Diperpanjang', color: 'bg-indigo-100 text-indigo-700' },
  { value: 'Terminasi', label: 'Terminasi', color: 'bg-red-100 text-red-700' },
] as const;

export const PROJECT_STATUS_OPTIONS = [
  { value: 'Persiapan', label: 'Persiapan', color: 'bg-blue-100 text-blue-700' },
  { value: 'Berjalan', label: 'Berjalan', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-gray-100 text-gray-700' },
  { value: 'Ditunda', label: 'Ditunda', color: 'bg-orange-100 text-orange-700' },
] as const;

export const AGT_STATUS_OPTIONS = [
  { value: 'Aktif', label: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Evaluasi', label: 'Evaluasi', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'Ditangguhkan', label: 'Ditangguhkan', color: 'bg-orange-100 text-orange-700' },
  { value: 'Tidak Aktif', label: 'Tidak Aktif', color: 'bg-gray-100 text-gray-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700' },
] as const;

export const NIK_STATUS_OPTIONS = [
  { value: 'Aktif', label: 'Aktif', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'Tidak Aktif', label: 'Tidak Aktif', color: 'bg-gray-100 text-gray-700' },
  { value: 'Ditangguhkan', label: 'Ditangguhkan', color: 'bg-orange-100 text-orange-700' },
  { value: 'Selesai', label: 'Selesai', color: 'bg-blue-100 text-blue-700' },
] as const;

export const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
] as const;

export const BULAN_ROMawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'] as const;

export type PageType = 'dashboard' | 'nik-internal' | 'nik-eksternal' | 'vendor' | 'buyer' | 'db-buyer' | 'kontrak' | 'permohonan' | 'permintaan-barang' | 'log-transaksi' | 'register-invoice' | 'register-pembayaran' | 'payroll' | 'laporan-keuangan' | 'settings' | 'agt-management' | 'projects' | 'investors-input';

export const JABATAN_DIVISI_OPTIONS = [
  'Direktur Utama', 'Komisaris', 'Komisaris 2', 'Komisaris 3', 'Komisaris 4',
  'Finance Manager', 'Accounting', 'Admin Operasional', 'HR/Payroll',
  'Marketing', 'Sales', 'Operasional', 'Gudang/QC', 'IT/Digital', 'Driver/Helper',
] as const;

export const DIVISI_CODE_MAP: Record<string, string> = {
  'Direktur Utama': 'DIR', 'Komisaris': 'KOM1', 'Komisaris 2': 'KOM2',
  'Komisaris 3': 'KOM3', 'Komisaris 4': 'KOM4', 'Finance Manager': 'FIN',
  'Accounting': 'ACC', 'Admin Operasional': 'ADM', 'HR/Payroll': 'HR',
  'Marketing': 'MKT', 'Sales': 'SLS', 'Operasional': 'OPS',
  'Gudang/QC': 'GUD', 'IT/Digital': 'IT', 'Driver/Helper': 'DRV',
};

export const KLASIFIKASI_OPTIONS = [
  { value: 'OPS', label: 'OPS - Operasional Terintegrasi' },
  { value: 'CON', label: 'CON - Penghubung Bisnis' },
  { value: 'QC', label: 'QC - Quality Control' },
  { value: 'BOR', label: 'BOR - Borongan Produksi' },
  { value: 'BPK', label: 'BPK - Borongan Packing' },
  { value: 'BLG', label: 'BLG - Borongan Logistik' },
  { value: 'AGT', label: 'AGT - Agen Penjualan' },
  { value: 'MDT', label: 'MDT - Mediator' },
  { value: 'FOP', label: 'FOP - Fee Operasional' },
  { value: 'KSL', label: 'KSL - Konsultan Lepas' },
] as const;

export const KONTRAK_KLASIFIKASI_OPTIONS = [
  { value: 'BUY', label: 'BUY - Buyer', color: 'bg-blue-100 text-blue-700' },
  { value: 'SUP', label: 'SUP - Supplier', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'INV', label: 'INV - Investor', color: 'bg-violet-100 text-violet-700' },
  { value: 'AGT', label: 'AGT - Agen/Trader', color: 'bg-amber-100 text-amber-700' },
  { value: 'INT', label: 'INT - Internal', color: 'bg-slate-100 text-slate-700' },
] as const;

export const formatRupiah = (val: number): string => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);
};

// ==================== HELPER FUNCTIONS ====================

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function padNum(n: number, len: number = 3): string {
  return String(n).padStart(len, '0');
}

function generateNikInternal(nikList: NikInternal[], jabatanDivisi: string): string {
  const code = DIVISI_CODE_MAP[jabatanDivisi] || 'XXX';
  const existing = nikList.filter(n => n.nik.startsWith(`MRV-${code}-INT-`));
  const maxSeq = existing.reduce((max, n) => {
    const parts = n.nik.split('-');
    const seq = parseInt(parts[parts.length - 1], 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `MRV-${code}-INT-${padNum(maxSeq + 1)}`;
}

function generateNikEksternal(nikList: NikEksternal[], klasifikasi: string): string {
  const year = new Date().getFullYear();
  const prefix = `MRV-EXT-${klasifikasi}-${year}-`;
  const existing = nikList.filter(n => n.nik.startsWith(prefix));
  const maxSeq = existing.reduce((max, n) => {
    const parts = n.nik.split('-');
    const seq = parseInt(parts[parts.length - 1], 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${padNum(maxSeq + 1)}`;
}

function generateVendorId(vendorList: VendorRegister[], provinsi: string): string {
  const year = new Date().getFullYear();
  const provCode = provinsi.substring(0, 3).toUpperCase();
  const prefix = `MRV-VEN-${provCode}-${year}-`;
  const existing = vendorList.filter(v => v.vendorId.startsWith(prefix));
  const maxSeq = existing.reduce((max, v) => {
    const parts = v.vendorId.split('-');
    const seq = parseInt(parts[parts.length - 1], 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${padNum(maxSeq + 1)}`;
}

function generateBuyerId(buyerList: BuyerRegister[], negara: string): string {
  const year = new Date().getFullYear();
  const countryCode = negara.substring(0, 3).toUpperCase();
  const prefix = `MRV-BID-${countryCode}-${year}-`;
  const existing = buyerList.filter(b => b.buyerId.startsWith(prefix));
  const maxSeq = existing.reduce((max, b) => {
    const parts = b.buyerId.split('-');
    const seq = parseInt(parts[parts.length - 1], 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${padNum(maxSeq + 1)}`;
}

function generatePermintaanBarangNomor(list: PermintaanBarang[]): string {
  const year = new Date().getFullYear();
  const prefix = `PB-MRV-${year}-`;
  const existing = list.filter(p => p.nomor.startsWith(prefix));
  const maxSeq = existing.reduce((max, p) => {
    const seq = parseInt(p.nomor.split('-').pop() || '0', 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${padNum(maxSeq + 1)}`;
}

function generateInvoiceNomor(list: InvoiceRegister[]): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = padNum(now.getMonth() + 1, 2);
  const prefix = `INV/MRV/EXP/${year}/${month}/`;
  const existing = list.filter(i => i.nomorInvoice.startsWith(prefix));
  const maxSeq = existing.reduce((max, i) => {
    const parts = i.nomorInvoice.split('/');
    const seq = parseInt(parts[parts.length - 1], 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${padNum(maxSeq + 1)}`;
}

function generateKodeProyek(projectList: ProjectEntry[], namaProyek: string): string {
  const words = namaProyek.trim().split(/\s+/);
  const prefix = words.slice(0, 2).map(w => w.substring(0, 3).toUpperCase()).join('');
  const year = new Date().getFullYear().toString().slice(-2);
  const existing = projectList.filter(p => p.kodeProyek.startsWith(prefix));
  const seq = padNum(existing.length + 1);
  return `${prefix}${year}${seq}`;
}

function generateNomorSuratInvestor(kodeProyek: string, investorList: InvestorEntry[]): string {
  const now = new Date();
  const bulanRomawi = BULAN_ROMawi[now.getMonth()];
  const tahun = now.getFullYear();
  const investorsBulanIni = investorList.filter(inv => {
    return inv.nomorSurat.includes(kodeProyek) &&
        inv.nomorSurat.includes(`/${bulanRomawi}/`) &&
        inv.nomorSurat.includes(`/${tahun}/`);
  });
  const nomorUrut = padNum(investorsBulanIni.length + 1);
  return `INV/${kodeProyek}/${bulanRomawi}/${tahun}/${nomorUrut}`;
}

function generateNomorKontrakInvestor(kodeProyek: string, contractList: InvestorContract[]): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `KTR/INV/MRV/${kodeProyek}/${year}/${month}/`;
  const existing = contractList.filter(c => c.nomorKontrak.startsWith(prefix));
  const maxSeq = existing.reduce((max, c) => {
    const parts = c.nomorKontrak.split('/');
    const seq = parseInt(parts[parts.length - 1] || '0', 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

function generateKodeAgt(agtList: AgtEntry[]): string {
  const year = new Date().getFullYear();
  const prefix = `AGT-MRV-${year}-`;
  const existing = agtList.filter(a => a.kodeAgt.startsWith(prefix));
  const maxSeq = existing.reduce((max, a) => {
    const seq = parseInt(a.kodeAgt.split('-').pop() || '0', 10);
    return isNaN(seq) ? max : Math.max(max, seq);
  }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

// ==================== STORE TYPES ====================

interface AdminStore {
  nikInternals: NikInternal[];
  nikEksternals: NikEksternal[];
  vendors: VendorRegister[];
  buyers: BuyerRegister[];
  buyerDatabases: BuyerDatabaseEntry[];
  kontraks: KontrakRegister[];
  permohonans: PermohonanVendor[];
  permintaanBarangs: PermintaanBarang[];
  logPenjualans: LogPenjualan[];
  logPembelians: LogPembelian[];
  logBebans: LogBeban[];
  logGajiHonors: LogGajiHonor[];
  logAsets: LogAset[];
  invoiceRegisters: InvoiceRegister[];
  pembayaranRegisters: PembayaranRegister[];
  payrollEntries: PayrollEntry[];
  companyLogo: string;
  projects: ProjectEntry[];
  investors: InvestorEntry[];
  investorContracts: InvestorContract[];
  agtEntries: AgtEntry[];
  activePage: PageType;
  isSyncing: boolean;
  setActivePage: (page: PageType) => void;
  addNikInternal: (data: Omit<NikInternal, 'id' | 'nik' | 'createdAt' | 'updatedAt'>) => NikInternal;
  updateNikInternal: (id: string, data: Partial<NikInternal>) => void;
  deleteNikInternal: (id: string) => void;
  addNikEksternal: (data: Omit<NikEksternal, 'id' | 'nik' | 'createdAt' | 'updatedAt'>) => NikEksternal;
  updateNikEksternal: (id: string, data: Partial<NikEksternal>) => void;
  deleteNikEksternal: (id: string) => void;
  addVendor: (data: Omit<VendorRegister, 'id' | 'vendorId' | 'createdAt'>) => VendorRegister;
  updateVendor: (id: string, data: Partial<VendorRegister>) => void;
  deleteVendor: (id: string) => void;
  addBuyer: (data: Omit<BuyerRegister, 'id' | 'buyerId' | 'createdAt'>) => BuyerRegister;
  updateBuyer: (id: string, data: Partial<BuyerRegister>) => void;
  deleteBuyer: (id: string) => void;
  addBuyerDatabase: (data: Omit<BuyerDatabaseEntry, 'id' | 'createdAt' | 'updatedAt'>) => BuyerDatabaseEntry;
  updateBuyerDatabase: (id: string, data: Partial<BuyerDatabaseEntry>) => void;
  deleteBuyerDatabase: (id: string) => void;
  addKontrak: (data: Omit<KontrakRegister, 'id' | 'createdAt' | 'updatedAt'>) => KontrakRegister;
  updateKontrak: (id: string, data: Partial<KontrakRegister>) => void;
  deleteKontrak: (id: string) => void;
  addPermohonan: (data: Omit<PermohonanVendor, 'id' | 'createdAt'>) => PermohonanVendor;
  updatePermohonan: (id: string, data: Partial<PermohonanVendor>) => void;
  deletePermohonan: (id: string) => void;
  addPermintaanBarang: (data: Omit<PermintaanBarang, 'id' | 'nomor' | 'createdAt' | 'updatedAt'>) => PermintaanBarang;
  updatePermintaanBarang: (id: string, data: Partial<PermintaanBarang>) => void;
  deletePermintaanBarang: (id: string) => void;
  addLogPenjualan: (data: Omit<LogPenjualan, 'id' | 'totalPenjualan' | 'createdAt'>) => LogPenjualan;
  updateLogPenjualan: (id: string, data: Partial<LogPenjualan>) => void;
  deleteLogPenjualan: (id: string) => void;
  addLogPembelian: (data: Omit<LogPembelian, 'id' | 'totalPembelian' | 'createdAt'>) => LogPembelian;
  updateLogPembelian: (id: string, data: Partial<LogPembelian>) => void;
  deleteLogPembelian: (id: string) => void;
  addLogBeban: (data: Omit<LogBeban, 'id' | 'createdAt'>) => LogBeban;
  updateLogBeban: (id: string, data: Partial<LogBeban>) => void;
  deleteLogBeban: (id: string) => void;
  addLogGajiHonor: (data: Omit<LogGajiHonor, 'id' | 'createdAt'>) => LogGajiHonor;
  updateLogGajiHonor: (id: string, data: Partial<LogGajiHonor>) => void;
  deleteLogGajiHonor: (id: string) => void;
  addLogAset: (data: Omit<LogAset, 'id' | 'createdAt'>) => LogAset;
  updateLogAset: (id: string, data: Partial<LogAset>) => void;
  deleteLogAset: (id: string) => void;
  addInvoice: (data: Omit<InvoiceRegister, 'id' | 'nomorInvoice' | 'createdAt'>) => InvoiceRegister;
  updateInvoice: (id: string, data: Partial<InvoiceRegister>) => void;
  deleteInvoice: (id: string) => void;
  addPembayaran: (data: Omit<PembayaranRegister, 'id' | 'createdAt'>) => PembayaranRegister;
  updatePembayaran: (id: string, data: Partial<PembayaranRegister>) => void;
  deletePembayaran: (id: string) => void;
  addPayroll: (data: Omit<PayrollEntry, 'id' | 'gajiKotor' | 'totalPotongan' | 'gajiBersih' | 'createdAt'>) => PayrollEntry;
  updatePayroll: (id: string, data: Partial<PayrollEntry>) => void;
  deletePayroll: (id: string) => void;
  setCompanyLogo: (logo: string) => void;
  addProject: (data: Omit<ProjectEntry, 'id' | 'kodeProyek' | 'createdAt' | 'updatedAt'>) => ProjectEntry;
  updateProject: (id: string, data: Partial<ProjectEntry>) => void;
  deleteProject: (id: string) => void;
  addInvestor: (data: Omit<InvestorEntry, 'id' | 'nomorSurat' | 'createdAt' | 'updatedAt'>) => InvestorEntry;
  updateInvestor: (id: string, data: Partial<InvestorEntry>) => void;
  deleteInvestor: (id: string) => void;
  addInvestorContract: (data: Omit<InvestorContract, 'id' | 'nomorKontrak' | 'createdAt' | 'updatedAt'>) => InvestorContract;
  updateInvestorContract: (id: string, data: Partial<InvestorContract>) => void;
  deleteInvestorContract: (id: string) => void;
  addAgtEntry: (data: Omit<AgtEntry, 'id' | 'kodeAgt' | 'createdAt' | 'updatedAt'>) => AgtEntry;
  updateAgtEntry: (id: string, data: Partial<AgtEntry>) => void;
  deleteAgtEntry: (id: string) => void;
  syncToNeon: () => Promise<boolean>;
  loadFromNeon: () => Promise<boolean>;
  exportAllData: () => string;
  importAllData: (json: string) => boolean;
  resetAllData: () => void;
}

// ==================== INITIAL DATA ====================

const initialNikInternals: NikInternal[] = [
  {
    id: generateId(), nik: 'MRV-DIR-INT-001', namaLengkap: 'Muhammad Rizky Pratama',
    jabatanDivisi: 'Direktur Utama', status: 'Aktif', tipeHubungan: 'Pemegang Saham',
    tglMulai: '2024-01-01', tglBerakhir: '2028-12-31', payroll: 'Ya',
    keterangan: 'Pendiri dan Direktur Utama PT Marviro Ekspor Indonesia',
    createdAt: '2024-01-01T08:00:00.000Z', updatedAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: generateId(), nik: 'MRV-FIN-INT-001', namaLengkap: 'Siti Aisyah Putri',
    jabatanDivisi: 'Finance Manager', status: 'Aktif', tipeHubungan: 'Karyawan Tetap',
    tglMulai: '2024-03-01', tglBerakhir: '2026-02-28', payroll: 'Ya',
    keterangan: 'Bertanggung jawab atas manajemen keuangan perusahaan',
    createdAt: '2024-03-01T08:00:00.000Z', updatedAt: '2024-03-01T08:00:00.000Z',
  },
];

const initialNikEksternals: NikEksternal[] = [
  {
    id: generateId(), nik: 'MRV-EXT-OPS-2025-001', namaLengkap: 'Ahmad Fadillah',
    klasifikasi: 'OPS', peran: 'Koordinator Operasional Lapangan',
    dasarKontrak: 'Perjanjian Kerja Sama Operasional', nomorKontrak: 'PKS-OPS-2025-001',
    tglMulai: '2025-01-15', tglBerakhir: '2025-12-31', skemaImbalan: 'Bulanan',
    pajak: 'PPH 23', status: 'Aktif',
    keterangan: 'Koordinator utama untuk operasional lapangan di Sulawesi Selatan',
    createdAt: '2025-01-15T08:00:00.000Z', updatedAt: '2025-01-15T08:00:00.000Z',
  },
];

const initialVendors: VendorRegister[] = [
  {
    id: generateId(), vendorId: 'MRV-VEN-SUL-2025-001', tglRegistrasi: '2025-02-01',
    namaSupplier: 'CV Sulawesi Makmur Jaya', pic: 'Haji Abdul Rahman',
    provinsi: 'Sulawesi Selatan', komoditas: 'Kopi Robusta, Kelapa',
    kapasitasBulan: '50 Ton', noHp: '081234567890', hasilAudit: 'Lulus',
    status: 'Aktif', keterangan: 'Supplier utama kopi robusta dari Sulawesi Selatan',
    createdAt: '2025-02-01T08:00:00.000Z',
  },
];

const initialProjects: ProjectEntry[] = [
  {
    id: generateId(), namaProyek: 'Proyek Kopi Specialty Sulawesi',
    deskripsi: 'Pengembangan dan ekspor kopi specialty dari Sulawesi Selatan',
    kodeProyek: 'PROKOS25001', minInvestor: 1, maxInvestor: 5,
    minInvestasiPerInvestor: 50000000, maxInvestasiPerInvestor: 500000000,
    totalNilaiProyek: 1000000000, omzetKotor: 2000000000,
    biayaOperasional: 1500000000, labaBersih: 500000000,
    statusProyek: 'Berjalan', tanggalMulai: '2025-01-01', tanggalSelesai: '2025-12-31',
    createdAt: '2025-01-01T08:00:00.000Z', updatedAt: '2025-01-01T08:00:00.000Z',
  },
];

// ==================== STORE ====================

export const useAdminStore = create<AdminStore>()(
    persist(
        (set, get) => ({
          nikInternals: initialNikInternals,
          nikEksternals: initialNikEksternals,
          vendors: initialVendors,
          buyers: [],
          buyerDatabases: [],
          kontraks: [],
          permohonans: [],
          permintaanBarangs: [],
          logPenjualans: [],
          logPembelians: [],
          logBebans: [],
          logGajiHonors: [],
          logAsets: [],
          invoiceRegisters: [],
          pembayaranRegisters: [],
          payrollEntries: [],
          companyLogo: '',
          projects: initialProjects,
          investors: [],
          investorContracts: [],
          agtEntries: [],
          isSyncing: false,
          activePage: 'dashboard',
          setActivePage: (page) => set({ activePage: page }),

          // ==================== SYNC TO NEON ====================
          syncToNeon: async () => {
            if (get().isSyncing) return false;
            set({ isSyncing: true });
            try {
              const state = get();
              const allData = {
                nikInternals: state.nikInternals || [],
                nikEksternals: state.nikEksternals || [],
                vendors: state.vendors || [],
                buyers: state.buyers || [],
                buyerDatabases: state.buyerDatabases || [],
                kontraks: state.kontraks || [],
                projects: state.projects || [],
                investors: state.investors || [],
                investorContracts: state.investorContracts || [],
                agtEntries: state.agtEntries || [],
              };

              console.log('📤 Syncing to Neon:', JSON.stringify({
                nikInternals: allData.nikInternals.length,
                nikEksternals: allData.nikEksternals.length,
                vendors: allData.vendors.length,
                buyers: allData.buyers.length,
                buyerDatabases: allData.buyerDatabases.length,
                kontraks: allData.kontraks.length,
                projects: allData.projects.length,
                investors: allData.investors.length,
                investorContracts: allData.investorContracts.length,
                agtEntries: allData.agtEntries.length,
              }));

              const res = await fetch('/api/data/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'all', data: allData }),
              });

              if (!res.ok) {
                const errText = await res.text();
                console.error('❌ Sync failed:', res.status, errText);
                set({ isSyncing: false });
                return false;
              }

              const result = await res.json();
              console.log('✅ Sync result:', result);
              set({ isSyncing: false });
              return result.success || false;
            } catch (error) {
              console.error('❌ Sync error:', error);
              set({ isSyncing: false });
              return false;
            }
          },

          // ==================== LOAD FROM NEON ====================
          loadFromNeon: async () => {
            try {
              const res = await fetch('/api/data/sync');
              if (!res.ok) return false;
              const result = await res.json();
              if (result.success && result.data) {
                const d = result.data;
                set({
                  nikInternals: d.nikInternals?.length ? d.nikInternals : get().nikInternals,
                  nikEksternals: d.nikEksternals?.length ? d.nikEksternals : get().nikEksternals,
                  vendors: d.vendors?.length ? d.vendors : get().vendors,
                  buyers: d.buyers?.length ? d.buyers : get().buyers,
                  buyerDatabases: d.buyerDatabases?.length ? d.buyerDatabases : get().buyerDatabases,
                  kontraks: d.kontraks?.length ? d.kontraks : get().kontraks,
                  projects: d.projects?.length ? d.projects : get().projects,
                  investors: d.investors?.length ? d.investors : get().investors,
                  investorContracts: d.investorContracts?.length ? d.investorContracts : get().investorContracts,
                  agtEntries: d.agtEntries?.length ? d.agtEntries : get().agtEntries,
                });
                return true;
              }
              return false;
            } catch { return false; }
          },

          // ==================== CRUD OPERATIONS ====================
          addNikInternal: (data) => {
            const nik = generateNikInternal(get().nikInternals, data.jabatanDivisi);
            const now = new Date().toISOString();
            const newItem: NikInternal = { ...data, id: generateId(), nik, createdAt: now, updatedAt: now };
            set((s) => ({ nikInternals: [...s.nikInternals, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateNikInternal: (id, data) => {
            set((s) => ({ nikInternals: s.nikInternals.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteNikInternal: (id) => {
            set((s) => ({ nikInternals: s.nikInternals.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addNikEksternal: (data) => {
            const nik = generateNikEksternal(get().nikEksternals, data.klasifikasi);
            const now = new Date().toISOString();
            const newItem: NikEksternal = { ...data, id: generateId(), nik, createdAt: now, updatedAt: now };
            set((s) => ({ nikEksternals: [...s.nikEksternals, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateNikEksternal: (id, data) => {
            set((s) => ({ nikEksternals: s.nikEksternals.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteNikEksternal: (id) => {
            set((s) => ({ nikEksternals: s.nikEksternals.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addVendor: (data) => {
            const vendorId = generateVendorId(get().vendors, data.provinsi);
            const now = new Date().toISOString();
            const newItem: VendorRegister = { ...data, id: generateId(), vendorId, createdAt: now };
            set((s) => ({ vendors: [...s.vendors, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateVendor: (id, data) => {
            set((s) => ({ vendors: s.vendors.map(i => i.id === id ? { ...i, ...data } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteVendor: (id) => {
            set((s) => ({ vendors: s.vendors.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addBuyer: (data) => {
            const buyerId = generateBuyerId(get().buyers, data.negara);
            const now = new Date().toISOString();
            const newItem: BuyerRegister = { ...data, id: generateId(), buyerId, createdAt: now };
            set((s) => ({ buyers: [...s.buyers, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateBuyer: (id, data) => {
            set((s) => ({ buyers: s.buyers.map(i => i.id === id ? { ...i, ...data } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteBuyer: (id) => {
            set((s) => ({ buyers: s.buyers.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addBuyerDatabase: (data) => {
            const now = new Date().toISOString();
            const newItem: BuyerDatabaseEntry = { ...data, id: generateId(), createdAt: now, updatedAt: now };
            set((s) => ({ buyerDatabases: [...s.buyerDatabases, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateBuyerDatabase: (id, data) => {
            set((s) => ({ buyerDatabases: s.buyerDatabases.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteBuyerDatabase: (id) => {
            set((s) => ({ buyerDatabases: s.buyerDatabases.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addKontrak: (data) => {
            const now = new Date().toISOString();
            const newItem: KontrakRegister = { ...data, id: generateId(), createdAt: now, updatedAt: now };
            set((s) => ({ kontraks: [...s.kontraks, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateKontrak: (id, data) => {
            set((s) => ({ kontraks: s.kontraks.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteKontrak: (id) => {
            set((s) => ({ kontraks: s.kontraks.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addProject: (data) => {
            const kodeProyek = generateKodeProyek(get().projects, data.namaProyek);
            const now = new Date().toISOString();
            const labaBersih = (data.omzetKotor || 0) - (data.biayaOperasional || 0);
            const newItem: ProjectEntry = { ...data, id: generateId(), kodeProyek, labaBersih, createdAt: now, updatedAt: now };
            set((s) => ({ projects: [...s.projects, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateProject: (id, data) => {
            set((s) => ({ projects: s.projects.map(i => { if (i.id !== id) return i; const u = { ...i, ...data, updatedAt: new Date().toISOString() }; if (data.omzetKotor !== undefined || data.biayaOperasional !== undefined) u.labaBersih = (u.omzetKotor || 0) - (u.biayaOperasional || 0); return u; }) }));
            get().syncToNeon().catch(() => {});
          },
          deleteProject: (id) => {
            set((s) => ({ projects: s.projects.filter(i => i.id !== id), investors: s.investors.filter(i => i.projectId !== id), investorContracts: s.investorContracts.filter(i => i.projectId !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addInvestor: (data) => {
            const project = get().projects.find(p => p.id === data.projectId);
            const nomorSurat = project ? generateNomorSuratInvestor(project.kodeProyek, get().investors) : `INV/UNKNOWN/${BULAN_ROMawi[new Date().getMonth()]}/${new Date().getFullYear()}/001`;
            const now = new Date().toISOString();
            const newItem: InvestorEntry = { ...data, id: generateId(), nomorSurat, createdAt: now, updatedAt: now };
            set((s) => ({ investors: [...s.investors, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateInvestor: (id, data) => {
            set((s) => ({ investors: s.investors.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteInvestor: (id) => {
            set((s) => ({ investors: s.investors.filter(i => i.id !== id), investorContracts: s.investorContracts.filter(i => i.investorId !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addInvestorContract: (data) => {
            const project = get().projects.find(p => p.id === data.projectId);
            const investor = get().investors.find(inv => inv.id === data.investorId);
            const nomorKontrak = project ? generateNomorKontrakInvestor(project.kodeProyek, get().investorContracts) : `KTR/UNKNOWN/001/${BULAN_ROMawi[new Date().getMonth()]}/${new Date().getFullYear()}`;
            const now = new Date().toISOString();
            const newItem: InvestorContract = { ...data, id: generateId(), nomorKontrak, nomorSuratInvestor: investor?.nomorSurat || '', createdAt: now, updatedAt: now };
            set((s) => ({ investorContracts: [...s.investorContracts, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateInvestorContract: (id, data) => {
            set((s) => ({ investorContracts: s.investorContracts.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteInvestorContract: (id) => {
            set((s) => ({ investorContracts: s.investorContracts.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          addAgtEntry: (data) => {
            const kodeAgt = generateKodeAgt(get().agtEntries);
            const now = new Date().toISOString();
            const newItem: AgtEntry = { ...data, id: generateId(), kodeAgt, createdAt: now, updatedAt: now };
            set((s) => ({ agtEntries: [...s.agtEntries, newItem] }));
            get().syncToNeon().catch(() => {});
            return newItem;
          },
          updateAgtEntry: (id, data) => {
            set((s) => ({ agtEntries: s.agtEntries.map(i => i.id === id ? { ...i, ...data, updatedAt: new Date().toISOString() } : i) }));
            get().syncToNeon().catch(() => {});
          },
          deleteAgtEntry: (id) => {
            set((s) => ({ agtEntries: s.agtEntries.filter(i => i.id !== id) }));
            get().syncToNeon().catch(() => {});
          },

          exportAllData: () => JSON.stringify(get(), null, 2),
          importAllData: (json: string) => {
            try {
              const data = JSON.parse(json);
              if (data.nikInternals) set({ nikInternals: data.nikInternals });
              if (data.nikEksternals) set({ nikEksternals: data.nikEksternals });
              if (data.vendors) set({ vendors: data.vendors });
              if (data.buyers) set({ buyers: data.buyers });
              if (data.buyerDatabases) set({ buyerDatabases: data.buyerDatabases });
              if (data.kontraks) set({ kontraks: data.kontraks });
              if (data.projects) set({ projects: data.projects });
              if (data.investors) set({ investors: data.investors });
              if (data.investorContracts) set({ investorContracts: data.investorContracts });
              if (data.agtEntries) set({ agtEntries: data.agtEntries });
              get().syncToNeon().catch(() => {});
              return true;
            } catch { return false; }
          },
          resetAllData: () => set({
            nikInternals: initialNikInternals, nikEksternals: initialNikEksternals,
            vendors: initialVendors, buyers: [], buyerDatabases: [],
            kontraks: [], projects: initialProjects,
            investors: [], investorContracts: [], agtEntries: [],
            activePage: 'dashboard',
          }),
        }),
        {
          name: 'marviro-admin-storage',
          partialize: (state) => ({
            nikInternals: state.nikInternals, nikEksternals: state.nikEksternals,
            vendors: state.vendors, buyers: state.buyers,
            buyerDatabases: state.buyerDatabases, kontraks: state.kontraks,
            projects: state.projects, investors: state.investors,
            investorContracts: state.investorContracts, agtEntries: state.agtEntries,
          }),
        }
    )
);