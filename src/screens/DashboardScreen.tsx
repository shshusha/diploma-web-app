import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {
  Appbar,
  Text,
  Divider,
  FAB,
  useTheme,
  Card,
  Button,
  IconButton,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { QuickActionButton } from '../components/Dashboard/QuickActionButton';
import { RecentAlertItem } from '../components/Dashboard/RecentAlertItem';
import { SystemStatusModal } from '../components/SystemStatusModal';
import { trpc } from '../lib/trpc';
import { simulationService } from '../lib/simulationService';
import { getAlertTypeDisplayText } from '../lib/alertUtils';

interface DashboardScreenProps {
  selectedAccountId: string;
  onLogout: () => Promise<void>;
  onNavigateToAlertHistory: () => void;
  onNavigateToEmergencyContacts: () => void;
  onNavigateToEmergencyAlert: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  selectedAccountId,
  onLogout,
  onNavigateToAlertHistory,
  onNavigateToEmergencyContacts,
  onNavigateToEmergencyAlert,
}) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [systemStatusModalVisible, setSystemStatusModalVisible] =
    useState(false);

  // Set the current account in simulation service when component mounts
  useEffect(() => {
    simulationService.setCurrentAccount(selectedAccountId);
    // Log dashboard access
    simulationService.logDashboardAccess();
  }, [selectedAccountId]);

  // tRPC queries
  const {
    data: alerts,
    isLoading: alertsLoading,
    error: alertsError,
    refetch: refetchAlerts,
  } = trpc.alerts.getAll.useQuery({
    limit: 10,
    isResolved: false, // Get active alerts
    userId: selectedAccountId, // Filter by current user
  });

  // Get selected account details
  const { data: selectedAccount } = trpc.users.getById.useQuery({
    id: selectedAccountId,
  });

  // Resolve alert mutation
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout and select a different account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
    );
  };

  const handleEmergencyPress = () => {
    onNavigateToEmergencyAlert();
  };

  const handleCallContacts = () => {
    onNavigateToEmergencyContacts();
  };

  const handleViewAlerts = () => {
    onNavigateToAlertHistory();
  };

  const handleSystemStatusPress = () => {
    setSystemStatusModalVisible(true);
  };

  const handleSystemStatusDismiss = () => {
    setSystemStatusModalVisible(false);
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

  // Get system components status
  const getSystemComponents = () => {
    return [
      {
        name: 'Location Services',
        status: 'online' as const,
        lastCheck: 'Just now',
      },
      {
        name: 'Emergency Contacts',
        status: 'online' as const,
        lastCheck: '2 minutes ago',
      },
      {
        name: 'Alert System',
        status: alertsError ? ('offline' as const) : ('online' as const),
        lastCheck: 'Just now',
      },
      {
        name: 'Network Connection',
        status: 'online' as const,
        lastCheck: 'Just now',
      },
    ];
  };

  // Determine status based on active alerts
  const getStatusData = () => {
    if (alertsLoading) {
      return {
        status: 'warning' as const,
        title: 'Loading Status',
        description: 'Checking system status...',
        lastUpdated: 'Just now',
      };
    }

    if (alertsError) {
      return {
        status: 'danger' as const,
        title: 'Connection Error',
        description: 'Unable to connect to safety monitoring system.',
        lastUpdated: 'Just now',
      };
    }

    const activeAlertsCount = alerts?.length || 0;

    if (activeAlertsCount === 0) {
      return {
        status: 'safe' as const,
        title: 'Safety Status',
        description: 'All systems are functioning normally. No active alerts.',
        lastUpdated: 'Just now',
      };
    } else if (activeAlertsCount <= 2) {
      return {
        status: 'warning' as const,
        title: 'Safety Status',
        description: `${activeAlertsCount} active alert(s) detected. Monitor situation.`,
        lastUpdated: 'Just now',
      };
    } else {
      return {
        status: 'danger' as const,
        title: 'Safety Status',
        description: `${activeAlertsCount} active alerts detected. Immediate attention required.`,
        lastUpdated: 'Just now',
      };
    }
  };

  const statusData = getStatusData();

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content
          title="Safety Monitor"
          subtitle={selectedAccount?.name || 'Dashboard'}
        />
        <IconButton
          icon={() => (
            <Icon
              name={
                statusData.status === 'safe'
                  ? 'check-circle'
                  : statusData.status === 'warning'
                  ? 'warning'
                  : 'error'
              }
              size={24}
              color={
                statusData.status === 'safe'
                  ? '#4CAF50'
                  : statusData.status === 'warning'
                  ? '#FF9800'
                  : '#F44336'
              }
            />
          )}
          onPress={handleSystemStatusPress}
          style={styles.statusIcon}
        />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Current Alerts Section - Show first if there are alerts */}
        {alerts && alerts.length > 0 && (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text variant="titleLarge" style={styles.sectionTitle}>
                  Current Alerts
                </Text>
                <Text style={styles.alertCount}>
                  {alertsLoading ? '...' : alerts?.length || 0} active
                </Text>
              </View>

              {alertsLoading ? (
                <Card style={styles.loadingCard}>
                  <Card.Content style={styles.loadingContent}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>
                      Loading current alerts...
                    </Text>
                  </Card.Content>
                </Card>
              ) : alertsError ? (
                <Card style={styles.errorCard}>
                  <Card.Content>
                    <Text style={styles.errorText}>
                      Failed to load current alerts. Pull down to refresh.
                    </Text>
                    <Text style={styles.errorDetails}>
                      {alertsError.message}
                    </Text>
                  </Card.Content>
                </Card>
              ) : (
                alerts.map(alert => (
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
              )}
            </View>

            <Divider style={styles.divider} />
          </>
        )}

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsContainer}>
            <QuickActionButton
              title="Call Contacts"
              icon="phone"
              onPress={handleCallContacts}
              color="#4CAF50"
            />
            <QuickActionButton
              title="View All Alerts"
              icon="notifications"
              onPress={handleViewAlerts}
              color="#FF9800"
            />
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Alerts History Section - Show at bottom if no current alerts */}
        {(!alerts || alerts.length === 0) && (
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              Alert History
            </Text>
            <Card style={styles.alertsCard}>
              <Card.Content style={styles.alertsContent}>
                <Text style={styles.alertsTitle}>
                  {alertsLoading
                    ? 'Loading...'
                    : `${alerts?.length || 0} active alerts`}
                </Text>
                <Text style={styles.alertsSubtitle}>
                  View your complete alert history and manage all alerts
                </Text>
                <Button
                  mode="contained"
                  onPress={onNavigateToAlertHistory}
                  style={styles.viewAllButton}
                  icon="notifications"
                >
                  View All Alerts
                </Button>
              </Card.Content>
            </Card>
          </View>
        )}

        {/* Bottom spacing for FAB */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button for Emergency */}
      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.error }]}
        icon="exclamation"
        onPress={handleEmergencyPress}
        label="SOS"
      />

      {/* System Status Modal */}
      <SystemStatusModal
        visible={systemStatusModalVisible}
        onDismiss={handleSystemStatusDismiss}
        status={statusData.status}
        title={statusData.title}
        description={statusData.description}
        lastUpdated={statusData.lastUpdated}
        activeAlertsCount={alerts?.length || 0}
        totalAlertsCount={alerts?.length || 0}
        systemComponents={getSystemComponents()}
      />
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
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  alertCount: {
    fontSize: 14,
    color: '#666',
    paddingRight: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  divider: {
    marginVertical: 16,
  },
  bottomSpacing: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
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
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  viewAllCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  viewAllContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  viewAllButton: {
    marginTop: 8,
  },
  alertsCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  alertsContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  alertsSubtitle: {
    color: '#666',
    marginBottom: 16,
  },
  statusIcon: {
    marginRight: 8,
  },
});
