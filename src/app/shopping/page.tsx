"use client";

import { Navbar } from "@/components/layout/navbar";
import { VoiceRecorder } from "@/components/voice-recorder/voice-recorder";

export default function ShoppingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">购物助手</h1>
          <p className="text-lg text-muted-foreground">
            基于您的消费偏好，智能推荐购物清单和优惠信息
          </p>
        </div>

        <div className="mb-8">
          <VoiceRecorder />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">购物清单</h2>
            <p className="text-muted-foreground">暂无购物清单</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">消费偏好</h2>
            <p className="text-muted-foreground">基于您的用户画像分析</p>
          </div>
        </div>
      </main>
    </div>
  );
}

