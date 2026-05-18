// components/admin/input-investor.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, InvestorEntry, INVESTOR_STATUS_OPTIONS } from '@/lib/store';
import { DataTable, Column } from './data-table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
    DollarSign,
    Percent,
    CalendarDays,
    UserCheck,
    Building2,
    Target,
    Users,
    Link2,
    FileText,
    ReceiptText,
    CreditCard,
} from 'lucide-react';

// ==================== CURRENCY INPUT ====================

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

function CurrencyInput({ value, onChange, placeholder, className }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState('');

    const formatRupiahInput = (val: number): string => {
        if (!val || val === 0) return '';
        return new Intl.NumberFormat('id-ID').format(val);
    };

    if (formatRupiahInput(value) !== displayValue && !displayValue.includes('.')) {
        setDisplayValue(formatRupiahInput(value));
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseInt(rawValue.replace(/[^0-9]/g, ''), 10) || 0;
        setDisplayValue(numericValue > 0 ? new Intl.NumberFormat('id-ID').format(numericValue) : '');
        onChange(numericValue);
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">Rp</span>
            <Input
                type="text"
                inputMode="numeric"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder || "0"}
                className={`pl-10 ${className || ''}`}
            />
        </div>
    );
}

// ==================== FORM STATE ====================

interface InvestorFormState {
    projectId: string;
    namaInvestor: string;
    company: string;
    email: string;
    phone: string;
    alamat: string;
    npwp: string;
    nikReferensi: string;
    nilaiInvestasi: number;
    persentaseBagiHasil: string;
    tanggalMulai: string;
    tanggalSelesai: string;
    statusInvestasi: InvestorEntry['statusInvestasi'];
    catatan: string;
    tipeInvestor: 'Proyek' | 'Tetap';
    linkedKontrakId: string;
}

const emptyForm: InvestorFormState = {
    projectId: '',
    namaInvestor: '',
    company: '',
    email: '',
    phone: '',
    alamat: '',
    npwp: '',
    nikReferensi: '',
    nilaiInvestasi: 0,
    persentaseBagiHasil: '20',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: '',
    statusInvestasi: 'Aktif',
    catatan: '',
    tipeInvestor: 'Proyek',
    linkedKontrakId: '',
};

export function InputInvestorPage() {
    const store = useAdminStore() || {};
    const { investors = [], projects = [], kontraks = [], nikEksternals = [] } = store;
    const addInvestor = store.addInvestor || (() => {});
    const updateInvestor = store.updateInvestor || (() => {});
    const deleteInvestor = store.deleteInvestor || (() => {});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InvestorEntry | null>(null);
    const [form, setForm] = useState<InvestorFormState>(emptyForm);
    const [filterProject, setFilterProject] = useState('all');
    const [filterTipe, setFilterTipe] = useState('all');
    const [showKontrakSelect, setShowKontrakSelect] = useState(false);

    // Get kontrak dengan klasifikasi INV (Investor)
    const kontrakInvestor = useMemo(() => {
        return kontraks.filter(k => k.klasifikasi === 'INV' && (k.status === 'Aktif' || k.status === 'Proses TTD'));
    }, [kontraks]);

    // Filtered data
    const filteredInvestors = useMemo(() => {
        let data = investors;
        if (filterProject !== 'all') data = data.filter(inv => inv.projectId === filterProject);
        if (filterTipe === 'proyek') data = data.filter(inv => inv.projectId && inv.projectId !== 'tetap');
        if (filterTipe === 'tetap') data = data.filter(inv => inv.projectId === 'tetap' || !inv.projectId);
        return data;
    }, [investors, filterProject, filterTipe]);

    // Stats
    const stats = useMemo(() => {
        const total = investors.length;
        const aktif = investors.filter(inv => inv.statusInvestasi === 'Aktif').length;
        const proyek = investors.filter(inv => inv.projectId && inv.projectId !== 'tetap').length;
        const tetap = investors.filter(inv => inv.projectId === 'tetap' || !inv.projectId).length;
        const totalDana = investors.reduce((sum, inv) => sum + (inv.nilaiInvestasi || 0), 0);
        return { total, aktif, proyek, tetap, totalDana };
    }, [investors]);

    const handleAdd = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setShowKontrakSelect(false);
        setDialogOpen(true);
    };

    const handleEdit = (item: InvestorEntry) => {
        setEditingItem(item);
        const linkedData = parseLinkedData(item.catatan);
        setForm({
            projectId: item.projectId,
            namaInvestor: item.namaInvestor,
            company: item.company || '',
            email: item.email,
            phone: item.phone,
            alamat: item.alamat,
            npwp: item.npwp || '',
            nikReferensi: linkedData.nikReferensi || '',
            nilaiInvestasi: item.nilaiInvestasi,
            persentaseBagiHasil: item.persentaseBagiHasil.toString(),
            tanggalMulai: item.tanggalMulai,
            tanggalSelesai: item.tanggalSelesai,
            statusInvestasi: item.statusInvestasi,
            catatan: item.catatan,
            tipeInvestor: (item.projectId && item.projectId !== 'tetap') ? 'Proyek' : 'Tetap',
            linkedKontrakId: linkedData.kontrakId || '',
        });
        setShowKontrakSelect(!!linkedData.kontrakId);
        setDialogOpen(true);
    };

    // Parse linked data dari catatan
    const parseLinkedData = (catatan: string) => {
        const result: { kontrakId: string; nikReferensi: string } = { kontrakId: '', nikReferensi: '' };
        if (!catatan) return result;
        try {
            const lines = catatan.split('\n');
            for (const line of lines) {
                if (line.startsWith('LINKED_KONTRAK:')) result.kontrakId = line.split(':')[1]?.trim() || '';
                if (line.startsWith('LINKED_NIK:')) result.nikReferensi = line.split(':')[1]?.trim() || '';
            }
        } catch {}
        return result;
    };

    // Build catatan dengan linked data
    const buildCatatan = (catatan: string, kontrakId: string, nikReferensi: string): string => {
        const cleanCatatan = catatan
            .split('\n')
            .filter(line => !line.startsWith('LINKED_KONTRAK:') && !line.startsWith('LINKED_NIK:'))
            .join('\n')
            .trim();

        const links: string[] = [];
        if (kontrakId) links.push(`LINKED_KONTRAK:${kontrakId}`);
        if (nikReferensi) links.push(`LINKED_NIK:${nikReferensi}`);

        return links.length > 0
            ? `${cleanCatatan}\n${links.join('\n')}`.trim()
            : cleanCatatan;
    };

    // Handle pilih kontrak
    const handleKontrakSelect = (kontrakId: string) => {
        if (!kontrakId || kontrakId === 'none') {
            setForm({ ...form, linkedKontrakId: '' });
            return;
        }
        const kontrak = kontraks.find(k => k.id === kontrakId);
        if (kontrak) {
            setForm({
                ...form,
                linkedKontrakId: kontrakId,
                namaInvestor: form.namaInvestor || kontrak.namaPihak,
            });
        }
    };

    // Handle pilih NIK referensi
    const handleNikReferensiSelect = (nikId: string) => {
        if (!nikId || nikId === 'none') {
            setForm({ ...form, nikReferensi: '' });
            return;
        }
        const nik = nikEksternals.find(n => n.id === nikId);
        if (nik) {
            setForm({
                ...form,
                nikReferensi: nik.nik,
                namaInvestor: form.namaInvestor || nik.namaLengkap,
                email: form.email || '',
                phone: form.phone || '',
            });
        }
    };

    const handleSave = () => {
        if (!form.namaInvestor.trim()) { toast.error('Nama Investor wajib diisi'); return; }
        if (!form.email.trim()) { toast.error('Email wajib diisi'); return; }
        if (!form.npwp.trim()) { toast.error('NPWP wajib diisi sebagai identitas utama'); return; }

        const projectId = form.tipeInvestor === 'Tetap' ? 'tetap' : form.projectId;

        const data = {
            projectId: projectId || 'tetap',
            namaInvestor: form.namaInvestor.trim(),
            company: form.company.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            alamat: form.alamat.trim(),
            npwp: form.npwp.trim(),
            nilaiInvestasi: form.nilaiInvestasi || 0,
            persentaseBagiHasil: Number(form.persentaseBagiHasil) || 0,
            tanggalMulai: form.tanggalMulai,
            tanggalSelesai: form.tanggalSelesai,
            statusInvestasi: form.statusInvestasi,
            catatan: buildCatatan(form.catatan, form.linkedKontrakId, form.nikReferensi),
        };

        if (editingItem) {
            updateInvestor(editingItem.id, data);
            toast.success('Investor berhasil diperbarui');
        } else {
            addInvestor(data);
            toast.success('Investor berhasil ditambahkan');
        }
        setDialogOpen(false);
    };

    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
        if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}JT`;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    const getStatusColor = (status: string) => {
        const found = INVESTOR_STATUS_OPTIONS.find(o => o.value === status);
        return found?.color || 'bg-gray-100 text-gray-700';
    };

    const getProjectName = (projectId: string) => {
        if (!projectId || projectId === 'tetap') return 'Investor Tetap';
        const project = projects.find(p => p.id === projectId);
        return project ? `${project.kodeProyek} - ${project.namaProyek}` : '-';
    };

    // Get linked kontrak info
    const getLinkedKontrakInfo = (investor: InvestorEntry) => {
        const linked = parseLinkedData(investor.catatan);
        if (!linked.kontrakId) return null;
        return kontraks.find(k => k.id === linked.kontrakId);
    };

    const columns: Column<InvestorEntry>[] = [
        { key: 'nomorSurat', label: 'No. Surat' },
        { key: 'namaInvestor', label: 'Nama Investor' },
        { key: 'company', label: 'Perusahaan', render: (item: InvestorEntry) => item.company || '-' },
        { key: 'npwp', label: 'NPWP', render: (item: InvestorEntry) => item.npwp ? <span className="font-mono text-xs">{item.npwp}</span> : '-' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        {
            key: 'projectId',
            label: 'Proyek',
            render: (item: InvestorEntry) => (
                <Badge variant="outline" className="text-xs">
                    {getProjectName(item.projectId)}
                </Badge>
            )
        },
        {
            key: 'linkedKontrak' as keyof InvestorEntry,
            label: 'No. Kontrak',
            render: (item: InvestorEntry) => {
                const kontrak = getLinkedKontrakInfo(item);
                return kontrak ? (
                    <Badge variant="secondary" className="text-xs font-mono">
                        <FileText className="h-3 w-3 mr-1" />
                        {kontrak.nomorKontrak}
                    </Badge>
                ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                );
            }
        },
        { key: 'nilaiInvestasi', label: 'Investasi', render: (item: InvestorEntry) => formatCurrency(item.nilaiInvestasi) },
        { key: 'persentaseBagiHasil', label: 'Bagi Hasil', render: (item: InvestorEntry) => `${item.persentaseBagiHasil}%` },
        {
            key: 'statusInvestasi',
            label: 'Status',
            render: (item: InvestorEntry) => (
                <Badge className={`text-xs ${getStatusColor(item.statusInvestasi)}`}>{item.statusInvestasi}</Badge>
            )
        },
    ];

    const selectedProject = form.projectId ? projects.find(p => p.id === form.projectId) : null;
    const selectedKontrak = form.linkedKontrakId ? kontraks.find(k => k.id === form.linkedKontrakId) : null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Input Investor</h1>
                    <p className="text-sm text-muted-foreground">Pendataan investor per proyek & investor tetap Marviro</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-slate-600" />
                            <p className="text-xs font-medium text-slate-600">Total</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCheck className="h-4 w-4 text-emerald-600" />
                            <p className="text-xs font-medium text-emerald-600">Aktif</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">{stats.aktif}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Per Proyek</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{stats.proyek}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="h-4 w-4 text-violet-600" />
                            <p className="text-xs font-medium text-violet-600">Investor Tetap</p>
                        </div>
                        <p className="text-2xl font-bold text-violet-700">{stats.tetap}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-amber-600" />
                            <p className="text-xs font-medium text-amber-600">Total Dana</p>
                        </div>
                        <p className="text-lg font-bold text-amber-700">{formatCurrency(stats.totalDana)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                <Select value={filterProject} onValueChange={setFilterProject}>
                    <SelectTrigger className="w-48"><SelectValue placeholder="Semua Proyek" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Proyek</SelectItem>
                        {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.namaProyek}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterTipe} onValueChange={setFilterTipe}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Tipe</SelectItem>
                        <SelectItem value="proyek">Per Proyek</SelectItem>
                        <SelectItem value="tetap">Investor Tetap</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <DataTable<InvestorEntry>
                title="Daftar Investor"
                columns={columns}
                data={filteredInvestors}
                searchKeys={['nomorSurat', 'namaInvestor', 'email', 'npwp', 'company']}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(item) => { deleteInvestor(item.id); toast.success('Investor berhasil dihapus'); }}
                statusKey="statusInvestasi"
            />

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>{editingItem ? 'Edit Investor' : 'Tambah Investor Baru'}</DialogTitle>
                                <p className="text-sm text-muted-foreground">Pendataan investor</p>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Tipe Investor */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <Label className="text-blue-700 mb-2 block">Tipe Investor</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant={form.tipeInvestor === 'Proyek' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setForm({ ...form, tipeInvestor: 'Proyek' })}
                                >
                                    <Target className="h-4 w-4 mr-1" />
                                    Per Proyek
                                </Button>
                                <Button
                                    variant={form.tipeInvestor === 'Tetap' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setForm({ ...form, tipeInvestor: 'Tetap', projectId: 'tetap' })}
                                >
                                    <Building2 className="h-4 w-4 mr-1" />
                                    Investor Tetap Marviro
                                </Button>
                            </div>
                        </div>

                        {/* Pilih Proyek (jika per proyek) */}
                        {form.tipeInvestor === 'Proyek' && (
                            <div className="space-y-2">
                                <Label>Proyek</Label>
                                <Select value={form.projectId} onValueChange={(v) => setForm({ ...form, projectId: v })}>
                                    <SelectTrigger><SelectValue placeholder="Pilih proyek" /></SelectTrigger>
                                    <SelectContent>
                                        {projects.map(p => (
                                            <SelectItem key={p.id} value={p.id}>[{p.kodeProyek}] {p.namaProyek}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedProject && (
                                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                                        <p>Range Investasi: {formatCurrency(selectedProject.minInvestasiPerInvestor)} - {formatCurrency(selectedProject.maxInvestasiPerInvestor)}</p>
                                        <p>Laba Bersih Proyek: {formatCurrency(selectedProject.labaBersih)}</p>
                                        <p>Kuota Investor: {investors.filter(inv => inv.projectId === selectedProject.id).length} / {selectedProject.maxInvestor}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ==================== LINK KONTRAK INVESTOR ==================== */}
                        <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Kontrak Investor
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowKontrakSelect(!showKontrakSelect)}
                                    className="text-xs"
                                >
                                    {showKontrakSelect ? 'Sembunyikan' : 'Pilih Kontrak'}
                                </Button>
                            </div>

                            {showKontrakSelect && (
                                <div className="space-y-2">
                                    <Label>Tarik Nomor Kontrak dari Kontrak Register</Label>
                                    <Select value={form.linkedKontrakId || 'none'} onValueChange={handleKontrakSelect}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih kontrak investor..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Tidak ada / Manual --</SelectItem>
                                            {kontrakInvestor.map(k => (
                                                <SelectItem key={k.id} value={k.id}>
                                                    {k.nomorKontrak} - {k.namaPihak}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {selectedKontrak && (
                                        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
                                            <p className="font-medium text-green-800">Kontrak Terpilih:</p>
                                            <div className="mt-1 space-y-1 text-green-700">
                                                <p><strong>No:</strong> {selectedKontrak.nomorKontrak}</p>
                                                <p><strong>Pihak:</strong> {selectedKontrak.namaPihak}</p>
                                                <p><strong>Objek:</strong> {selectedKontrak.objekKontrak}</p>
                                                <p><strong>Status:</strong> {selectedKontrak.status}</p>
                                                <p><strong>Periode:</strong> {selectedKontrak.tglMulai} s/d {selectedKontrak.tglBerakhir}</p>
                                            </div>
                                        </div>
                                    )}

                                    {kontrakInvestor.length === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Belum ada kontrak dengan klasifikasi INV. Tambahkan di Kontrak Register terlebih dahulu.
                                        </p>
                                    )}
                                </div>
                            )}

                            {!showKontrakSelect && selectedKontrak && (
                                <Badge variant="secondary" className="text-xs font-mono">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {selectedKontrak.nomorKontrak}
                                </Badge>
                            )}

                            {!showKontrakSelect && !selectedKontrak && (
                                <p className="text-xs text-muted-foreground">
                                    Belum ada kontrak terhubung. Klik "Pilih Kontrak" untuk menghubungkan.
                                </p>
                            )}
                        </div>

                        {/* ==================== DATA DIRI ==================== */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Data Diri
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nama Investor *</Label>
                                    <Input value={form.namaInvestor} onChange={(e) => setForm({ ...form, namaInvestor: e.target.value })} placeholder="Nama lengkap sesuai identitas" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Perusahaan</Label>
                                    <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Nama perusahaan (opsional)" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <ReceiptText className="h-4 w-4" />
                                        NPWP (Identitas Utama) *
                                    </Label>
                                    <Input value={form.npwp} onChange={(e) => setForm({ ...form, npwp: e.target.value })} placeholder="XX.XXX.XXX.X-XXX.XXX" className="font-mono" />
                                    <p className="text-xs text-muted-foreground">NPWP digunakan sebagai identitas utama investor</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-1">
                                        <Link2 className="h-4 w-4" />
                                        Referensi NIK Eksternal
                                    </Label>
                                    <Select value={nikEksternals.find(n => n.nik === form.nikReferensi)?.id || 'none'} onValueChange={handleNikReferensiSelect}>
                                        <SelectTrigger><SelectValue placeholder="Opsional - pilih NIK" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">-- Tidak ada --</SelectItem>
                                            {nikEksternals.map(n => (
                                                <SelectItem key={n.id} value={n.id}>{n.nik} - {n.namaLengkap}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">Referensi silang ke data NIK Eksternal (opsional)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@investor.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label>No. Telepon</Label>
                                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62..." />
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <Label>Alamat</Label>
                                <Textarea value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Alamat lengkap sesuai identitas" rows={2} />
                            </div>
                        </div>

                        {/* ==================== DETAIL INVESTASI ==================== */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Detail Investasi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Nilai Investasi</Label>
                                    <CurrencyInput
                                        value={form.nilaiInvestasi}
                                        onChange={(val) => setForm({ ...form, nilaiInvestasi: val })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Persentase Bagi Hasil (%)</Label>
                                    <Input type="number" value={form.persentaseBagiHasil} onChange={(e) => setForm({ ...form, persentaseBagiHasil: e.target.value })} min={0} max={100} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Estimasi Bagi Hasil</Label>
                                    <div className="p-2 rounded-md bg-emerald-50 font-bold text-emerald-700 text-sm">
                                        {formatCurrency((selectedProject?.labaBersih || 0) * (Number(form.persentaseBagiHasil) || 0) / 100)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ==================== MASA INVESTASI ==================== */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                                <CalendarDays className="h-4 w-4" />
                                Masa Investasi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Mulai</Label>
                                    <Input type="date" value={form.tanggalMulai} onChange={(e) => setForm({ ...form, tanggalMulai: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Selesai</Label>
                                    <Input type="date" value={form.tanggalSelesai} onChange={(e) => setForm({ ...form, tanggalSelesai: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {/* ==================== STATUS ==================== */}
                        <div className="space-y-2">
                            <Label>Status Investasi</Label>
                            <Select value={form.statusInvestasi} onValueChange={(v) => setForm({ ...form, statusInvestasi: v as InvestorEntry['statusInvestasi'] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {INVESTOR_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* ==================== CATATAN ==================== */}
                        <div className="space-y-2">
                            <Label>Catatan</Label>
                            <Textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan tambahan..." rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave}>{editingItem ? 'Simpan Perubahan' : 'Tambah Investor'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}