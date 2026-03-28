import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

export default function ThemeScreen({ navigation }) {
    const { isDarkMode, setThemeMode, theme } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: theme.pageBg || theme.background }}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.pageBg || theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* HEADER */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, zIndex: 10, padding: 8 }}>
                        <ChevronLeft size={24} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: theme.text }}>Theme</Text>
                </View>

                {/* CONTENT */}
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    
                    {/* TOP LABEL */}
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12 }}>APPEARANCE</Text>

                    {/* CARD 1 — Light Mode */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setThemeMode(false)}
                        style={{
                            flexDirection: 'row', alignItems: 'center',
                            backgroundColor: isDarkMode ? theme.card : '#FFFFFF',
                            borderRadius: 16, padding: 16, marginBottom: 12,
                            borderWidth: 2, borderColor: !isDarkMode ? '#2563EB' : theme.border
                        }}
                    >
                        {/* Left side: Preview box */}
                        <View style={{ width: 64, height: 48, borderRadius: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 6 }}>
                            <View style={{ height: 6, backgroundColor: '#FFFFFF', borderRadius: 2, marginBottom: 6, elevation: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 1} }} />
                            <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 4, width: '80%' }} />
                            <View style={{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, width: '60%' }} />
                        </View>

                        {/* Right side */}
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: theme.text }}>Light Mode</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#64748B', marginTop: 2 }}>Clean white interface</Text>
                        </View>

                        {/* Far right checkbox */}
                        <View style={{
                            width: 22, height: 22, borderRadius: 11,
                            backgroundColor: !isDarkMode ? '#2563EB' : 'transparent',
                            borderWidth: !isDarkMode ? 0 : 2, borderColor: '#CBD5E1',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            {!isDarkMode && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                    </TouchableOpacity>

                    {/* CARD 2 — Dark Mode */}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setThemeMode(true)}
                        style={{
                            flexDirection: 'row', alignItems: 'center',
                            backgroundColor: theme.card,
                            borderRadius: 16, padding: 16,
                            borderWidth: 2, borderColor: isDarkMode ? '#2563EB' : theme.border
                        }}
                    >
                        {/* Left side: Preview box */}
                        <View style={{ width: 64, height: 48, borderRadius: 10, backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', padding: 6 }}>
                            <View style={{ height: 6, backgroundColor: '#0F172A', borderRadius: 2, marginBottom: 6 }} />
                            <View style={{ height: 4, backgroundColor: '#334155', borderRadius: 2, marginBottom: 4, width: '80%' }} />
                            <View style={{ height: 4, backgroundColor: '#334155', borderRadius: 2, width: '60%' }} />
                        </View>

                        {/* Right side */}
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: theme.text }}>Dark Mode</Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#64748B', marginTop: 2 }}>Easy on the eyes at night</Text>
                        </View>

                        {/* Far right checkbox */}
                        <View style={{
                            width: 22, height: 22, borderRadius: 11,
                            backgroundColor: isDarkMode ? '#2563EB' : 'transparent',
                            borderWidth: isDarkMode ? 0 : 2, borderColor: '#CBD5E1',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            {isDarkMode && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                    </TouchableOpacity>

                    <View style={{ height: 1, backgroundColor: theme.divider, marginVertical: 24 }} />

                    {/* SECOND LABEL */}
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, marginBottom: 12 }}>PREVIEW</Text>

                    {/* MINI PREVIEW CARD */}
                    <View style={{
                        backgroundColor: theme.card, borderRadius: 16, padding: 16,
                        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
                        borderWidth: 1, borderColor: theme.border
                    }}>
                        {/* Row 1 */}
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                <Text style={{ color: '#ffffff', fontFamily: 'Poppins_700Bold', fontSize: 14 }}>S</Text>
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: theme.subText }}>Good morning,</Text>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: theme.text }}>smartfinance</Text>
                            </View>
                        </View>

                        <View style={{ height: 1, backgroundColor: theme.divider, marginVertical: 12 }} />

                        {/* Row 2 */}
                        <View>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: theme.subText }}>Total Portfolio</Text>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: theme.text, marginTop: 2 }}>₹24,500</Text>
                        </View>

                        <View style={{ height: 1, backgroundColor: theme.divider, marginVertical: 12 }} />

                        {/* Row 3 */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1, backgroundColor: theme.inputBg, borderRadius: 10, padding: 10 }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: theme.subText }}>Monthly In</Text>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: theme.text, marginTop: 2 }}>₹0</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: theme.inputBg, borderRadius: 10, padding: 10 }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: theme.subText }}>Monthly Out</Text>
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: theme.text, marginTop: 2 }}>₹0</Text>
                            </View>
                        </View>
                    </View>

                    {/* BOTTOM NOTE */}
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 24, lineHeight: 18 }}>
                        Your theme preference is saved automatically and will be remembered each time you open the app.
                    </Text>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
