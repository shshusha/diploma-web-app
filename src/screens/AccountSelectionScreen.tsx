import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Appbar,
  Text,
  Card,
  Button,
  ActivityIndicator,
  Avatar,
  Chip,
  Divider,
} from 'react-native-paper';
import { trpc } from '../lib/trpc';
import { simulationService } from '../lib/simulationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccountSelectionScreenProps {
  onAccountSelected: (accountId: string) => void;
}

export const AccountSelectionScreen: React.FC<AccountSelectionScreenProps> = ({
  onAccountSelected,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // tRPC query to get all users/accounts
  const {
    data: accounts,
    isLoading: accountsLoading,
    error: accountsError,
    refetch: refetchAccounts,
  } = trpc.users.getAll.useQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchAccounts();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccountSelect = async (accountId: string) => {
    setSelectedAccount(accountId);

    try {
      // Store selected account in AsyncStorage
      await AsyncStorage.setItem('selectedAccountId', accountId);

      // Set the current account in simulation service
      simulationService.setCurrentAccount(accountId);

      // Log account selection simulation
      await simulationService.simulateAccountUsage({
        accountId,
        timestamp: new Date(),
        action: 'account_selected',
      });

      Alert.alert(
        'Account Selected',
        'Account selected successfully. Proceeding to dashboard.',
        [
          {
            text: 'Continue',
            onPress: () => onAccountSelected(accountId),
          },
        ],
      );
    } catch (error) {
      console.error('Error selecting account:', error);
      Alert.alert('Error', 'Failed to select account. Please try again.');
    }
  };

  const getAccountStatus = (account: any) => {
    // You can customize this based on your account data structure
    if (account.isActive) return 'Active';
    if (account.lastSeen) return 'Recently Active';
    return 'Inactive';
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#4CAF50';
      case 'Recently Active':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content
          title="Select Account"
          subtitle="Choose an account to simulate"
        />
        <Appbar.Action icon="refresh" onPress={handleRefresh} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Available Accounts
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Select an account to simulate usage and access the dashboard
          </Text>
        </View>

        {accountsLoading ? (
          <Card style={styles.loadingCard}>
            <Card.Content style={styles.loadingContent}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Loading accounts...</Text>
            </Card.Content>
          </Card>
        ) : accountsError ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>
                Failed to load accounts. Pull down to refresh.
              </Text>
              <Text style={styles.errorDetails}>{accountsError.message}</Text>
            </Card.Content>
          </Card>
        ) : accounts && accounts.length > 0 ? (
          <View style={styles.accountsContainer}>
            {accounts.map(account => {
              const status = getAccountStatus(account);
              const statusColor = getAccountStatusColor(status);

              return (
                <Card
                  key={account.id}
                  style={[
                    styles.accountCard,
                    selectedAccount === account.id && styles.selectedCard,
                  ]}
                  onPress={() => handleAccountSelect(account.id)}
                >
                  <Card.Content>
                    <View style={styles.accountHeader}>
                      <View style={styles.accountInfo}>
                        <Avatar.Text
                          size={50}
                          label={account.name?.charAt(0)?.toUpperCase() || 'U'}
                          style={styles.avatar}
                        />
                        <View style={styles.accountDetails}>
                          <Text
                            variant="titleMedium"
                            style={styles.accountName}
                          >
                            {account.name || 'Unknown User'}
                          </Text>
                          <Text
                            variant="bodyMedium"
                            style={styles.accountEmail}
                          >
                            {account.email || 'No email'}
                          </Text>
                          <Text variant="bodySmall" style={styles.accountPhone}>
                            {account.phone || 'No phone'}
                          </Text>
                        </View>
                      </View>
                      <Chip
                        mode="outlined"
                        textStyle={{ color: statusColor }}
                        style={[
                          styles.statusChip,
                          { borderColor: statusColor },
                        ]}
                      >
                        {status}
                      </Chip>
                    </View>

                    {account._count && account._count.emergencyContacts > 0 && (
                      <View style={styles.contactsInfo}>
                        <Text variant="bodySmall" style={styles.contactsLabel}>
                          Emergency Contacts: {account._count.emergencyContacts}
                        </Text>
                      </View>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No accounts found</Text>
              <Text style={styles.emptySubtext}>
                Please ensure the server is running and has user data
              </Text>
            </Card.Content>
          </Card>
        )}

        {selectedAccount && (
          <View style={styles.selectedInfo}>
            <Divider style={styles.divider} />
            <Text variant="bodyMedium" style={styles.selectedText}>
              Selected Account:{' '}
              {accounts?.find(a => a.id === selectedAccount)?.name}
            </Text>
            <Button
              mode="contained"
              onPress={() => {
                if (selectedAccount) {
                  handleAccountSelect(selectedAccount);
                }
              }}
              style={styles.continueButton}
            >
              Continue to Dashboard
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    lineHeight: 20,
  },
  accountsContainer: {
    paddingHorizontal: 16,
  },
  accountCard: {
    marginBottom: 12,
    elevation: 2,
  },
  selectedCard: {
    borderColor: '#1976D2',
    borderWidth: 2,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountEmail: {
    color: '#666',
    marginBottom: 2,
  },
  accountPhone: {
    color: '#999',
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  contactsInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  contactsLabel: {
    color: '#666',
  },
  loadingCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  loadingContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
    paddingVertical: 16,
  },
  errorDetails: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 4,
  },
  emptyCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 16,
    fontSize: 16,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  selectedInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  divider: {
    marginBottom: 16,
  },
  selectedText: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 8,
  },
});
