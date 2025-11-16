/**
 * LangChain Tools
 * 定义 Agent 可以使用的工具
 */

import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import type { PrismaClient } from "@prisma/client";

/**
 * 创建任务工具
 */
export function createTaskTool(prisma: PrismaClient) {
  return new DynamicStructuredTool({
    name: "createTask",
    description: "创建一个新任务。当用户提到需要做某件事时使用此工具。",
    schema: z.object({
      title: z.string().describe("任务标题，简洁明了"),
      description: z.string().optional().describe("任务详细描述"),
      scheduledAt: z.string().optional().describe("计划执行时间，ISO 8601 格式，如：2024-01-01T22:00:00Z"),
      priority: z.enum(["low", "medium", "high", "urgent"]).default("medium").describe("任务优先级"),
      category: z.string().optional().describe("任务分类，如：充电、健康、工作等"),
      tags: z.array(z.string()).optional().describe("任务标签"),
    }),
    func: async ({ title, description, scheduledAt, priority, category, tags }) => {
      try {
        const task = await prisma.task.create({
          data: {
            title,
            description,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            priority,
            category,
            tags: tags || [],
            type: "task",
            status: "pending",
          },
        });

        // 返回格式：包含任务ID，方便 Agent 后续提取
        return JSON.stringify({
          success: true,
          taskId: task.id,
          message: `任务创建成功！ID: ${task.id}, 标题: ${task.title}`,
        });
      } catch (error) {
        return JSON.stringify({
          success: false,
          message: `创建任务失败: ${error instanceof Error ? error.message : "未知错误"}`,
        });
      }
    },
  });
}

