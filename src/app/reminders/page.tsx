"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";
import { ReminderList } from "@/components/reminder/reminder-list";
import { PermissionPrompt } from "@/components/notifications/permission-prompt";
import { trpc } from "@/lib/trpc/client";
import type { Reminder } from "@/lib/types/reminder";
import type { VoiceRecord } from "@/lib/types/voice-record";
import { useNotificationContext } from "@/components/notifications/notification-provider";
import { TaskForNotification } from "@/hooks/types";

// 将 Task 转换为 Reminder 格式
function taskToReminder(task: any): Reminder {
  return {
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    type: task.type === "reminder" ? "task" : (task.type as Reminder["type"]) || "task",
    priority: task.priority as Reminder["priority"],
    status: task.status === "cancelled" ? "cancelled" : (task.status as Reminder["status"]),
    scheduledAt: task.scheduledAt ? new Date(task.scheduledAt).toISOString() : new Date().toISOString(),
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : undefined,
    repeatPattern: task.repeatPattern ? {
      frequency: task.repeatPattern.frequency || "daily",
      interval: task.repeatPattern.interval || 1,
      daysOfWeek: task.repeatPattern.daysOfWeek,
      endDate: task.repeatPattern.endDate,
    } : undefined,
    smartTiming: task.smartTiming ? {
      basedOn: task.smartTiming.basedOn || "behavior",
      optimalTime: task.smartTiming.optimalTime,
      context: task.smartTiming.context,
    } : undefined,
    createdAt: new Date(task.createdAt).toISOString(),
    updatedAt: new Date(task.updatedAt).toISOString(),
    completedAt: task.completedAt ? new Date(task.completedAt).toISOString() : undefined,
    tags: Array.isArray(task.tags) ? task.tags : undefined,
    category: task.category || undefined,
  };
}

export default function RemindersPage() {
  // 使用 tRPC 获取任务数据
  const { data: tasks, isLoading, refetch } = trpc.task.getAll.useQuery();
  
  // 将任务转换为提醒格式
  const reminders: Reminder[] = tasks ? tasks.map(taskToReminder) : [];

  // 获取通知上下文（用于清理已通知的任务ID）
  // 注意：NotificationProvider 在 layout 中已经包裹了所有页面，所以这里总是可用的
  const notificationContext = useNotificationContext();

  // tRPC mutations
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleRecordComplete = (record: VoiceRecord) => {
    // 语音记录完成后，刷新任务列表
    // 实际的任务创建已经在主页面通过 AI Agent 完成
    refetch();
  };

  const handleComplete = async (id: string) => {
    try {
      await updateTask.mutateAsync({
        id,
        status: "completed",
      });
      // 清理已通知的任务ID
      notificationContext.clearNotifiedTask(id);
    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const handleSnooze = async (id: string, minutes: number) => {
    // 对于推迟功能，我们可以更新 scheduledAt 时间
    const task = tasks?.find((t: TaskForNotification) => t.id === id);
    if (task && task.scheduledAt) {
      const newScheduledAt = new Date(task.scheduledAt);
      newScheduledAt.setMinutes(newScheduledAt.getMinutes() + minutes);
      
      try {
        await updateTask.mutateAsync({
          id,
          scheduledAt: newScheduledAt.toISOString(),
        });
        // 清理已通知的任务ID，这样在新时间到达时还能收到通知
        notificationContext.clearNotifiedTask(id);
      } catch (error) {
        console.error("Failed to snooze task:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个任务吗？")) {
      try {
        await deleteTask.mutateAsync({ id });
        // 清理已通知的任务ID
        notificationContext.clearNotifiedTask(id);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const pendingReminders = reminders.filter((r) => r.status === "pending");
  const completedReminders = reminders.filter((r) => r.status === "completed");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">提醒管家</h1>
          <p className="text-lg text-muted-foreground">
            智能提醒系统，基于您的用户画像提供个性化提醒
          </p>
        </div>

        {/* 通知权限提示 */}
        <PermissionPrompt />

        {/* 语音记录 */}
        <div className="mb-8">
          <VoiceRecorder onRecordComplete={handleRecordComplete} />
        </div>

        {/* 统计信息 */}
        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-bold text-foreground">{reminders.length}</div>
            <div className="text-sm text-muted-foreground">总提醒数</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-bold text-primary-500">{pendingReminders.length}</div>
            <div className="text-sm text-muted-foreground">待处理</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-bold text-accent-500">{completedReminders.length}</div>
            <div className="text-sm text-muted-foreground">已完成</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="text-2xl font-bold text-secondary-500">
              {Math.round((completedReminders.length / reminders.length) * 100) || 0}%
            </div>
            <div className="text-sm text-muted-foreground">完成率</div>
          </div>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="mb-8 text-center text-muted-foreground">
            加载中...
          </div>
        )}

        {/* 待处理提醒 */}
        {!isLoading && (
          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">待处理提醒</h2>
            <ReminderList
              reminders={pendingReminders}
              onComplete={handleComplete}
              onSnooze={handleSnooze}
              onDelete={handleDelete}
            />
          </div>
        )}

        {/* 已完成提醒 */}
        {!isLoading && completedReminders.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-foreground">已完成提醒</h2>
            <ReminderList reminders={completedReminders} />
          </div>
        )}
      </main>
    </div>
  );
}

