/**
 * 通知 Hook
 * useNotifications Hook
 * 
 * 用于管理提醒通知，定期检查待提醒的任务并触发通知
 */

import { useEffect, useRef, useState } from "react";
import { notificationService } from "@/lib/notifications/notification-service";
import { trpc } from "@/lib/trpc/client";
import { TaskForNotification } from "./types";

interface UseNotificationsOptions {
  /**
   * 检查间隔（毫秒），默认 30 秒
   */
  checkInterval?: number;
  /**
   * 是否自动请求权限
   */
  autoRequestPermission?: boolean;
  /**
   * 已通知的任务ID集合（用于避免重复通知）
   */
  notifiedTaskIds?: Set<string>;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    checkInterval = 30000, // 30秒检查一次
    autoRequestPermission = true,
  } = options;

  const [permission, setPermission] = useState<"default" | "granted" | "denied">("default");
  const [isEnabled, setIsEnabled] = useState(false);
  const notifiedTaskIdsRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 获取所有待提醒的任务
  const { data: tasks, refetch } = trpc.task.getAll.useQuery(undefined, {
    refetchInterval: checkInterval, // 定期刷新
  });

  /**
   * 请求通知权限
   */
  const requestPermission = async () => {
    try {
      const perm = await notificationService.requestPermission();
      setPermission(perm);
      setIsEnabled(perm === "granted");
      return perm;
    } catch (error) {
      console.error("请求通知权限失败:", error);
      setPermission("denied");
      setIsEnabled(false);
      return "denied";
    }
  };

  /**
   * 检查并发送通知
   */
  const checkAndNotify = useRef<() => Promise<void>>(async () => {
    if (!isEnabled || !tasks) {
      return;
    }

    const now = new Date();
    const notifiedIds = notifiedTaskIdsRef.current;

    // 筛选出需要提醒的任务
    // 使用简化的类型定义避免 TypeScript 过度推断
    const tasksToNotify = (tasks as TaskForNotification[]).filter((task) => {
      // 只处理待处理状态的任务
      if (task.status !== "pending") {
        return false;
      }

      // 必须有 scheduledAt
      if (!task.scheduledAt) {
        return false;
      }

      // 检查是否已经通知过
      if (notifiedIds.has(task.id)) {
        return false;
      }

      // 检查时间是否到了
      const scheduledTime = new Date(task.scheduledAt);
      const timeDiff = scheduledTime.getTime() - now.getTime();
      
      // 如果任务时间已经过了，或者在未来但在检查间隔内（允许提前通知），则发送通知
      // 例如：如果检查间隔是30秒，那么会在任务时间前30秒到任务时间后30秒内发送通知
      // 这样可以确保即使检查时间稍微晚于任务时间，也能收到通知
      return timeDiff <= checkInterval && timeDiff >= -checkInterval;
    });

    // 发送通知
    for (const task of tasksToNotify) {
      try {
        await notificationService.showReminderNotification(
          task.title,
          task.description || undefined,
          task.id
        );
        
        // 标记为已通知
        notifiedIds.add(task.id);
        
        console.log(`已发送提醒通知: ${task.title}`);
      } catch (error) {
        console.error(`发送提醒通知失败 (${task.id}):`, error);
      }
    }
  });

  /**
   * 初始化
   */
  useEffect(() => {
    // 检查浏览器支持
    if (!notificationService.isSupported()) {
      console.warn("浏览器不支持通知功能");
      setIsEnabled(false);
      return;
    }

    // 获取当前权限状态
    const currentPermission = notificationService.getPermission();
    setPermission(currentPermission);
    setIsEnabled(currentPermission === "granted");

    // 注意：浏览器不允许在页面加载时自动请求通知权限
    // 必须在用户交互（如点击按钮）的上下文中调用
    // 所以这里不自动请求，而是通过 PermissionPrompt 组件让用户主动点击
    // if (autoRequestPermission && currentPermission === "default") {
    //   requestPermission();
    // }
  }, [autoRequestPermission]);

  /**
   * 更新 checkAndNotify 函数引用
   */
  useEffect(() => {
    checkAndNotify.current = async () => {
      if (!isEnabled || !tasks) {
        return;
      }

      const now = new Date();
      const notifiedIds = notifiedTaskIdsRef.current;

      // 筛选出需要提醒的任务
      // 使用简化的类型定义避免 TypeScript 过度推断
      const tasksToNotify = (tasks as TaskForNotification[]).filter((task) => {
        // 只处理待处理状态的任务
        if (task.status !== "pending") {
          return false;
        }

        // 必须有 scheduledAt
        if (!task.scheduledAt) {
          return false;
        }

        // 检查是否已经通知过
        if (notifiedIds.has(task.id)) {
          return false;
        }

        // 检查时间是否到了
        const scheduledTime = new Date(task.scheduledAt);
        const timeDiff = scheduledTime.getTime() - now.getTime();
        
        // 如果任务时间已经过了，或者在未来但在检查间隔内（允许提前通知），则发送通知
        // 例如：如果检查间隔是30秒，那么会在任务时间前30秒到任务时间后30秒内发送通知
        // 这样可以确保即使检查时间稍微晚于任务时间，也能收到通知
        return timeDiff <= checkInterval && timeDiff >= -checkInterval;
      });

      // 发送通知
      for (const task of tasksToNotify) {
        try {
          await notificationService.showReminderNotification(
            task.title,
            task.description || undefined,
            task.id
          );
          
          // 标记为已通知
          notifiedIds.add(task.id);
          
          console.log(`已发送提醒通知: ${task.title}`);
        } catch (error) {
          console.error(`发送提醒通知失败 (${task.id}):`, error);
        }
      }
    };
  }, [isEnabled, tasks, checkInterval]);

  /**
   * 定期检查并发送通知
   */
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    // 立即检查一次
    checkAndNotify.current();

    // 设置定期检查
    intervalRef.current = setInterval(() => {
      checkAndNotify.current();
    }, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, checkInterval]);

  /**
   * 清理已通知的任务ID（当任务完成或删除时）
   */
  const clearNotifiedTask = (taskId: string) => {
    notifiedTaskIdsRef.current.delete(taskId);
  };

  /**
   * 清理所有已通知的任务ID
   */
  const clearAllNotifiedTasks = () => {
    notifiedTaskIdsRef.current.clear();
  };

  return {
    permission,
    isEnabled,
    requestPermission,
    clearNotifiedTask,
    clearAllNotifiedTasks,
  };
}

