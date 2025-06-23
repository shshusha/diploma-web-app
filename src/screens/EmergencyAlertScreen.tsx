import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  Appbar,
  Card,
  Text,
  Button,
  Chip,
  TextInput,
} from 'react-native-paper';
import Geolocation from '@react-native-community/geolocation';
import {
  AlertType,
  Severity,
  getAlertTypeDisplayText,
  getSeverityDisplayText,
  getSeverityColor,
  getSeverityDescription,
} from '../lib/constants';
import { trpc } from '../lib/trpc';

interface EmergencyAlertScreenProps {
  onGoBack: () => void;
  selectedAccountId: string;
}

const emergencyTypes = [
  {
    id: AlertType.SEVERE_WEATHER_WARNING,
    label: getAlertTypeDisplayText(AlertType.SEVERE_WEATHER_WARNING),
    icon: 'weather-lightning',
    color: '#FF9800',
  },
  {
    id: AlertType.FLOOD_WARNING,
    label: getAlertTypeDisplayText(AlertType.FLOOD_WARNING),
    icon: 'water',
    color: '#2196F3',
  },
  {
    id: AlertType.TORNADO_WARNING,
    label: getAlertTypeDisplayText(AlertType.TORNADO_WARNING),
    icon: 'weather-tornado',
    color: '#F44336',
  },
  {
    id: AlertType.HURRICANE_WARNING,
    label: getAlertTypeDisplayText(AlertType.HURRICANE_WARNING),
    icon: 'weather-hurricane',
    color: '#9C27B0',
  },
  {
    id: AlertType.EARTHQUAKE_ALERT,
    label: getAlertTypeDisplayText(AlertType.EARTHQUAKE_ALERT),
    icon: 'earth',
    color: '#795548',
  },
  {
    id: AlertType.TSUNAMI_WARNING,
    label: getAlertTypeDisplayText(AlertType.TSUNAMI_WARNING),
    icon: 'waves',
    color: '#00BCD4',
  },
  {
    id: AlertType.WILDFIRE_ALERT,
    label: getAlertTypeDisplayText(AlertType.WILDFIRE_ALERT),
    icon: 'fire',
    color: '#FF5722',
  },
  {
    id: AlertType.CIVIL_EMERGENCY,
    label: getAlertTypeDisplayText(AlertType.CIVIL_EMERGENCY),
    icon: 'alert-circle',
    color: '#F44336',
  },
  {
    id: AlertType.AMBER_ALERT,
    label: getAlertTypeDisplayText(AlertType.AMBER_ALERT),
    icon: 'account-alert',
    color: '#FF9800',
  },
  {
    id: AlertType.SILVER_ALERT,
    label: getAlertTypeDisplayText(AlertType.SILVER_ALERT),
    icon: 'account-alert',
    color: '#9E9E9E',
  },
  {
    id: AlertType.TERRORISM_ALERT,
    label: getAlertTypeDisplayText(AlertType.TERRORISM_ALERT),
    icon: 'shield-alert',
    color: '#D32F2F',
  },
  {
    id: AlertType.HAZMAT_INCIDENT,
    label: getAlertTypeDisplayText(AlertType.HAZMAT_INCIDENT),
    icon: 'flask',
    color: '#4CAF50',
  },
  {
    id: AlertType.INFRASTRUCTURE_FAILURE,
    label: getAlertTypeDisplayText(AlertType.INFRASTRUCTURE_FAILURE),
    icon: 'wrench',
    color: '#607D8B',
  },
  {
    id: AlertType.PUBLIC_HEALTH_EMERGENCY,
    label: getAlertTypeDisplayText(AlertType.PUBLIC_HEALTH_EMERGENCY),
    icon: 'medical-bag',
    color: '#E91E63',
  },
  {
    id: AlertType.EVACUATION_ORDER,
    label: getAlertTypeDisplayText(AlertType.EVACUATION_ORDER),
    icon: 'run',
    color: '#FF5722',
  },
  {
    id: AlertType.SHELTER_IN_PLACE,
    label: getAlertTypeDisplayText(AlertType.SHELTER_IN_PLACE),
    icon: 'home',
    color: '#3F51B5',
  },
  {
    id: AlertType.ROAD_CLOSURE,
    label: getAlertTypeDisplayText(AlertType.ROAD_CLOSURE),
    icon: 'road',
    color: '#FF9800',
  },
  {
    id: AlertType.POWER_OUTAGE,
    label: getAlertTypeDisplayText(AlertType.POWER_OUTAGE),
    icon: 'flash-off',
    color: '#424242',
  },
  {
    id: AlertType.WATER_EMERGENCY,
    label: getAlertTypeDisplayText(AlertType.WATER_EMERGENCY),
    icon: 'water-off',
    color: '#2196F3',
  },
];

const severityLevels = [
  {
    id: Severity.INFO,
    label: getSeverityDisplayText(Severity.INFO),
    color: getSeverityColor(Severity.INFO),
    description: getSeverityDescription(Severity.INFO),
  },
  {
    id: Severity.ADVISORY,
    label: getSeverityDisplayText(Severity.ADVISORY),
    color: getSeverityColor(Severity.ADVISORY),
    description: getSeverityDescription(Severity.ADVISORY),
  },
  {
    id: Severity.WATCH,
    label: getSeverityDisplayText(Severity.WATCH),
    color: getSeverityColor(Severity.WATCH),
    description: getSeverityDescription(Severity.WATCH),
  },
  {
    id: Severity.WARNING,
    label: getSeverityDisplayText(Severity.WARNING),
    color: getSeverityColor(Severity.WARNING),
    description: getSeverityDescription(Severity.WARNING),
  },
  {
    id: Severity.EMERGENCY,
    label: getSeverityDisplayText(Severity.EMERGENCY),
    color: getSeverityColor(Severity.EMERGENCY),
    description: getSeverityDescription(Severity.EMERGENCY),
  },
  {
    id: Severity.CRITICAL,
    label: getSeverityDisplayText(Severity.CRITICAL),
    color: getSeverityColor(Severity.CRITICAL),
    description: getSeverityDescription(Severity.CRITICAL),
  },
];

export const EmergencyAlertScreen: React.FC<EmergencyAlertScreenProps> = ({
  onGoBack,
  selectedAccountId,
}) => {
  const [selectedType, setSelectedType] = useState<AlertType | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | null>(
    null,
  );
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // tRPC mutation for creating alerts
  const createAlertMutation = trpc.alerts.create.useMutation({
    onSuccess: () => {
      setIsSubmitting(false);
      Alert.alert(
        'Emergency Alert Sent',
        'Your emergency alert has been sent. Your contacts and local authorities have been notified.',
        [
          {
            text: 'OK',
            onPress: () => onGoBack(),
          },
        ],
      );
    },
    onError: error => {
      setIsSubmitting(false);
      Alert.alert('Error', `Failed to send emergency alert: ${error.message}`, [
        {
          text: 'OK',
          onPress: () => setIsSubmitting(false),
        },
      ]);
    },
  });

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handles permissions through Info.plist
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to send emergency alerts.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);

    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to automatically get your current location.',
        );
        setIsGettingLocation(false);
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          const locationText = `${latitude.toFixed(6)}, ${longitude.toFixed(
            6,
          )}`;
          setLocation(locationText);
          setCoordinates({ latitude, longitude });
          setIsGettingLocation(false);
        },
        _error => {
          setIsGettingLocation(false);
          Alert.alert(
            'Location Error',
            'Unable to get your current location. Please enter it manually.',
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    } catch (error) {
      setIsGettingLocation(false);
      Alert.alert('Error', 'Failed to get location. Please enter it manually.');
    }
  };

  const handleSendAlert = async () => {
    if (!selectedType || !selectedSeverity) {
      Alert.alert(
        'Missing Information',
        'Please select both emergency type and severity level.',
      );
      return;
    }

    if (!location.trim()) {
      Alert.alert('Missing Location', 'Please provide your current location.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the alert data according to the tRPC schema
      const alertData = {
        userId: selectedAccountId,
        type: selectedType,
        severity: selectedSeverity,
        message:
          description.trim() ||
          `${getAlertTypeDisplayText(selectedType)} - ${getSeverityDisplayText(
            selectedSeverity,
          )} level alert at ${location.trim()}`,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      };

      // Send the alert using tRPC mutation
      createAlertMutation.mutate(alertData);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        'Error',
        'Failed to send emergency alert. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setIsSubmitting(false),
          },
        ],
      );
    }
  };

  const getSelectedTypeData = () => {
    return emergencyTypes.find(type => type.id === selectedType);
  };

  const getSelectedSeverityData = () => {
    return severityLevels.find(severity => severity.id === selectedSeverity);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={onGoBack} />
        <Appbar.Content title="Emergency Alert" />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Emergency Type Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Emergency Type
            </Text>
            <View style={styles.chipContainer}>
              {emergencyTypes.map(type => (
                <Chip
                  key={type.id}
                  selected={selectedType === type.id}
                  onPress={() => setSelectedType(type.id as AlertType)}
                  style={[
                    styles.chip,
                    selectedType === type.id && {
                      backgroundColor: type.color + '20',
                    },
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedType === type.id && {
                      color: type.color,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {type.label}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Severity Level Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Severity Level
            </Text>
            <View style={styles.severityContainer}>
              {severityLevels.map(severity => (
                <Chip
                  key={severity.id}
                  selected={selectedSeverity === severity.id}
                  onPress={() => setSelectedSeverity(severity.id as Severity)}
                  style={[
                    styles.severityChip,
                    selectedSeverity === severity.id && {
                      backgroundColor: severity.color + '20',
                    },
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedSeverity === severity.id && {
                      color: severity.color,
                      fontWeight: 'bold',
                    },
                  ]}
                >
                  {severity.label}
                </Chip>
              ))}
            </View>
            {getSelectedSeverityData() && (
              <Text
                style={[
                  styles.severityDescription,
                  { color: getSelectedSeverityData()?.color },
                ]}
              >
                {getSelectedSeverityData()?.description}
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Location Input */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Location *
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Enter your current location or address"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
            <Button
              mode="outlined"
              onPress={getCurrentLocation}
              loading={isGettingLocation}
              disabled={isGettingLocation}
              style={styles.locationButton}
              icon="map-marker"
            >
              {isGettingLocation
                ? 'Getting Location...'
                : 'Get Current Location'}
            </Button>
          </Card.Content>
        </Card>

        {/* Description Input */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Additional Details (Optional)
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Provide additional details about the emergency..."
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
          </Card.Content>
        </Card>

        {/* Summary */}
        {(selectedType || selectedSeverity || location) && (
          <Card style={styles.summaryCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Alert Summary
              </Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Type:</Text>
                <Text style={styles.summaryValue}>
                  {getSelectedTypeData()?.label || 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Severity:</Text>
                <Text style={styles.summaryValue}>
                  {getSelectedSeverityData()?.label || 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Location:</Text>
                <Text style={styles.summaryValue}>
                  {location || 'Not provided'}
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Send Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSendAlert}
            loading={isSubmitting}
            disabled={
              isSubmitting ||
              !selectedType ||
              !selectedSeverity ||
              !location.trim()
            }
            style={[styles.sendButton, { backgroundColor: '#F44336' }]}
            icon="send"
            contentStyle={styles.sendButtonContent}
          >
            {isSubmitting ? 'Sending Alert...' : 'Send Emergency Alert'}
          </Button>
        </View>

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
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
  },
  severityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  severityChip: {
    marginBottom: 8,
  },
  severityDescription: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  input: {
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#f8f9fa',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#666',
  },
  summaryValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sendButton: {
    borderRadius: 8,
  },
  sendButtonContent: {
    paddingVertical: 8,
  },
  bottomSpacing: {
    height: 20,
  },
  locationButton: {
    marginTop: 8,
  },
});
