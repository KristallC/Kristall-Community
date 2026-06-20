const CACHE_NAME = 'kristall-cache-v1';
const ASSETS = [
  'index.html',
  'projects.html',
  'marketplace.html',
  'profile.html',
  'project-template.html',
  'styles.css',
  'favicon.png',
  'css/decorations.css',
  'databases/projects.json',
  'databases/market.json',
  'databases/news.json',
  'databases/users.json'
];

// Установка сервис-воркера и кэширование твоих реальных ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Перехват запросов для стабильной автономной работы сайта
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
