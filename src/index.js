
 // TODO: introduce eslintrc.js
//  if (navigator.serviceWorker != null) {
//   navigator.serviceWorker.register('sw.js')
//     .then((registration) => {
//       console.log('Registered events at scope: ', registration.scope);
//     });
// }
// //TODO: consider generate cache list using webpack
// const cacheStorageKey = 'minimal-pwa-1'

// const cacheList = [
//   '/',
//   "index.html",
//   "main.css",
//   "e.png"
// ];
// self.addEventListener('install', e => {
//   e.waitUntil(
//     caches.open(cacheStorageKey)
//     .then(cache => cache.addAll(cacheList))
//     .then(() => self.skipWaiting())
//   )
// });
// self.addEventListener('fetch', function(e) {
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       if (response != null) {
//         return response
//       }
//       return fetch(e.request.url)
//     })
//   )
// });
// self.addEventListener('activate', function(e) {
//   e.waitUntil(
//     Promise.all(
//       caches.keys().then(cacheNames => {
//         return cacheNames.map(name => {
//           if (name !== cacheStorageKey) {
//             return caches.delete(name)
//           }
//         })
//       })
//     ).then(() => {
//       return self.clients.claim()
//     })
//   )
// });

import io from 'socket.io-client';

const socket = io('http://localhost');
socket.on('connect', () => {
  console.log('Connected');
});