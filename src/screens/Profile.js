import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Save, Camera, ShieldCheck, BadgeCheck, Activity, LogOut, Briefcase, CheckCircle2, ChevronRight, Fingerprint, Settings as SettingsIcon } from 'lucide-react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../components/GlassCard';
import FeatureTag from '../components/common/FeatureTag';

const Profile = ({ navigation }) => {
    const { userProfile, updateUserProfile, logout } = useAuth();
    const [formData, setFormData] = useState({ name: '', phone: '', address: '', occupation: '', bio: '', income: '', idProof: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                phone: userProfile.phone || '',
                address: userProfile.address || '',
                occupation: userProfile.occupation || '',
                bio: userProfile.bio || '',
                income: userProfile.income?.toString() || '',
                idProof: userProfile.idProof || ''
            });
        }
    }, [userProfile]);

    const handleSubmit = async () => {
        setIsSaving(true);
        setSaveStatus(null);
        try {
            await updateUserProfile({ ...formData, income: Number(formData.income) || 0 });
            setSaveStatus('success');
            Alert.alert('Protocol Success', 'Profile integrity updated.');
            setTimeout(() => setSaveStatus(null), 3000);
        } catch (error) {
            setSaveStatus('error');
            Alert.alert('System Error', error.message || 'Transmission failed.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
                    <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View className="px-6 pt-10 pb-6 flex-row justify-between items-end">
                            <View>
                                <FeatureTag text="Account Terminal" subText="v1.0" />
                                <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase mb-1">Identity</Text>
                                <Text className="text-slate-500 font-cinzel text-xs uppercase tracking-widest">Secure your personal financial record.</Text>
                            </View>
                            <TouchableOpacity 
                                onPress={logout} 
                                className="w-14 h-14 bg-rose-500/10 rounded-2xl items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/10"
                            >
                                <LogOut size={20} color="#f43f5e" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>

                        {/* Profile Identity Card */}
                        <MotiView 
                            from={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ type: 'timing', duration: 600 }}
                            className="px-6 mb-8"
                        >
                            <LinearGradient
                                colors={['#4f46e5', '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="rounded-[3rem] p-8 overflow-hidden relative shadow-2xl shadow-indigo-500/40"
                            >
                                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                
                                <View className="flex-row items-center gap-6 mb-10">
                                    <View className="relative">
                                        <View className="w-24 h-24 rounded-[2rem] bg-white/20 items-center justify-center border border-white/30 backdrop-blur-md shadow-2xl">
                                            <Text className="text-4xl font-grenze-bold text-white italic uppercase tracking-tighter">
                                                {formData.name ? formData.name.charAt(0) : 'U'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity className="absolute bottom-[-10%] right-[-10%] w-10 h-10 bg-indigo-950 rounded-2xl items-center justify-center border-4 border-[#4f46e5] shadow-lg">
                                            <Camera size={16} color="#fff" />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white text-3xl font-grenze-bold tracking-tight italic uppercase leading-none mb-2">
                                            {formData.name || 'ANONYMOUS'}
                                        </Text>
                                        <View className="flex-row items-center gap-2">
                                            <View className="px-3 py-1 bg-white/20 rounded-lg border border-white/30">
                                                <Text className="text-white text-[9px] font-cinzel-bold uppercase tracking-widest italic">
                                                    {formData.occupation || 'UNASSIGNED'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View className="flex-row divide-x divide-white/20 pt-6 border-t border-white/20">
                                    <View className="flex-1 items-center">
                                        <View className="flex-row items-center gap-2 mb-2">
                                            <ShieldCheck size={16} color="#4ade80" />
                                            <Text className="text-white text-xs font-grenze-bold uppercase tracking-widest italic">Stable</Text>
                                        </View>
                                        <Text className="text-indigo-100 text-[8px] font-cinzel-semibold uppercase tracking-[0.3em] opacity-60">Security State</Text>
                                    </View>
                                    <View className="flex-1 items-center">
                                        <View className="flex-row items-center gap-2 mb-2">
                                            <BadgeCheck size={16} color="#fff" />
                                            <Text className="text-white text-xs font-grenze-bold uppercase tracking-widest italic">Alpha</Text>
                                        </View>
                                        <Text className="text-indigo-100 text-[8px] font-cinzel-semibold uppercase tracking-[0.3em] opacity-60">Tier Level</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </MotiView>

                        {/* Completion Metrics */}
                        <View className="px-6 mb-8">
                            <GlassCard intensity={10} style={{ padding: 24 }}>
                                <View className="flex-row justify-between items-center mb-4">
                                    <View className="flex-row items-center gap-3">
                                        <View className="w-10 h-10 bg-indigo-500/10 rounded-xl items-center justify-center border border-indigo-500/20">
                                            <Activity size={18} color="#818cf8" strokeWidth={2.5} />
                                        </View>
                                        <Text className="text-white text-sm font-grenze-bold uppercase tracking-[0.2em] italic">Profile Maturity</Text>
                                    </View>
                                    <Text className="text-indigo-400 font-grenze-bold text-sm tracking-tighter">82%</Text>
                                </View>
                                <View className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                    <View className="h-full w-[82%] bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50" />
                                </View>
                                <Text className="text-slate-500 text-[9px] font-cinzel uppercase tracking-widest mt-4 italic text-center">Complete sectors to unlock advanced protocols.</Text>
                            </GlassCard>
                        </View>

                        {/* Terminal Navigation Links */}
                        <View className="px-6 mb-8 space-y-4">
                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Investments')}
                                activeOpacity={0.8}
                                className="w-full h-20 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 items-center justify-between flex-row px-8"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-indigo-500/10 rounded-xl items-center justify-center border border-indigo-500/20">
                                        <Briefcase size={18} color="#818cf8" strokeWidth={2.5} />
                                    </View>
                                    <View>
                                        <Text className="text-white font-grenze-bold text-[10px] uppercase tracking-[0.3em] italic">Wealth Matrix</Text>
                                        <Text className="text-slate-500 text-[8px] font-cinzel uppercase tracking-widest mt-1">Institutional Portfolio</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color="#475569" />
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Settings')}
                                activeOpacity={0.8}
                                className="w-full h-20 rounded-[2rem] bg-slate-500/5 border border-slate-500/10 items-center justify-between flex-row px-8"
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-slate-500/10 rounded-xl items-center justify-center border border-slate-500/20">
                                        <SettingsIcon size={18} color="#94a3b8" />
                                    </View>
                                    <View>
                                        <Text className="text-white font-grenze-bold text-[10px] uppercase tracking-[0.3em] italic">System Config</Text>
                                        <Text className="text-slate-500 text-[8px] font-cinzel uppercase tracking-widest mt-1">App Preferences</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color="#475569" />
                            </TouchableOpacity>
                        </View>

                        {/* Information Form Sections */}
                        <View className="px-6 space-y-8">
                            <GlassCard intensity={5} style={{ padding: 28 }}>
                                <Text className="text-white text-xl font-grenze-bold uppercase italic tracking-tight mb-8">System Registry</Text>
                                <View className="space-y-6">
                                    <InputField label="Assigned ID" icon={<User size={18} color="#818cf8" />} value={formData.name} onChangeText={(v) => setFormData({ ...formData, name: v })} placeholder="Full Name" />
                                    <InputField label="Comms Channel" icon={<Phone size={18} color="#818cf8" />} value={formData.phone} onChangeText={(v) => setFormData({ ...formData, phone: v })} placeholder="+91 XXXXX XXXXX" keyboardType="phone-pad" />
                                    <InputField label="Sector Occupation" icon={<Briefcase size={18} color="#818cf8" />} value={formData.occupation} onChangeText={(v) => setFormData({ ...formData, occupation: v })} placeholder="e.g. Architect" />
                                    <InputField label="Capital Threshold (₹)" icon={<Fingerprint size={18} color="#818cf8" />} value={formData.income} onChangeText={(v) => setFormData({ ...formData, income: v })} placeholder="Monthly Income" keyboardType="numeric" />
                                    
                                    <View>
                                        <View className="flex-row items-start gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 min-h-[100px] shadow-inner">
                                            <MapPin size={18} color="#818cf8" style={{ marginTop: 2 }} />
                                            <TextInput
                                                multiline
                                                value={formData.address}
                                                onChangeText={(v) => setFormData({ ...formData, address: v })}
                                                placeholder="Location Data"
                                                placeholderTextColor="#475569"
                                                className="flex-1 text-white text-sm leading-relaxed font-cinzel"
                                                textAlignVertical="top"
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        disabled={isSaving}
                                        activeOpacity={0.8}
                                        className={`w-full h-16 rounded-[1.5rem] items-center justify-center flex-row gap-3 mt-6 shadow-2xl ${saveStatus === 'success' ? 'bg-emerald-500' : 'bg-indigo-600 shadow-indigo-600/30'}`}
                                    >
                                        {isSaving ? <ActivityIndicator color="#fff" /> : (
                                            <>
                                                {saveStatus === 'success' ? <CheckCircle2 size={20} color="#fff" strokeWidth={3} /> : <Save size={20} color="#fff" strokeWidth={2.5} />}
                                                <Text className="text-white font-cinzel-bold text-xs uppercase tracking-[0.4em] italic">
                                                    {saveStatus === 'success' ? 'Synchronized' : 'Execute Sync'}
                                                </Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </GlassCard>

                            <TouchableOpacity className="w-full h-20 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 items-center justify-between flex-row px-8 mb-4">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 bg-rose-500/10 rounded-xl items-center justify-center">
                                        <LogOut size={18} color="#f43f5e" />
                                    </View>
                                    <Text className="text-rose-400 font-grenze-bold text-[10px] uppercase tracking-[0.3em]">Flush Session</Text>
                                </View>
                                <ChevronRight size={18} color="#f43f5e" />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default' }) => (
    <View>
        <Text className="text-slate-500 text-[10px] font-cinzel-bold uppercase tracking-[0.2em] mb-3 ml-1">{label}</Text>
        <View className="flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-5 h-14 shadow-inner">
            {icon}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#475569"
                keyboardType={keyboardType}
                className="flex-1 text-white text-sm font-cinzel"
            />
        </View>
    </View>
);

export default Profile;
