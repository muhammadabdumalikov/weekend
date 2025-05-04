/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
