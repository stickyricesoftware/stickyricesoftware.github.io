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
  event.respondWith(
    caches.open('currency-converter-cache').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) return response;
        return fetch(event.request)
          .then(function(networkResponse) {
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(function() {
            // Return a fallback response or empty response on error
            return new Response('', { status: 503, statusText: 'Service Unavailable' });
          });
      });
    })
  );
});
