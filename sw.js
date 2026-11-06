/* NEKEH Portál – service worker (offline-héj és telepíthetőség) */
const VERSION = 'nekeh-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './img/cimer.webp',
  './img/app/icon-192.png',
  './img/app/icon-512.png',
  './img/app/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Csak a saját eredetű kéréseket kezeljük; a Firebase/gstatic/ipify a hálózatra megy.
  if (url.origin !== self.location.origin) return;

  // Oldal-navigáció: előbb hálózat (friss változat), ha nincs net, a gyorsítótárból az app-héj.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(r => { const cp = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); return r; })
        .catch(() => caches.match('./index.html').then(r => r || caches.match('./')))
    );
    return;
  }

  // Statikus fájlok (képek stb.): előbb gyorsítótár, mellette frissítés a háttérben.
  e.respondWith(
    caches.match(req).then(cached => {
      const net = fetch(req).then(r => {
        if (r && r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
        return r;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
