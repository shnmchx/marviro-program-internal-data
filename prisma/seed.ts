import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingUser = await prisma.user.findUnique({
    where: { email: 'master@marviro.com' },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('bcdf5ecc', 12);
    
    await prisma.user.create({
      data: {
        email: 'master@marviro.com',
        password: hashedPassword,
        name: 'Master Admin',
        role: 'admin',
      },
    });
    
    console.log('Default user created: master@marviro.com / bcdf5ecc');
  } else {
    console.log('Default user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
