'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cloud, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore } from '@/lib/store';

export function SyncButton() {
    const [status, setStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
    const syncToNeon = useAdminStore(state => state.syncToNeon);
    const isSyncing = useAdminStore(state => state.isSyncing);

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
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={isSyncing}
            className="text-xs gap-2"
        >
            {isSyncing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Cloud className="h-3 w-3" />}
            Sync to Neon
        </Button>
    );
}