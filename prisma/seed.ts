import Prisma from "@prisma/client";

const prisma = new Prisma.PrismaClient();

export async function seed(): Promise<void> {
  // TODO
  await prisma.$disconnect();
  return process.exit();
}
