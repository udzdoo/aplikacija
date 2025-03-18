const CACHE_NAME = 'v1';
const urlsToCache = [
    '/',
    'index.html',
    'styles.css',
    'icons/android-icon-36x36.png',
    'icons/android-icon-48x48.png',
    'icons/android-icon-72x72.png',
    'icons/android-icon-96x96.png',
    'icons/android-icon-144x144.png',
    'icons/android-icon-192x192.png',
    'https://creator.voiceflow.com/prototype/67d0d79b756dab285ec1318e',
    'offline.html'
];

// Install service worker and cache essential files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache).catch((error) => {
                console.error('Caching failed:', error);
            });
        })
    );
});

// Intercept fetch requests and serve cached response or fetch from network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                if (event.request.url.startsWith('https://') && response.ok) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, response.clone()).catch((error) => {
                            console.error('Failed to cache:', error);
                        });
                    });
                }
                return response;
            }).catch((error) => {
                console.error('Fetch failed:', error);
                return caches.match('offline.html'); // Serve offline page if fetch fails
            });
        })
    );
});

// Activate new service worker and remove old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Delete old caches
                    }
                })
            );
        })
    );
});
