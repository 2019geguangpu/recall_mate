/**
 * Task Router
 * 任务相关的 tRPC 路由
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const taskRouter = router({
  // 获取所有任务
  getAll: publicProcedure.query(async () => {
    return await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // 根据状态获取任务
  getByStatus: publicProcedure
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      return await prisma.task.findMany({
        where: { status: input.status },
        orderBy: { createdAt: "desc" },
      });
    }),

  // 创建任务
  create: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        type: z.string().default("task"),
        status: z.string().default("pending"),
        priority: z.string().default("medium"),
        scheduledAt: z.string().datetime().optional(),
        dueDate: z.string().datetime().optional(),
        repeatPattern: z.any().optional(),
        smartTiming: z.any().optional(),
        tags: z.array(z.string()).optional(),
        category: z.string().optional(),
        voiceRecordId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          type: input.type,
          status: input.status,
          priority: input.priority,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
          repeatPattern: input.repeatPattern,
          smartTiming: input.smartTiming,
          tags: input.tags,
          category: input.category,
          voiceRecordId: input.voiceRecordId,
        },
      });
    }),

  // 更新任务
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.string().optional(),
        priority: z.string().optional(),
        scheduledAt: z.string().datetime().optional(),
        dueDate: z.string().datetime().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData: any = { ...data };
      
      if (input.scheduledAt) {
        updateData.scheduledAt = new Date(input.scheduledAt);
      }
      if (input.dueDate) {
        updateData.dueDate = new Date(input.dueDate);
      }
      if (input.status === "completed") {
        updateData.completedAt = new Date();
      }

      return await prisma.task.update({
        where: { id },
        data: updateData,
      });
    }),

  // 删除任务
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.task.delete({
        where: { id: input.id },
      });
    }),
});

