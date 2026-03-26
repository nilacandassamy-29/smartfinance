import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles, Shield, Fingerprint } from 'lucide-react-native';
import { MotiView } from 'moti';
import { GlassCard } from '../components/GlassCard';
import FeatureTag from '../components/common/FeatureTag';

const LoginScreen = ({ navigation }) => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Data Breach", "Required identification fields are null.");
            return;
        }
        setLoading(true);
        try {
            await login(email, password);
        } catch (error) {
            Alert.alert("Access Denied", error.message || "Credential mismatch.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            {/* Background Glow */}
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 px-6 justify-center">
                    {/* Logo Section */}
                    <MotiView 
                        from={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="items-center mb-12"
                    >
                        <View className="relative">
                            <LinearGradient 
                                colors={['#4f46e5', '#8b5cf6']} 
                                className="w-24 h-24 rounded-[2rem] items-center justify-center p-4 shadow-2xl shadow-indigo-500/40"
                            >
                                <Sparkles size={40} color="#fff" strokeWidth={2.5} />
                            </LinearGradient>
                            <View className="absolute bottom-[-10%] right-[-10%] w-10 h-10 bg-indigo-950 rounded-2xl items-center justify-center border-4 border-[#020617] shadow-lg">
                                <Shield size={16} color="#4ade80" />
                            </View>
                        </View>
                        <Text className="text-white text-5xl font-grenze-bold tracking-tighter italic uppercase mt-8">Smart{'\n'}Finance</Text>
                        <Text className="text-slate-500 font-cinzel text-[9px] uppercase tracking-[0.4em] mt-3 italic text-center">AI-Powered Wealth Archive</Text>
                    </MotiView>

                    {/* Auth Form */}
                    <MotiView 
                        from={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 200 }}
                    >
                        <GlassCard intensity={15} style={{ padding: 32 }}>
                            <View className="flex-row items-center gap-3 mb-8 ml-1">
                                <View className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                                <Text className="text-white text-2xl font-grenze-bold uppercase italic tracking-tight">Access Gate</Text>
                            </View>

                            <View className="space-y-6">
                                {/* Email Field */}
                                <InputField 
                                    label="Identification Hash" 
                                    icon={<Mail size={18} color="#818cf8" />} 
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="you@domain.com"
                                    keyboardType="email-address"
                                />

                                {/* Password Field */}
                                <InputField 
                                    label="Access Key" 
                                    icon={<Lock size={18} color="#818cf8" />} 
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholder="••••••••"
                                    secureTextEntry
                                />

                                {/* Action Button */}
                                <TouchableOpacity 
                                    onPress={handleLogin} 
                                    disabled={loading}
                                    activeOpacity={0.8}
                                    className="h-16 bg-indigo-600 rounded-[1.5rem] flex-row items-center justify-center gap-4 mt-4 shadow-2xl shadow-indigo-600/30 border border-indigo-400/20"
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : (
                                        <>
                                            <Text className="text-white font-cinzel-bold text-xs uppercase tracking-[0.4em] italic">Open Ledger</Text>
                                            <ArrowRight size={20} color="#fff" strokeWidth={3} />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </GlassCard>
                    </MotiView>

                    {/* Footer Nav */}
                    <View className="flex-row justify-center items-center gap-3 mt-10">
                        <Text className="text-slate-500 font-cinzel text-xs">Node not found?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-indigo-400 font-cinzel-bold text-xs uppercase tracking-widest italic">Initialize Identity</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry = false }) => (
    <View className="mb-6">
        <Text className="text-slate-500 font-cinzel-bold text-[10px] uppercase tracking-[0.2em] mb-3 ml-1">{label}</Text>
        <View className="flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 h-14 shadow-inner">
            {icon}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#475569"
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                autoCapitalize="none"
                className="flex-1 text-white text-sm font-cinzel"
            />
        </View>
    </View>
);

export default LoginScreen;
