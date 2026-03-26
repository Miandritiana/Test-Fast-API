import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/auth/sign_up",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_up`,
        },
        {
          source: "/api/auth/sign_in",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/sign_in_with_password`,
        },
        {
          source: "/api/profiles",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/profiles`,
        }
      ];
    },
    experimental: {
      proxyTimeout: 2000000,
    },
};

const withNextIntl = createNextIntlPlugin();

export default nextConfig;
