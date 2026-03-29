import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet, LogIn, UserPlus, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function AuthChoiceScreen({ navigation }) {
    const { theme, isDarkMode } = useTheme();
    const [selected, setSelected] = useState('login');

    const handleContinue = () => {
        if (selected === 'login') {
            navigation.navigate('Login');
        } else {
            navigation.navigate('Register');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Back Button */}
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={{ position: 'absolute', top: 16, left: 20, zIndex: 10, padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, elevation: 1 }}
                >
                    <ChevronLeft size={24} color={theme.text} />
                </TouchableOpacity>

                {/* TOP SECTION */}
                <View style={{ alignItems: 'center', marginTop: 60, paddingHorizontal: 20 }}>
                    <View style={{
                        width: 90, height: 90, borderRadius: 45,
                        backgroundColor: isDarkMode ? '#1e3a8a' : '#EFF6FF',
                        alignItems: 'center', justifyContent: 'center',
                        marginBottom: 20
                    }}>
                        <Wallet size={56} color="#2563EB" />
                    </View>
                    <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, color: theme.text, letterSpacing: 0 }}>
                        SmartFinance
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: theme.subText, marginTop: 6 }}>
                        Your money, your control
                    </Text>
                </View>

                {/* MIDDLE SECTION */}
                <View style={{ marginTop: 48, paddingHorizontal: 20 }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.text, textAlign: 'center', marginBottom: 24 }}>
                        Welcome! How would you like to continue?
                    </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                        
                        {/* Card 1 — Login */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelected('login')}
                            style={{
                                flex: 1,
                                height: 180,
                                backgroundColor: theme.card,
                                borderRadius: 16,
                                padding: 20,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOpacity: isDarkMode ? 0.2 : 0.06,
                                shadowRadius: 10,
                                elevation: 3,
                                borderWidth: 2,
                                borderColor: selected === 'login' ? '#2563EB' : theme.border,
                            }}
                        >
                            <View style={{
                                width: 52, height: 52, borderRadius: 26,
                                backgroundColor: isDarkMode ? '#1e3a8a' : '#EFF6FF',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <LogIn size={28} color="#2563EB" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.text, marginTop: 12 }}>
                                Login
                            </Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: theme.subText, marginTop: 4, textAlign: 'center' }}>
                                Already have an account
                            </Text>
                        </TouchableOpacity>

                        {/* Card 2 — Register */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setSelected('register')}
                            style={{
                                flex: 1,
                                height: 180,
                                backgroundColor: theme.card,
                                borderRadius: 16,
                                padding: 20,
                                alignItems: 'center',
                                shadowColor: '#000',
                                shadowOpacity: isDarkMode ? 0.2 : 0.06,
                                shadowRadius: 10,
                                elevation: 3,
                                borderWidth: 2,
                                borderColor: selected === 'register' ? '#10B981' : theme.border,
                            }}
                        >
                            <View style={{
                                width: 52, height: 52, borderRadius: 26,
                                backgroundColor: isDarkMode ? '#064e3b' : '#D1FAE5',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                <UserPlus size={28} color="#10B981" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: theme.text, marginTop: 12 }}>
                                Register
                            </Text>
                            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: theme.subText, marginTop: 4, textAlign: 'center' }}>
                                New to SmartFinance?
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* BOTTOM SECTION */}
                <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={handleContinue}
                        style={{
                            backgroundColor: selected === 'login' ? '#2563EB' : '#10B981',
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: 'center',
                            shadowColor: selected === 'login' ? '#2563EB' : '#10B981',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                            elevation: 8,
                        }}
                    >
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#ffffff' }}>
                            {selected === 'login' ? 'Continue to Login' : 'Continue to Register'}
                        </Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}
