'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/store';

export function SyncButton() {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const { syncToNeon, loadFromNeon } = useAdminStore();

    const handleSync = async () => {
        setStatus('syncing');
        toast.info('Syncing data ke Neon...');

        const success = await syncToNeon();

        if (success) {
            setStatus('success');
            toast.success('Data berhasil disync ke Neon Database!');
            setTimeout(() => setStatus('idle'), 3000);
        } else {
            setStatus('error');
            toast.error('Gagal sync ke Neon!');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    const handleLoad = async () => {
        setStatus('syncing');
        toast.info('Loading data dari Neon...');

        const success = await loadFromNeon();

        if (success) {
            setStatus('success');
            toast.success('Data berhasil diload dari Neon!');
            setTimeout(() => setStatus('idle'), 3000);
        } else {
            setStatus('error');
            toast.error('Gagal load dari Neon!');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={status === 'syncing'}
                className="text-xs gap-2"
            >
                {status === 'syncing' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                ) : status === 'error' ? (
                    <XCircle className="h-3 w-3 text-red-500" />
                ) : (
                    <Cloud className="h-3 w-3" />
                )}
                Sync to Neon
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLoad}
                disabled={status === 'syncing'}
                className="text-xs gap-2"
            >
                <CloudOff className="h-3 w-3" />
                Load
            </Button>
        </div>
    );
}