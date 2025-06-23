export enum AlertType {
  SEVERE_WEATHER_WARNING = 'SEVERE_WEATHER_WARNING',
  FLOOD_WARNING = 'FLOOD_WARNING',
  TORNADO_WARNING = 'TORNADO_WARNING',
  HURRICANE_WARNING = 'HURRICANE_WARNING',
  EARTHQUAKE_ALERT = 'EARTHQUAKE_ALERT',
  TSUNAMI_WARNING = 'TSUNAMI_WARNING',
  WILDFIRE_ALERT = 'WILDFIRE_ALERT',
  CIVIL_EMERGENCY = 'CIVIL_EMERGENCY',
  AMBER_ALERT = 'AMBER_ALERT',
  SILVER_ALERT = 'SILVER_ALERT',
  TERRORISM_ALERT = 'TERRORISM_ALERT',
  HAZMAT_INCIDENT = 'HAZMAT_INCIDENT',
  INFRASTRUCTURE_FAILURE = 'INFRASTRUCTURE_FAILURE',
  PUBLIC_HEALTH_EMERGENCY = 'PUBLIC_HEALTH_EMERGENCY',
  EVACUATION_ORDER = 'EVACUATION_ORDER',
  SHELTER_IN_PLACE = 'SHELTER_IN_PLACE',
  ROAD_CLOSURE = 'ROAD_CLOSURE',
  POWER_OUTAGE = 'POWER_OUTAGE',
  WATER_EMERGENCY = 'WATER_EMERGENCY',
}

export enum Severity {
  INFO = 'INFO',
  ADVISORY = 'ADVISORY',
  WATCH = 'WATCH',
  WARNING = 'WARNING',
  EMERGENCY = 'EMERGENCY',
  CRITICAL = 'CRITICAL',
}

// Helper function to get display text for alert types
export const getAlertTypeDisplayText = (
  alertType: AlertType | string,
): string => {
  // Handle both enum and string inputs for backward compatibility
  const alertTypeStr =
    typeof alertType === 'string' ? alertType.toUpperCase() : alertType;

  switch (alertTypeStr) {
    case AlertType.SEVERE_WEATHER_WARNING:
      return 'Severe Weather Warning';
    case AlertType.FLOOD_WARNING:
      return 'Flood Warning';
    case AlertType.TORNADO_WARNING:
      return 'Tornado Warning';
    case AlertType.HURRICANE_WARNING:
      return 'Hurricane Warning';
    case AlertType.EARTHQUAKE_ALERT:
      return 'Earthquake Alert';
    case AlertType.TSUNAMI_WARNING:
      return 'Tsunami Warning';
    case AlertType.WILDFIRE_ALERT:
      return 'Wildfire Alert';
    case AlertType.CIVIL_EMERGENCY:
      return 'Civil Emergency';
    case AlertType.AMBER_ALERT:
      return 'Amber Alert';
    case AlertType.SILVER_ALERT:
      return 'Silver Alert';
    case AlertType.TERRORISM_ALERT:
      return 'Terrorism Alert';
    case AlertType.HAZMAT_INCIDENT:
      return 'Hazmat Incident';
    case AlertType.INFRASTRUCTURE_FAILURE:
      return 'Infrastructure Failure';
    case AlertType.PUBLIC_HEALTH_EMERGENCY:
      return 'Public Health Emergency';
    case AlertType.EVACUATION_ORDER:
      return 'Evacuation Order';
    case AlertType.SHELTER_IN_PLACE:
      return 'Shelter in Place';
    case AlertType.ROAD_CLOSURE:
      return 'Road Closure';
    case AlertType.POWER_OUTAGE:
      return 'Power Outage';
    case AlertType.WATER_EMERGENCY:
      return 'Water Emergency';
    default:
      // For backward compatibility, try to format unknown types
      if (typeof alertType === 'string') {
        return alertType
          .split('_')
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' ');
      }
      return 'Unknown Alert';
  }
};

// Helper function to get display text for severity levels
export const getSeverityDisplayText = (severity: Severity | string): string => {
  // Handle both enum and string inputs for backward compatibility
  const severityStr =
    typeof severity === 'string' ? severity.toUpperCase() : severity;

  switch (severityStr) {
    case Severity.INFO:
    case 'LOW':
      return 'Info';
    case Severity.ADVISORY:
      return 'Advisory';
    case Severity.WATCH:
      return 'Watch';
    case Severity.WARNING:
    case 'HIGH':
      return 'Warning';
    case Severity.EMERGENCY:
      return 'Emergency';
    case Severity.CRITICAL:
      return 'Critical';
    default:
      // For backward compatibility, try to format unknown severities
      if (typeof severity === 'string') {
        return (
          severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase()
        );
      }
      return 'Unknown';
  }
};

// Helper function to get color for severity levels
export const getSeverityColor = (severity: Severity | string): string => {
  // Handle both enum and string inputs for backward compatibility
  const severityStr =
    typeof severity === 'string' ? severity.toUpperCase() : severity;

  switch (severityStr) {
    case Severity.INFO:
    case 'LOW':
      return '#2196F3'; // Blue
    case Severity.ADVISORY:
      return '#4CAF50'; // Green
    case Severity.WATCH:
    case 'MEDIUM':
      return '#FF9800'; // Orange
    case Severity.WARNING:
    case 'HIGH':
      return '#FF5722'; // Red-Orange
    case Severity.EMERGENCY:
      return '#F44336'; // Red
    case Severity.CRITICAL:
      return '#9C27B0'; // Purple
    default:
      return '#666666'; // Gray
  }
};

// Helper function to get description for severity levels
export const getSeverityDescription = (severity: Severity): string => {
  switch (severity) {
    case Severity.INFO:
      return 'Informational message, no immediate action required';
    case Severity.ADVISORY:
      return 'Advisory notice, be aware of conditions';
    case Severity.WATCH:
      return 'Watch conditions, prepare for possible emergency';
    case Severity.WARNING:
      return 'Warning conditions, take immediate action';
    case Severity.EMERGENCY:
      return 'Emergency conditions, immediate action required';
    case Severity.CRITICAL:
      return 'Critical conditions, life-threatening situation';
    default:
      return 'Unknown severity level';
  }
};

// Helper function to get icon for severity levels
export const getSeverityIcon = (severity: Severity | string): string => {
  // Handle both enum and string inputs for backward compatibility
  const severityStr =
    typeof severity === 'string' ? severity.toUpperCase() : severity;

  switch (severityStr) {
    case Severity.INFO:
    case 'LOW':
      return 'info';
    case Severity.ADVISORY:
    case Severity.WATCH:
    case 'MEDIUM':
      return 'warning';
    case Severity.WARNING:
    case 'HIGH':
      return 'error';
    case Severity.EMERGENCY:
    case Severity.CRITICAL:
      return 'priority-high';
    default:
      return 'info';
  }
};
