import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["acme.test", "proplumb.test"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
