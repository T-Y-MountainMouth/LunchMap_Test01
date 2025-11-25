// Service Worker for LunchMap PWA
const CACHE_NAME = 'lunchmap-cache-v1';

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// キャッシュしない外部ドメインのリスト
const EXCLUDED_DOMAINS = [
  'maps.googleapis.com',
  'maps.gstatic.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// インストールイベント: 静的アセットをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // 新しいService Workerをすぐにアクティブにする
  self.skipWaiting();
});

// アクティベートイベント: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  // 現在のページにService Workerを適用
  self.clients.claim();
});

// フェッチイベント: ネットワーク優先、失敗時はキャッシュを使用
self.addEventListener('fetch', (event) => {
  // GETリクエスト以外はキャッシュしない
  if (event.request.method !== 'GET') {
    return;
  }

  // 外部ドメインへのリクエストはキャッシュしない
  const isExcludedDomain = EXCLUDED_DOMAINS.some((domain) =>
    event.request.url.includes(domain)
  );
  if (isExcludedDomain) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(async (response) => {
        // 成功したレスポンス（2xx）をキャッシュに保存
        if (response.ok) {
          const responseClone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);
        }
        return response;
      })
      .catch(() => {
        // ネットワーク失敗時はキャッシュから取得
        return caches.match(event.request);
      })
  );
});
