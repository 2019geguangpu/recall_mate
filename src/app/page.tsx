"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { InputSwitcher } from "@/components/input-switcher/input-switcher";
import { ProfileCard } from "@/components/user-profile/profile-card";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/lib/notifications/notification-service";

type InputMode = "voice" | "text";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [recentRecords, setRecentRecords] = useState<VoiceRecord[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>("voice");

  // 测试通知功能
  const handleTestNotification = async () => {
    try {
      const permission = await notificationService.requestPermission();
      if (permission === "granted") {
        await notificationService.showReminderNotification(
          "测试通知",
          "这是一条测试通知，如果您能看到这条消息，说明通知功能正常！",
          `test-${Date.now()}`
        );
        toast.success("测试通知已发送");
      } else {
        toast.error("通知权限被拒绝，请在浏览器设置中允许通知");
      }
    } catch (error) {
      console.error("测试通知失败:", error);
      toast.error("发送测试通知失败");
    }
  };

  // tRPC mutations
  const parseAndCreateTask = trpc.ai.parseAndCreateTask.useMutation();
  
  // 获取 loading 状态
  const isProcessing = parseAndCreateTask.isPending;

  const handleRecordComplete = async (record: VoiceRecord) => {
    setRecentRecords((prev) => [record, ...prev].slice(0, 5));

    // 如果记录有文本内容，使用 AI Agent 解析并创建任务
    if (record.transcript) {
      try {
        // 检测是否包含时间相关关键词
        const hasTimeKeywords = containsTimeKeywords(record.transcript);
        
        // 只有在包含时间关键词时才获取和传递时区信息
        const userTimezone = hasTimeKeywords 
          ? Intl.DateTimeFormat().resolvedOptions().timeZone 
          : undefined;
        
        const result = await parseAndCreateTask.mutateAsync({
          text: record.transcript,
          voiceRecord: {
            id: record.id,
            type: record.type,
            status: record.status,
            audioUrl: record.audioUrl,
            duration: record.duration,
            transcript: record.transcript,
            confidence: record.confidence,
            extractedInfo: record.extractedInfo,
          },
          timezone: userTimezone,
        });

        if (result.success) {
          if ("task" in result && result.task) {
            toast.success("任务创建成功", {
              description: result.message || "任务已成功创建",
            });
          } else {
            toast.warning("未能创建任务", {
              description: result.message || "请稍后重试",
            });
          }
        } else {
          toast.warning("未能创建任务", {
            description: result.message || "请稍后重试",
          });
        }
      } catch (error) {
        toast.error("创建任务失败", {
          description: error instanceof Error ? error.message : "发生了未知错误",
        });
      }
    }

    // 这里可以添加逻辑来更新用户画像
    // 例如：从语音记录中提取信息并更新 profile
  };

  const profileDimensions = [
    { key: "sleepPattern" as const, title: "作息规律", icon: "🌙" },
    { key: "workPattern" as const, title: "工作模式", icon: "💼" },
    { key: "healthNeeds" as const, title: "健康需求", icon: "💊" },
    { key: "behaviorPattern" as const, title: "行为模式", icon: "🎯" },
    { key: "memoryCharacteristics" as const, title: "记忆特征", icon: "🧠" },
    { key: "consumptionPreferences" as const, title: "消费偏好", icon: "🛒" },
    { key: "habitAnalysis" as const, title: "习惯分析", icon: "📊" },
    { key: "personalityTags" as const, title: "个性标签", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* 核心引擎标题 */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            智能简历核心引擎
          </h1>
          <p className="text-lg text-muted-foreground">
            统一用户画像 · 所有模块共享同一份智能简历数据
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-32 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary-500"
                style={{ width: `${profile.profileCompleteness}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              画像完整度: {profile.profileCompleteness}%
            </span>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTestNotification}
              className="gap-2"
            >
              🔔 测试通知功能
            </Button>
          </div>
        </div>

        {/* 输入区域 */}
        <div className="mb-8">
          <InputSwitcher
            mode={inputMode}
            onModeChange={setInputMode}
            onRecordComplete={handleRecordComplete}
            isProcessing={isProcessing}
          />
        </div>

        {/* 用户画像网格 */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            用户画像维度
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {profileDimensions.map((dim) => (
              <ProfileCard
                key={dim.key}
                profile={profile}
                dimension={dim.key}
                title={dim.title}
                icon={dim.icon}
              />
            ))}
          </div>
        </div>

        {/* 扩展模块展示 */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-foreground">
            扩展模块
          </h2>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { name: "提醒管家", icon: "⏰", href: "/reminders" },
              { name: "购物助手", icon: "🛒", href: "/shopping" },
              { name: "健康管理", icon: "💊", href: "/health" },
              { name: "日程规划", icon: "📅", href: "/schedule" },
              { name: "财务管家", icon: "💰", href: "/finance" },
              { name: "学习伙伴", icon: "📚", href: "/learning" },
            ].map((module) => (
              <a
                key={module.name}
                href={module.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6 text-center transition-all hover:border-primary-500 hover:shadow-md"
              >
                <span className="text-4xl">{module.icon}</span>
                <span className="font-medium text-foreground">{module.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 最近语音记录 */}
        {recentRecords.length > 0 && (
          <div>
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              最近语音记录
            </h2>
            <div className="space-y-3">
              {recentRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {record.transcript || "处理中..."}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(record.createdAt).toLocaleString("zh-CN")} · 
                        时长: {Math.floor(record.duration / 60)}:
                        {(record.duration % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                    {record.status === "completed" && (
                      <span className="rounded-full bg-accent-100 px-2 py-1 text-xs text-accent-700">
                        已完成
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
