/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  swcMinify: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['topcar.club'],
  },
}

module.exports = nextConfig
