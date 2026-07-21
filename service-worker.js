// 锻炼打卡 - Service Worker
// 安装后缓存核心文件，支持离线访问

const CACHE_NAME = "workout-v5";
const FILES = [
  "./",
  "./index.html",
  "./workout-tracker.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// 安装：预缓存核心文件
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// 激活：清理旧版本缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 响应页面发来的 skip-waiting 消息
self.addEventListener("message", (event) => {
  if (event.data === "skip-waiting") {
    self.skipWaiting();
  }
});

// 请求拦截：缓存优先，网络兜底
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
