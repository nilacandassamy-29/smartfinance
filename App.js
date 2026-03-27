import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, ThemeAwareStatusBar } from './src/context/ThemeContext';
import { ExpenseProvider } from './src/context/ExpenseContext';
import { IncomeProvider } from './src/context/IncomeContext';
import { InvestmentProvider } from './src/context/InvestmentContext';
import { UserProfileProvider } from './src/context/UserProfileContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f8fafc',
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const oldTextRender = Text.render;
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'Poppins-Regular' };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserProfileProvider>
          <ThemeProvider>
            <IncomeProvider>
              <ExpenseProvider>
                <InvestmentProvider>
                  <OnboardingProvider>
                    <NavigationContainer theme={NavigationTheme}>
                      <RootNavigator />
                      <ThemeAwareStatusBar />
                    </NavigationContainer>
                  </OnboardingProvider>
                </InvestmentProvider>
              </ExpenseProvider>
            </IncomeProvider>
          </ThemeProvider>
        </UserProfileProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
