import type { NextConfig } from "next";
import { BASE_PATH } from "./src/lib/base-path";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['rewind-devotion-unquote.ngrok-free.dev']
};

export default nextConfig;
