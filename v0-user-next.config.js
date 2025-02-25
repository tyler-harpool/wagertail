/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // This will allow Next.js to attempt static generation
    // for pages that time out, up to 3 times
    staticPageGenerationTimeout: 120,
  },
}

module.exports = nextConfig

