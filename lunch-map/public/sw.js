// Service Worker for LunchMap PWA
const CACHE_NAME = 'lunchmap-cache-v1';

// キャッシュするリソース
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
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
  // Google Maps APIやその他の外部リソースはキャッシュしない
  if (
    event.request.url.includes('maps.googleapis.com') ||
    event.request.url.includes('maps.gstatic.com')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功したレスポンスをキャッシュに保存
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // ネットワーク失敗時はキャッシュから取得
        return caches.match(event.request);
      })
  );
});
