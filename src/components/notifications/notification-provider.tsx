"use client";

/**
 * 通知提供者组件
 * Notification Provider Component
 * 
 * 在应用启动时初始化通知系统
 */

import { createContext, useContext, useEffect } from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { registerServiceWorker } from "@/lib/pwa/service-worker";

interface NotificationContextValue {
  permission: "default" | "granted" | "denied";
  isEnabled: boolean;
  requestPermission: () => Promise<"default" | "granted" | "denied">;
  clearNotifiedTask: (taskId: string) => void;
  clearAllNotifiedTasks: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext must be used within NotificationProvider");
  }
  return context;
}

export function NotificationProvider({ children }: { children?: React.ReactNode }) {
  const notificationState = useNotifications({
    checkInterval: 30000, // 30秒检查一次
    autoRequestPermission: true,
  });

  // 注册 Service Worker（用于 PWA 后台通知）
  useEffect(() => {
    if (typeof window !== "undefined") {
      registerServiceWorker()
        .then((registration) => {
          if (registration) {
            // 监听 Service Worker 发送的消息
            navigator.serviceWorker.addEventListener("message", (event) => {
              if (event.data?.type === "NOTIFICATION_PERMISSION_REQUIRED") {
                console.warn("Service Worker 报告：通知权限未授予");
                // 可以在这里显示提示，或者触发权限请求
                // 由于权限必须在用户交互中请求，这里只记录日志
              }
              
              // 响应 Service Worker 的权限查询
              if (event.data?.type === "CHECK_NOTIFICATION_PERMISSION" && event.data?.port) {
                const permission = Notification.permission;
                event.data.port.postMessage({ permission });
              }
            });
          }
        })
        .catch((error) => {
          console.error("Failed to register Service Worker:", error);
        });
    }
  }, []);

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}

