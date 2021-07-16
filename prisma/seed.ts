import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seed(): Promise<void> {
  // TODO
  await prisma.$disconnect();
  return process.exit();
}
