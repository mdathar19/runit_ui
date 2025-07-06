/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['assets.runit.in'], // Add the hostname here
      // Or if using Next.js 12.3+, you can use remotePatterns:
      // remotePatterns: [
      //   {
      //     protocol: 'https',
      //     hostname: 'assets.runit.in',
      //   },
      // ],
    },
  }
  
  export default nextConfig;