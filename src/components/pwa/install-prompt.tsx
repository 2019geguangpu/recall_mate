"use client";

/**
 * PWA 安装提示组件
 * PWA Install Prompt Component
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 检查是否已经安装
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 监听应用安装事件
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    try {
      // 显示安装提示
      await deferredPrompt.prompt();
      
      // 等待用户选择
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        console.log("用户接受了安装提示");
      } else {
        console.log("用户拒绝了安装提示");
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error("安装失败:", error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 保存到 localStorage，避免频繁提示
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // 如果已安装或用户已关闭提示，不显示
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  // 检查是否在短时间内已关闭过提示
  const dismissedTime = localStorage.getItem("pwa-install-dismissed");
  if (dismissedTime) {
    const dismissed = parseInt(dismissedTime, 10);
    const daysSinceDismissed = (Date.now() - dismissed) / (1000 * 60 * 60 * 24);
    if (daysSinceDismissed < 7) {
      // 7天内不再显示
      return null;
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <div className="rounded-lg border border-border bg-card p-4 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-foreground">
              📱 安装 Recall Mate
            </h3>
            <p className="mb-3 text-sm text-muted-foreground">
              安装后即使关闭浏览器也能接收提醒通知，体验更佳！
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} size="sm">
                安装
              </Button>
              <Button onClick={handleDismiss} size="sm" variant="outline">
                稍后
              </Button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 text-muted-foreground hover:text-foreground"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

