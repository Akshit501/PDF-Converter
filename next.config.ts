import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.29.93", "192.168.29.93:3000", "localhost:3000"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

