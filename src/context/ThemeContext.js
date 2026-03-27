import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
 const systemColorScheme = useColorScheme();
 const [theme, setTheme] = useState('dark'); // Default to dark as per project style

 useEffect(() => {
 const loadTheme = async () => {
 const savedTheme = await AsyncStorage.getItem('theme');
 if (savedTheme) {
 setTheme(savedTheme);
 } else {
 setTheme(systemColorScheme || 'dark');
 }
 };
 loadTheme();
 }, [systemColorScheme]);

 const toggleTheme = async () => {
 const newTheme = theme === 'light' ? 'dark' : 'light';
 setTheme(newTheme);
 await AsyncStorage.setItem('theme', newTheme);
 };

 return (
 <ThemeContext.Provider value={{ theme, toggleTheme }}>
 {children}
 </ThemeContext.Provider>
 );
};
