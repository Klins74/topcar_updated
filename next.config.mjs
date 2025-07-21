/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js configuration options go here.
  // For example, if you use external images:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'moykahpfrrvzsybwmwhv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
};

export default nextConfig;