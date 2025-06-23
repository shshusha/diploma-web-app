import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Paragraph, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  AlertType,
  Severity,
  getAlertTypeDisplayText,
  getSeverityColor,
  getSeverityIcon,
  getSeverityDisplayText,
} from '../../lib/alertUtils';

interface RecentAlertItemProps {
  id: string;
  type: AlertType | string; // Allow string for backward compatibility
  severity: Severity | string; // Allow string for backward compatibility
  message: string;
  timestamp: string;
  isResolved: boolean;
  onPress: (id: string, alertData: any) => void;
}

export const RecentAlertItem: React.FC<RecentAlertItemProps> = ({
  id,
  type,
  severity,
  message,
  timestamp,
  isResolved,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        onPress(id, { type, severity, message, timestamp, isResolved })
      }
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Icon
                name={getSeverityIcon(severity)}
                size={20}
                color={getSeverityColor(severity)}
                style={styles.icon}
              />
              <Text
                variant="titleMedium"
                style={styles.title}
                numberOfLines={1}
              >
                {getAlertTypeDisplayText(type)}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{
                color: getSeverityColor(severity),
                fontSize: 11,
                fontWeight: '600',
              }}
              style={[
                styles.severityChip,
                { borderColor: getSeverityColor(severity) },
              ]}
            >
              {getSeverityDisplayText(severity)}
            </Chip>
          </View>
          <Paragraph style={styles.message} numberOfLines={2}>
            {message}
          </Paragraph>
          <View style={styles.footer}>
            <Paragraph style={styles.timestamp}>{timestamp}</Paragraph>
            {isResolved && (
              <Chip
                mode="flat"
                textStyle={{
                  fontSize: 11,
                  fontWeight: '600',
                }}
                style={styles.resolvedChip}
              >
                Resolved
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  card: {
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  severityChip: {
    height: 32,
    minHeight: 32,
    flexShrink: 0,
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    flex: 1,
  },
  resolvedChip: {
    backgroundColor: '#4CAF50',
    height: 32,
    minHeight: 32,
    flexShrink: 0,
  },
});
