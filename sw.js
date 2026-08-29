const CACHE_NAME = 'mmc-scanner-v3.4'; // ⬅️ GI-UPDATE NATO ANG VERSION (v3.4)
const MAP_CACHE = 'mmc-map-cache-v1';  // ⬅️ GI-DUGANG ANG CACHE PARA SA MAPA

// KINI ANG MGA FILES NGA I-DOWNLOAD UG I-SAVE SA SELPON INIG UNANG ABLI
const urlsToCache = [
  './',
  './index.html',
  './database.js', 
  './menu.html',
  './menu.json',
  './menu.png',
  './mmc.png', 
  'https://lh3.googleusercontent.com/d/1m1NrFKOMKh4YjoUdXD0KvxcpySM5RuwU', 
  './scan.html',
  './scan.json',
  './scan.png',
  'https://unpkg.com/html5-qrcode', 
  './report.html',
  './map.html',
  './never_say_never.mp3', 
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@8',
];

// 1. INSTALL EVENT: I-download ug i-save ang mga files sa celfon cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache for PWA files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. ACTIVATE EVENT: Limpyohi ang mga karaan nga cache (Gi-update para maprotektahan ang MAP_CACHE)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // I-delete lang kung dili siya CACHE_NAME ug dili sab MAP_CACHE
          if (cacheName !== CACHE_NAME && cacheName !== MAP_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. FETCH EVENT: I-serve ang files gikan sa cache kung offline na
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // ✨ KINI ANG MAGIC PARA SA MAPA (OpenStreetMap) ✨
  if (requestUrl.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse; // Kung naa na sa memory, i-load dayon
        }
        // Kung wala pa, kuhaon sa internet ug i-save dayon sa MAP_CACHE
        return fetch(event.request).then(networkResponse => {
          return caches.open(MAP_CACHE).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // Kung offline, i-ignore ra ang error sa mapa para dili mag-crash ang app
        });
      })
    );
    return; // Kinahanglan mo-exit diri aron dili niya basahon ang ubos nga code para sa mapa
  }

  // 📂 NORMAL NGA FETCH PARA SA APP FILES (HTML, JS, CSS, MP3)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kung naa sa cache, ihatag dayon bisan walay internet
        if (response) {
          return response;
        }
        // Kung wala, kuhaa sa network kung online
        return fetch(event.request);
      })
  );
});