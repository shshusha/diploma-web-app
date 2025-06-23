import React from 'react';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976D2',
    secondary: '#424242',
    error: '#D32F2F',
    warning: '#FF9800',
    success: '#4CAF50',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#212121',
    onSurface: '#212121',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({
  children,
}) => {
  return <PaperProvider theme={theme}>{children}</PaperProvider>;
};
