import './global.css';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_900Black 
} from '@expo-google-fonts/inter';
import { 
  Outfit_400Regular, 
  Outfit_600SemiBold, 
  Outfit_700Bold, 
  Outfit_900Black 
} from '@expo-google-fonts/outfit';
import {
  GrenzeGotisch_400Regular,
  GrenzeGotisch_600SemiBold,
  GrenzeGotisch_700Bold,
  GrenzeGotisch_900Black
} from '@expo-google-fonts/grenze-gotisch';
import {
  Cinzel_400Regular,
  Cinzel_600SemiBold,
  Cinzel_700Bold,
  Cinzel_900Black
} from '@expo-google-fonts/cinzel';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { ExpenseProvider } from './src/context/ExpenseContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import RootNavigator from './src/navigation/RootNavigator';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

const NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-Black': Inter_900Black,
    'Outfit-Regular': Outfit_400Regular,
    'Outfit-SemiBold': Outfit_600SemiBold,
    'Outfit-Bold': Outfit_700Bold,
    'Outfit-Black': Outfit_900Black,
    'GrenzeGotisch-Regular': GrenzeGotisch_400Regular,
    'GrenzeGotisch-SemiBold': GrenzeGotisch_600SemiBold,
    'GrenzeGotisch-Bold': GrenzeGotisch_700Bold,
    'GrenzeGotisch-Black': GrenzeGotisch_900Black,
    'Cinzel-Regular': Cinzel_400Regular,
    'Cinzel-SemiBold': Cinzel_600SemiBold,
    'Cinzel-Bold': Cinzel_700Bold,
    'Cinzel-Black': Cinzel_900Black,
  });

  React.useEffect(() => {
    if (fontError) console.error('Font Load Error:', fontError);
    console.log('Fonts Loaded State:', fontsLoaded);
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#818cf8" style={{ transform: [{ scale: 0.8 }] }} />
          <View style={{ height: 1, width: 60, backgroundColor: 'rgba(99,102,241,0.2)', marginVertical: 15 }} />
          <View style={{ paddingHorizontal: 12, py: 4, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
            <ActivityIndicator size="small" color="#475569" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <NavigationContainer theme={NavigationTheme}>
      <AuthProvider>
        <ThemeProvider>
          <ExpenseProvider>
            <OnboardingProvider>
              <RootNavigator />
              <StatusBar style="light" />
            </OnboardingProvider>
          </ExpenseProvider>
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
