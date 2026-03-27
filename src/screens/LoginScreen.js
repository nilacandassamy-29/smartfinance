import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { theme, isDarkMode } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Missing Fields', 'Please fill in your email and password.');
            return;
        }
        setLoading(true);
        try {
            await login(email.trim(), password);
        } catch (e) {
            Alert.alert('Login Failed', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }} showsVerticalScrollIndicator={false}>
                        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }}>
                            {/* Header */}
                            <View style={{ paddingTop: 40, marginBottom: 40 }}>
                                <View style={{
                                    width: 52, height: 52, backgroundColor: '#2563eb',
                                    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                                }}>
                                    <Text style={{ color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 22 }}>S</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: theme.text, marginBottom: 8 }}>Welcome back</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: theme.subText }}>Sign in to your account</Text>
                            </View>

                            {/* Fields */}
                            <View style={{ gap: 16, marginBottom: 28 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text, marginBottom: 8 }}>Email Address</Text>
                                    <TextInput
                                        value={email} onChangeText={setEmail}
                                        placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none"
                                        placeholderTextColor={theme.placeholder}
                                        style={{
                                            height: 52, borderRadius: 12, backgroundColor: theme.inputBg,
                                            borderWidth: 1.5, borderColor: theme.border,
                                            paddingHorizontal: 16, fontFamily: 'Poppins-Regular',
                                            fontSize: 15, color: theme.text,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text, marginBottom: 8 }}>Password</Text>
                                    <TextInput
                                        value={password} onChangeText={setPassword}
                                        placeholder="Enter your password" secureTextEntry
                                        placeholderTextColor={theme.placeholder}
                                        style={{
                                            height: 52, borderRadius: 12, backgroundColor: theme.inputBg,
                                            borderWidth: 1.5, borderColor: theme.border,
                                            paddingHorizontal: 16, fontFamily: 'Poppins-Regular',
                                            fontSize: 15, color: theme.text,
                                        }}
                                    />
                                </View>
                            </View>

                            {/* CTA */}
                            <TouchableOpacity
                                onPress={handleLogin} activeOpacity={0.85} disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#93c5fd' : '#2563eb',
                                    borderRadius: 14, height: 56,
                                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                                    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#fff' }}>
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center', paddingVertical: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.subText }}>
                                    Don't have an account?{' '}
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2563eb' }}>Create one</Text>
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
