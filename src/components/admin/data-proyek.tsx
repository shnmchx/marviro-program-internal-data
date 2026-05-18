// components/admin/data-proyek.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, ProjectEntry, PROJECT_STATUS_OPTIONS } from '@/lib/store';
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
import { FolderKanban, Target, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';

interface ProjectFormState {
    namaProyek: string;
    deskripsi: string;
    minInvestor: number;
    maxInvestor: number;
    minInvestasiPerInvestor: number;
    maxInvestasiPerInvestor: number;
    totalNilaiProyek: number;
    omzetKotor: number;
    biayaOperasional: number;
    statusProyek: ProjectEntry['statusProyek'];
    tanggalMulai: string;
    tanggalSelesai: string;
}

const emptyForm: ProjectFormState = {
    namaProyek: '',
    deskripsi: '',
    minInvestor: 1,
    maxInvestor: 10,
    minInvestasiPerInvestor: 10000000,
    maxInvestasiPerInvestor: 1000000000,
    totalNilaiProyek: 100000000,
    omzetKotor: 0,
    biayaOperasional: 0,
    statusProyek: 'Persiapan',
    tanggalMulai: new Date().toISOString().split('T')[0],
    tanggalSelesai: '',
};

// ==================== CURRENCY INPUT COMPONENT ====================

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    className?: string;
}

function CurrencyInput({ value, onChange, placeholder, className }: CurrencyInputProps) {
    const [displayValue, setDisplayValue] = useState(formatRupiahInput(value));

    function formatRupiahInput(val: number): string {
        if (!val || val === 0) return '';
        return new Intl.NumberFormat('id-ID').format(val);
    }

    function parseRupiahInput(val: string): number {
        // Hapus semua karakter non-digit
        const cleaned = val.replace(/[^0-9]/g, '');
        return parseInt(cleaned, 10) || 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const numericValue = parseRupiahInput(rawValue);

        // Update display dengan format
        setDisplayValue(formatRupiahInput(numericValue));

        // Kirim nilai numeric ke parent
        onChange(numericValue);
    };

    // Update display saat value berubah dari parent
    useState(() => {
        setDisplayValue(formatRupiahInput(value));
    });

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rp</span>
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

export function DataProyekPage() {
    const store = useAdminStore() || {};
    const { projects = [], investors = [] } = store;
    const addProject = store.addProject || (() => {});
    const updateProject = store.updateProject || (() => {});
    const deleteProject = store.deleteProject || (() => {});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ProjectEntry | null>(null);
    const [form, setForm] = useState<ProjectFormState>(emptyForm);

    // Update display currency saat edit
    useState(() => {
        if (editingItem) {
            // Trigger re-render untuk currency input
        }
    });

    // Stats
    const stats = useMemo(() => {
        const total = projects.length;
        const berjalan = projects.filter(p => p.statusProyek === 'Berjalan').length;
        const persiapan = projects.filter(p => p.statusProyek === 'Persiapan').length;
        const selesai = projects.filter(p => p.statusProyek === 'Selesai').length;
        const totalOmzet = projects.reduce((sum, p) => sum + (p.omzetKotor || 0), 0);
        const totalLaba = projects.reduce((sum, p) => sum + (p.labaBersih || 0), 0);
        return { total, berjalan, persiapan, selesai, totalOmzet, totalLaba };
    }, [projects]);

    const getProjectInvestors = (projectId: string) => {
        return investors.filter(inv => inv.projectId === projectId);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setDialogOpen(true);
    };

    const handleEdit = (item: ProjectEntry) => {
        setEditingItem(item);
        setForm({
            namaProyek: item.namaProyek,
            deskripsi: item.deskripsi,
            minInvestor: item.minInvestor,
            maxInvestor: item.maxInvestor,
            minInvestasiPerInvestor: item.minInvestasiPerInvestor,
            maxInvestasiPerInvestor: item.maxInvestasiPerInvestor,
            totalNilaiProyek: item.totalNilaiProyek,
            omzetKotor: item.omzetKotor,
            biayaOperasional: item.biayaOperasional,
            statusProyek: item.statusProyek,
            tanggalMulai: item.tanggalMulai,
            tanggalSelesai: item.tanggalSelesai,
        });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!form.namaProyek.trim()) {
            toast.error('Nama Proyek wajib diisi');
            return;
        }

        if (editingItem) {
            updateProject(editingItem.id, form);
            toast.success('Proyek berhasil diperbarui');
        } else {
            addProject(form);
            toast.success('Proyek berhasil ditambahkan');
        }
        setDialogOpen(false);
    };

    const formatCurrency = (value: number) => {
        if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
        if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}JT`;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    };

    const getStatusColor = (status: string) => {
        const found = PROJECT_STATUS_OPTIONS.find(o => o.value === status);
        return found?.color || 'bg-gray-100 text-gray-700';
    };

    const columns: Column<ProjectEntry>[] = [
        { key: 'kodeProyek', label: 'Kode' },
        { key: 'namaProyek', label: 'Nama Proyek' },
        {
            key: 'statusProyek',
            label: 'Status',
            render: (item: ProjectEntry) => (
                <Badge className={`text-xs ${getStatusColor(item.statusProyek)}`}>{item.statusProyek}</Badge>
            )
        },
        {
            key: 'investorCount' as keyof ProjectEntry,
            label: 'Investor',
            render: (item: ProjectEntry) => (
                <span className="text-sm">{getProjectInvestors(item.id).length} / {item.maxInvestor}</span>
            )
        },
        { key: 'totalNilaiProyek', label: 'Nilai Proyek', render: (item: ProjectEntry) => formatCurrency(item.totalNilaiProyek) },
        { key: 'omzetKotor', label: 'Omzet', render: (item: ProjectEntry) => formatCurrency(item.omzetKotor) },
        { key: 'labaBersih', label: 'Laba Bersih', render: (item: ProjectEntry) => <span className="text-emerald-600 font-medium">{formatCurrency(item.labaBersih)}</span> },
        { key: 'tanggalMulai', label: 'Tgl Mulai' },
        { key: 'tanggalSelesai', label: 'Tgl Selesai' },
    ];

    // Kalkulasi laba bersih otomatis
    const calculatedLaba = form.omzetKotor - form.biayaOperasional;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Data Proyek</h1>
                    <p className="text-sm text-muted-foreground">Manajemen proyek investasi PT Marviro</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FolderKanban className="h-4 w-4 text-slate-600" />
                            <p className="text-xs font-medium text-slate-600">Total</p>
                        </div>
                        <p className="text-2xl font-bold text-slate-700">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-50 to-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-emerald-600" />
                            <p className="text-xs font-medium text-emerald-600">Berjalan</p>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">{stats.berjalan}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Persiapan</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{stats.persiapan}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-gray-50 to-slate-50">
                    <CardContent className="p-4">
                        <p className="text-xs font-medium text-gray-600 mb-2">Selesai</p>
                        <p className="text-2xl font-bold text-gray-700">{stats.selesai}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-amber-600" />
                            <p className="text-xs font-medium text-amber-600">Total Omzet</p>
                        </div>
                        <p className="text-lg font-bold text-amber-700">{formatCurrency(stats.totalOmzet)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <p className="text-xs font-medium text-green-600">Total Laba</p>
                        </div>
                        <p className="text-lg font-bold text-green-700">{formatCurrency(stats.totalLaba)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <DataTable<ProjectEntry>
                title="Daftar Proyek"
                columns={columns}
                data={projects}
                searchKeys={['kodeProyek', 'namaProyek', 'deskripsi']}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={(item) => { deleteProject(item.id); toast.success('Proyek berhasil dihapus'); }}
                statusKey="statusProyek"
            />

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FolderKanban className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>{editingItem ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
                                <p className="text-sm text-muted-foreground">Manajemen proyek investasi</p>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama Proyek *</Label>
                                <Input value={form.namaProyek} onChange={(e) => setForm({ ...form, namaProyek: e.target.value })} placeholder="Nama proyek" />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={form.statusProyek} onValueChange={(v) => setForm({ ...form, statusProyek: v as ProjectEntry['statusProyek'] })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PROJECT_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Deskripsi</Label>
                            <Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} placeholder="Deskripsi proyek" rows={2} />
                        </div>

                        {/* Konfigurasi Investor */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3">Konfigurasi Investor</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label>Min Investor</Label>
                                    <Input type="number" value={form.minInvestor} onChange={(e) => setForm({ ...form, minInvestor: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Investor</Label>
                                    <Input type="number" value={form.maxInvestor} onChange={(e) => setForm({ ...form, maxInvestor: Number(e.target.value) })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Min Investasi/Investor</Label>
                                    <CurrencyInput
                                        value={form.minInvestasiPerInvestor}
                                        onChange={(val) => setForm({ ...form, minInvestasiPerInvestor: val })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Max Investasi/Investor</Label>
                                    <CurrencyInput
                                        value={form.maxInvestasiPerInvestor}
                                        onChange={(val) => setForm({ ...form, maxInvestasiPerInvestor: val })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Keuangan */}
                        <div className="border-t pt-4">
                            <h3 className="font-semibold text-sm mb-3">Keuangan Proyek</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Total Nilai Proyek</Label>
                                    <CurrencyInput
                                        value={form.totalNilaiProyek}
                                        onChange={(val) => setForm({ ...form, totalNilaiProyek: val })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Omzet Kotor</Label>
                                    <CurrencyInput
                                        value={form.omzetKotor}
                                        onChange={(val) => setForm({ ...form, omzetKotor: val })}
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Biaya Operasional</Label>
                                    <CurrencyInput
                                        value={form.biayaOperasional}
                                        onChange={(val) => setForm({ ...form, biayaOperasional: val })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/50 mt-3 grid grid-cols-3 gap-4 text-sm">
                                <div><p className="text-muted-foreground">Omzet Kotor</p><p className="font-medium">{formatCurrency(form.omzetKotor)}</p></div>
                                <div><p className="text-muted-foreground">Biaya Operasional</p><p className="font-medium text-red-600">- {formatCurrency(form.biayaOperasional)}</p></div>
                                <div><p className="text-muted-foreground">Laba Bersih</p><p className="font-bold text-emerald-600">{formatCurrency(calculatedLaba)}</p></div>
                            </div>
                        </div>

                        {/* Tanggal */}
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
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave}>{editingItem ? 'Simpan Perubahan' : 'Tambah Proyek'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}