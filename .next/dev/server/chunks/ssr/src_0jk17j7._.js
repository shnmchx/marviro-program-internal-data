module.exports = [
"[project]/src/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AGT_STATUS_OPTIONS",
    ()=>AGT_STATUS_OPTIONS,
    "BULAN_ROMawi",
    ()=>BULAN_ROMawi,
    "BUYER_STATUS_OPTIONS",
    ()=>BUYER_STATUS_OPTIONS,
    "CARA_PEMBAYARAN_OPTIONS",
    ()=>CARA_PEMBAYARAN_OPTIONS,
    "CONTRACT_STATUS_OPTIONS",
    ()=>CONTRACT_STATUS_OPTIONS,
    "DIVISI_CODE_MAP",
    ()=>DIVISI_CODE_MAP,
    "INVESTOR_STATUS_OPTIONS",
    ()=>INVESTOR_STATUS_OPTIONS,
    "JABATAN_DIVISI_OPTIONS",
    ()=>JABATAN_DIVISI_OPTIONS,
    "KLASIFIKASI_OPTIONS",
    ()=>KLASIFIKASI_OPTIONS,
    "KONTRAK_JENIS_OPTIONS",
    ()=>KONTRAK_JENIS_OPTIONS,
    "KONTRAK_KLASIFIKASI_OPTIONS",
    ()=>KONTRAK_KLASIFIKASI_OPTIONS,
    "KONTRAK_STATUS_OPTIONS",
    ()=>KONTRAK_STATUS_OPTIONS,
    "MONTH_NAMES",
    ()=>MONTH_NAMES,
    "NIK_STATUS_OPTIONS",
    ()=>NIK_STATUS_OPTIONS,
    "PROJECT_STATUS_OPTIONS",
    ()=>PROJECT_STATUS_OPTIONS,
    "formatRupiah",
    ()=>formatRupiah,
    "useAdminStore",
    ()=>useAdminStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const BUYER_STATUS_OPTIONS = [
    {
        value: 'New Lead',
        label: 'New Lead',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Follow Up',
        label: 'Follow Up',
        color: 'bg-cyan-100 text-cyan-700'
    },
    {
        value: 'Negotiation',
        label: 'Negotiation',
        color: 'bg-yellow-100 text-yellow-700'
    },
    {
        value: 'Belum Closing',
        label: 'Belum Closing',
        color: 'bg-orange-100 text-orange-700'
    },
    {
        value: 'Closing',
        label: 'Closing',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Continue',
        label: 'Continue',
        color: 'bg-teal-100 text-teal-700'
    },
    {
        value: 'Scam',
        label: 'Scam',
        color: 'bg-red-100 text-red-700'
    },
    {
        value: 'Rejected',
        label: 'Rejected',
        color: 'bg-gray-200 text-gray-700'
    },
    {
        value: 'No Response',
        label: 'No Response',
        color: 'bg-purple-100 text-purple-700'
    }
];
const CARA_PEMBAYARAN_OPTIONS = [
    {
        value: 'Transfer',
        label: 'Transfer Bank'
    },
    {
        value: 'Cash',
        label: 'Tunai'
    },
    {
        value: 'Bertahap',
        label: 'Bertahap'
    }
];
const CONTRACT_STATUS_OPTIONS = [
    {
        value: 'Draft',
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'Aktif',
        label: 'Aktif',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Terminasi',
        label: 'Terminasi',
        color: 'bg-red-100 text-red-700'
    },
    {
        value: 'Diperpanjang',
        label: 'Diperpanjang',
        color: 'bg-indigo-100 text-indigo-700'
    }
];
const KONTRAK_STATUS_OPTIONS = [
    {
        value: 'Draft',
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'Proses TTD',
        label: 'Proses Tanda Tangan',
        color: 'bg-yellow-100 text-yellow-700'
    },
    {
        value: 'Aktif',
        label: 'Aktif / Terbit',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Ditunda',
        label: 'Ditunda',
        color: 'bg-orange-100 text-orange-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Dibatalkan',
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-700'
    }
];
const KONTRAK_JENIS_OPTIONS = [
    {
        value: 'Buyer',
        label: 'Buyer',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Supplier',
        label: 'Supplier',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Investor',
        label: 'Investor',
        color: 'bg-violet-100 text-violet-700'
    },
    {
        value: 'AGT/Trader',
        label: 'AGT / Trader',
        color: 'bg-amber-100 text-amber-700'
    },
    {
        value: 'Internal',
        label: 'Internal',
        color: 'bg-slate-100 text-slate-700'
    }
];
const INVESTOR_STATUS_OPTIONS = [
    {
        value: 'Aktif',
        label: 'Aktif',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Diperpanjang',
        label: 'Diperpanjang',
        color: 'bg-indigo-100 text-indigo-700'
    },
    {
        value: 'Terminasi',
        label: 'Terminasi',
        color: 'bg-red-100 text-red-700'
    }
];
const PROJECT_STATUS_OPTIONS = [
    {
        value: 'Persiapan',
        label: 'Persiapan',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'Berjalan',
        label: 'Berjalan',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'Ditunda',
        label: 'Ditunda',
        color: 'bg-orange-100 text-orange-700'
    }
];
const AGT_STATUS_OPTIONS = [
    {
        value: 'Aktif',
        label: 'Aktif',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Evaluasi',
        label: 'Evaluasi',
        color: 'bg-yellow-100 text-yellow-700'
    },
    {
        value: 'Ditangguhkan',
        label: 'Ditangguhkan',
        color: 'bg-orange-100 text-orange-700'
    },
    {
        value: 'Tidak Aktif',
        label: 'Tidak Aktif',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700'
    }
];
const NIK_STATUS_OPTIONS = [
    {
        value: 'Aktif',
        label: 'Aktif',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'Tidak Aktif',
        label: 'Tidak Aktif',
        color: 'bg-gray-100 text-gray-700'
    },
    {
        value: 'Ditangguhkan',
        label: 'Ditangguhkan',
        color: 'bg-orange-100 text-orange-700'
    },
    {
        value: 'Selesai',
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700'
    }
];
const MONTH_NAMES = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
];
const BULAN_ROMawi = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII'
];
const JABATAN_DIVISI_OPTIONS = [
    'Direktur Utama',
    'Komisaris',
    'Komisaris 2',
    'Komisaris 3',
    'Komisaris 4',
    'Finance Manager',
    'Accounting',
    'Admin Operasional',
    'HR/Payroll',
    'Marketing',
    'Sales',
    'Operasional',
    'Gudang/QC',
    'IT/Digital',
    'Driver/Helper'
];
const DIVISI_CODE_MAP = {
    'Direktur Utama': 'DIR',
    'Komisaris': 'KOM1',
    'Komisaris 2': 'KOM2',
    'Komisaris 3': 'KOM3',
    'Komisaris 4': 'KOM4',
    'Finance Manager': 'FIN',
    'Accounting': 'ACC',
    'Admin Operasional': 'ADM',
    'HR/Payroll': 'HR',
    'Marketing': 'MKT',
    'Sales': 'SLS',
    'Operasional': 'OPS',
    'Gudang/QC': 'GUD',
    'IT/Digital': 'IT',
    'Driver/Helper': 'DRV'
};
const KLASIFIKASI_OPTIONS = [
    {
        value: 'OPS',
        label: 'OPS - Operasional Terintegrasi'
    },
    {
        value: 'CON',
        label: 'CON - Penghubung Bisnis'
    },
    {
        value: 'QC',
        label: 'QC - Quality Control'
    },
    {
        value: 'BOR',
        label: 'BOR - Borongan Produksi'
    },
    {
        value: 'BPK',
        label: 'BPK - Borongan Packing'
    },
    {
        value: 'BLG',
        label: 'BLG - Borongan Logistik'
    },
    {
        value: 'AGT',
        label: 'AGT - Agen Penjualan'
    },
    {
        value: 'MDT',
        label: 'MDT - Mediator'
    },
    {
        value: 'FOP',
        label: 'FOP - Fee Operasional'
    },
    {
        value: 'KSL',
        label: 'KSL - Konsultan Lepas'
    }
];
const KONTRAK_KLASIFIKASI_OPTIONS = [
    {
        value: 'BUY',
        label: 'BUY - Buyer',
        color: 'bg-blue-100 text-blue-700'
    },
    {
        value: 'SUP',
        label: 'SUP - Supplier',
        color: 'bg-emerald-100 text-emerald-700'
    },
    {
        value: 'INV',
        label: 'INV - Investor',
        color: 'bg-violet-100 text-violet-700'
    },
    {
        value: 'AGT',
        label: 'AGT - Agen/Trader',
        color: 'bg-amber-100 text-amber-700'
    },
    {
        value: 'INT',
        label: 'INT - Internal',
        color: 'bg-slate-100 text-slate-700'
    }
];
const formatRupiah = (val)=>{
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(val);
};
// ==================== HELPER FUNCTIONS ====================
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}
function padNum(n, len = 3) {
    return String(n).padStart(len, '0');
}
function generateNikInternal(nikList, jabatanDivisi) {
    const code = DIVISI_CODE_MAP[jabatanDivisi] || 'XXX';
    const existing = nikList.filter((n)=>n.nik.startsWith(`MRV-${code}-INT-`));
    const maxSeq = existing.reduce((max, n)=>{
        const parts = n.nik.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `MRV-${code}-INT-${padNum(maxSeq + 1)}`;
}
function generateNikEksternal(nikList, klasifikasi) {
    const year = new Date().getFullYear();
    const prefix = `MRV-EXT-${klasifikasi}-${year}-`;
    const existing = nikList.filter((n)=>n.nik.startsWith(prefix));
    const maxSeq = existing.reduce((max, n)=>{
        const parts = n.nik.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${padNum(maxSeq + 1)}`;
}
function generateVendorId(vendorList, provinsi) {
    const year = new Date().getFullYear();
    const provCode = provinsi.substring(0, 3).toUpperCase();
    const prefix = `MRV-VEN-${provCode}-${year}-`;
    const existing = vendorList.filter((v)=>v.vendorId.startsWith(prefix));
    const maxSeq = existing.reduce((max, v)=>{
        const parts = v.vendorId.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${padNum(maxSeq + 1)}`;
}
function generateBuyerId(buyerList, negara) {
    const year = new Date().getFullYear();
    const countryCode = negara.substring(0, 3).toUpperCase();
    const prefix = `MRV-BID-${countryCode}-${year}-`;
    const existing = buyerList.filter((b)=>b.buyerId.startsWith(prefix));
    const maxSeq = existing.reduce((max, b)=>{
        const parts = b.buyerId.split('-');
        const seq = parseInt(parts[parts.length - 1], 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${padNum(maxSeq + 1)}`;
}
function generatePermintaanBarangNomor(list) {
    const year = new Date().getFullYear();
    const prefix = `PB-MRV-${year}-`;
    const existing = list.filter((p)=>p.nomor.startsWith(prefix));
    const maxSeq = existing.reduce((max, p)=>{
        const seq = parseInt(p.nomor.split('-').pop() || '0', 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${padNum(maxSeq + 1)}`;
}
function generateInvoiceNomor(list) {
    const now = new Date();
    const year = now.getFullYear();
    const month = padNum(now.getMonth() + 1, 2);
    const prefix = `INV/MRV/EXP/${year}/${month}/`;
    const existing = list.filter((i)=>i.nomorInvoice.startsWith(prefix));
    const maxSeq = existing.reduce((max, i)=>{
        const parts = i.nomorInvoice.split('/');
        const seq = parseInt(parts[parts.length - 1], 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${padNum(maxSeq + 1)}`;
}
function generateKodeProyek(projectList, namaProyek) {
    const words = namaProyek.trim().split(/\s+/);
    const prefix = words.slice(0, 2).map((w)=>w.substring(0, 3).toUpperCase()).join('');
    const year = new Date().getFullYear().toString().slice(-2);
    const existing = projectList.filter((p)=>p.kodeProyek.startsWith(prefix));
    const seq = padNum(existing.length + 1);
    return `${prefix}${year}${seq}`;
}
function generateNomorSuratInvestor(kodeProyek, investorList) {
    const now = new Date();
    const bulanRomawi = BULAN_ROMawi[now.getMonth()];
    const tahun = now.getFullYear();
    const investorsBulanIni = investorList.filter((inv)=>{
        return inv.nomorSurat.includes(kodeProyek) && inv.nomorSurat.includes(`/${bulanRomawi}/`) && inv.nomorSurat.includes(`/${tahun}/`);
    });
    const nomorUrut = padNum(investorsBulanIni.length + 1);
    return `INV/${kodeProyek}/${bulanRomawi}/${tahun}/${nomorUrut}`;
}
function generateNomorKontrakInvestor(kodeProyek, contractList) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `KTR/INV/MRV/${kodeProyek}/${year}/${month}/`;
    const existing = contractList.filter((c)=>c.nomorKontrak.startsWith(prefix));
    const maxSeq = existing.reduce((max, c)=>{
        const parts = c.nomorKontrak.split('/');
        const seq = parseInt(parts[parts.length - 1] || '0', 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}
function generateKodeAgt(agtList) {
    const year = new Date().getFullYear();
    const prefix = `AGT-MRV-${year}-`;
    const existing = agtList.filter((a)=>a.kodeAgt.startsWith(prefix));
    const maxSeq = existing.reduce((max, a)=>{
        const seq = parseInt(a.kodeAgt.split('-').pop() || '0', 10);
        return isNaN(seq) ? max : Math.max(max, seq);
    }, 0);
    return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}
// ==================== INITIAL DATA ====================
const initialNikInternals = [
    {
        id: generateId(),
        nik: 'MRV-DIR-INT-001',
        namaLengkap: 'Muhammad Rizky Pratama',
        jabatanDivisi: 'Direktur Utama',
        status: 'Aktif',
        tipeHubungan: 'Pemegang Saham',
        tglMulai: '2024-01-01',
        tglBerakhir: '2028-12-31',
        payroll: 'Ya',
        keterangan: 'Pendiri dan Direktur Utama PT Marviro Ekspor Indonesia',
        createdAt: '2024-01-01T08:00:00.000Z',
        updatedAt: '2024-01-01T08:00:00.000Z'
    },
    {
        id: generateId(),
        nik: 'MRV-FIN-INT-001',
        namaLengkap: 'Siti Aisyah Putri',
        jabatanDivisi: 'Finance Manager',
        status: 'Aktif',
        tipeHubungan: 'Karyawan Tetap',
        tglMulai: '2024-03-01',
        tglBerakhir: '2026-02-28',
        payroll: 'Ya',
        keterangan: 'Bertanggung jawab atas manajemen keuangan perusahaan',
        createdAt: '2024-03-01T08:00:00.000Z',
        updatedAt: '2024-03-01T08:00:00.000Z'
    }
];
const initialNikEksternals = [
    {
        id: generateId(),
        nik: 'MRV-EXT-OPS-2025-001',
        namaLengkap: 'Ahmad Fadillah',
        klasifikasi: 'OPS',
        peran: 'Koordinator Operasional Lapangan',
        dasarKontrak: 'Perjanjian Kerja Sama Operasional',
        nomorKontrak: 'PKS-OPS-2025-001',
        tglMulai: '2025-01-15',
        tglBerakhir: '2025-12-31',
        skemaImbalan: 'Bulanan',
        pajak: 'PPH 23',
        status: 'Aktif',
        keterangan: 'Koordinator utama untuk operasional lapangan di Sulawesi Selatan',
        createdAt: '2025-01-15T08:00:00.000Z',
        updatedAt: '2025-01-15T08:00:00.000Z'
    }
];
const initialVendors = [
    {
        id: generateId(),
        vendorId: 'MRV-VEN-SUL-2025-001',
        tglRegistrasi: '2025-02-01',
        namaSupplier: 'CV Sulawesi Makmur Jaya',
        pic: 'Haji Abdul Rahman',
        provinsi: 'Sulawesi Selatan',
        komoditas: 'Kopi Robusta, Kelapa',
        kapasitasBulan: '50 Ton',
        noHp: '081234567890',
        hasilAudit: 'Lulus',
        status: 'Aktif',
        keterangan: 'Supplier utama kopi robusta dari Sulawesi Selatan',
        createdAt: '2025-02-01T08:00:00.000Z'
    }
];
const initialProjects = [
    {
        id: generateId(),
        namaProyek: 'Proyek Kopi Specialty Sulawesi',
        deskripsi: 'Pengembangan dan ekspor kopi specialty dari Sulawesi Selatan',
        kodeProyek: 'PROKOS25001',
        minInvestor: 1,
        maxInvestor: 5,
        minInvestasiPerInvestor: 50000000,
        maxInvestasiPerInvestor: 500000000,
        totalNilaiProyek: 1000000000,
        omzetKotor: 2000000000,
        biayaOperasional: 1500000000,
        labaBersih: 500000000,
        statusProyek: 'Berjalan',
        tanggalMulai: '2025-01-01',
        tanggalSelesai: '2025-12-31',
        createdAt: '2025-01-01T08:00:00.000Z',
        updatedAt: '2025-01-01T08:00:00.000Z'
    }
];
const useAdminStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
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
        setActivePage: (page)=>set({
                activePage: page
            }),
        // ==================== SYNC TO NEON ====================
        syncToNeon: async ()=>{
            if (get().isSyncing) return false;
            set({
                isSyncing: true
            });
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
                    agtEntries: state.agtEntries || []
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
                    agtEntries: allData.agtEntries.length
                }));
                const res = await fetch('/api/data/sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        type: 'all',
                        data: allData
                    })
                });
                if (!res.ok) {
                    const errText = await res.text();
                    console.error('❌ Sync failed:', res.status, errText);
                    set({
                        isSyncing: false
                    });
                    return false;
                }
                const result = await res.json();
                console.log('✅ Sync result:', result);
                set({
                    isSyncing: false
                });
                return result.success || false;
            } catch (error) {
                console.error('❌ Sync error:', error);
                set({
                    isSyncing: false
                });
                return false;
            }
        },
        // ==================== LOAD FROM NEON ====================
        loadFromNeon: async ()=>{
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
                        agtEntries: d.agtEntries?.length ? d.agtEntries : get().agtEntries
                    });
                    return true;
                }
                return false;
            } catch  {
                return false;
            }
        },
        // ==================== CRUD OPERATIONS ====================
        addNikInternal: (data)=>{
            const nik = generateNikInternal(get().nikInternals, data.jabatanDivisi);
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                nik,
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    nikInternals: [
                        ...s.nikInternals,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateNikInternal: (id, data)=>{
            set((s)=>({
                    nikInternals: s.nikInternals.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteNikInternal: (id)=>{
            set((s)=>({
                    nikInternals: s.nikInternals.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addNikEksternal: (data)=>{
            const nik = generateNikEksternal(get().nikEksternals, data.klasifikasi);
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                nik,
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    nikEksternals: [
                        ...s.nikEksternals,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateNikEksternal: (id, data)=>{
            set((s)=>({
                    nikEksternals: s.nikEksternals.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteNikEksternal: (id)=>{
            set((s)=>({
                    nikEksternals: s.nikEksternals.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addVendor: (data)=>{
            const vendorId = generateVendorId(get().vendors, data.provinsi);
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                vendorId,
                createdAt: now
            };
            set((s)=>({
                    vendors: [
                        ...s.vendors,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateVendor: (id, data)=>{
            set((s)=>({
                    vendors: s.vendors.map((i)=>i.id === id ? {
                            ...i,
                            ...data
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteVendor: (id)=>{
            set((s)=>({
                    vendors: s.vendors.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addBuyer: (data)=>{
            const buyerId = generateBuyerId(get().buyers, data.negara);
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                buyerId,
                createdAt: now
            };
            set((s)=>({
                    buyers: [
                        ...s.buyers,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateBuyer: (id, data)=>{
            set((s)=>({
                    buyers: s.buyers.map((i)=>i.id === id ? {
                            ...i,
                            ...data
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteBuyer: (id)=>{
            set((s)=>({
                    buyers: s.buyers.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addBuyerDatabase: (data)=>{
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    buyerDatabases: [
                        ...s.buyerDatabases,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateBuyerDatabase: (id, data)=>{
            set((s)=>({
                    buyerDatabases: s.buyerDatabases.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteBuyerDatabase: (id)=>{
            set((s)=>({
                    buyerDatabases: s.buyerDatabases.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addKontrak: (data)=>{
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    kontraks: [
                        ...s.kontraks,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateKontrak: (id, data)=>{
            set((s)=>({
                    kontraks: s.kontraks.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteKontrak: (id)=>{
            set((s)=>({
                    kontraks: s.kontraks.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addProject: (data)=>{
            const kodeProyek = generateKodeProyek(get().projects, data.namaProyek);
            const now = new Date().toISOString();
            const labaBersih = (data.omzetKotor || 0) - (data.biayaOperasional || 0);
            const newItem = {
                ...data,
                id: generateId(),
                kodeProyek,
                labaBersih,
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    projects: [
                        ...s.projects,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateProject: (id, data)=>{
            set((s)=>({
                    projects: s.projects.map((i)=>{
                        if (i.id !== id) return i;
                        const u = {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        };
                        if (data.omzetKotor !== undefined || data.biayaOperasional !== undefined) u.labaBersih = (u.omzetKotor || 0) - (u.biayaOperasional || 0);
                        return u;
                    })
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteProject: (id)=>{
            set((s)=>({
                    projects: s.projects.filter((i)=>i.id !== id),
                    investors: s.investors.filter((i)=>i.projectId !== id),
                    investorContracts: s.investorContracts.filter((i)=>i.projectId !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addInvestor: (data)=>{
            const project = get().projects.find((p)=>p.id === data.projectId);
            const nomorSurat = project ? generateNomorSuratInvestor(project.kodeProyek, get().investors) : `INV/UNKNOWN/${BULAN_ROMawi[new Date().getMonth()]}/${new Date().getFullYear()}/001`;
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                nomorSurat,
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    investors: [
                        ...s.investors,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateInvestor: (id, data)=>{
            set((s)=>({
                    investors: s.investors.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteInvestor: (id)=>{
            set((s)=>({
                    investors: s.investors.filter((i)=>i.id !== id),
                    investorContracts: s.investorContracts.filter((i)=>i.investorId !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addInvestorContract: (data)=>{
            const project = get().projects.find((p)=>p.id === data.projectId);
            const investor = get().investors.find((inv)=>inv.id === data.investorId);
            const nomorKontrak = project ? generateNomorKontrakInvestor(project.kodeProyek, get().investorContracts) : `KTR/UNKNOWN/001/${BULAN_ROMawi[new Date().getMonth()]}/${new Date().getFullYear()}`;
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                nomorKontrak,
                nomorSuratInvestor: investor?.nomorSurat || '',
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    investorContracts: [
                        ...s.investorContracts,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateInvestorContract: (id, data)=>{
            set((s)=>({
                    investorContracts: s.investorContracts.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteInvestorContract: (id)=>{
            set((s)=>({
                    investorContracts: s.investorContracts.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        addAgtEntry: (data)=>{
            const kodeAgt = generateKodeAgt(get().agtEntries);
            const now = new Date().toISOString();
            const newItem = {
                ...data,
                id: generateId(),
                kodeAgt,
                createdAt: now,
                updatedAt: now
            };
            set((s)=>({
                    agtEntries: [
                        ...s.agtEntries,
                        newItem
                    ]
                }));
            get().syncToNeon().catch(()=>{});
            return newItem;
        },
        updateAgtEntry: (id, data)=>{
            set((s)=>({
                    agtEntries: s.agtEntries.map((i)=>i.id === id ? {
                            ...i,
                            ...data,
                            updatedAt: new Date().toISOString()
                        } : i)
                }));
            get().syncToNeon().catch(()=>{});
        },
        deleteAgtEntry: (id)=>{
            set((s)=>({
                    agtEntries: s.agtEntries.filter((i)=>i.id !== id)
                }));
            get().syncToNeon().catch(()=>{});
        },
        exportAllData: ()=>JSON.stringify(get(), null, 2),
        importAllData: (json)=>{
            try {
                const data = JSON.parse(json);
                if (data.nikInternals) set({
                    nikInternals: data.nikInternals
                });
                if (data.nikEksternals) set({
                    nikEksternals: data.nikEksternals
                });
                if (data.vendors) set({
                    vendors: data.vendors
                });
                if (data.buyers) set({
                    buyers: data.buyers
                });
                if (data.buyerDatabases) set({
                    buyerDatabases: data.buyerDatabases
                });
                if (data.kontraks) set({
                    kontraks: data.kontraks
                });
                if (data.projects) set({
                    projects: data.projects
                });
                if (data.investors) set({
                    investors: data.investors
                });
                if (data.investorContracts) set({
                    investorContracts: data.investorContracts
                });
                if (data.agtEntries) set({
                    agtEntries: data.agtEntries
                });
                get().syncToNeon().catch(()=>{});
                return true;
            } catch  {
                return false;
            }
        },
        resetAllData: ()=>set({
                nikInternals: initialNikInternals,
                nikEksternals: initialNikEksternals,
                vendors: initialVendors,
                buyers: [],
                buyerDatabases: [],
                kontraks: [],
                projects: initialProjects,
                investors: [],
                investorContracts: [],
                agtEntries: [],
                activePage: 'dashboard'
            })
    }), {
    name: 'marviro-admin-storage',
    partialize: (state)=>({
            nikInternals: state.nikInternals,
            nikEksternals: state.nikEksternals,
            vendors: state.vendors,
            buyers: state.buyers,
            buyerDatabases: state.buyerDatabases,
            kontraks: state.kontraks,
            projects: state.projects,
            investors: state.investors,
            investorContracts: state.investorContracts,
            agtEntries: state.agtEntries
        })
}));
}),
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/hooks/use-mobile.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsMobile",
    ()=>useIsMobile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    const [isMobile, setIsMobile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](undefined);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
        const onChange = ()=>{
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener("change", onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return ()=>mql.removeEventListener("change", onChange);
    }, []);
    return !!isMobile;
}
}),
"[project]/src/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/dashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$nik$2d$internal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/nik-internal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$nik$2d$eksternal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/nik-eksternal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$vendor$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/vendor-register.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$buyer$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/buyer-register.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$buyer$2d$database$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/buyer-database.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$kontrak$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/kontrak-register.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$permohonan$2d$vendor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/permohonan-vendor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$permintaan$2d$barang$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/permintaan-barang.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$log$2d$transaksi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/log-transaksi.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$laporan$2d$keuangan$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/laporan-keuangan.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$payroll$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/payroll.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$register$2d$invoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/register-invoice.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$register$2d$pembayaran$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/register-pembayaran.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$agt$2d$management$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/agt-management.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$data$2d$proyek$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/data-proyek.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$input$2d$investor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/input-investor.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/settings.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$login$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/login-modal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$sync$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/sync-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/sidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/separator.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-ssr] (ecmascript) <export default as UserPlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/store.js [app-ssr] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.js [app-ssr] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-ssr] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageSearch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-search.js [app-ssr] (ecmascript) <export default as PackageSearch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.js [app-ssr] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.js [app-ssr] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/wallet.js [app-ssr] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/receipt.js [app-ssr] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-ssr] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.js [app-ssr] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-check.js [app-ssr] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
// ==================== NAV ITEMS ====================
const navItems = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
        section: 'Menu Utama'
    },
    {
        key: 'nik-internal',
        label: 'NIK Internal',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        section: 'Menu Utama'
    },
    {
        key: 'nik-eksternal',
        label: 'NIK Eksternal',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlus$3e$__["UserPlus"],
        section: 'Menu Utama'
    },
    {
        key: 'vendor',
        label: 'Vendor',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"],
        section: 'Menu Utama'
    },
    {
        key: 'buyer',
        label: 'Buyer Register',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"],
        section: 'Data Pembeli'
    },
    {
        key: 'db-buyer',
        label: 'Database Buyer',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"],
        section: 'Data Pembeli'
    },
    {
        key: 'projects',
        label: 'Data Proyek',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"],
        section: 'Proyek & Investasi'
    },
    {
        key: 'investors-input',
        label: 'Input Investor',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"],
        section: 'Proyek & Investasi'
    },
    {
        key: 'agt-management',
        label: 'AGT / Trader',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"],
        section: 'Agen & Trader'
    },
    {
        key: 'kontrak',
        label: 'Kontrak',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
        section: 'Transaksi'
    },
    {
        key: 'permohonan',
        label: 'Permohonan',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"],
        section: 'Transaksi'
    },
    {
        key: 'permintaan-barang',
        label: 'Permintaan Barang',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageSearch$3e$__["PackageSearch"],
        section: 'Transaksi'
    },
    {
        key: 'log-transaksi',
        label: 'Log Transaksi',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"],
        section: 'Keuangan'
    },
    {
        key: 'laporan-keuangan',
        label: 'Laporan Keuangan',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"],
        section: 'Keuangan'
    },
    {
        key: 'register-invoice',
        label: 'Register Invoice',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"],
        section: 'Keuangan'
    },
    {
        key: 'register-pembayaran',
        label: 'Register Pembayaran',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"],
        section: 'Keuangan'
    },
    {
        key: 'payroll',
        label: 'Payroll',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"],
        section: 'Keuangan'
    }
];
const sections = [
    'Menu Utama',
    'Data Pembeli',
    'Proyek & Investasi',
    'Agen & Trader',
    'Transaksi',
    'Keuangan'
];
// ==================== APP SIDEBAR ====================
function AppSidebar() {
    const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAdminStore"])();
    const { activePage, setActivePage } = store;
    const permohonans = store.permohonans || [];
    const buyerDatabases = store.buyerDatabases || [];
    const invoiceRegisters = store.invoiceRegisters || [];
    const pembayaranRegisters = store.pembayaranRegisters || [];
    const investors = store.investors || [];
    const projects = store.projects || [];
    const agtEntries = store.agtEntries || [];
    const pendingCount = permohonans.filter((p)=>p.statusPermohonan === 'Pending').length;
    const invoiceBelumLunas = invoiceRegisters.filter((i)=>i.statusPembayaran === 'Belum Lunas').length;
    const pembayaranPending = pembayaranRegisters.filter((p)=>p.status === 'Pending').length;
    const activeAgtCount = agtEntries.filter((a)=>a.statusAgt === 'Aktif').length;
    const activeInvestorCount = investors.filter((inv)=>inv.statusInvestasi === 'Aktif').length;
    const activeProjectCount = projects.filter((p)=>p.statusProyek === 'Berjalan').length;
    const followUpAlertCount = (()=>{
        const now = new Date();
        return buyerDatabases.filter((b)=>{
            if ([
                'Closing',
                'Continue',
                'Scam',
                'Rejected'
            ].includes(b.status)) return false;
            if (!b.lastFollowUp) return false;
            const daysDiff = Math.floor((now.getTime() - new Date(b.lastFollowUp).getTime()) / (1000 * 60 * 60 * 24));
            if (b.status === 'New Lead' && daysDiff >= 3) return true;
            if (b.status === 'Follow Up' && daysDiff >= 5) return true;
            if (b.status === 'Negotiation' && daysDiff >= 7) return true;
            if (b.status === 'Belum Closing' && daysDiff >= 7) return true;
            if (b.status === 'No Response' && daysDiff >= 3) return true;
            if (b.nextFollowUp && new Date(b.nextFollowUp) < now) return true;
            return false;
        }).length;
    })();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Sidebar"], {
        collapsible: "icon",
        variant: "sidebar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarHeader"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 group-data-[collapsible=icon]:justify-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm",
                            children: "MRV"
                        }, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 106,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col group-data-[collapsible=icon]:hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-semibold",
                                    children: "PT Marviro"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Ekspor Indonesia"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 107,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 105,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 104,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarContent"], {
                children: [
                    sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                                    children: section
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 116,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroupContent"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                                        children: navItems.filter((n)=>n.section === section).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                                    isActive: activePage === item.key,
                                                    onClick: ()=>setActivePage(item.key),
                                                    tooltip: item.label,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 122,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 123,
                                                            columnNumber: 29
                                                        }, this),
                                                        item.key === 'permohonan' && pendingCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "destructive",
                                                            className: "ml-auto text-xs",
                                                            children: pendingCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 79
                                                        }, this),
                                                        item.key === 'db-buyer' && followUpAlertCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-orange-500 text-white",
                                                            children: followUpAlertCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 125,
                                                            columnNumber: 83
                                                        }, this),
                                                        item.key === 'register-invoice' && invoiceBelumLunas > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-red-500 text-white",
                                                            children: invoiceBelumLunas
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 126,
                                                            columnNumber: 90
                                                        }, this),
                                                        item.key === 'register-pembayaran' && pembayaranPending > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-yellow-500 text-white",
                                                            children: pembayaranPending
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 127,
                                                            columnNumber: 93
                                                        }, this),
                                                        item.key === 'projects' && activeProjectCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-blue-500 text-white",
                                                            children: activeProjectCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 128,
                                                            columnNumber: 83
                                                        }, this),
                                                        item.key === 'investors-input' && activeInvestorCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-emerald-500 text-white",
                                                            children: activeInvestorCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 91
                                                        }, this),
                                                        item.key === 'agt-management' && activeAgtCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                            className: "ml-auto text-xs bg-amber-500 text-white",
                                                            children: activeAgtCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.tsx",
                                                            lineNumber: 130,
                                                            columnNumber: 85
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 121,
                                                    columnNumber: 27
                                                }, this)
                                            }, item.key, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 118,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 117,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, section, true, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 115,
                            columnNumber: 15
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                                children: "Sistem"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 139,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarGroupContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                            isActive: activePage === 'settings',
                                            onClick: ()=>setActivePage('settings'),
                                            tooltip: "Pengaturan",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Pengaturan"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 53
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 142,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 141,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 140,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 138,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 103,
        columnNumber: 7
    }, this);
}
// ==================== PAGE CONTENT ====================
function PageContent() {
    const { activePage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAdminStore"])();
    switch(activePage){
        case 'dashboard':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 160,
                columnNumber: 30
            }, this);
        case 'nik-internal':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$nik$2d$internal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NikInternalPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 161,
                columnNumber: 33
            }, this);
        case 'nik-eksternal':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$nik$2d$eksternal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NikEksternalPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 162,
                columnNumber: 34
            }, this);
        case 'vendor':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$vendor$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["VendorRegisterPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 163,
                columnNumber: 27
            }, this);
        case 'buyer':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$buyer$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BuyerRegisterPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 164,
                columnNumber: 26
            }, this);
        case 'db-buyer':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$buyer$2d$database$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BuyerDatabasePage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 165,
                columnNumber: 29
            }, this);
        case 'projects':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$data$2d$proyek$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataProyekPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 166,
                columnNumber: 29
            }, this);
        case 'investors-input':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$input$2d$investor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InputInvestorPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 167,
                columnNumber: 36
            }, this);
        case 'kontrak':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$kontrak$2d$register$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["KontrakRegisterPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 168,
                columnNumber: 28
            }, this);
        case 'permohonan':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$permohonan$2d$vendor$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PermohonanVendorPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 169,
                columnNumber: 31
            }, this);
        case 'permintaan-barang':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$permintaan$2d$barang$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PermintaanBarangPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 170,
                columnNumber: 38
            }, this);
        case 'log-transaksi':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$log$2d$transaksi$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LogTransaksiPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 171,
                columnNumber: 34
            }, this);
        case 'laporan-keuangan':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$laporan$2d$keuangan$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LaporanKeuanganPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 172,
                columnNumber: 37
            }, this);
        case 'register-invoice':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$register$2d$invoice$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RegisterInvoicePage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 173,
                columnNumber: 37
            }, this);
        case 'register-pembayaran':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$register$2d$pembayaran$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RegisterPembayaranPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 174,
                columnNumber: 40
            }, this);
        case 'payroll':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$payroll$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PayrollPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 175,
                columnNumber: 28
            }, this);
        case 'agt-management':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$agt$2d$management$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AgtManagementPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 176,
                columnNumber: 35
            }, this);
        case 'settings':
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$settings$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsPage"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 177,
                columnNumber: 29
            }, this);
        default:
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$dashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dashboard"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 178,
                columnNumber: 21
            }, this);
    }
}
function HomePage() {
    const { activePage, loadFromNeon, isSyncing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAdminStore"])();
    const [isAuthenticated, setIsAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showLogin, setShowLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Inisialisasi: cek auth + load data dari Neon
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const init = async ()=>{
            try {
                // Cek apakah sudah login
                const auth = localStorage.getItem('marviro-auth');
                if (auth === 'true') {
                    setIsAuthenticated(true);
                    // Load data dari Neon database
                    // Ini memastikan data selalu sync di semua device
                    const loaded = await loadFromNeon();
                    if (loaded) {
                        console.log('✅ Data loaded from Neon');
                    } else {
                        console.log('⚠️ Using local data (Neon not available)');
                    }
                }
            } catch (error) {
                console.error('Init error:', error);
            } finally{
                setIsLoading(false);
            }
        };
        init();
    }, []);
    // Handle login sukses
    const handleLoginSuccess = async ()=>{
        localStorage.setItem('marviro-auth', 'true');
        setIsAuthenticated(true);
        setShowLogin(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Selamat datang!');
        // Load data dari Neon setelah login
        const loaded = await loadFromNeon();
        if (loaded) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Data berhasil dimuat dari server');
        }
    };
    // Handle logout
    const handleLogout = ()=>{
        localStorage.removeItem('marviro-auth');
        setIsAuthenticated(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Berhasil logout');
    };
    const pageTitle = {
        dashboard: 'Dashboard',
        'nik-internal': 'NIK Internal',
        'nik-eksternal': 'NIK Eksternal',
        vendor: 'Vendor Register',
        buyer: 'Buyer Register',
        'db-buyer': 'Database Buyer',
        projects: 'Data Proyek',
        'investors-input': 'Input Investor',
        kontrak: 'Kontrak Register',
        permohonan: 'Permohonan Vendor',
        'permintaan-barang': 'Permintaan Barang',
        'log-transaksi': 'Log Transaksi',
        'laporan-keuangan': 'Laporan Keuangan',
        'register-invoice': 'Register Invoice',
        'register-pembayaran': 'Register Pembayaran',
        payroll: 'Payroll',
        'agt-management': 'AGT / Trader Management',
        settings: 'Pengaturan'
    };
    // Loading screen
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl mx-auto mb-4 animate-pulse",
                        children: "MRV"
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 265,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: isSyncing ? 'Memuat data dari server...' : 'Memuat...'
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 268,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 264,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/page.tsx",
            lineNumber: 263,
            columnNumber: 9
        }, this);
    }
    // Not authenticated - show landing page
    if (!isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-gray-200 p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center w-full max-w-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-center mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-bold text-3xl shadow-lg",
                                    children: "MRV"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/page.tsx",
                                    lineNumber: 283,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 282,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold mb-2",
                                children: "PT Marviro Ekspor Indonesia"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 287,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-muted-foreground mb-6",
                                children: "Sistem Administrasi & Monitoring"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 288,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                size: "lg",
                                onClick: ()=>setShowLogin(true),
                                className: "px-8",
                                children: "Masuk ke Sistem"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 289,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 281,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 280,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$login$2d$modal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LoginModal"], {
                    open: showLogin,
                    onOpenChange: setShowLogin,
                    onLoginSuccess: handleLoginSuccess
                }, void 0, false, {
                    fileName: "[project]/src/app/page.tsx",
                    lineNumber: 294,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true);
    }
    // Authenticated - show dashboard
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AppSidebar, {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 306,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarInset"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarTrigger"], {
                                        className: "-ml-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 310,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Separator"], {
                                        orientation: "vertical",
                                        className: "mr-2 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 311,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-sm font-medium",
                                        children: pageTitle[activePage]
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 312,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$sync$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SyncButton"], {}, void 0, false, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        onClick: handleLogout,
                                        className: "text-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-3 w-3 mr-1"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this),
                                            "Logout"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.tsx",
                                lineNumber: 314,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 308,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 overflow-auto p-4 md:p-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PageContent, {}, void 0, false, {
                            fileName: "[project]/src/app/page.tsx",
                            lineNumber: 322,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 307,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SidebarRail"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 325,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 305,
        columnNumber: 7
    }, this);
}
}),
];

//# sourceMappingURL=src_0jk17j7._.js.map