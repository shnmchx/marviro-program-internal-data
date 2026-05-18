import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Dynamic import Prisma
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();

        // Test insert satu data
        await prisma.nikInternal.create({
            data: {
                id: 'test-' + Date.now(),
                nik: 'MRV-TEST-001',
                namaLengkap: 'Test User',
                jabatanDivisi: 'Test',
                status: 'Aktif',
                tipeHubungan: 'Test',
                tglMulai: '2025-01-01',
                tglBerakhir: '2025-12-31',
                payroll: 'Ya',
                keterangan: 'Test sync',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        });

        await prisma.$disconnect();

        return NextResponse.json({ success: true, message: 'Data inserted!' });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || String(error),
            code: error?.code
        }, { status: 500 });
    }
}