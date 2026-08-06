import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    imageSizes: [256, 384],
    deviceSizes: [640, 1200, 2048],
  },
};

export default nextConfig;
