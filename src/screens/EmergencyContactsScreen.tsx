import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import {
  Appbar,
  Text,
  Card,
  ActivityIndicator,
  FAB,
  IconButton,
  useTheme,
  Avatar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { trpc } from '../lib/trpc';
import { simulationService } from '../lib/simulationService';

interface EmergencyContactsScreenProps {
  selectedAccountId: string;
  onBack: () => void;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isActive?: boolean;
}

export const EmergencyContactsScreen: React.FC<
  EmergencyContactsScreenProps
> = ({ selectedAccountId, onBack }) => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Set the current account in simulation service when component mounts
  React.useEffect(() => {
    simulationService.setCurrentAccount(selectedAccountId);
  }, [selectedAccountId]);

  // tRPC queries - get emergency contacts for the current user
  const {
    data: emergencyContacts,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts,
  } = trpc.emergencyContacts.getByUserId.useQuery({
    userId: selectedAccountId,
  });

  // Get selected account details
  const { data: selectedAccount } = trpc.users.getById.useQuery({
    id: selectedAccountId,
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchContacts();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCallContact = (phoneNumber: string, contactName: string) => {
    Alert.alert('Call Contact', `Call ${contactName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${phoneNumber}`);
        },
      },
    ]);
  };

  const handleAddContact = () => {
    Alert.alert(
      'Add Emergency Contact',
      'This feature will allow you to add new emergency contacts.',
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onBack} />
        <Appbar.Content
          title="Emergency Contacts"
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
        {/* Contacts List */}
        <View style={styles.contactsSection}>
          {contactsLoading ? (
            <Card style={styles.loadingCard}>
              <Card.Content style={styles.loadingContent}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                  Loading emergency contacts...
                </Text>
              </Card.Content>
            </Card>
          ) : contactsError ? (
            <Card style={styles.errorCard}>
              <Card.Content>
                <Text style={styles.errorText}>
                  Failed to load emergency contacts. Pull down to refresh.
                </Text>
                <Text style={styles.errorDetails}>{contactsError.message}</Text>
              </Card.Content>
            </Card>
          ) : emergencyContacts && emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact: Contact, index: number) => {
              return (
                <Card key={contact.id || index} style={styles.contactCard}>
                  <Card.Content>
                    <View style={styles.contactHeader}>
                      <View style={styles.contactInfo}>
                        <Avatar.Text
                          size={50}
                          label={contact.name?.charAt(0)?.toUpperCase() || 'C'}
                          style={styles.avatar}
                        />
                        <View style={styles.contactDetails}>
                          <Text
                            variant="titleMedium"
                            style={styles.contactName}
                          >
                            {contact.name || 'Unknown Contact'}
                          </Text>
                          <Text style={styles.contactPhone}>
                            {contact.phone || 'No phone number'}
                          </Text>
                          <Text style={styles.contactRelationship}>
                            {contact.relationship || 'Emergency Contact'}
                          </Text>
                        </View>
                      </View>
                      <IconButton
                        icon="phone"
                        mode="contained"
                        onPress={() =>
                          handleCallContact(contact.phone, contact.name)
                        }
                        style={[
                          styles.callButton,
                          { backgroundColor: '#4CAF50' },
                        ]}
                        iconColor="white"
                      />
                    </View>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyContent}>
                <Icon name="people" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
                <Text style={styles.emptySubtitle}>
                  Add emergency contacts to ensure help is available when needed
                </Text>
                <IconButton
                  icon="add"
                  mode="contained"
                  onPress={handleAddContact}
                  style={styles.addButton}
                  iconColor="white"
                />
              </Card.Content>
            </Card>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button for adding contacts */}
      {emergencyContacts && emergencyContacts.length > 0 && (
        <FAB
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          icon="add"
          onPress={handleAddContact}
          label="Add Contact"
        />
      )}
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
  contactsSection: {
    paddingHorizontal: 16,
  },
  loadingCard: {
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
  contactCard: {
    marginVertical: 8,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactPhone: {
    color: '#666',
    marginBottom: 2,
  },
  contactRelationship: {
    color: '#999',
    fontSize: 12,
  },
  callButton: {
    margin: 4,
  },
  emptyCard: {
    marginVertical: 8,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#666',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#999',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  addButton: {
    marginTop: 8,
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
});
