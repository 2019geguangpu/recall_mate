"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";

export default function FinancePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">财务管家</h1>
          <p className="text-lg text-muted-foreground">
            基于您的消费偏好和习惯分析，智能管理财务
          </p>
        </div>

        <div className="mb-8">
          <VoiceRecorder />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">收支记录</h2>
            <p className="text-muted-foreground">记录您的收支情况</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">预算管理</h2>
            <p className="text-muted-foreground">基于消费偏好设定预算</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">财务分析</h2>
            <p className="text-muted-foreground">智能分析消费模式</p>
          </div>
        </div>
      </main>
    </div>
  );
}

