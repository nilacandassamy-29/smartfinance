import React, { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, UserPlus, ShieldAlert } from 'lucide-react-native';
import { MotiView } from 'moti';
import { GlassCard } from '../components/GlassCard';
import FeatureTag from '../components/common/FeatureTag';

const RegisterScreen = ({ navigation }) => {
    const { register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Protocol Incomplete", "Please populate all identity fields.");
            return;
        }
        setLoading(true);
        try {
            await register(email, password, {
                name, email, income: 0, phone: '', address: '', occupation: '',
                bio: '', idProof: '', onboardingComplete: false, createdAt: new Date().toISOString()
            });
        } catch (error) {
            Alert.alert("Registry Error", error.message || "Failed to initialize account.");
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
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                        {/* Logo & Intro */}
                        <MotiView 
                            from={{ opacity: 0, translateY: -20 }} 
                            animate={{ opacity: 1, translateY: 0 }} 
                            className="items-center mt-12 mb-10 px-6"
                        >
                            <View className="relative">
                                <LinearGradient 
                                    colors={['#4f46e5', '#8b5cf6']} 
                                    className="w-20 h-20 rounded-[1.8rem] items-center justify-center p-4 shadow-2xl shadow-indigo-500/40"
                                >
                                    <UserPlus size={32} color="#fff" strokeWidth={2.5} />
                                </LinearGradient>
                                <View className="absolute bottom-[-10%] right-[-10%] w-9 h-9 bg-indigo-950 rounded-xl items-center justify-center border-4 border-[#020617] shadow-lg">
                                    <ShieldAlert size={14} color="#facc15" />
                                </View>
                            </View>
                            <Text className="text-white text-4xl font-grenze-bold tracking-tighter italic uppercase mt-8 text-center">Protocol{'\n'}Registry</Text>
                            <Text className="text-slate-500 text-[9px] font-cinzel uppercase tracking-[0.4em] mt-3 italic text-center">Join the SmartFinance Archive</Text>
                        </MotiView>

                        {/* Registration Form */}
                        <MotiView 
                            from={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 200 }}
                            className="px-6"
                        >
                            <GlassCard intensity={15} style={{ padding: 32 }}>
                                <View className="flex-row items-center gap-3 mb-8 ml-1">
                                    <View className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                                    <Text className="text-white text-2xl font-grenze-bold uppercase italic tracking-tight">Identity Data</Text>
                                </View>

                                <View className="space-y-6">
                                    {/* Name Field */}
                                    <InputField 
                                        label="Full Identity Name" 
                                        icon={<User size={18} color="#818cf8" />} 
                                        value={name}
                                        onChangeText={setName}
                                        placeholder="Full Name"
                                    />

                                    {/* Email Field */}
                                    <InputField 
                                        label="Comms Identifier (Email)" 
                                        icon={<Mail size={18} color="#818cf8" />} 
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder="you@domain.com"
                                        keyboardType="email-address"
                                    />

                                    {/* Password Field */}
                                    <InputField 
                                        label="Security Access Key" 
                                        icon={<Lock size={18} color="#818cf8" />} 
                                        value={password}
                                        onChangeText={setPassword}
                                        placeholder="Min. 8 characters"
                                        secureTextEntry
                                    />

                                    {/* Submit Button */}
                                    <TouchableOpacity 
                                        onPress={handleRegister} 
                                        disabled={loading}
                                        activeOpacity={0.8}
                                        className="h-16 bg-indigo-600 rounded-[1.5rem] flex-row items-center justify-center gap-4 mt-6 shadow-2xl shadow-indigo-600/30 border border-indigo-400/20"
                                    >
                                        {loading ? <ActivityIndicator color="#fff" /> : (
                                            <>
                                                <Text className="text-white font-cinzel-bold text-xs uppercase tracking-[0.4em] italic">Initialize Archive</Text>
                                                <ArrowRight size={20} color="#fff" strokeWidth={3} />
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>

                            {/* Sign In Link */}
                            <View className="flex-row justify-center items-center gap-3 mt-10">
                                <Text className="text-slate-500 font-cinzel text-xs">Node already exists?</Text>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Text className="text-indigo-400 font-cinzel-bold text-xs uppercase tracking-widest italic">Return to Access Gate</Text>
                                </TouchableOpacity>
                            </View>
                        </MotiView>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default', secureTextEntry = false }) => (
    <View className="mb-6">
        <Text className="text-slate-500 text-[10px] font-cinzel-bold uppercase tracking-[0.2em] mb-3 ml-1">{label}</Text>
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

export default RegisterScreen;
