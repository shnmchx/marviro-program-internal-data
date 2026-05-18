import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (type === 'all' && data) {
            const prisma = new PrismaClient();

            await prisma.nikInternal.deleteMany();
            await prisma.nikEksternal.deleteMany();
            await prisma.vendor.deleteMany();
            await prisma.buyer.deleteMany();
            await prisma.buyerDatabase.deleteMany();
            await prisma.kontrak.deleteMany();
            await prisma.project.deleteMany();
            await prisma.investor.deleteMany();
            await prisma.investorContract.deleteMany();
            await prisma.agtEntry.deleteMany();

            if (data.nikInternals?.length) for (const item of data.nikInternals) await prisma.nikInternal.create({ data: item });
            if (data.nikEksternals?.length) for (const item of data.nikEksternals) await prisma.nikEksternal.create({ data: item });
            if (data.vendors?.length) for (const item of data.vendors) await prisma.vendor.create({ data: item });
            if (data.buyers?.length) for (const item of data.buyers) await prisma.buyer.create({ data: item });
            if (data.buyerDatabases?.length) for (const item of data.buyerDatabases) await prisma.buyerDatabase.create({ data: item });
            if (data.kontraks?.length) for (const item of data.kontraks) await prisma.kontrak.create({ data: item });
            if (data.projects?.length) for (const item of data.projects) await prisma.project.create({ data: item });
            if (data.investors?.length) for (const item of data.investors) await prisma.investor.create({ data: item });
            if (data.investorContracts?.length) for (const item of data.investorContracts) await prisma.investorContract.create({ data: item });
            if (data.agtEntries?.length) for (const item of data.agtEntries) await prisma.agtEntry.create({ data: item });

            await prisma.$disconnect();
            return NextResponse.json({ success: true, message: 'All data synced!' });
        }

        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const prisma = new PrismaClient();
        const [nikInternals, nikEksternals, vendors, buyers, buyerDatabases, kontraks, projects, investors, investorContracts, agtEntries] = await Promise.all([
            prisma.nikInternal.findMany(), prisma.nikEksternal.findMany(), prisma.vendor.findMany(),
            prisma.buyer.findMany(), prisma.buyerDatabase.findMany(), prisma.kontrak.findMany(),
            prisma.project.findMany(), prisma.investor.findMany(), prisma.investorContract.findMany(),
            prisma.agtEntry.findMany(),
        ]);
        await prisma.$disconnect();
        return NextResponse.json({ success: true, data: { nikInternals, nikEksternals, vendors, buyers, buyerDatabases, kontraks, projects, investors, investorContracts, agtEntries } });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || 'Database error', data: {} });
    }
}