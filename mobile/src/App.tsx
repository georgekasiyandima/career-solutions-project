import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';

import {AuthProvider} from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext';
import {NotificationProvider} from './context/NotificationContext';
import AppNavigator from './navigation/AppNavigator';
import {theme} from './constants/theme';
import SplashScreen from './components/common/SplashScreen';

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <NavigationContainer>
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={theme.colors.primary}
                />
                <SplashScreen>
                  <AppNavigator />
                </SplashScreen>
              </NavigationContainer>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App; 