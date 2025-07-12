declare module 'next-pwa' {
  import { NextConfig } from 'next'
  type NextPWA = (nextConfig: Partial<NextConfig>) => (config: NextConfig) => NextConfig
  const withPWA: NextPWA
  export default withPWA
}
