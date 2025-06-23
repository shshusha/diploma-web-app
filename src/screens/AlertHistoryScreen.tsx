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
  ActivityIndicator,
  Chip,
} from 'react-native-paper';
import { RecentAlertItem } from '../components/Dashboard/RecentAlertItem';
import { trpc } from '../lib/trpc';
import { simulationService } from '../lib/simulationService';
import { getAlertTypeDisplayText } from '../lib/alertUtils';

interface AlertHistoryScreenProps {
  selectedAccountId: string;
  onBack: () => void;
}

export const AlertHistoryScreen: React.FC<AlertHistoryScreenProps> = ({
  selectedAccountId,
  onBack,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  // Set the current account in simulation service when component mounts
  React.useEffect(() => {
    simulationService.setCurrentAccount(selectedAccountId);
  }, [selectedAccountId]);

  // tRPC queries - get all alerts for the current user
  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts,
  } = trpc.alerts.getAll.useQuery({
    limit: 50, // Get more alerts for history
    userId: selectedAccountId, // Filter by current user
  });

  // Get selected account details
  const { data: selectedAccount } = trpc.users.getById.useQuery({
    id: selectedAccountId,
  });

  const resolveAlertMutation = trpc.alerts.resolve.useMutation({
    onSuccess: () => {
      refetchAlerts();
    },
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchAlerts();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAlertPress = (alertId: string, alertData: any) => {
    // Log alert view
    simulationService.logAlertView(alertId);

    Alert.alert(
      getAlertTypeDisplayText(alertData.type) || 'Alert Details',
      alertData.message || 'No message available',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Resolved',
          onPress: () => {
            resolveAlertMutation.mutate({ id: alertId });
          },
        },
      ],
    );
  };

  // Filter alerts based on current filter
  const filteredAlerts =
    alerts?.filter(alert => {
      switch (filter) {
        case 'active':
          return !alert.isResolved;
        case 'resolved':
          return alert.isResolved;
        default:
          return true; // 'all'
      }
    }) || [];

  const getFilterCount = (filterType: 'all' | 'active' | 'resolved') => {
    if (!alerts) return 0;
    switch (filterType) {
      case 'active':
        return alerts.filter(alert => !alert.isResolved).length;
      case 'resolved':
        return alerts.filter(alert => alert.isResolved).length;
      default:
        return alerts.length;
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content
          title="Alert History"
          subtitle={selectedAccount?.name || 'User'}
        />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <Text variant="titleMedium" style={styles.filterTitle}>
            Filter Alerts
          </Text>
          <View style={styles.filterChips}>
            <Chip
              mode={filter === 'all' ? 'flat' : 'outlined'}
              onPress={() => setFilter('all')}
              style={styles.filterChip}
            >
              All ({getFilterCount('all')})
            </Chip>
            <Chip
              mode={filter === 'active' ? 'flat' : 'outlined'}
              onPress={() => setFilter('active')}
              style={styles.filterChip}
            >
              Active ({getFilterCount('active')})
            </Chip>
            <Chip
              mode={filter === 'resolved' ? 'flat' : 'outlined'}
              onPress={() => setFilter('resolved')}
              style={styles.filterChip}
            >
              Resolved ({getFilterCount('resolved')})
            </Chip>
          </View>
        </View>

        {/* Alerts Section */}
        <View style={styles.alertsSection}>
          {alertsLoading ? (
            <Card style={styles.loadingCard}>
              <Card.Content style={styles.loadingContent}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading alert history...</Text>
              </Card.Content>
            </Card>
          ) : alertsError ? (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={styles.errorText}>
                  Failed to load alert history. Pull down to refresh.
                </Text>
                <Text style={styles.errorDetails}>{alertsError.message}</Text>
              </Card.Content>
            </Card>
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <RecentAlertItem
                key={alert.id}
                id={alert.id}
                type={alert.type}
                severity={alert.severity}
                message={alert.message}
                timestamp={new Date(alert.createdAt).toLocaleDateString()}
                isResolved={alert.isResolved}
                onPress={id => handleAlertPress(id, alert)}
              />
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No {filter === 'all' ? '' : filter} alerts found
                </Text>
                <Text style={styles.emptySubtext}>
                  {filter === 'active'
                    ? 'You have no active alerts at the moment.'
                    : filter === 'resolved'
                    ? 'No resolved alerts in your history.'
                    : 'No alerts found in your history.'}
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
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
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  filterTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  alertsSection: {
    flex: 1,
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
    fontWeight: 'bold',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  bottomSpacing: {
    height: 20,
  },
});
