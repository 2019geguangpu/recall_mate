/**
 * 通知服务
 * Notification Service
 * 
 * 用于管理浏览器通知权限和发送通知
 * 支持移动端和PC端
 */

export type NotificationPermission = "default" | "granted" | "denied";

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string; // 用于替换相同 tag 的通知
  requireInteraction?: boolean; // 是否要求用户交互才能关闭
  silent?: boolean;
  vibrate?: number[]; // 移动端震动模式
  data?: any; // 自定义数据
}

class NotificationService {
  private permission: NotificationPermission = "default";

  /**
   * 检测是否为 macOS 系统
   */
  private isMacOS(): boolean {
    if (typeof window === "undefined") {
      return false;
    }
    return /Mac|iPhone|iPad|iPod/.test(navigator.platform) || 
           /Mac/.test(navigator.userAgent);
  }

  /**
   * 检查浏览器是否支持通知
   */
  isSupported(): boolean {
    return "Notification" in window;
  }

  /**
   * 获取当前通知权限状态
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission as NotificationPermission;
  }

  /**
   * 请求通知权限
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error("浏览器不支持通知功能");
    }

    if (Notification.permission === "granted") {
      this.permission = "granted";
      return "granted";
    }

    if (Notification.permission === "denied") {
      this.permission = "denied";
      return "denied";
    }

    // 请求权限
    const permission = await Notification.requestPermission();
    this.permission = permission as NotificationPermission;
    return this.permission;
  }

  /**
   * 检查 Service Worker 是否可用
   */
  private async isServiceWorkerReady(): Promise<boolean> {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return registration !== null;
    } catch {
      return false;
    }
  }

  /**
   * 通过 Service Worker 发送通知（用于后台通知）
   */
  private async showNotificationViaServiceWorker(
    options: NotificationOptions
  ): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const notificationOptions: any = {
        body: options.body || "",
        icon: options.icon || "/favicon-192x192.png",
        badge: options.badge || "/favicon-32x32.png",
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        data: options.data,
      };

      // 添加震动（如果支持）
      if (options.vibrate) {
        notificationOptions.vibrate = options.vibrate;
      }
      
      await registration.showNotification(options.title, notificationOptions);

      return true;
    } catch (error) {
      console.error("通过 Service Worker 发送通知失败:", error);
      return false;
    }
  }

  /**
   * 发送通知
   * 优先使用 Service Worker（如果可用），否则使用普通通知 API
   */
  async showNotification(options: NotificationOptions): Promise<Notification | null> {
    if (!this.isSupported()) {
      console.warn("浏览器不支持通知功能");
      return null;
    }

    // 如果权限未授予，尝试请求权限
    if (Notification.permission !== "granted") {
      const permission = await this.requestPermission();
      if (permission !== "granted") {
        console.warn("通知权限未授予");
        return null;
      }
    }

    try {
      const notificationOptions: NotificationOptions = {
        title: options.title,
        body: options.body || "",
        icon: options.icon || "/favicon-192x192.png",
        badge: options.badge || "/favicon-32x32.png",
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
        data: options.data,
      };

      // 移动端支持震动
      if ("vibrate" in navigator && options.vibrate) {
        notificationOptions.vibrate = options.vibrate;
      }

      // 优先尝试使用 Service Worker（支持后台通知）
      const swReady = await this.isServiceWorkerReady();
      if (swReady) {
        const success = await this.showNotificationViaServiceWorker(notificationOptions);
        if (success) {
          // Service Worker 通知已发送，返回 null（因为通知由 Service Worker 管理）
          // 调用者可以通过检查返回值是否为 null 来判断是否使用了 Service Worker
          return null;
        }
      }

      // 如果 Service Worker 不可用，使用普通通知 API
      const notification = new Notification(options.title, notificationOptions);

      // 点击通知时的处理
      notification.onclick = (event) => {
        event.preventDefault();
        // 聚焦到窗口
        window.focus();
        // 可以在这里添加导航逻辑
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error("发送通知失败:", error);
      return null;
    }
  }

  /**
   * 发送提醒通知
   */
  async showReminderNotification(
    title: string,
    description?: string,
    reminderId?: string
  ): Promise<Notification | null> {
    // macOS 对持久通知（requireInteraction）支持不好，使用标准通知
    // 其他平台可以使用持久通知，确保用户不会错过重要提醒
    const isMac = this.isMacOS();
    
    return this.showNotification({
      title: `⏰ ${title}`,
      body: description || "提醒时间到了！",
      tag: reminderId || `reminder-${Date.now()}`,
      requireInteraction: !isMac, // macOS 上不使用持久通知
      silent: false, // 标准通知（有声音）
      vibrate: isMac ? undefined : [200, 100, 200], // macOS 不支持震动，移动端支持
      data: {
        type: "reminder",
        reminderId,
        url: "/reminders",
      },
    });
  }

  /**
   * 关闭所有通知（通过 tag）
   */
  closeNotificationsByTag(tag: string): void {
    // 注意：浏览器 API 不直接支持通过 tag 关闭通知
    // 这需要在创建通知时保存引用，然后手动关闭
    // 这里只是占位，实际实现需要在外部管理通知引用
  }
}

// 导出单例
export const notificationService = new NotificationService();

