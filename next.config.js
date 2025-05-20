/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");
const nextConfig = {
  reactStrictMode: false,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio-z4488o8g0g4s4wcssww8g8s0.116.202.26.85.sslip.io",
        port: "443", // Add port if required
        pathname: "/travelapp/**", // Adjust the path to match your files
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tour/list",
        destination: "https://api.trippo.live/api/tour/list", // Proxies API requests
      },
    ];
  },
};

module.exports = nextConfig;
