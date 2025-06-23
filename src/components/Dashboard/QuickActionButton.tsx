import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface QuickActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  color?: string;
  isEmergency?: boolean;
}

export const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  icon,
  onPress,
  color,
  isEmergency = false,
}) => {
  const theme = useTheme();

  const getButtonColor = () => {
    if (isEmergency) return '#F44336';
    if (color) return color;
    return theme.colors.primary;
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Card style={[styles.card, { borderColor: getButtonColor() }]}>
        <Card.Content style={styles.content}>
          <Icon
            name={icon}
            size={32}
            color={getButtonColor()}
            style={styles.icon}
          />
          <Text
            variant="titleMedium"
            style={[styles.title, { color: getButtonColor() }]}
          >
            {title}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 4,
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
