/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  reactStrictMode: false,
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "37.60.231.13",
        port: "9000", // Add port if required
        pathname: "/travelapp/**", // Adjust the path to match your files
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tour/list",
        destination: "http://37.60.231.13:3001/api/tour/list", // Proxies API requests
      },
    ];
  },
};

module.exports = nextConfig;
