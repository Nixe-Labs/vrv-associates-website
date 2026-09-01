import type { NextConfig } from "next";

/**
 * GitHub Pages serves this project from a subpath
 * (nixe-labs.github.io/vrv-associates-website), so the build needs a basePath.
 * It is applied only in CI, keeping `npm run dev` served from `/` locally.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const repository = "vrv-associates-website";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Pages is static hosting: emit plain HTML/CSS/JS into `out/`.
  output: "export",

  // Directory-style URLs (`/services/index.html`) rather than `/services.html`,
  // which is what Pages resolves reliably.
  trailingSlash: true,

  // No Image Optimization server exists on Pages.
  images: { unoptimized: true },

  // basePath already prefixes `/_next/*` assets — setting assetPrefix as well
  // would double it up.
  ...(isPages ? { basePath: `/${repository}` } : {}),
};

export default nextConfig;
