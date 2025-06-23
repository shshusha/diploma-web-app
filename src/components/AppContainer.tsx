import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountSelectionScreen } from '../screens/AccountSelectionScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AlertHistoryScreen } from '../screens/AlertHistoryScreen';
import { EmergencyContactsScreen } from '../screens/EmergencyContactsScreen';
import { EmergencyAlertScreen } from '../screens/EmergencyAlertScreen';
import { LoadingScreen } from './LoadingScreen';

type Screen =
  | 'account-selection'
  | 'dashboard'
  | 'alert-history'
  | 'emergency-contacts'
  | 'emergency-alert';

export const AppContainer: React.FC = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  const [currentScreen, setCurrentScreen] =
    useState<Screen>('account-selection');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a previously selected account
    const checkStoredAccount = async () => {
      try {
        const storedAccountId = await AsyncStorage.getItem('selectedAccountId');
        if (storedAccountId) {
          setSelectedAccountId(storedAccountId);
          setCurrentScreen('dashboard');
        }
      } catch (error) {
        console.error('Error reading stored account:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAccount();
  }, []);

  const handleAccountSelected = (accountId: string) => {
    setSelectedAccountId(accountId);
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('selectedAccountId');
      setSelectedAccountId(null);
      setCurrentScreen('account-selection');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleNavigateToAlertHistory = () => {
    setCurrentScreen('alert-history');
  };

  const handleNavigateToEmergencyContacts = () => {
    setCurrentScreen('emergency-contacts');
  };

  const handleNavigateToEmergencyAlert = () => {
    setCurrentScreen('emergency-alert');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  // Show loading state while checking for stored account
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show account selection if no account is selected
  if (!selectedAccountId) {
    return <AccountSelectionScreen onAccountSelected={handleAccountSelected} />;
  }

  // Show appropriate screen based on current screen state
  switch (currentScreen) {
    case 'alert-history':
      return (
        <AlertHistoryScreen
          selectedAccountId={selectedAccountId}
          onBack={handleBackToDashboard}
        />
      );
    case 'emergency-contacts':
      return (
        <EmergencyContactsScreen
          selectedAccountId={selectedAccountId}
          onBack={handleBackToDashboard}
        />
      );
    case 'emergency-alert':
      return (
        <EmergencyAlertScreen
          onGoBack={handleBackToDashboard}
          selectedAccountId={selectedAccountId}
        />
      );
    case 'dashboard':
    default:
      return (
        <DashboardScreen
          selectedAccountId={selectedAccountId}
          onLogout={handleLogout}
          onNavigateToAlertHistory={handleNavigateToAlertHistory}
          onNavigateToEmergencyContacts={handleNavigateToEmergencyContacts}
          onNavigateToEmergencyAlert={handleNavigateToEmergencyAlert}
        />
      );
  }
};
