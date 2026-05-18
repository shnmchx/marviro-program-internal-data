// components/admin/agt-management.tsx
'use client';

import { useState, useMemo } from 'react';
import { useAdminStore, AgtEntry, AGT_STATUS_OPTIONS } from '@/lib/store';
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
    Target,
    MapPin,
    Package,
    TrendingUp,
    UserCheck,
    PauseCircle,
    FileCheck,
    Search,
} from 'lucide-react';

// ==================== OPTIONS ====================

const FOKUS_PRODUK_OPTIONS = [
    'Frozen Avocado',
    'Frozen Fruit',
    'Coffee',
    'White Label Coffee',
    'Fresh Fruit',
    'Coconut Product',
    'Spices',
    'Cocoa',
    'Vanilla',
    'Essential Oil',
] as const;

const FOKUS_MARKET_OPTIONS = [
    'Horeca',
    'Retail',
    'B2B Distribution',
    'Export Buyer',
    'Reseller',
    'Food Service',
    'E-Commerce',
    'Wholesale',
    'Direct Consumer',
    'Government',
] as const;

const WILAYAH_OPTIONS = [
    'Makassar',
    'Sulawesi Selatan',
    'Jabodetabek',
    'Indonesia Timur',
    'Indonesia Barat',
    'UAE Market',
    'Singapore Market',
    'Malaysia Market',
    'Japan Market',
    'Europe Market',
    'USA Market',
    'Middle East Market',
] as const;

// ==================== FORM STATE ====================

interface AgtFormState {
    namaAgt: string;
    nikEksternal: string;
    nomorKontrak: string;
    fokusProduk: string[];
    fokusMarket: string[];
    wilayahFokus: string[];
    statusAgt: AgtEntry['statusAgt'];
    tanggalBergabung: string;
    catatan: string;
}

const emptyAgtForm: AgtFormState = {
    namaAgt: '',
    nikEksternal: '',
    nomorKontrak: '',
    fokusProduk: [],
    fokusMarket: [],
    wilayahFokus: [],
    statusAgt: 'Aktif',
    tanggalBergabung: new Date().toISOString().split('T')[0],
    catatan: '',
};

export function AgtManagementPage() {
    const store = useAdminStore() || {};
    const { agtEntries = [], nikEksternals = [], kontraks = [] } = store;
    const addAgtEntry = store.addAgtEntry || (() => ({ kodeAgt: '' }));
    const updateAgtEntry = store.updateAgtEntry || (() => {});
    const deleteAgtEntry = store.deleteAgtEntry || (() => {});

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<AgtEntry | null>(null);
    const [form, setForm] = useState<AgtFormState>(emptyAgtForm);

    // Statistics
    const stats = useMemo(() => {
        const total = agtEntries.length;
        const aktif = agtEntries.filter(a => a.statusAgt === 'Aktif').length;
        const evaluasi = agtEntries.filter(a => a.statusAgt === 'Evaluasi').length;
        const ditangguhkan = agtEntries.filter(a => a.statusAgt === 'Ditangguhkan').length;
        const tidakAktif = agtEntries.filter(a => a.statusAgt === 'Tidak Aktif').length;
        const selesai = agtEntries.filter(a => a.statusAgt === 'Selesai').length;
        return { total, aktif, evaluasi, ditangguhkan, tidakAktif, selesai };
    }, [agtEntries]);

    const handleAdd = () => {
        setEditingItem(null);
        setForm(emptyAgtForm);
        setDialogOpen(true);
    };

    const handleEdit = (item: AgtEntry) => {
        setEditingItem(item);
        setForm({
            namaAgt: item.namaAgt,
            nikEksternal: item.nikEksternal,
            nomorKontrak: item.nomorKontrak,
            fokusProduk: item.fokusProduk || [],
            fokusMarket: item.fokusMarket || [],
            wilayahFokus: item.wilayahFokus || [],
            statusAgt: item.statusAgt,
            tanggalBergabung: item.tanggalBergabung,
            catatan: item.catatan || '',
        });
        setDialogOpen(true);
    };

    const handleDelete = (item: AgtEntry) => {
        deleteAgtEntry(item.id);
        toast.success('Data AGT berhasil dihapus');
    };

    const handleSave = () => {
        if (!form.namaAgt.trim()) {
            toast.error('Nama AGT wajib diisi');
            return;
        }

        if (editingItem) {
            updateAgtEntry(editingItem.id, form);
            toast.success('Data AGT berhasil diperbarui');
        } else {
            const newItem = addAgtEntry(form);
            if (newItem && newItem.kodeAgt) {
                toast.success(`AGT berhasil ditambahkan (${newItem.kodeAgt})`);
            }
        }
        setDialogOpen(false);
    };

    // Auto-fill dari NIK Eksternal
    const handleNikSelect = (nikId: string) => {
        if (!nikId || nikId === 'none') {
            setForm({ ...form, nikEksternal: '', namaAgt: '', nomorKontrak: '' });
            return;
        }
        const nik = nikEksternals.find(n => n.id === nikId);
        if (nik) {
            setForm({
                ...form,
                nikEksternal: nik.nik,
                namaAgt: form.namaAgt || nik.namaLengkap,
                nomorKontrak: form.nomorKontrak || nik.nomorKontrak,
                tanggalBergabung: form.tanggalBergabung || nik.tglMulai,
            });
        }
    };

    // Auto-fill dari Kontrak Register (AGT/Trader)
    const kontrakAgt = useMemo(() => {
        return kontraks.filter(k => k.klasifikasi === 'AGT' && (k.status === 'Aktif' || k.status === 'Proses TTD'));
    }, [kontraks]);

    const handleKontrakSelect = (kontrakId: string) => {
        if (!kontrakId || kontrakId === 'none') {
            setForm({ ...form, nomorKontrak: '' });
            return;
        }
        const kontrak = kontraks.find(k => k.id === kontrakId);
        if (kontrak) {
            setForm({
                ...form,
                nomorKontrak: kontrak.nomorKontrak,
                namaAgt: form.namaAgt || kontrak.namaPihak,
                tanggalBergabung: form.tanggalBergabung || kontrak.tglMulai,
            });
        }
    };

    const getStatusColor = (status: string) => {
        const found = AGT_STATUS_OPTIONS.find(o => o.value === status);
        return found?.color || 'bg-gray-100 text-gray-700';
    };

    const columns: Column<AgtEntry>[] = [
        { key: 'kodeAgt', label: 'Kode AGT' },
        { key: 'namaAgt', label: 'Nama AGT' },
        { key: 'nikEksternal', label: 'NIK Eksternal' },
        { key: 'nomorKontrak', label: 'No. Kontrak' },
        {
            key: 'fokusProduk',
            label: 'Fokus Produk',
            render: (item: AgtEntry) => (
                <div className="flex flex-wrap gap-1">
                    {(item.fokusProduk || []).slice(0, 2).map(p => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                    {(item.fokusProduk || []).length > 2 && (
                        <span className="text-xs text-muted-foreground">+{item.fokusProduk.length - 2}</span>
                    )}
                </div>
            )
        },
        {
            key: 'fokusMarket',
            label: 'Fokus Market',
            render: (item: AgtEntry) => (
                <div className="flex flex-wrap gap-1">
                    {(item.fokusMarket || []).slice(0, 2).map(m => (
                        <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>
                    ))}
                    {(item.fokusMarket || []).length > 2 && (
                        <span className="text-xs text-muted-foreground">+{item.fokusMarket.length - 2}</span>
                    )}
                </div>
            )
        },
        {
            key: 'wilayahFokus',
            label: 'Wilayah',
            render: (item: AgtEntry) => (
                <div className="flex flex-wrap gap-1">
                    {(item.wilayahFokus || []).slice(0, 2).map(w => (
                        <Badge key={w} variant="outline" className="text-xs border-blue-300 text-blue-700">{w}</Badge>
                    ))}
                    {(item.wilayahFokus || []).length > 2 && (
                        <span className="text-xs text-muted-foreground">+{item.wilayahFokus.length - 2}</span>
                    )}
                </div>
            )
        },
        { key: 'tanggalBergabung', label: 'Tgl Bergabung' },
        {
            key: 'statusAgt',
            label: 'Status',
            render: (item: AgtEntry) => (
                <Badge className={`text-xs ${getStatusColor(item.statusAgt)}`}>{item.statusAgt}</Badge>
            )
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">AGT / Trader Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Monitoring & mapping agent/trader PT Marviro Ekspor Indonesia
                    </p>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-slate-600" />
                            <p className="text-xs font-medium text-slate-600">Total AGT</p>
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
                <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Search className="h-4 w-4 text-yellow-600" />
                            <p className="text-xs font-medium text-yellow-600">Evaluasi</p>
                        </div>
                        <p className="text-2xl font-bold text-yellow-700">{stats.evaluasi}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <PauseCircle className="h-4 w-4 text-orange-600" />
                            <p className="text-xs font-medium text-orange-600">Ditangguhkan</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-700">{stats.ditangguhkan}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FileCheck className="h-4 w-4 text-blue-600" />
                            <p className="text-xs font-medium text-blue-600">Selesai</p>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">{stats.selesai}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table */}
            <DataTable<AgtEntry>
                title="Daftar AGT / Trader"
                columns={columns}
                data={agtEntries}
                searchKeys={['kodeAgt', 'namaAgt', 'nikEksternal', 'nomorKontrak']}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                statusKey="statusAgt"
            />

            {/* Dialog Form */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Target className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <DialogTitle>
                                    {editingItem ? 'Edit AGT / Trader' : 'Tambah AGT / Trader Baru'}
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground">Monitoring & mapping agent/trader</p>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Nama & NIK */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nama AGT *</Label>
                                <Input value={form.namaAgt} onChange={(e) => setForm({ ...form, namaAgt: e.target.value })} placeholder="Nama agent/trader" />
                            </div>
                            <div className="space-y-2">
                                <Label>NIK Eksternal</Label>
                                <Select value={nikEksternals.find(n => n.nik === form.nikEksternal)?.id || 'none'} onValueChange={handleNikSelect}>
                                    <SelectTrigger><SelectValue placeholder="Pilih NIK" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">-- Pilih NIK --</SelectItem>
                                        {nikEksternals.map(n => (
                                            <SelectItem key={n.id} value={n.id}>
                                                {n.nik} - {n.namaLengkap}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Nomor Kontrak (dari Kontrak Register AGT) */}
                        <div className="space-y-2">
                            <Label>Nomor Kontrak (dari Kontrak Register)</Label>
                            <Select value={kontraks.find(k => k.nomorKontrak === form.nomorKontrak)?.id || 'none'} onValueChange={handleKontrakSelect}>
                                <SelectTrigger><SelectValue placeholder="Pilih kontrak AGT" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">-- Input manual --</SelectItem>
                                    {kontrakAgt.map(k => (
                                        <SelectItem key={k.id} value={k.id}>
                                            {k.nomorKontrak} - {k.namaPihak}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Input
                                value={form.nomorKontrak}
                                onChange={(e) => setForm({ ...form, nomorKontrak: e.target.value })}
                                placeholder="Atau input manual"
                                className="mt-2"
                            />
                        </div>

                        {/* Tanggal Bergabung */}
                        <div className="space-y-2">
                            <Label>Tanggal Bergabung</Label>
                            <Input type="date" value={form.tanggalBergabung} onChange={(e) => setForm({ ...form, tanggalBergabung: e.target.value })} />
                        </div>

                        {/* Fokus Produk */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Fokus Produk
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {FOKUS_PRODUK_OPTIONS.map(produk => {
                                    const isSelected = form.fokusProduk.includes(produk);
                                    return (
                                        <Badge
                                            key={produk}
                                            variant={isSelected ? 'default' : 'outline'}
                                            className="cursor-pointer hover:opacity-80"
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    fokusProduk: isSelected
                                                        ? form.fokusProduk.filter(p => p !== produk)
                                                        : [...form.fokusProduk, produk]
                                                });
                                            }}
                                        >
                                            {produk}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Fokus Market */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Fokus Market
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {FOKUS_MARKET_OPTIONS.map(market => {
                                    const isSelected = form.fokusMarket.includes(market);
                                    return (
                                        <Badge
                                            key={market}
                                            variant={isSelected ? 'secondary' : 'outline'}
                                            className="cursor-pointer hover:opacity-80"
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    fokusMarket: isSelected
                                                        ? form.fokusMarket.filter(m => m !== market)
                                                        : [...form.fokusMarket, market]
                                                });
                                            }}
                                        >
                                            {market}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Wilayah Fokus */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Wilayah Fokus
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {WILAYAH_OPTIONS.map(wilayah => {
                                    const isSelected = form.wilayahFokus.includes(wilayah);
                                    return (
                                        <Badge
                                            key={wilayah}
                                            variant={isSelected ? 'default' : 'outline'}
                                            className={`cursor-pointer hover:opacity-80 ${isSelected ? '' : 'border-blue-300 text-blue-700'}`}
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    wilayahFokus: isSelected
                                                        ? form.wilayahFokus.filter(w => w !== wilayah)
                                                        : [...form.wilayahFokus, wilayah]
                                                });
                                            }}
                                        >
                                            {wilayah}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label>Status AGT</Label>
                            <Select value={form.statusAgt} onValueChange={(val) => setForm({ ...form, statusAgt: val as AgtEntry['statusAgt'] })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {AGT_STATUS_OPTIONS.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Catatan */}
                        <div className="space-y-2">
                            <Label>Catatan</Label>
                            <Textarea value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="Catatan monitoring, evaluasi, dll." rows={3} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                        <Button onClick={handleSave}>
                            {editingItem ? 'Simpan Perubahan' : 'Tambah AGT'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}