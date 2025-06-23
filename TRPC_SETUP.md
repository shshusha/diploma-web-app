# tRPC Setup Guide for Mobile App

## Overview

This mobile app uses tRPC to communicate with the alarm-app server. The setup has been configured to work with the existing server endpoints.

## Configuration

### 1. Update Server URL

Edit `src/lib/config.ts` and update the `developmentUrl` with your computer's IP address:

```typescript
export const config = {
  trpc: {
    // Replace with your computer's IP address
    developmentUrl: 'http://YOUR_IP_ADDRESS:3000/trpc',
    productionUrl: 'https://your-production-domain.com/trpc',
  },
  // ...
};
```

### 2. Find Your IP Address

Run this command to find your computer's IP address:

```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Or on macOS:

```bash
ipconfig getifaddr en0
```

### 3. Ensure Server is Running

Make sure the alarm-app server is running on port 3000:

```bash
cd ../alarm-app
npm run dev
```

## Available tRPC Endpoints

The mobile app uses these server endpoints:

### Alerts

- `alerts.getAll` - Get all alerts with optional filtering
- `alerts.resolve` - Mark an alert as resolved
- `alerts.create` - Create a new alert

### Users

- `users.getAll` - Get all users
- `users.getById` - Get user by ID
- `users.create` - Create a new user

### Emergency Contacts

- `emergencyContacts.*` - Manage emergency contacts

### Detection Rules

- `detectionRules.*` - Manage detection rules

## Features Implemented

### Dashboard Screen

- ✅ Real-time status based on active alerts
- ✅ Loading states and error handling
- ✅ Pull-to-refresh functionality
- ✅ Alert resolution via tRPC mutation
- ✅ Dynamic status indicators

### Error Handling

- ✅ Network error detection
- ✅ Loading states for all queries
- ✅ Retry logic with exponential backoff
- ✅ User-friendly error messages

### Data Persistence

- ✅ Query cache persistence using AsyncStorage
- ✅ Optimistic updates for mutations
- ✅ Background refetching

## Troubleshooting

### Connection Issues

1. Ensure both devices are on the same network
2. Check firewall settings on your computer
3. Verify the server is running on port 3000
4. Test the connection in a browser: `http://YOUR_IP:3000/trpc`

### Development Tips

- Use ngrok for testing if devices are on different networks
- Enable React Native debugging to see tRPC logs
- Check the server logs for any errors

## Production Deployment

1. Update `productionUrl` in `src/lib/config.ts`
2. Ensure your server is accessible from the internet
3. Set up proper SSL certificates
4. Configure CORS on the server if needed
