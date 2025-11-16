/**
 * tRPC 初始化
 */

import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";

export const t = initTRPC.context<{
  prisma: typeof prisma;
}>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

