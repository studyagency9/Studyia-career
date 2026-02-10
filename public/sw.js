// Service Worker for Studyia Career - Cache busting for updates
const CACHE_NAME = 'studyia-career-v2'; // Version incrémentée pour forcer la mise à jour
const urlsToCache = [
  '/',
  '/apply',
  '/dashboard',
  '/login',
  '/signup',
  '/pricing',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache ouvert:', CACHE_NAME);
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`⚠️ Impossible de mettre en cache l'URL: ${url}`, err);
              return Promise.resolve();
            })
          )
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Installation terminée');
        // Forcer l'activation immédiate du nouveau service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker: Activation terminée');
      // Prendre le contrôle de toutes les pages ouvertes
      return self.clients.claim();
    })
  );
});

// Fetch event - Network first, cache fallback avec cache busting
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET (POST, PUT, etc.)
  if (event.request.method !== 'GET') {
    return;
  }

  // Stratégie: Network First pour les pages HTML, Cache First pour les assets
  const request = event.request;
  const url = new URL(request.url);
  
  // Pour les pages HTML, toujours essayer le réseau en premier
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Si réseau OK, mettre en cache et retourner
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Si réseau échoue, essayer le cache
          return caches.match(request);
        })
    );
  } else {
    // Pour les assets (JS, CSS, images), Cache First avec réseau fallback
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            // Vérifier si la version en cache est encore valide (max 1h)
            const cachedTime = response.headers.get('sw-cached-time');
            if (cachedTime && (Date.now() - parseInt(cachedTime)) < 3600000) {
              return response;
            }
            // Sinon, essayer le réseau
            return fetch(request).then((networkResponse) => {
              if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }
              return networkResponse;
            }).catch(() => response); // Fallback au cache si réseau échoue
          }
          
          // Si rien en cache, aller sur le réseau
          return fetch(request).then((response) => {
            if (response.ok) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSalesData());
  }
});

async function syncSalesData() {
  // Sync logic for sales data when back online
  console.log('Syncing sales data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('Studyia Career', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/associate/dashboard')
  );
});
