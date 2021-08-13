import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

async function tinker(): Promise<void> {
  await prisma.$disconnect();
  return process.exit();
}

tinker();
