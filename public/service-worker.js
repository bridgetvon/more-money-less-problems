// const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'version_01';
const CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/assets/css/style.css',
    '/assets/images/icons/icon-72x72.png',
    '/assets/images/icons/icon-96x96.png',
    '/assets/images/icons/icon-128x128.png',
    '/assets/images/icons/icon-144x144.png',
    '/assets/images/icons/icon-152x152.png',
    '/assets/images/icons/icon-192x192.png',
    '/assets/images/icons/icon-384x384.png',
    '/assets/images/icons/icon-512x512.png'
];

//install service worker 
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache: ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(keyList =>{
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log('removing cache data', key);
                        return caches.delete(key);
                    }
                })
            )
        })
    );
    //take every instance of the application a user has and claim this activation, this service worker is activated among all demands a user has open 
    self.clients.claim()
})

//intercept fetch request 
self.addEventListener('fetch', (evt) => {
    if (evt.request.url.includes('/api/')) {
        evt.respondWith(
            caches
              .open(CACHE_NAME)
              .then(cache => {
                return fetch(evt.request)
                  .then(response => {
                    if (response.status === 200) {
                        //response.clone can only be used once to we clone it so it can be used later 
                      const responseClone = response.clone();
                      cache.put(evt.request.url, responseClone);
                    }
      
                    return response;
                  })
                  .catch(err => {
                    // Network request failed, try to get it from the cache.
                    return cache.match(evt.request);
                  });
              })
              .catch(err => console.log(err))
          );
      
          return;
        }
    
        evt.respondWith(
            fetch(evt.request).catch(function () {
                return caches.match(evt.request).then(function(response){
                    if (response) {
                        return response;
                    } else if (evt.request.headers.get('accept').includes('text.html')) {
                        return caches.match('/');
                    }
                });
            })
        );
    });
    