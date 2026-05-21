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
  // Backward-compat redirects for legacy flat-listing URLs. The `Browse_System`
  // moved from `/products?category=…` to dedicated category routes
  // (`/products/account|topup|voucher`). `permanent: true` issues HTTP 308 so
  // search engines and clients update their cached entries. The `has` clause
  // matches the literal `category` query value; query params other than
  // `category` (e.g. `?q=…`) are passed through to the destination unchanged.
  // See spec: .kiro/specs/product-categorization-update (REQ-6.5, REQ-12.1).
  async redirects() {
    return [
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "account" }],
        destination: "/products/account",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "topup" }],
        destination: "/products/topup",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "category", value: "voucher" }],
        destination: "/products/voucher",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
