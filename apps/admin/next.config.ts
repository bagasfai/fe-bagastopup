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
}

export default nextConfig
