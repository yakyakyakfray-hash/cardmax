/* CardMax service worker — app-shell caching for offline + installability.
   Bump CACHE_VERSION whenever you change cached assets so clients refresh. */
const CACHE_VERSION = "cardmax-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./cards.js",
  "./firebase-config.js",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon-180.png",
  "./icons/favicon-32.png",
  // Firebase SDK modules — cached so the app shell can boot offline.
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Cache each asset independently so one failed (e.g. offline) cross-origin
      // fetch doesn't abort the whole install.
      Promise.all(APP_SHELL.map((url) => cache.add(url).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* Navigations: network-first so app updates show up, falling back to cache offline.
   Other GETs: cache-first for speed.
   Note (for the Code build): do NOT cache Firebase/Firestore API calls here —
   let those hit the network so sync stays live. Add an exclusion when wiring Firebase. */
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Never intercept Firebase Auth / Firestore backend calls — sync must stay
  // live and tokens must hit the network. (The gstatic SDK *modules* are a
  // different host and remain cacheable above.)
  const url = new URL(req.url);
  const host = url.hostname;
  if (/googleapis\.com$|accounts\.google\.com$|apis\.google\.com$|firebaseio\.com$|identitytoolkit|securetoken|firestore|firebaseinstallations/.test(host)) {
    return; // fall through to the network, no caching
  }
  // Firebase Hosting reserves /__/auth/* and /__/firebase/* for the sign-in
  // helper — never cache or intercept these, or auth breaks.
  if (url.pathname.startsWith("/__/")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
