import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';

export default function WelcomeScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => navigation.replace('GetStarted'), 2500);
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MotiView
                    from={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 700 }}
                    style={{ alignItems: 'center', paddingHorizontal: 32 }}
                >
                    {/* Logo Mark */}
                    <View style={{
                        width: 88, height: 88,
                        backgroundColor: '#3D5AFE',
                        borderRadius: 28,
                        alignItems: 'center', justifyContent: 'center',
                        marginBottom: 28,
                        shadowColor: '#3D5AFE',
                        shadowOffset: { width: 0, height: 12 },
                        shadowOpacity: 0.35,
                        shadowRadius: 20,
                        elevation: 12,
                    }}>
                        <Text style={{ fontSize: 36, color: '#fff', fontFamily: 'Poppins_700Bold' }}>S</Text>
                    </View>

                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 30, color: theme.text, letterSpacing: -0.5, marginBottom: 10 }}>
                        SmartFinance
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: theme.subText, textAlign: 'center', lineHeight: 22 }}>
                        Your all-in-one financial command center
                    </Text>

                    {/* Loading dots */}
                    <MotiView
                        from={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 800, type: 'timing', duration: 400 }}
                        style={{ flexDirection: 'row', gap: 6, marginTop: 48 }}
                    >
                        {[0, 1, 2].map(i => (
                            <MotiView
                                key={i}
                                from={{ scale: 0.6, opacity: 0.3 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ loop: true, type: 'timing', duration: 600, delay: i * 200 }}
                                style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#3D5AFE' }}
                            />
                        ))}
                    </MotiView>
                </MotiView>
            </SafeAreaView>
        </View>
    );
}
