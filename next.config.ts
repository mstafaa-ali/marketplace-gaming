import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mock product covers ship from placehold.co until real CDN imagery lands.
    // Keep the host list tight; expand only when adding a verified image source.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
