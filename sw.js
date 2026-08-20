const CACHE_NAME = 'mmc26-cache-v1.06';

// KINI ANG MGA FILES NGA I-DOWNLOAD UG I-SAVE SA SELPON INIG UNANG ABLI
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@8',
  'https://lh3.googleusercontent.com/d/1m1NrFKOMKh4YjoUdXD0KvxcpySM5RuwU' // Ang imong banner image
];

// INSTALLATION: Inig abli sa rider sa link nga naay internet, i-download niya ang files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Gi-ablihan ang cache ug gi-download ang files');
        return cache.addAll(urlsToCache);
      })
  );
});

// FETCHING: Inig abli sa rider sa bukid nga walay internet, i-serve ang naka-save nga files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(response => {
        // Kung na-save na sa cache, mao nay i-gawas. Kung wala, i-download gikan sa internet.
        return response || fetch(event.request);
      })
  );
});

// ACTIVATION: Pag-limpyo kung naay bag-o nga version sa cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});