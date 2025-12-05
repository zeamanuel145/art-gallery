/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    qualities: [75, 90, 100],
  },
  allowedDevOrigins: [
    '10.4.115.64',
    'localhost',
    '127.0.0.1'
  ],
}

module.exports = nextConfig