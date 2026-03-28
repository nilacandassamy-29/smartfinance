import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const { theme, isDarkMode } = useTheme();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Missing Fields', 'Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            await register(email.trim(), password, { name });
        } catch (e) {
            Alert.alert('Registration Failed', e.message);
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
                            <View style={{ paddingTop: 40, marginBottom: 36 }}>
                                <View style={{
                                    width: 52, height: 52, backgroundColor: '#2563eb',
                                    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                                }}>
                                    <Text style={{ color: '#fff', fontFamily: 'Poppins_700Bold', fontSize: 22 }}>S</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 28, color: theme.text, marginBottom: 8 }}>Create account</Text>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 15, color: theme.subText }}>Join thousands of smart investors</Text>
                            </View>

                            <View style={{ gap: 16, marginBottom: 28 }}>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: theme.text, marginBottom: 8 }}>Full Name</Text>
                                    <TextInput
                                        value={name} onChangeText={setName}
                                        placeholder="Your name" keyboardType="default"
                                        autoCapitalize="words"
                                        placeholderTextColor={theme.placeholder}
                                        style={{
                                            height: 52, borderRadius: 12, backgroundColor: theme.inputBg,
                                            borderWidth: 1.5, borderColor: theme.border,
                                            paddingHorizontal: 16, fontFamily: 'Poppins_400Regular',
                                            fontSize: 15, color: theme.text,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: theme.text, marginBottom: 8 }}>Email Address</Text>
                                    <TextInput
                                        value={email} onChangeText={setEmail}
                                        placeholder="you@example.com" keyboardType="email-address"
                                        autoCapitalize="none"
                                        placeholderTextColor={theme.placeholder}
                                        style={{
                                            height: 52, borderRadius: 12, backgroundColor: theme.inputBg,
                                            borderWidth: 1.5, borderColor: theme.border,
                                            paddingHorizontal: 16, fontFamily: 'Poppins_400Regular',
                                            fontSize: 15, color: theme.text,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 14, color: theme.text, marginBottom: 8 }}>Password</Text>
                                    <TextInput
                                        value={password} onChangeText={setPassword}
                                        placeholder="Create a strong password"
                                        autoCapitalize="none" secureTextEntry={true}
                                        placeholderTextColor={theme.placeholder}
                                        style={{
                                            height: 52, borderRadius: 12, backgroundColor: theme.inputBg,
                                            borderWidth: 1.5, borderColor: theme.border,
                                            paddingHorizontal: 16, fontFamily: 'Poppins_400Regular',
                                            fontSize: 15, color: theme.text,
                                        }}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleRegister} activeOpacity={0.85} disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#93c5fd' : '#2563eb',
                                    borderRadius: 14, height: 56,
                                    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                                    shadowColor: '#2563eb', shadowOffset: { width: 0, height: 6 },
                                    shadowOpacity: 0.25, shadowRadius: 10, elevation: 6,
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 16, color: '#fff' }}>
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', paddingVertical: 16 }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: theme.subText }}>
                                    Already have an account?{' '}
                                    <Text style={{ fontFamily: 'Poppins_600SemiBold', color: '#2563eb' }}>Sign in</Text>
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
