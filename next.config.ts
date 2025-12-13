import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ctaiwooelzfacgkukunb.supabase.co', // The hostname from your error message
        port: '',
        pathname: '/storage/v1/object/public/**', // This allows all images from your public storage
      },
    ],
  },
};

export default nextConfig;
