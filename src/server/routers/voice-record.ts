/**
 * Voice Record Router
 * 语音记录相关的 tRPC 路由
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { prisma } from "@/lib/prisma";

export const voiceRecordRouter = router({
  // 获取所有语音记录
  getAll: publicProcedure.query(async () => {
    return await prisma.voiceRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  // 根据 ID 获取语音记录
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.voiceRecord.findUnique({
        where: { id: input.id },
        include: {
          tasks: true, // 包含关联的任务
        },
      });
    }),

  // 创建语音记录
  create: publicProcedure
    .input(
      z.object({
        id: z.string().optional(), // 可选，如果不提供则自动生成
        type: z.enum(["reminder", "note", "task", "event", "thought"]).default("note"),
        status: z.enum(["recording", "processing", "completed", "failed"]).default("completed"),
        audioUrl: z.string().optional(),
        duration: z.number().default(0),
        transcript: z.string().optional(),
        confidence: z.number().optional(),
        extractedInfo: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.voiceRecord.create({
        data: id ? { id, ...data } : data,
      });
    }),

  // 更新语音记录
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(["reminder", "note", "task", "event", "thought"]).optional(),
        status: z.enum(["recording", "processing", "completed", "failed"]).optional(),
        audioUrl: z.string().optional(),
        duration: z.number().optional(),
        transcript: z.string().optional(),
        confidence: z.number().optional(),
        extractedInfo: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.voiceRecord.update({
        where: { id },
        data,
      });
    }),

  // 删除语音记录
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.voiceRecord.delete({
        where: { id: input.id },
      });
    }),

  // 关联任务到语音记录（通过更新任务）
  associateTask: publicProcedure
    .input(
      z.object({
        voiceRecordId: z.string(),
        taskId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // 先检查语音记录是否存在
      const voiceRecord = await prisma.voiceRecord.findUnique({
        where: { id: input.voiceRecordId },
      });

      if (!voiceRecord) {
        throw new Error(`VoiceRecord with id ${input.voiceRecordId} not found`);
      }

      // 更新任务，关联语音记录
      return await prisma.task.update({
        where: { id: input.taskId },
        data: { voiceRecordId: input.voiceRecordId },
      });
    }),
});

