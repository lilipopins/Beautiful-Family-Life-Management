
const CACHE_NAME = 'bfl-cache-v1';
const OFFLINE_URL = 'offline.html';
const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'styles.min.css',
  'script.js',
  'script.min.js',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'splash-portrait.png',
  'splash-landscape.png',
  'page-d-accueil.png',
  'infographie-gratuit-vs-premium.png',
  'tarifs-et-ofrre-premium.png',
  'modules-et-fonctionnalites.png',
  'communaute-et-ressources.png',
  'contact-et-support.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS.filter(Boolean).map(x => new Request(x, {cache: 'reload'})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) && caches.delete(k)));
    clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(event.request, response.clone());
      return response;
    } catch (e) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      return caches.match(OFFLINE_URL);
    }
  })());
});
