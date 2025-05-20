/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");
const nextConfig = {
  reactStrictMode: false,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "116.202.26.85",
        port: "9000", // Add port if required
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
