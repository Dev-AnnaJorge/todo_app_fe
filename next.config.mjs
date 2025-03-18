/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    experimental: {
      optimizeCss: true,
    },
    webpack: (config) => {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 300000,
      };
      config.optimization.runtimeChunk = 'single';
      config.resolve.fallback = { fs: false, net: false, tls: false };
      return config;
    },
    async headers() {
      return [
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=0, must-revalidate',
            },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=31536000; includeSubDomains; preload',
            },
            { key: 'X-Frame-Options', value: 'DENY' },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'geolocation=(self), microphone=()',
            },
            {
              key: 'Access-Control-Allow-Origin',
              value:
                process.env.NODE_ENV === 'production'
                  ? process.env.NEXT_PUBLIC_BASE_URL
                  : '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'Content-Type, Authorization',
            },
            { key: 'Access-Control-Allow-Credentials', value: 'true' },
          ],
        },
      ];
    },
  
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
  };
  
  export default nextConfig;