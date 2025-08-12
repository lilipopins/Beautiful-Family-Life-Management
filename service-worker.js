
const CACHE_NAME='bfl-v1';
const OFFLINE_URL='offline.html';
const PRECACHE=[
  './','index.html','styles.min.css','script.min.js',
  'icon-192.png','icon-512.png','apple-touch-icon.png',
  'splash-portrait.png','splash-landscape.png',
  'page-d-accueil.png','infographie-gratuit-vs-premium.png',
  'tarifs-et-ofrre-premium.png','modules-et-fonctionnalites.png',
  'communaute-et-ressources.png','contact-et-support.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  e.respondWith(fetch(e.request).then(res=>{
    const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)); return res;
  }).catch(()=>caches.match(e.request).then(r=>r||caches.match(OFFLINE_URL))));
});
