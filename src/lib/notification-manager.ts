export type NotificationSetupResult = {
  supported: boolean;
  permission: NotificationPermission | "unsupported";
  workerReady: boolean;
  message: string;
};

const WORKER_URL = "/rtcr-notifications-sw.js";

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

async function registerNotificationWorker(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
  try {
    await navigator.serviceWorker.register(WORKER_URL, { scope: "/" });
    await navigator.serviceWorker.ready;
    return true;
  } catch {
    return false;
  }
}

export async function ensureNotificationPermission(): Promise<NotificationSetupResult> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return {
      supported: false,
      permission: "unsupported",
      workerReady: false,
      message: "Ce navigateur ne prend pas en charge les notifications.",
    };
  }

  let permission = Notification.permission;
  if (permission === "default") permission = await Notification.requestPermission();
  const workerReady = permission === "granted" ? await registerNotificationWorker() : false;

  return {
    supported: true,
    permission,
    workerReady,
    message:
      permission === "granted"
        ? workerReady
          ? "Notifications activées pour cet appareil."
          : "Autorisation accordée, mais le service de notifications n'est pas disponible."
        : permission === "denied"
          ? "Notifications bloquées par le navigateur."
          : "Autorisation en attente.",
  };
}

export function showLocalNotification(title: string, body: string, url = "/") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  const notification = new Notification(title, {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    data: { url },
  });
  notification.onclick = () => {
    window.focus();
    window.location.assign(url);
  };
}