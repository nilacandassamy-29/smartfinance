import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme on app start
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('darkMode');
      if (saved === 'true') {
          setIsDarkMode(true);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('darkMode', String(newValue));
  };

  const setThemeMode = async (isDark) => {
    setIsDarkMode(isDark);
    await AsyncStorage.setItem('darkMode', String(isDark));
  };

  // LIGHT THEME COLORS
  const lightTheme = {
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0F172A',
    subText: '#64748B',
    border: '#F1F5F9',
    tabBar: '#FFFFFF',
    tabBarBorder: '#F1F5F9',
    inputBg: '#F8FAFC',
    sectionLabel: '#94A3B8',
    divider: '#F1F5F9',
    iconBg: '#F8FAFC',
    portfolioCard: '#3D5AFE',
    modalBg: '#FFFFFF',
    pageBg: '#F8FAFC',
    danger: '#EF4444',
    placeholder: '#CBD5E1'
  };

  // DARK THEME COLORS
  const darkTheme = {
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    subText: '#94A3B8',
    border: '#334155',
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    inputBg: '#334155',
    sectionLabel: '#64748B',
    divider: '#334155',
    iconBg: '#334155',
    portfolioCard: '#3D5AFE',
    modalBg: '#1E293B',
    pageBg: '#020617',
    danger: '#EF4444',
    placeholder: '#475569'
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setThemeMode, toggleTheme: toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeAwareStatusBar = () => {
    const { isDarkMode, theme } = useTheme();
    return <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.background} />;
};
