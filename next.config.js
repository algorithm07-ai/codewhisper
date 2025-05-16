/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 为Docker部署优化
};

module.exports = nextConfig;
