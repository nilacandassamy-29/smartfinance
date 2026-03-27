import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { MotiView } from 'moti';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

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

    const Field = ({ label, value, onChange, placeholder, type, secure }) => (
        <View>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#374151', marginBottom: 8 }}>{label}</Text>
            <TextInput
                value={value} onChangeText={onChange}
                placeholder={placeholder} keyboardType={type || 'default'}
                autoCapitalize="none" secureTextEntry={secure}
                placeholderTextColor='#64748b'
                style={{
                    height: 52, borderRadius: 12, backgroundColor: '#f8fafc',
                    borderWidth: 1.5, borderColor: '#e2e8f0',
                    paddingHorizontal: 16, fontFamily: 'Poppins-Regular',
                    fontSize: 15, color: '#0f172a',
                }}
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 28 }} showsVerticalScrollIndicator={false}>
                        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 500 }}>
                            <View style={{ paddingTop: 40, marginBottom: 36 }}>
                                <View style={{
                                    width: 52, height: 52, backgroundColor: '#2563eb',
                                    borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 24,
                                }}>
                                    <Text style={{ color: '#fff', fontFamily: 'Poppins-Bold', fontSize: 22 }}>S</Text>
                                </View>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: '#0f172a', marginBottom: 8 }}>Create account</Text>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15, color: '#64748b' }}>Join thousands of smart investors</Text>
                            </View>

                            <View style={{ gap: 16, marginBottom: 28 }}>
                                <Field label="Full Name" value={name} onChange={setName} placeholder="Your name" />
                                <Field label="Email Address" value={email} onChange={setEmail} placeholder="you@example.com" type="email-address" />
                                <Field label="Password" value={password} onChange={setPassword} placeholder="Create a strong password" secure />
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
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#fff' }}>
                                    {loading ? 'Creating account...' : 'Create Account'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', paddingVertical: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#64748b' }}>
                                    Already have an account?{' '}
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#2563eb' }}>Sign in</Text>
                                </Text>
                            </TouchableOpacity>
                        </MotiView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
