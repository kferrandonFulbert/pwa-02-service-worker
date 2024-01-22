// service-worker.js

const CACHE_NAME = 'my-blank-pwa-cache-v1';

// Liste des ressources à mettre en cache
const RESOURCES_TO_CACHE = [
  './',
  './index.html'
  // Ajoutez ici toutes les ressources que vous souhaitez mettre en cache
];

// Installation du service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(RESOURCES_TO_CACHE);
      })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la ressource est présente dans le cache, on la renvoie
        if (response) {
          return response;
        }

        // Sinon, on effectue la requête réseau et on met en cache la réponse
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(cacheName)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});
