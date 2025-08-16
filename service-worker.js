/* Simple offline-first service worker for BFL */
const CACHE_NAME = 'bfl-pwa-v3';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './offline.html',
  './favicon.svg',
  './manifest.json',
  './page-d-accueil.png',
  './tarifs-et-offres-premium.png',
  './modules-et-fonctionnalites.png',
  './communauté-et-ressources.png',
  './contact-et-support.png',
  './infographie-gratuit-vs-premium.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match('./offline.html')))
  );
});
