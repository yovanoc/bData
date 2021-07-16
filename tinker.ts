import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function tinker(): Promise<void> {
  await prisma.$disconnect();
  return process.exit();
}

tinker();
