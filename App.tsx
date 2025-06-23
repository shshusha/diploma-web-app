/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { AppThemeProvider } from './src/theme/AppTheme';
import { AppContainer } from './src/components/AppContainer';
import { TRPCProvider } from './src/lib/trpc-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <TRPCProvider>
      <AppThemeProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#1976D2"
        />
        <AppContainer />
      </AppThemeProvider>
    </TRPCProvider>
  );
}

export default App;
