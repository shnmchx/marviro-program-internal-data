import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { type, data } = body;

        if (type === 'all' && data) {
            const prisma = new PrismaClient();

            // Clear all existing data
            await prisma.nikInternal.deleteMany().catch(() => {});
            await prisma.nikEksternal.deleteMany().catch(() => {});
            await prisma.vendor.deleteMany().catch(() => {});
            await prisma.buyer.deleteMany().catch(() => {});
            await prisma.buyerDatabase.deleteMany().catch(() => {});
            await prisma.kontrak.deleteMany().catch(() => {});
            await prisma.project.deleteMany().catch(() => {});
            await prisma.investor.deleteMany().catch(() => {});
            await prisma.investorContract.deleteMany().catch(() => {});
            await prisma.agtEntry.deleteMany().catch(() => {});

            // Insert NIK Internal
            if (data.nikInternals?.length) {
                for (const item of data.nikInternals) {
                    await prisma.nikInternal.create({
                        data: {
                            id: item.id || '',
                            nik: item.nik || '',
                            namaLengkap: item.namaLengkap || '',
                            jabatanDivisi: item.jabatanDivisi || '',
                            status: item.status || '',
                            tipeHubungan: item.tipeHubungan || '',
                            tglMulai: item.tglMulai || '',
                            tglBerakhir: item.tglBerakhir || '',
                            payroll: item.payroll || '',
                            keterangan: item.keterangan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert NIK Eksternal
            if (data.nikEksternals?.length) {
                for (const item of data.nikEksternals) {
                    await prisma.nikEksternal.create({
                        data: {
                            id: item.id || '',
                            nik: item.nik || '',
                            namaLengkap: item.namaLengkap || '',
                            klasifikasi: item.klasifikasi || '',
                            peran: item.peran || '',
                            dasarKontrak: item.dasarKontrak || '',
                            nomorKontrak: item.nomorKontrak || '',
                            tglMulai: item.tglMulai || '',
                            tglBerakhir: item.tglBerakhir || '',
                            skemaImbalan: item.skemaImbalan || '',
                            pajak: item.pajak || '',
                            status: item.status || '',
                            keterangan: item.keterangan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Vendors
            if (data.vendors?.length) {
                for (const item of data.vendors) {
                    await prisma.vendor.create({
                        data: {
                            id: item.id || '',
                            vendorId: item.vendorId || '',
                            tglRegistrasi: item.tglRegistrasi || '',
                            namaSupplier: item.namaSupplier || '',
                            pic: item.pic || '',
                            provinsi: item.provinsi || '',
                            komoditas: item.komoditas || '',
                            kapasitasBulan: item.kapasitasBulan || '',
                            noHp: item.noHp || '',
                            hasilAudit: item.hasilAudit || '',
                            status: item.status || '',
                            keterangan: item.keterangan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Buyers
            if (data.buyers?.length) {
                for (const item of data.buyers) {
                    await prisma.buyer.create({
                        data: {
                            id: item.id || '',
                            buyerId: item.buyerId || '',
                            tglRegistrasi: item.tglRegistrasi || '',
                            namaPerusahaan: item.namaPerusahaan || '',
                            pic: item.pic || '',
                            negara: item.negara || '',
                            alamatLengkap: item.alamatLengkap || '',
                            email: item.email || '',
                            noHp: item.noHp || '',
                            komoditasMinat: item.komoditasMinat || '',
                            metodePembayaran: item.metodePembayaran || '',
                            status: item.status || '',
                            keterangan: item.keterangan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Buyer Database
            if (data.buyerDatabases?.length) {
                for (const item of data.buyerDatabases) {
                    await prisma.buyerDatabase.create({
                        data: {
                            id: item.id || '',
                            year: item.year || 0,
                            month: item.month || 0,
                            company: item.company || '',
                            contact: item.contact || '',
                            country: item.country || '',
                            productInterest: item.productInterest || '',
                            quantity: item.quantity || '',
                            terms: item.terms || '',
                            email: item.email || '',
                            phone: item.phone || '',
                            status: item.status || '',
                            sumberData: item.sumberData || '',
                            linkedAgtId: item.linkedAgtId || '',
                            lastFollowUp: item.lastFollowUp || '',
                            nextFollowUp: item.nextFollowUp || '',
                            catatan: item.catatan || '',
                            catatanDetail: item.catatanDetail || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Kontraks
            if (data.kontraks?.length) {
                for (const item of data.kontraks) {
                    await prisma.kontrak.create({
                        data: {
                            id: item.id || '',
                            nomorKontrak: item.nomorKontrak || '',
                            jenisKontrak: item.jenisKontrak || '',
                            klasifikasi: item.klasifikasi || '',
                            namaPihak: item.namaPihak || '',
                            referensiId: item.referensiId || '',
                            objekKontrak: item.objekKontrak || '',
                            komoditas: item.komoditas || '',
                            tglMulai: item.tglMulai || '',
                            tglBerakhir: item.tglBerakhir || '',
                            status: item.status || '',
                            keterangan: item.keterangan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Projects
            if (data.projects?.length) {
                for (const item of data.projects) {
                    await prisma.project.create({
                        data: {
                            id: item.id || '',
                            namaProyek: item.namaProyek || '',
                            deskripsi: item.deskripsi || '',
                            kodeProyek: item.kodeProyek || '',
                            minInvestor: item.minInvestor || 0,
                            maxInvestor: item.maxInvestor || 0,
                            minInvestasiPerInvestor: item.minInvestasiPerInvestor || 0,
                            maxInvestasiPerInvestor: item.maxInvestasiPerInvestor || 0,
                            totalNilaiProyek: item.totalNilaiProyek || 0,
                            omzetKotor: item.omzetKotor || 0,
                            biayaOperasional: item.biayaOperasional || 0,
                            labaBersih: item.labaBersih || 0,
                            statusProyek: item.statusProyek || '',
                            tanggalMulai: item.tanggalMulai || '',
                            tanggalSelesai: item.tanggalSelesai || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Investors
            if (data.investors?.length) {
                for (const item of data.investors) {
                    await prisma.investor.create({
                        data: {
                            id: item.id || '',
                            projectId: item.projectId || '',
                            nomorSurat: item.nomorSurat || '',
                            namaInvestor: item.namaInvestor || '',
                            company: item.company || '',
                            email: item.email || '',
                            phone: item.phone || '',
                            alamat: item.alamat || '',
                            npwp: item.npwp || '',
                            nilaiInvestasi: item.nilaiInvestasi || 0,
                            persentaseBagiHasil: item.persentaseBagiHasil || 0,
                            tanggalMulai: item.tanggalMulai || '',
                            tanggalSelesai: item.tanggalSelesai || '',
                            statusInvestasi: item.statusInvestasi || '',
                            catatan: item.catatan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert Investor Contracts
            if (data.investorContracts?.length) {
                for (const item of data.investorContracts) {
                    await prisma.investorContract.create({
                        data: {
                            id: item.id || '',
                            investorId: item.investorId || '',
                            projectId: item.projectId || '',
                            nomorKontrak: item.nomorKontrak || '',
                            nomorSuratInvestor: item.nomorSuratInvestor || '',
                            nilaiInvestasi: item.nilaiInvestasi || 0,
                            persentaseBagiHasil: item.persentaseBagiHasil || 0,
                            jangkaWaktu: item.jangkaWaktu || 0,
                            tanggalMulai: item.tanggalMulai || '',
                            tanggalSelesai: item.tanggalSelesai || '',
                            caraPembayaran: item.caraPembayaran || '',
                            statusKontrak: item.statusKontrak || '',
                            syaratKetentuan: item.syaratKetentuan || '',
                            catatan: item.catatan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            // Insert AGT Entries - FIX: Convert array to JSON string
            if (data.agtEntries?.length) {
                for (const item of data.agtEntries) {
                    await prisma.agtEntry.create({
                        data: {
                            id: item.id || '',
                            kodeAgt: item.kodeAgt || '',
                            namaAgt: item.namaAgt || '',
                            nikEksternal: item.nikEksternal || '',
                            nomorKontrak: item.nomorKontrak || '',
                            fokusProduk: Array.isArray(item.fokusProduk) ? JSON.stringify(item.fokusProduk) : (item.fokusProduk || '[]'),
                            fokusMarket: Array.isArray(item.fokusMarket) ? JSON.stringify(item.fokusMarket) : (item.fokusMarket || '[]'),
                            wilayahFokus: Array.isArray(item.wilayahFokus) ? JSON.stringify(item.wilayahFokus) : (item.wilayahFokus || '[]'),
                            statusAgt: item.statusAgt || '',
                            tanggalBergabung: item.tanggalBergabung || '',
                            catatan: item.catatan || '',
                            createdAt: item.createdAt || new Date().toISOString(),
                            updatedAt: item.updatedAt || new Date().toISOString(),
                        }
                    }).catch(() => {});
                }
            }

            await prisma.$disconnect();
            return NextResponse.json({ success: true, message: 'All data synced!' });
        }

        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json({ success: false, error: error?.message || 'Server error' }, { status: 500 });
    }
}

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

        // Parse JSON strings back to arrays for AGT entries
        const parsedAgtEntries = agtEntries.map((entry: any) => ({
            ...entry,
            fokusProduk: typeof entry.fokusProduk === 'string' ? JSON.parse(entry.fokusProduk) : entry.fokusProduk,
            fokusMarket: typeof entry.fokusMarket === 'string' ? JSON.parse(entry.fokusMarket) : entry.fokusMarket,
            wilayahFokus: typeof entry.wilayahFokus === 'string' ? JSON.parse(entry.wilayahFokus) : entry.wilayahFokus,
        }));

        await prisma.$disconnect();

        return NextResponse.json({
            success: true,
            data: {
                nikInternals, nikEksternals, vendors, buyers,
                buyerDatabases, kontraks, projects, investors,
                investorContracts, agtEntries: parsedAgtEntries,
            }
        });
    } catch (error: any) {
        console.error('GET error:', error);
        return NextResponse.json({ success: false, error: error?.message || 'Database error', data: {} });
    }
}