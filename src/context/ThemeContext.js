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

  // LIGHT THEME COLORS
  const lightTheme = {
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    subText: '#64748B',
    border: '#E2E8F0',
    tabBar: '#FFFFFF',
    tabBarBorder: '#F1F5F9',
    inputBg: '#F8FAFC',
    sectionLabel: '#94A3B8',
    divider: '#F1F5F9',
    iconBg: '#F8FAFC',
    portfolioCard: '#2563EB',
    modalBg: '#FFFFFF',
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
    portfolioCard: '#1D4ED8',
    modalBg: '#1E293B',
    danger: '#EF4444',
    placeholder: '#475569'
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, toggleTheme: toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const ThemeAwareStatusBar = () => {
    const { isDarkMode, theme } = useTheme();
    return <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.background} />;
};
