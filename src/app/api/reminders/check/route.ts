/**
 * API Route: 检查待提醒的任务
 * 供 Service Worker 调用，用于后台检查提醒
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const now = new Date();
    
    // 查找所有待提醒的任务
    // 检查范围：过去30秒到未来60秒
    // - 过去30秒：防止错过刚刚到期的任务
    // - 未来60秒：提前通知，确保即使检查间隔是30秒，也能在任务到期前通知
    const pastInterval = 30000; // 30秒
    const futureInterval = 60000; // 60秒
    const beforeTime = new Date(now.getTime() - pastInterval);
    const afterTime = new Date(now.getTime() + futureInterval);

    const tasks = await prisma.task.findMany({
      where: {
        status: "pending",
        scheduledAt: {
          gte: beforeTime,
          lte: afterTime,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        scheduledAt: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("检查提醒失败:", error);
    return NextResponse.json(
      { error: "检查提醒失败" },
      { status: 500 }
    );
  }
}

