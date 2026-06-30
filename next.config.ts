import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/codelabs-isis3710",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
