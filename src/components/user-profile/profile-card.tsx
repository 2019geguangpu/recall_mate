"use client";

import type { UserProfile } from "@/lib/types/user-profile";

interface ProfileCardProps {
  profile: UserProfile;
  dimension: keyof Omit<UserProfile, "id" | "name" | "createdAt" | "updatedAt" | "profileCompleteness" | "lastAnalysisDate">;
  title: string;
  icon: string;
}

export function ProfileCard({ profile, dimension, title, icon }: ProfileCardProps) {
  const data = profile[dimension];

  const renderContent = () => {
    switch (dimension) {
      case "sleepPattern":
        const sleep = profile.sleepPattern;
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">就寝时间</span>
              <span className="font-medium">{sleep.bedtime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">起床时间</span>
              <span className="font-medium">{sleep.wakeTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">睡眠时长</span>
              <span className="font-medium">{sleep.sleepDuration} 小时</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">规律性</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${sleep.regularity}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{sleep.regularity}%</span>
              </div>
            </div>
          </div>
        );

      case "workPattern":
        const work = profile.workPattern;
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">工作时间</span>
              <span className="font-medium">
                {work.workHours.start} - {work.workHours.end}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">工作方式</span>
              <span className="font-medium">
                {work.workStyle === "remote" ? "远程" :
                 work.workStyle === "office" ? "办公室" :
                 work.workStyle === "hybrid" ? "混合" : "灵活"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">效率高峰</span>
              <span className="font-medium">
                {work.productivityPeak === "morning" ? "早晨" :
                 work.productivityPeak === "afternoon" ? "下午" :
                 work.productivityPeak === "evening" ? "晚上" : "夜间"}
              </span>
            </div>
          </div>
        );

      case "healthNeeds":
        const health = profile.healthNeeds;
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">运动频率</span>
              <span className="font-medium">
                {health.exerciseFrequency === "daily" ? "每天" :
                 health.exerciseFrequency === "weekly" ? "每周" :
                 health.exerciseFrequency === "occasional" ? "偶尔" : "很少"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">饮水量</span>
              <span className="font-medium">{health.waterIntake}ml</span>
            </div>
            {health.healthGoals.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">健康目标：</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {health.healthGoals.map((goal, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-accent-100 px-2 py-1 text-xs text-accent-700"
                    >
                      {goal}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "memoryCharacteristics":
        const memory = profile.memoryCharacteristics;
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">短期记忆</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${memory.shortTermCapacity}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{memory.shortTermCapacity}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">长期记忆</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-accent-500"
                    style={{ width: `${memory.longTermRetention}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{memory.longTermRetention}%</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">回忆速度</span>
              <span className="font-medium">
                {memory.recallSpeed === "fast" ? "快速" :
                 memory.recallSpeed === "moderate" ? "中等" : "较慢"}
              </span>
            </div>
          </div>
        );

      case "personalityTags":
        const personality = profile.personalityTags;
        return (
          <div className="space-y-3">
            {personality.traits.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">个性特质：</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {personality.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-700"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {personality.strengths.length > 0 && (
              <div>
                <span className="text-sm text-muted-foreground">优势：</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {personality.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-accent-100 px-2 py-1 text-xs text-accent-700"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            数据加载中...
          </div>
        );
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {renderContent()}
    </div>
  );
}

