"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";

export default function HealthPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">健康管理</h1>
          <p className="text-lg text-muted-foreground">
            基于您的健康需求，提供个性化健康建议和提醒
          </p>
        </div>

        <div className="mb-8">
          <VoiceRecorder />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">运动记录</h2>
            <p className="text-muted-foreground">记录您的运动数据</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">用药提醒</h2>
            <p className="text-muted-foreground">智能用药管理</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">健康目标</h2>
            <p className="text-muted-foreground">追踪您的健康目标</p>
          </div>
        </div>
      </main>
    </div>
  );
}

