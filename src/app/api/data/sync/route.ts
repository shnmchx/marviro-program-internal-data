import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
    try {
        const prisma = new PrismaClient();

        const [nikInternals, nikEksternals] = await Promise.all([
            prisma.nikInternal.findMany().catch(() => []),
            prisma.nikEksternal.findMany().catch(() => []),
        ]);

        await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: {
                nikInternals: nikInternals || [],
                nikEksternals: nikEksternals || [],
                vendors: [],
                buyers: [],
                buyerDatabases: [],
                kontraks: [],
                projects: [],
                investors: [],
                investorContracts: [],
                agtEntries: [],
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || 'Database error',
            data: {}
        });
    }
}