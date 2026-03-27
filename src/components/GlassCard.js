import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

export const GlassCard = ({ 
 children, 
 style, 
 intensity = 20, 
 tint = "dark",
 colors = ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)'] 
}) => {
 return (
 <View style={[styles.container, style]}>
 <BlurView intensity={intensity} tint={tint} style={styles.blur}>
 <LinearGradient
 colors={colors}
 style={styles.gradient}
 start={{ x: 0, y: 0 }}
 end={{ x: 1, y: 1 }}
 >
 {children}
 </LinearGradient>
 </BlurView>
 </View>
 );
};

const styles = StyleSheet.create({
 container: {
 borderRadius: 32,
 overflow: 'hidden',
 borderWidth: 1,
 borderColor: 'rgba(255,255,255,0.1)',
 backgroundColor: 'rgba(15, 23, 42, 0.4)', // slate-900/40
 },
 blur: {
 // Removed flex: 1 to allow container to expand with content
 },
 gradient: {
 // Removed flex: 1 to allow container to expand with content
 }
});
