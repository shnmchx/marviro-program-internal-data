import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    try {
        const prisma = new PrismaClient();

        const [
            nikInternals, nikEksternals, vendors, buyers,
            buyerDatabases, kontraks, projects, investors,
            investorContracts, agtEntries
        ] = await Promise.all([
            prisma.nikInternal.findMany().catch(() => []),
            prisma.nikEksternal.findMany().catch(() => []),
            prisma.vendor.findMany().catch(() => []),
            prisma.buyer.findMany().catch(() => []),
            prisma.buyerDatabase.findMany().catch(() => []),
            prisma.kontrak.findMany().catch(() => []),
            prisma.project.findMany().catch(() => []),
            prisma.investor.findMany().catch(() => []),
            prisma.investorContract.findMany().catch(() => []),
            prisma.agtEntry.findMany().catch(() => []),
        ]);

        await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: {
                nikInternals: nikInternals || [],
                nikEksternals: nikEksternals || [],
                vendors: vendors || [],
                buyers: buyers || [],
                buyerDatabases: buyerDatabases || [],
                kontraks: kontraks || [],
                projects: projects || [],
                investors: investors || [],
                investorContracts: investorContracts || [],
                agtEntries: agtEntries || [],
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || 'Database error',
            data: {
                nikInternals: [], nikEksternals: [], vendors: [], buyers: [],
                buyerDatabases: [], kontraks: [], projects: [], investors: [],
                investorContracts: [], agtEntries: [],
            }
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (type === 'all' && data) {
            const prisma = new PrismaClient();

            // Clear all
            await Promise.all([
                prisma.nikInternal.deleteMany().catch(() => {}),
                prisma.nikEksternal.deleteMany().catch(() => {}),
                prisma.vendor.deleteMany().catch(() => {}),
                prisma.buyer.deleteMany().catch(() => {}),
                prisma.buyerDatabase.deleteMany().catch(() => {}),
                prisma.kontrak.deleteMany().catch(() => {}),
                prisma.project.deleteMany().catch(() => {}),
                prisma.investor.deleteMany().catch(() => {}),
                prisma.investorContract.deleteMany().catch(() => {}),
                prisma.agtEntry.deleteMany().catch(() => {}),
            ]);

            // Insert all
            const inserts = [];

            if (data.nikInternals?.length) {
                for (const item of data.nikInternals) {
                    inserts.push(prisma.nikInternal.create({ data: item }).catch(() => {}));
                }
            }
            if (data.nikEksternals?.length) {
                for (const item of data.nikEksternals) {
                    inserts.push(prisma.nikEksternal.create({ data: item }).catch(() => {}));
                }
            }
            if (data.vendors?.length) {
                for (const item of data.vendors) {
                    inserts.push(prisma.vendor.create({ data: item }).catch(() => {}));
                }
            }
            if (data.buyers?.length) {
                for (const item of data.buyers) {
                    inserts.push(prisma.buyer.create({ data: item }).catch(() => {}));
                }
            }
            if (data.buyerDatabases?.length) {
                for (const item of data.buyerDatabases) {
                    inserts.push(prisma.buyerDatabase.create({ data: item }).catch(() => {}));
                }
            }
            if (data.kontraks?.length) {
                for (const item of data.kontraks) {
                    inserts.push(prisma.kontrak.create({ data: item }).catch(() => {}));
                }
            }
            if (data.projects?.length) {
                for (const item of data.projects) {
                    inserts.push(prisma.project.create({ data: item }).catch(() => {}));
                }
            }
            if (data.investors?.length) {
                for (const item of data.investors) {
                    inserts.push(prisma.investor.create({ data: item }).catch(() => {}));
                }
            }
            if (data.investorContracts?.length) {
                for (const item of data.investorContracts) {
                    inserts.push(prisma.investorContract.create({ data: item }).catch(() => {}));
                }
            }
            if (data.agtEntries?.length) {
                for (const item of data.agtEntries) {
                    inserts.push(prisma.agtEntry.create({ data: item }).catch(() => {}));
                }
            }

            await Promise.all(inserts);
            await prisma.$disconnect();

            return NextResponse.json({ success: true, message: 'Data synced!' });
        }

        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
    }
}