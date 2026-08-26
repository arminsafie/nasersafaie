import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets devices on the same network (e.g. testing on a phone via
  // npm run dev) load the site during local development. Next.js blocks
  // cross-origin requests to dev assets by default since 15.x; without
  // this, a phone loading the page over LAN gets served the HTML but the
  // JS bundle is rejected, so the page looks right but nothing responds
  // to taps. This only affects `next dev` — it has no effect on
  // production builds (`next build` / `next start`).
  allowedDevOrigins: [
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
    "172.17.*.*",
    "172.18.*.*",
    "172.19.*.*",
    "172.20.*.*",
    "172.21.*.*",
    "172.22.*.*",
    "172.23.*.*",
    "172.24.*.*",
    "172.25.*.*",
    "172.26.*.*",
    "172.27.*.*",
    "172.28.*.*",
    "172.29.*.*",
    "172.30.*.*",
    "172.31.*.*",
  ],
};

export default nextConfig;
