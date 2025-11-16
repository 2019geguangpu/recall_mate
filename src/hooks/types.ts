// 定义任务类型（tRPC 返回的数据中日期是字符串）
export interface TaskForNotification {
  id: string;
  title: string;
  description: string | null;
  status: string;
  scheduledAt: string | null;
}