# Account Selection Feature

## Overview

The Safety Monitor Mobile App now includes an account selection screen that appears before the dashboard. This feature allows users to select and simulate different accounts, with all usage data being sent to the backend for monitoring and analytics.

## Features

### Account Selection Screen

- **Account List**: Displays all available accounts from the backend
- **Account Details**: Shows name, email, phone, and status for each account
- **Emergency Contacts**: Displays the number of emergency contacts for each account
- **Status Indicators**: Visual status chips (Active, Recently Active, Inactive)
- **Selection Flow**: Click on an account to select it and proceed to dashboard

### Simulation Service

- **Usage Tracking**: Logs all user actions and interactions
- **Account Context**: Maintains current account context throughout the app
- **Backend Integration**: Sends simulation data to backend (when endpoints are implemented)
- **Local Storage**: Stores simulation data locally for debugging

### Dashboard Integration

- **Account Context**: Dashboard shows selected account name in the header
- **Logout Functionality**: Users can logout and select a different account
- **Action Logging**: All dashboard actions are logged with account context

## Implementation Details

### Components

#### AccountSelectionScreen

- Location: `src/screens/AccountSelectionScreen.tsx`
- Purpose: Displays available accounts and handles selection
- Features:
  - Pull-to-refresh functionality
  - Loading and error states
  - Account status visualization
  - Selection confirmation

#### AppContainer

- Location: `src/components/AppContainer.tsx`
- Purpose: Manages the app flow between account selection and dashboard
- Features:
  - Persistent account selection (stored in AsyncStorage)
  - Loading state management
  - Logout functionality

#### SimulationService

- Location: `src/lib/simulationService.ts`
- Purpose: Tracks and logs user actions for simulation purposes
- Features:
  - Singleton pattern for global state
  - Account context management
  - Action logging with timestamps
  - Backend integration ready

### Data Flow

1. **App Launch**: AppContainer checks for stored account selection
2. **Account Selection**: User selects an account from AccountSelectionScreen
3. **Simulation Logging**: Account selection is logged via SimulationService
4. **Dashboard Access**: User proceeds to dashboard with account context
5. **Action Tracking**: All dashboard actions are logged with account context
6. **Logout**: User can logout and return to account selection

### Backend Integration

The app is ready for backend integration with these endpoints:

#### Required Endpoints

- `users.getAll` - Get all available accounts ✅ (Already implemented)
- `users.getById` - Get specific account details ✅ (Already implemented)

#### Optional Endpoints (for full simulation)

- `simulation.logUsage` - Log user actions and interactions
- `simulation.getAccountStats` - Get account usage statistics
- `simulation.setActiveAccount` - Set active account for monitoring

### Usage Tracking

The app tracks these user actions:

1. **Account Selection** (`account_selected`)

   - Triggered when user selects an account
   - Includes account ID and timestamp

2. **Dashboard Access** (`dashboard_accessed`)

   - Triggered when user accesses the dashboard
   - Includes account ID and timestamp

3. **Alert Viewing** (`alert_viewed`)

   - Triggered when user views alert details
   - Includes account ID, alert ID, and timestamp

4. **Emergency Triggered** (`emergency_triggered`)
   - Triggered when user presses emergency button
   - Includes account ID and timestamp

## Configuration

### Development Setup

1. Ensure the backend server is running on the correct port
2. Update `src/lib/config.ts` with your server's IP address
3. Make sure the `users.getAll` endpoint returns account data

### Production Setup

1. Update production URL in `src/lib/config.ts`
2. Implement backend simulation endpoints
3. Configure proper error handling and retry logic

## Future Enhancements

### Planned Features

- **Account Switching**: Switch between accounts without logout
- **Account Search**: Search and filter accounts
- **Account Groups**: Group accounts by organization or role
- **Usage Analytics**: View account usage statistics
- **Real-time Updates**: Live updates when account data changes

### Backend Integration

- **Simulation Endpoints**: Full backend integration for usage tracking
- **Analytics Dashboard**: Backend dashboard for monitoring account usage
- **Real-time Notifications**: Push notifications for account events
- **Multi-tenant Support**: Support for multiple organizations

## Troubleshooting

### Common Issues

1. **No Accounts Displayed**

   - Check if backend server is running
   - Verify `users.getAll` endpoint is working
   - Check network connectivity

2. **Account Selection Fails**

   - Check AsyncStorage permissions
   - Verify account ID format
   - Check console for error messages

3. **Simulation Data Not Sent**
   - Check network connectivity
   - Verify backend endpoints are implemented
   - Check console for simulation logs

### Debug Information

The app logs simulation data to the console. You can view this data by:

1. Opening React Native debugger
2. Checking console logs
3. Looking for "Simulating account usage" messages

## API Reference

### SimulationService Methods

```typescript
// Set current account
simulationService.setCurrentAccount(accountId: string)

// Get current account
simulationService.getCurrentAccount(): string | null

// Log account usage
simulationService.simulateAccountUsage(data: SimulationData): Promise<void>

// Log specific actions
simulationService.logDashboardAccess(): Promise<void>
simulationService.logAlertView(alertId: string): Promise<void>
simulationService.logEmergencyTriggered(): Promise<void>
```

### SimulationData Interface

```typescript
interface SimulationData {
  accountId: string;
  timestamp: Date;
  action:
    | 'account_selected'
    | 'dashboard_accessed'
    | 'alert_viewed'
    | 'emergency_triggered';
  metadata?: Record<string, any>;
}
```
