/**
 * Service Worker 注册和管理
 * Service Worker Registration and Management
 */

export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Worker is not supported');
    return Promise.resolve(null);
  }

  return navigator.serviceWorker
    .register('/sw.js', {
      scope: '/',
    })
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);

      // 检查更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 新版本已安装，提示用户刷新
              console.log('New Service Worker version available');
            }
          });
        }
      });

      return registration;
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
      return null;
    });
}

export function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return Promise.resolve(false);
  }

  return navigator.serviceWorker
    .getRegistrations()
    .then((registrations) => {
      return Promise.all(
        registrations.map((registration) => registration.unregister())
      ).then(() => true);
    })
    .catch((error) => {
      console.error('Service Worker unregistration failed:', error);
      return false;
    });
}

/**
 * 检查 Service Worker 是否已注册
 */
export function isServiceWorkerRegistered(): boolean {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  return navigator.serviceWorker.controller !== null;
}

/**
 * 发送消息给 Service Worker
 */
export function postMessageToServiceWorker(message: any): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  } else {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.active) {
        registration.active.postMessage(message);
      }
    });
  }
}

