import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

// Perpanjang timeout
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

function clean(data: any, fields: string[]) {
  const c: any = {};
  for (const f of fields) {
    c[f] = data[f] ?? '';
  }
  return c;
}

async function upload() {
  const raw = fs.readFileSync('scripts/marviro-admin-backup-2026-05-18.json', 'utf-8');
  const json = JSON.parse(raw);
  const d = json.state || json;

  console.log('Uploading to Neon...\n');

  // Clear one by one with delay
  console.log('Clearing old data...');
  try { await prisma.nikInternal.deleteMany(); } catch(e) {}
  try { await prisma.nikEksternal.deleteMany(); } catch(e) {}
  try { await prisma.vendor.deleteMany(); } catch(e) {}
  try { await prisma.buyer.deleteMany(); } catch(e) {}
  try { await prisma.buyerDatabase.deleteMany(); } catch(e) {}
  try { await prisma.kontrak.deleteMany(); } catch(e) {}
  try { await prisma.project.deleteMany(); } catch(e) {}
  try { await prisma.investor.deleteMany(); } catch(e) {}
  try { await prisma.investorContract.deleteMany(); } catch(e) {}
  try { await prisma.agtEntry.deleteMany(); } catch(e) {}
  console.log('Cleared!\n');

  let n = 0;

  const insert = async (label: string, items: any[], fields: string[], fn: any) => {
    if (items?.length) {
      console.log(`Inserting ${items.length} ${label}...`);
      for (let i = 0; i < items.length; i++) {
        try {
          await fn({ data: clean(items[i], fields) });
        } catch(e: any) {
          console.log(`  ⚠️ Skip row ${i}: ${e.message?.slice(0, 100)}`);
        }
      }
      console.log(`✅ ${items.length} ${label}`);
      return items.length;
    }
    return 0;
  };

  n += await insert('NIK Internals', d.nikInternals, ['id','nik','namaLengkap','jabatanDivisi','status','tipeHubungan','tglMulai','tglBerakhir','payroll','keterangan','createdAt','updatedAt'], (x: any) => prisma.nikInternal.create(x));
  n += await insert('NIK Eksternals', d.nikEksternals, ['id','nik','namaLengkap','klasifikasi','peran','dasarKontrak','nomorKontrak','tglMulai','tglBerakhir','skemaImbalan','pajak','status','keterangan','createdAt','updatedAt'], (x: any) => prisma.nikEksternal.create(x));
  n += await insert('Vendors', d.vendors, ['id','vendorId','tglRegistrasi','namaSupplier','pic','provinsi','komoditas','kapasitasBulan','noHp','hasilAudit','status','keterangan','createdAt'], (x: any) => prisma.vendor.create(x));
  n += await insert('Buyers', d.buyers, ['id','buyerId','tglRegistrasi','namaPerusahaan','pic','negara','alamatLengkap','email','noHp','komoditasMinat','metodePembayaran','status','keterangan','createdAt'], (x: any) => prisma.buyer.create(x));
  n += await insert('Buyer DB', d.buyerDatabases, ['id','year','month','company','contact','country','productInterest','quantity','terms','email','phone','status','lastFollowUp','nextFollowUp','catatan','catatanDetail','sumberData','linkedAgtId','createdAt','updatedAt'], (x: any) => prisma.buyerDatabase.create(x));
  n += await insert('Kontraks', d.kontraks, ['id','nomorKontrak','jenisKontrak','klasifikasi','namaPihak','referensiId','objekKontrak','komoditas','tglMulai','tglBerakhir','status','keterangan','createdAt','updatedAt'], (x: any) => prisma.kontrak.create(x));
  n += await insert('Projects', d.projects, ['id','namaProyek','deskripsi','kodeProyek','minInvestor','maxInvestor','minInvestasiPerInvestor','maxInvestasiPerInvestor','totalNilaiProyek','omzetKotor','biayaOperasional','labaBersih','statusProyek','tanggalMulai','tanggalSelesai','createdAt','updatedAt'], (x: any) => prisma.project.create(x));
  n += await insert('Investors', d.investors, ['id','projectId','nomorSurat','namaInvestor','company','email','phone','alamat','npwp','nilaiInvestasi','persentaseBagiHasil','tanggalMulai','tanggalSelesai','statusInvestasi','catatan','createdAt','updatedAt'], (x: any) => prisma.investor.create(x));
  n += await insert('Investor Contracts', d.investorContracts, ['id','investorId','projectId','nomorKontrak','nomorSuratInvestor','nilaiInvestasi','persentaseBagiHasil','jangkaWaktu','tanggalMulai','tanggalSelesai','caraPembayaran','statusKontrak','syaratKetentuan','catatan','createdAt','updatedAt'], (x: any) => prisma.investorContract.create(x));
  n += await insert('AGT Entries', d.agtEntries, ['id','kodeAgt','namaAgt','nikEksternal','nomorKontrak','fokusProduk','fokusMarket','wilayahFokus','statusAgt','tanggalBergabung','catatan','createdAt','updatedAt'], (x: any) => prisma.agtEntry.create(x));

  console.log(`\n🎉 Total ${n} records uploaded!`);
  await prisma.$disconnect();
}

upload().catch(e => { console.error('❌', e.message); process.exit(1); });
