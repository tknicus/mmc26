const CACHE_NAME = 'mmc26-cache-v1.15'; // ⬅️ GI-UPDATE NATO ANG VERSION ARON MO-DOWNLOAD OG BAG-O

// KINI ANG MGA FILES NGA I-DOWNLOAD UG I-SAVE SA SELPON INIG UNANG ABLI
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './database.js', // ⬅️ IDUGANG: Ang imong masterlist
  './mmc.png', // ⬅️ IDUGANG: Ang watermark logo para sa picture
  // 👇 IDUGANG ANG IMONG KANTA DINHI 👇
  './never_say_never.mp3', // ⬅️ IDUGANG: Ang para tugtog inig mag SEND sa DATA
  //'./imong_kanta.mp3', // ⚠️ ILISI KINI KUNG UNSA GYUD ANG EXACT FILENAME SA IMONG AUDIO (ex: never_say_never.mp3)
  'https://unpkg.com/html5-qrcode', // ⬅️ IDUGANG: Ang utok sa QR Scanner
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

// ... (ANG UBAN NIMO NGA CODE SA FETCH UG ACTIVATE MAGPABILIN RA, WALA NAY USABON DIDTO) ...

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