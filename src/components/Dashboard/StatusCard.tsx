import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Paragraph } from 'react-native-paper';

interface StatusCardProps {
  status: 'safe' | 'warning' | 'danger';
  title: string;
  description: string;
  lastUpdated: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  title,
  description,
  lastUpdated,
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

  return (
    <Card style={[styles.card, { borderLeftColor: getStatusColor() }]}>
      <Card.Content>
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.title}>
            {title}
          </Text>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor() },
            ]}
          />
        </View>
        <Paragraph style={styles.description}>{description}</Paragraph>
        <Paragraph style={styles.timestamp}>
          Last updated: {lastUpdated}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
  },
});
