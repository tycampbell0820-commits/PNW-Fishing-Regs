/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `standalone` lets the Docker image ship only the runtime files Next needs,
  // not the whole node_modules tree. Drops the image size by ~10x.
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3']
};

export default nextConfig;
