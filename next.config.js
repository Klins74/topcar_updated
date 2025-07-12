// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public', // Destination directory for the service worker files
  register: true, // Automatically register the service worker
  skipWaiting: true, // Immediately activate new service worker versions
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development for easier debugging
  // You can add more configurations like runtime caching strategies here
  // runtimeCaching: [ ... ] 
})

module.exports = withPWA({
  // Your existing Next.js config options here
  reactStrictMode: true,
  // ...
})



