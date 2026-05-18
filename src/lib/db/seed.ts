import 'dotenv/config';
import { db } from './index';
import { seedDefaultUser } from '@/lib/auth';

async function main() {
    console.log('Seeding database...');
    await seedDefaultUser();
    console.log('Done! Default user: master@marviro.com / bcdf5ecc');
    process.exit(0);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});