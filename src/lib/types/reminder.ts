/**
 * 提醒系统类型定义
 * Reminder System Type Definitions
 */

export type ReminderPriority = "low" | "medium" | "high" | "urgent";
export type ReminderStatus = "pending" | "completed" | "snoozed" | "cancelled";
export type ReminderType = "task" | "event" | "medication" | "habit" | "custom";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  type: ReminderType;
  priority: ReminderPriority;
  status: ReminderStatus;
  
  // 时间相关
  scheduledAt: string; // ISO 8601 格式
  dueDate?: string; // 截止日期
  repeatPattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly" | "custom";
    interval: number; // 间隔
    daysOfWeek?: number[]; // 0-6, 0=周日
    endDate?: string;
  };
  
  // 智能提醒
  smartTiming?: {
    basedOn: "sleep" | "work" | "health" | "habit" | "behavior"; // 基于用户画像的哪个维度
    optimalTime?: string; // AI 计算的最佳提醒时间
    context?: string; // 上下文信息
  };
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  snoozedUntil?: string;
  
  // 关联
  tags?: string[];
  category?: string;
  relatedProfileDimension?: string; // 关联的用户画像维度
}

export interface ReminderStats {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  completionRate: number; // 完成率 0-100
  averageResponseTime?: number; // 平均响应时间（分钟）
}

