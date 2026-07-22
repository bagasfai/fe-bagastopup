import path from "node:path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  // Produces a self-contained .next/standalone build for lean Docker images.
  output: "standalone",
  // In a monorepo, tracing must be rooted at the repo root (not this app
  // folder), or the standalone bundle will miss the packages/ui workspace
  // dependency and crash at runtime.
  outputFileTracingRoot: path.join(__dirname, "../../"),
  images: {
    // Game logos/hero art are locally-generated placeholder SVGs; Next's
    // image optimizer refuses SVGs by default (XSS risk from untrusted
    // uploads), which doesn't apply to our own static assets.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
