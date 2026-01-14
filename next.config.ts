import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure trailing slash consistency
  trailingSlash: false,
  
  // Redirects for old URLs and URL normalization
  async redirects() {
    return [
      // Redirect old boy/girl URLs to male/female
      {
        source: '/names/boy',
        destination: '/names/male',
        permanent: true,
      },
      {
        source: '/names/boy/:path*',
        destination: '/names/male/:path*',
        permanent: true,
      },
      {
        source: '/names/girl',
        destination: '/names/female',
        permanent: true,
      },
      {
        source: '/names/girl/:path*',
        destination: '/names/female/:path*',
        permanent: true,
      },
      // Redirect uppercase letters to lowercase
      {
        source: '/names/starting-with/:letter([A-Z])',
        destination: '/names/starting-with/:letter',
        permanent: true,
      },
      {
        source: '/names/:gender/starting-with/:letter([A-Z])',
        destination: '/names/:gender/starting-with/:letter',
        permanent: true,
      },
    ];
  },
  
  // Headers for SEO and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      // Cache static SEO pages
      {
        source: '/names/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/name/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
