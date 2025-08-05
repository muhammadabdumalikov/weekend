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
        port: "",
        pathname: "/travelapp/**",
      },
      {
        protocol: "http",
        hostname: "minio-z4488o8g0g4s4wcssww8g8s0.116.202.26.85.sslip.io",
        port: "",
        pathname: "/travelapp/**",
      },
      // Instagram CDN patterns - more comprehensive
      {
        protocol: "https",
        hostname: "scontent-ams2-1.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-*.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent-*-*.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cdninstagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.instagram.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "instagram.com",
        port: "",
        pathname: "/**",
      },
      // Generic wildcard as fallback
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/tour/list",
        destination: "https://api.wetrippo.com/api/tour/list",
      },
      {
        source: "/api/admin/tour/list",
        destination: "https://api.wetrippo.com/api/admin/tour/list",
      },
    ];
  },
};

module.exports = nextConfig;
