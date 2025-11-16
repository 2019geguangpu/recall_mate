"use client";

/**
 * 通知权限请求提示组件
 * Notification Permission Prompt Component
 * 
 * 在用户首次访问或权限未授予时显示友好的权限请求提示
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotificationContext } from "./notification-provider";

export function PermissionPrompt() {
  const { permission, requestPermission } = useNotificationContext();
  const [isDismissed, setIsDismissed] = useState(false);

  // 检查是否已经关闭过提示（但只在权限未授予时检查）
  useEffect(() => {
    // 如果权限已授予，清除关闭记录
    if (permission === "granted") {
      localStorage.removeItem("notification-permission-dismissed");
      setIsDismissed(false);
      return;
    }
    
    // 如果权限已拒绝，也清除关闭记录（让用户可以再次看到提示）
    if (permission === "denied") {
      // 可以选择是否在权限被拒绝后继续显示提示
      // 这里我们选择不显示，因为用户已经明确拒绝了
      return;
    }
    
    // 只有在权限为 default 时才检查是否关闭过
    if (permission === "default") {
      const dismissed = localStorage.getItem("notification-permission-dismissed");
      if (dismissed) {
        // 检查是否超过24小时，如果超过则重新显示
        const dismissedTime = parseInt(dismissed, 10);
        if (!isNaN(dismissedTime)) {
          const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
          if (hoursSinceDismissed < 24) {
            setIsDismissed(true);
          } else {
            // 超过24小时，清除记录，重新显示提示
            localStorage.removeItem("notification-permission-dismissed");
          }
        } else {
          // 如果是 "true" 字符串，也清除（旧格式）
          localStorage.removeItem("notification-permission-dismissed");
        }
      }
    }
  }, [permission]);

  // 如果权限已授予或已拒绝，不显示提示
  if (permission !== "default" || isDismissed) {
    return null;
  }

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === "granted") {
        setIsDismissed(true);
        localStorage.setItem("notification-permission-dismissed", "true");
      }
    } catch (error) {
      console.error("请求通知权限失败:", error);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // 保存到 localStorage，避免频繁提示（24小时内不再显示）
    localStorage.setItem("notification-permission-dismissed", Date.now().toString());
  };

  return (
    <div className="mb-6 rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-950">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            🔔 启用通知提醒
          </h3>
          <p className="mb-3 text-sm text-muted-foreground">
            为了及时接收提醒通知，请允许浏览器发送通知。即使应用关闭，您也能收到提醒！
          </p>
          <div className="flex gap-2">
            <Button onClick={handleRequestPermission} size="sm">
              允许通知
            </Button>
            <Button onClick={handleDismiss} size="sm" variant="ghost">
              稍后提醒
            </Button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 text-muted-foreground hover:text-foreground"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

