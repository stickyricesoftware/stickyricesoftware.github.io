// sw.js

self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (e) => {
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Bypass cache for now; you can add caching later if needed
  event.respondWith(fetch(event.request));
});
