addEventListener('message', (event) => {
  console.log('service-worker', event);
});

postMessage('hello world');
console.log('sup');

self.addEventListener('fetch', (event) =>
  event.respondWith(cacheThenNetwork(event))
);

async function cacheThenNetwork(event) {
  const cache = await caches.open(getCacheName());

  const cachedResponse = await cache.match(event.request);

  if (cachedResponse) {
    log('Serving From Cache: ' + event.request.url);
    return cachedResponse;
  }

  const networkResponse = await fetch(event.request);

  log('Calling network: ' + event.request.url);

  return networkResponse;
}
