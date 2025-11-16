/**
 * 主 Router
 * 聚合所有子路由
 */

import { router } from "../trpc";
import { taskRouter } from "./task";
import { aiRouter } from "./ai";
import { voiceRecordRouter } from "./voice-record";

export const appRouter = router({
  task: taskRouter,
  ai: aiRouter,
  voiceRecord: voiceRecordRouter,
});

export type AppRouter = typeof appRouter;

