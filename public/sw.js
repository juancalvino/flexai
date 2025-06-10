// Service Worker for FLEXAI
// Version: 1.0.0

const CACHE_NAME = 'flexai-v1';
const STATIC_CACHE = 'flexai-static-v1';
const DYNAMIC_CACHE = 'flexai-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/precios',
  '/cobertura', 
  '/nosotros',
  '/404',
  '/assets/imagotipoFlexai.svg',
  '/favicon.svg',
  '/manifest.json'
];

// Network-first resources
const NETWORK_FIRST = [
  '/api/',
  'https://lightdata.flexai.com.ar/',
  'https://fonts.googleapis.com/',
  'https://fonts.gstatic.com/'
];

// Cache-first resources
const CACHE_FIRST = [
  '/assets/',
  '/images/',
  '/_astro/'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleRequest(request, url)
  );
});

async function handleRequest(request, url) {
  try {
    // Strategy 1: Network first for API calls and external resources
    if (NETWORK_FIRST.some(pattern => url.href.includes(pattern))) {
      return await networkFirst(request);
    }
    
    // Strategy 2: Cache first for static assets
    if (CACHE_FIRST.some(pattern => url.pathname.startsWith(pattern))) {
      return await cacheFirst(request);
    }
    
    // Strategy 3: Stale while revalidate for pages
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.error('Service Worker: Request failed', error);
    
    // Fallback to cache or offline page
    return await getCachedResponse(request) || 
           await getOfflineFallback(request);
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    return await getCachedResponse(request);
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await getCachedResponse(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Cache first failed', error);
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Fetch from network in background
  const networkPromise = fetch(request)
    .then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.warn('Service Worker: Network update failed', error);
    });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || networkPromise;
}

// Get cached response from any cache
async function getCachedResponse(request) {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    
    if (response) {
      return response;
    }
  }
  
  return null;
}

// Offline fallback
async function getOfflineFallback(request) {
  // For navigation requests, return cached homepage or offline page
  if (request.mode === 'navigate') {
    return await getCachedResponse('/') || 
           new Response('Offline - Please check your connection', {
             status: 503,
             statusText: 'Service Unavailable',
             headers: { 'Content-Type': 'text/plain' }
           });
  }
  
  return new Response('Resource not available offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Message handling for cache updates
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_URLS':
      cacheUrls(payload.urls);
      break;
      
    case 'CLEAR_CACHE':
      clearCache(payload.cacheName);
      break;
      
    default:
      console.log('Service Worker: Unknown message type', type);
  }
});

// Cache specific URLs
async function cacheUrls(urls) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
    console.log('Service Worker: URLs cached successfully');
  } catch (error) {
    console.error('Service Worker: Failed to cache URLs', error);
  }
}

// Clear specific cache
async function clearCache(cacheName) {
  try {
    await caches.delete(cacheName || DYNAMIC_CACHE);
    console.log('Service Worker: Cache cleared');
  } catch (error) {
    console.error('Service Worker: Failed to clear cache', error);
  }
}