"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";

export default function LearningPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">学习伙伴</h1>
          <p className="text-lg text-muted-foreground">
            基于您的记忆特征和学习习惯，提供个性化学习计划
          </p>
        </div>

        <div className="mb-8">
          <VoiceRecorder />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">学习计划</h2>
            <p className="text-muted-foreground">基于记忆特征制定学习计划</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">复习提醒</h2>
            <p className="text-muted-foreground">智能复习提醒系统</p>
          </div>
        </div>
      </main>
    </div>
  );
}

