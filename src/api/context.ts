import type { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";

export type Context = {
  prisma: PrismaClient;
};

export type AppInfos = {
  //
};

export async function resolveSession(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: Response
): Promise<{ infos: AppInfos | null }> {
  return { infos: null };
}
