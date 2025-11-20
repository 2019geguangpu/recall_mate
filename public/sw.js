/**
 * Service Worker for PWA
 * 用于在后台处理通知，即使应用关闭也能接收提醒
 */

const CACHE_NAME = 'recall-mate-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  // 强制激活新的 Service Worker
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 启动定期检查提醒
      startReminderCheck();
    })
  );
  // 立即控制所有客户端
  return self.clients.claim();
});

// 处理推送通知
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  let notificationData = {
    title: '提醒通知',
    body: '您有一个新的提醒',
    icon: '/android-chrome-192x192.png',
    badge: '/favicon-32x32.png',
    tag: 'reminder',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: {
      url: '/reminders',
    },
  };

  // 如果推送事件包含数据，使用推送数据
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate,
      data: notificationData.data,
    })
  );
});

// 处理通知点击
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/reminders';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 如果已经有打开的窗口，聚焦它
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // 如果没有打开的窗口，打开新窗口
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// 处理后台同步（用于定期检查提醒）
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'check-reminders') {
    event.waitUntil(checkReminders());
  }
});

// 定期检查提醒（每30秒）
let reminderCheckInterval = null;

// 启动定期检查
function startReminderCheck() {
  if (reminderCheckInterval) {
    return; // 已经启动
  }
  
  console.log('[Service Worker] Starting reminder check interval');
  
  // 立即检查一次
  checkReminders();
  
  // 每30秒检查一次
  reminderCheckInterval = setInterval(() => {
    checkReminders();
  }, 30000);
}

// 停止定期检查
function stopReminderCheck() {
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval);
    reminderCheckInterval = null;
    console.log('[Service Worker] Stopped reminder check interval');
  }
}

// 已通知的任务ID集合（用于避免重复通知）
// 使用 Map 存储任务ID和通知时间，定期清理过期记录
const notifiedReminders = new Map();

// 清理过期的通知记录（超过1小时）
function cleanExpiredNotifications() {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [id, notifiedAt] of notifiedReminders.entries()) {
    if (notifiedAt < oneHourAgo) {
      notifiedReminders.delete(id);
    }
  }
}

// 检查通知权限（通过向主线程查询）
async function checkNotificationPermission() {
  try {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    if (clients.length === 0) {
      // 没有活动的客户端，无法查询权限，返回 false
      return false;
    }
    
    // 向第一个客户端发送消息查询权限
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.permission === 'granted');
      };
      
      // 设置超时，如果3秒内没有响应，假设权限未授予
      setTimeout(() => resolve(false), 3000);
      
      clients[0].postMessage({
        type: 'CHECK_NOTIFICATION_PERMISSION',
        port: messageChannel.port2,
      }, [messageChannel.port2]);
    });
  } catch (error) {
    console.error('[Service Worker] Error checking permission:', error);
    return false;
  }
}

// 检查提醒的函数（需要在 Service Worker 中实现）
async function checkReminders() {
  try {
    // 首先检查通知权限
    // Service Worker 中无法直接访问 Notification.permission
    // 需要通过向客户端发送消息来检查
    const hasPermission = await checkNotificationPermission();
    
    if (!hasPermission) {
      // 权限未授予，静默跳过（不记录错误，避免控制台噪音）
      // 只在第一次检查时记录一次日志
      if (!checkReminders._permissionWarningLogged) {
        console.log('[Service Worker] Notification permission not granted, skipping reminder check. Please grant notification permission in the browser.');
        checkReminders._permissionWarningLogged = true;
      }
      return;
    }
    
    // 权限已授予，清除警告标记
    checkReminders._permissionWarningLogged = false;
    
    // 清理过期的通知记录
    cleanExpiredNotifications();
    
    // 这里可以调用 API 检查待提醒的任务
    // 由于 Service Worker 无法直接访问 tRPC，我们需要通过 fetch 调用 API
    const response = await fetch('/api/reminders/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.log('[Service Worker] Failed to fetch reminders:', response.status);
      return;
    }
    
    const reminders = await response.json();
    
    // 如果没有待提醒的任务，直接返回
    if (!reminders || reminders.length === 0) {
      return;
    }
    
    const now = Date.now();
    
    // 发送通知
    for (const reminder of reminders) {
      const reminderId = reminder.id;
      
      // 检查是否已经通知过
      if (notifiedReminders.has(reminderId)) {
        continue; // 跳过已通知的任务
      }
      
      // 计算任务时间
      const scheduledTime = new Date(reminder.scheduledAt).getTime();
      const timeDiff = scheduledTime - now;
      
      // 对于未来60秒内的任务，立即发送通知（提前通知）
      // 对于已经过期的任务（过去30秒内），也发送通知（以防错过）
      // 这样可以确保：
      // 1. 如果任务在35秒后到期，第一次检查时（未来60秒内）就会发送通知
      // 2. 如果任务在15秒后到期，会立即发送通知
      // 3. 如果任务刚刚过期（过去30秒内），也会发送通知以防错过
      if (timeDiff <= 60000 && timeDiff >= -30000) {
        try {
          // 检测是否为 macOS（Service Worker 中无法直接检测，使用 User-Agent）
          // macOS 对持久通知（requireInteraction）支持不好，使用标准通知
          const isMacOS = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent || '');
          
          // 尝试发送通知，如果权限未授予会抛出错误
          // 注意：Android Chrome 对 icon 和 badge 的要求比较严格
          const notificationOptions = {
            body: reminder.description || '提醒时间到了！',
            icon: '/android-chrome-192x192.png',
            badge: '/favicon-32x32.png', // Android 状态栏小图标
            tag: `reminder-${reminderId}`,
            renotify: true, // 如果已有相同 tag 的通知，重新通知（震动/声音）
            requireInteraction: !isMacOS, // macOS 上不使用持久通知
            // silent: false, // 不要显式设置 silent: false，某些浏览器可能不兼容
            vibrate: isMacOS ? undefined : [200, 100, 200, 100, 200, 100, 200], // 更长的震动模式
            data: {
              type: 'reminder',
              reminderId: reminderId,
              url: '/reminders',
            },
            actions: [
              {
                action: 'open',
                title: '查看详情'
              },
              {
                action: 'close',
                title: '关闭'
              }
            ]
          };

          await self.registration.showNotification(`⏰ ${reminder.title}`, notificationOptions);
          
          // 标记为已通知
          notifiedReminders.set(reminderId, now);
          
          console.log(`[Service Worker] Sent notification for reminder: ${reminder.title} (${timeDiff > 0 ? 'in ' + Math.round(timeDiff / 1000) + 's' : 'overdue'})`);
        } catch (notificationError) {
          console.error(`[Service Worker] Failed to send notification for reminder ${reminderId}:`, notificationError);
        }
      }
    }
  } catch (error) {
    console.error('[Service Worker] Error checking reminders:', error);
  }
}

// 处理消息（从主线程接收消息）
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CHECK_REMINDERS') {
    checkReminders();
  }
  
  if (event.data && event.data.type === 'START_REMINDER_CHECK') {
    startReminderCheck();
  }
  
  if (event.data && event.data.type === 'STOP_REMINDER_CHECK') {
    stopReminderCheck();
  }
});

