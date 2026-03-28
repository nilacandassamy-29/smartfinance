import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';

const features = [
    { icon: '💰', title: 'Smart Budgeting', desc: 'Track every rupee automatically' },
    { icon: '📈', title: 'Live Portfolio', desc: 'Real-time investment insights' },
    { icon: '🏛️', title: 'Govt. Schemes', desc: 'Discover the best financial schemes' },
];

export default function GetStartedScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 600 }}
                    style={{ flex: 1, paddingHorizontal: 28, paddingTop: 32 }}
                >
                    {/* Header */}
                    <View style={{ marginBottom: 40 }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 32, color: theme.text, lineHeight: 42, marginBottom: 10 }}>
                            Take control of{'\n'}your finances.
                        </Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: theme.subText, lineHeight: 22 }}>
                            Built for the modern Indian investor.
                        </Text>
                    </View>

                    {/* Feature cards */}
                    <View style={{ gap: 16, marginBottom: 40 }}>
                        {features.map((f, i) => (
                            <MotiView
                                key={i}
                                from={{ opacity: 0, translateX: -20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: 200 + i * 150, type: 'timing', duration: 500 }}
                                style={{
                                    flexDirection: 'row', alignItems: 'center', gap: 16,
                                    backgroundColor: theme.card,
                                    borderRadius: 16, padding: 18,
                                    borderWidth: 1, borderColor: theme.border,
                                }}
                            >
                                <View style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    backgroundColor: isDarkMode ? theme.iconBg : '#eff6ff',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Text style={{ fontSize: 22 }}>{f.icon}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: theme.text, marginBottom: 2 }}>{f.title}</Text>
                                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: theme.subText }}>{f.desc}</Text>
                                </View>
                            </MotiView>
                        ))}
                    </View>

                    <View style={{ gap: 12, paddingBottom: 24 }}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('AuthChoiceScreen')}
                            activeOpacity={0.85}
                            style={{
                                backgroundColor: '#2563eb', borderRadius: 14,
                                height: 56, alignItems: 'center', justifyContent: 'center',
                                shadowColor: '#2563eb', shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
                            }}
                        >
                            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#fff' }}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </MotiView>
            </SafeAreaView>
        </View>
    );
}
