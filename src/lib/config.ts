// Configuration for the app
export const config = {
  // tRPC server configuration
  trpc: {
    // Development URL - replace with your computer's IP address
    // You can find your IP by running: ifconfig | grep "inet " | grep -v 127.0.0.1
    developmentUrl: 'http://192.168.0.185:3000/api/trpc',
    // Production URL - replace with your actual production domain
    productionUrl: 'https://your-production-domain.com/trpc',
  },
  // App configuration
  app: {
    name: 'Safety Monitor',
    version: '1.0.0',
  },
} as const;
