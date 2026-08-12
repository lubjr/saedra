/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
    dynamicOnHover: true,
  },
};

export default nextConfig;
