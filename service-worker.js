self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                'index.html',
                'styles.css',
                'icons/ikonica123.png',
                'https://creator.voiceflow.com/prototype/67d0d79b756dab285ec1318e'
            ]).catch((error) => {
                console.error('Caching failed:', error);
            });
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                if (event.request.url.startsWith('http')) {
                    caches.open('v1').then((cache) => {
                        cache.put(event.request, response.clone());
                    });
                }
                return response;
            }).catch((error) => {
                console.error('Fetch failed:', error);
                return caches.match('offline.html');
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
