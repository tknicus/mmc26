const CACHE_NAME = 'mmc-scanner-v3.31'; // ⬅️ GI-UPDATE NATO ANG VERSION ARON MO-DOWNLOAD OG BAG-O

// KINI ANG MGA FILES NGA I-DOWNLOAD UG I-SAVE SA SELPON INIG UNANG ABLI
const urlsToCache = [
  './',
  './index.html',
  './database.js', // ⬅️ IDUGANG: Ang imong masterlist
  './menu.html',
  './menu.json',
  './menu.png',
  './mmc.png', // ⬅️ IDUGANG: Ang watermark logo para sa picture
  'https://lh3.googleusercontent.com/d/1m1NrFKOMKh4YjoUdXD0KvxcpySM5RuwU', // Ang imong banner image
  './scan.html',
  './scan.json',
  './scan.png',
  'https://unpkg.com/html5-qrcode', // ⬅️ IDUGANG: Ang utok sa QR Scanner
  './report.html',
  './map.html',
 
  // 👇 IDUGANG ANG IMONG KANTA DINHI 👇
  './never_say_never.mp3', // ⬅️ IDUGANG: Ang para tugtog inig mag SEND sa DATA
  //'./imong_kanta.mp3', // ⚠️ ILISI KINI KUNG UNSA GYUD ANG EXACT FILENAME SA IMONG AUDIO (ex: never_say_never.mp3)
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@8',
];


// 1. INSTALL EVENT: I-download ug i-save ang mga files sa celfon cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// 2. FETCH EVENT: I-serve ang files gikan sa cache kung offline na
self.addEventListener('fetch', event => {
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

// 3. ACTIVATE EVENT: Limpyohi ang mga karaan nga cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});