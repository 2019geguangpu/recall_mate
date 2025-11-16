"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Reminder } from "@/lib/types/reminder";

interface ReminderListProps {
  reminders: Reminder[];
  onComplete?: (id: string) => void;
  onSnooze?: (id: string, minutes: number) => void;
  onDelete?: (id: string) => void;
}

export function ReminderList({
  reminders,
  onComplete,
  onSnooze,
  onDelete,
}: ReminderListProps) {
  const getPriorityColor = (priority: Reminder["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-white";
      case "high":
        return "bg-secondary-500 text-gray-900";
      case "medium":
        return "bg-primary-500 text-white";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: Reminder["status"]) => {
    switch (status) {
      case "completed":
        return "bg-accent-100 text-accent-700";
      case "snoozed":
        return "bg-secondary-100 text-secondary-700";
      case "pending":
        return "bg-primary-100 text-primary-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天后`;
    if (hours > 0) return `${hours}小时后`;
    if (minutes > 0) return `${minutes}分钟后`;
    if (minutes < 0) return "已过期";
    return "现在";
  };

  return (
    <div className="space-y-3">
      {reminders.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">暂无提醒</p>
        </div>
      ) : (
        reminders.map((reminder) => (
          <div
            key={reminder.id}
            className="rounded-lg border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                      reminder.priority
                    )}`}
                  >
                    {reminder.priority === "urgent"
                      ? "紧急"
                      : reminder.priority === "high"
                      ? "高"
                      : reminder.priority === "medium"
                      ? "中"
                      : "低"}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                      reminder.status
                    )}`}
                  >
                    {reminder.status === "completed"
                      ? "已完成"
                      : reminder.status === "snoozed"
                      ? "已推迟"
                      : "待处理"}
                  </span>
                  {reminder.smartTiming && (
                    <span className="rounded-full bg-accent-100 px-2 py-1 text-xs text-accent-700">
                      🤖 智能提醒
                    </span>
                  )}
                </div>
                <h3 className="mb-1 text-lg font-semibold text-foreground">
                  {reminder.title}
                </h3>
                {reminder.description && (
                  <p className="mb-2 text-sm text-muted-foreground">
                    {reminder.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>⏰ {formatDate(reminder.scheduledAt)}</span>
                  {reminder.repeatPattern && (
                    <span>🔄 {reminder.repeatPattern.frequency === "daily" ? "每天" :
                              reminder.repeatPattern.frequency === "weekly" ? "每周" :
                              reminder.repeatPattern.frequency === "monthly" ? "每月" : "每年"}</span>
                  )}
                </div>
                {reminder.smartTiming && (
                  <div className="mt-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                    💡 基于您的{reminder.smartTiming.basedOn === "sleep" ? "作息规律" :
                              reminder.smartTiming.basedOn === "work" ? "工作模式" :
                              reminder.smartTiming.basedOn === "health" ? "健康需求" :
                              reminder.smartTiming.basedOn === "habit" ? "习惯分析" : "行为模式"}智能推荐
                  </div>
                )}
              </div>
              {reminder.status === "pending" && (
                <div className="ml-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onComplete?.(reminder.id)}
                  >
                    完成
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSnooze?.(reminder.id, 10)}
                  >
                    推迟10分钟
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete?.(reminder.id)}
                  >
                    删除
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

