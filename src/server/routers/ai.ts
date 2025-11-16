/**
 * AI Router
 * 使用 LangChain Agent 和 DeepSeek-R1 解析用户输入并创建任务
 */

import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { ChatDeepSeek } from "@langchain/deepseek";
import { createAgent } from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import { prisma } from "@/lib/prisma";
import { createTaskTool } from "@/lib/ai/tools";
import { buildTaskPrompt } from "@/lib/ai/prompts";

// 初始化 DeepSeek 模型
const model = new ChatDeepSeek({
  model: "deepseek-chat", // 或 "deepseek-reasoner" 用于推理任务
  temperature: 0.7,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const aiRouter = router({
  // 解析用户输入并创建任务
  parseAndCreateTask: publicProcedure
    .input(
      z.object({
        text: z.string(),
        voiceRecordId: z.string().optional(),
        voiceRecord: z.object({
          id: z.string(),
          type: z.enum(["reminder", "note", "task", "event", "thought"]).default("note"),
          status: z.enum(["recording", "processing", "completed", "failed"]).default("completed"),
          audioUrl: z.string().optional(),
          duration: z.number().default(0),
          transcript: z.string().optional(),
          confidence: z.number().optional(),
          extractedInfo: z.any().optional(),
        }).optional(),
        timezone: z.string().optional(), // 用户时区，如 "Asia/Shanghai"
      })
    )
    .mutation(async ({ input }) => {
      try {
        // 处理语音记录：确保语音记录存在（如果提供了）
        // 设计原则：语音记录和任务是解耦的，这里只是为了业务便利性提供一站式创建
        // 理想情况下，应该先调用 voiceRecord.create，然后再调用此 API
        let finalVoiceRecordId: string | undefined = input.voiceRecordId;
        
        if (input.voiceRecord) {
          // 如果提供了完整的语音记录数据，创建或更新它
          // 这提供了便利性，但理想情况下应该通过 voiceRecord.create 完成
          const existingRecord = await prisma.voiceRecord.findUnique({
            where: { id: input.voiceRecord.id },
          });
          
          if (existingRecord) {
            // 如果已存在，更新它
            await prisma.voiceRecord.update({
              where: { id: input.voiceRecord.id },
              data: {
                type: input.voiceRecord.type,
                status: input.voiceRecord.status,
                audioUrl: input.voiceRecord.audioUrl,
                duration: input.voiceRecord.duration,
                transcript: input.voiceRecord.transcript,
                confidence: input.voiceRecord.confidence,
                extractedInfo: input.voiceRecord.extractedInfo,
              },
            });
            finalVoiceRecordId = input.voiceRecord.id;
          } else {
            // 如果不存在，创建新的语音记录
            await prisma.voiceRecord.create({
              data: {
                id: input.voiceRecord.id,
                type: input.voiceRecord.type,
                status: input.voiceRecord.status,
                audioUrl: input.voiceRecord.audioUrl,
                duration: input.voiceRecord.duration,
                transcript: input.voiceRecord.transcript,
                confidence: input.voiceRecord.confidence,
                extractedInfo: input.voiceRecord.extractedInfo,
              },
            });
            finalVoiceRecordId = input.voiceRecord.id;
          }
        } else if (input.voiceRecordId) {
          // 如果只提供了 voiceRecordId，验证它是否存在
          const existingRecord = await prisma.voiceRecord.findUnique({
            where: { id: input.voiceRecordId },
          });
          
          if (!existingRecord) {
            // 如果不存在，记录警告但不阻止任务创建（符合解耦原则）
            console.warn(`VoiceRecord with id ${input.voiceRecordId} not found, will skip association`);
            finalVoiceRecordId = undefined;
          } else {
            finalVoiceRecordId = input.voiceRecordId;
          }
        }
        
        const tools = [createTaskTool(prisma)];
        
        // 使用模块化的 prompt 构建函数
        // 如果提供了时区，则构建包含时间信息的 prompt；否则使用基础 prompt
        const systemPrompt = buildTaskPrompt(input.timezone);
        
        // 使用 createAgent 创建 React Agent
        const agent = createAgent({
          model,
          tools,
          systemPrompt,
        });

        // 执行 Agent
        const result = await agent.invoke({
          messages: [
            {
              role: "human",
              content: input.text,
            },
          ],
        });

        // 从结果中提取创建的任务ID
        let taskId: string | null = null;
        let outputText = "";
        
        // 遍历所有消息，查找工具调用的结果
        for (const message of result.messages) {
          // 检查是否是工具消息（ToolMessage）
          if (message instanceof ToolMessage || message.constructor.name === "ToolMessage") {
            const toolMessage = message as ToolMessage;
            const toolContent = typeof toolMessage.content === "string" 
              ? toolMessage.content 
              : JSON.stringify(toolMessage.content);
            
            // 检查是否是 createTask 工具的结果
            if (toolMessage.name === "createTask" || toolContent.includes("taskId")) {
              try {
                const parsed = JSON.parse(toolContent);
                if (parsed.success && parsed.taskId) {
                  taskId = parsed.taskId;
                  outputText = parsed.message || toolContent;
                  break;
                }
              } catch (e) {
                // 如果不是 JSON，尝试正则匹配
                const taskIdMatch = toolContent.match(/taskId["\s:]+([a-zA-Z0-9_-]+)/);
                if (taskIdMatch) {
                  taskId = taskIdMatch[1];
                  outputText = toolContent;
                  break;
                }
              }
            }
          }
          
          // 同时检查消息内容中是否包含 taskId（可能是 AI 在回复中提到了）
          const content = typeof message.content === "string" 
            ? message.content 
            : JSON.stringify(message.content);
          
          // 尝试从 JSON 中提取
          try {
            const jsonMatch = content.match(/\{[\s\S]*"taskId"[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.taskId && !taskId) {
                taskId = parsed.taskId;
              }
            }
          } catch (e) {
            // 如果 JSON 解析失败，尝试正则匹配
            const taskIdMatch = content.match(/taskId["\s:]+([a-zA-Z0-9_-]+)/);
            if (taskIdMatch && !taskId) {
              taskId = taskIdMatch[1];
            }
          }
          
          // 收集所有消息内容作为输出文本
          if (content && !outputText) {
            outputText = content;
          }
        }
        
        // 如果还没找到，从最后一条消息中提取
        if (!taskId && result.messages.length > 0) {
          const lastMessage = result.messages[result.messages.length - 1];
          const lastContent = typeof lastMessage.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage.content);
          
          if (!outputText) {
            outputText = lastContent;
          }
          
          // 尝试从 JSON 中提取
          try {
            const jsonMatch = lastContent.match(/\{[\s\S]*"taskId"[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              if (parsed.taskId) {
                taskId = parsed.taskId;
              }
            }
          } catch (e) {
            // 如果 JSON 解析失败，尝试正则匹配
            const taskIdMatch = lastContent.match(/taskId["\s:]+([a-zA-Z0-9_-]+)/);
            if (taskIdMatch) {
              taskId = taskIdMatch[1];
            }
          }
        }

        if (taskId) {
          // 如果存在有效的 voiceRecordId，关联到任务
          if (finalVoiceRecordId) {
            await prisma.task.update({
              where: { id: taskId },
              data: { voiceRecordId: finalVoiceRecordId },
            });
          }

          const task = await prisma.task.findUnique({
            where: { id: taskId },
          });

          return {
            success: true,
            task,
            message: outputText,
          };
        }

        return {
          success: false,
          message: outputText || "未能创建任务",
        };
      } catch (error) {
        console.error("AI Agent error:", error);
        return {
          success: false,
          message: error instanceof Error ? error.message : "处理失败",
        };
      }
    }),
});

