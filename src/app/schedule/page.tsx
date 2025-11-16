"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">日程规划</h1>
          <p className="text-lg text-muted-foreground">
            基于您的工作模式和作息规律，智能规划日程安排
          </p>
        </div>

        <div className="mb-8">
          <VoiceRecorder />
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">日程视图</h2>
          <div className="text-center text-muted-foreground">
            <p>日历视图将在这里显示</p>
            <p className="mt-2 text-sm">基于您的工作模式和作息规律智能推荐最佳时间</p>
          </div>
        </div>
      </main>
    </div>
  );
}

