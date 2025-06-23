import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Divider,
  List,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SystemStatusModalProps {
  visible: boolean;
  onDismiss: () => void;
  status: 'safe' | 'warning' | 'danger';
  title: string;
  description: string;
  lastUpdated: string;
  activeAlertsCount: number;
  totalAlertsCount: number;
  systemComponents: Array<{
    name: string;
    status: 'online' | 'offline' | 'warning';
    lastCheck: string;
  }>;
}

const { height: screenHeight } = Dimensions.get('window');

export const SystemStatusModal: React.FC<SystemStatusModalProps> = ({
  visible,
  onDismiss,
  status,
  title,
  description,
  lastUpdated,
  activeAlertsCount,
  totalAlertsCount,
  systemComponents,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'safe':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'danger':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'safe':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'error';
      default:
        return 'help';
    }
  };

  const getComponentStatusColor = (componentStatus: string) => {
    switch (componentStatus) {
      case 'online':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'offline':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getComponentStatusIcon = (componentStatus: string) => {
    switch (componentStatus) {
      case 'online':
        return 'check-circle';
      case 'warning':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'help';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onDismiss}
        />
        <View style={styles.modalContainer}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.statusHeader}>
              <Icon
                name={getStatusIcon()}
                size={32}
                color={getStatusColor()}
                style={styles.statusIcon}
              />
              <View style={styles.statusInfo}>
                <Text variant="titleLarge" style={styles.statusTitle}>
                  {title}
                </Text>
                <Text
                  style={[styles.statusIndicator, { color: getStatusColor() }]}
                >
                  {status.toUpperCase()}
                </Text>
              </View>
            </View>
            <IconButton
              icon="close"
              size={24}
              onPress={onDismiss}
              style={styles.closeButton}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Content */}
          <View style={styles.content}>
            {/* Description */}
            <Card style={styles.descriptionCard}>
              <Card.Content>
                <Text style={styles.description}>{description}</Text>
                <Text style={styles.lastUpdated}>
                  Last updated: {lastUpdated}
                </Text>
              </Card.Content>
            </Card>

            {/* Alert Summary */}
            <Card style={styles.summaryCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.summaryTitle}>
                  Alert Summary
                </Text>
                <View style={styles.alertSummary}>
                  <View style={styles.alertItem}>
                    <Text style={styles.alertLabel}>Active Alerts</Text>
                    <Chip
                      mode="outlined"
                      textStyle={{
                        color: activeAlertsCount > 0 ? '#F44336' : '#4CAF50',
                      }}
                      style={[
                        styles.alertChip,
                        {
                          borderColor:
                            activeAlertsCount > 0 ? '#F44336' : '#4CAF50',
                        },
                      ]}
                    >
                      {activeAlertsCount}
                    </Chip>
                  </View>
                  <View style={styles.alertItem}>
                    <Text style={styles.alertLabel}>Total Alerts</Text>
                    <Chip mode="outlined" style={styles.alertChip}>
                      {totalAlertsCount}
                    </Chip>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* System Components */}
            <Card style={styles.componentsCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.componentsTitle}>
                  System Components
                </Text>
                {systemComponents.map((component, index) => (
                  <List.Item
                    key={index}
                    title={component.name}
                    description={`Last check: ${component.lastCheck}`}
                    left={() => (
                      <Icon
                        name={getComponentStatusIcon(component.status)}
                        size={24}
                        color={getComponentStatusColor(component.status)}
                        style={styles.componentIcon}
                      />
                    )}
                    right={() => (
                      <Chip
                        mode="outlined"
                        textStyle={{
                          color: getComponentStatusColor(component.status),
                          fontSize: 12,
                        }}
                        style={[
                          styles.componentChip,
                          {
                            borderColor: getComponentStatusColor(
                              component.status,
                            ),
                          },
                        ]}
                      >
                        {component.status.toUpperCase()}
                      </Chip>
                    )}
                    style={styles.componentItem}
                  />
                ))}
              </Card.Content>
            </Card>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusIndicator: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    margin: 0,
  },
  divider: {
    marginHorizontal: 16,
  },
  content: {
    padding: 16,
  },
  descriptionCard: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  alertSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  alertItem: {
    alignItems: 'center',
  },
  alertLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  alertChip: {
    height: 32,
  },
  componentsCard: {
    marginBottom: 16,
  },
  componentsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  componentItem: {
    paddingVertical: 8,
  },
  componentIcon: {
    marginTop: 4,
  },
  componentChip: {
    height: 28,
    alignSelf: 'center',
  },
});
