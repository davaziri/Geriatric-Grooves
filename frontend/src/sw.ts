/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Same runtime caching rules as before, just written by hand now that a
// custom service worker (needed for push handling) replaces the
// auto-generated one.
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/exercises"),
  new StaleWhileRevalidate({ cacheName: "exercise-library" }),
);
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/profile"),
  new NetworkFirst({ cacheName: "profile-data" }),
);
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/routine"),
  new StaleWhileRevalidate({ cacheName: "daily-routine" }),
);
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/sessions"),
  new NetworkFirst({ cacheName: "session-data" }),
);

interface ReminderPushPayload {
  title?: string;
  body?: string;
}

self.addEventListener("push", (event) => {
  let payload: ReminderPushPayload = {};
  try {
    payload = event.data?.json() ?? {};
  } catch {
    payload = { body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? "Geriatric Grooves", {
      body: payload.body ?? "Ready for today's stretch? No rush — whenever works for you.",
      icon: "/icon.svg",
      badge: "/icon.svg",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/home");
    }),
  );
});

self.skipWaiting();
self.addEventListener("activate", () => {
  self.clients.claim();
});
