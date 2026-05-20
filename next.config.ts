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
    // Skip server-side image optimization while we are on placeholder imagery.
    // The optimizer fetches each remote URL on the server, which fails behind
    // TLS-intercepting proxies (UNABLE_TO_VERIFY_LEAF_SIGNATURE) and adds no
    // value for already-rasterised mock placeholders. Flip this back to the
    // default once real CDN imagery replaces the mocks.
    // Alternative if you need optimization in this environment: launch dev
    // with `NODE_OPTIONS=--use-system-ca` so Node trusts the OS certificate
    // store (Node 22+).
    unoptimized: true,
  },
};

export default nextConfig;
