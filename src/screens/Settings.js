import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StatusBar, SafeAreaView } from 'react-native';
import { Bell, Lock, Eye, Smartphone, Moon, Globe, Shield, LogOut, ChevronRight, ShieldCheck, Cpu, Code, Hexagon } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';
import { GlassCard } from '../components/GlassCard';
import FeatureTag from '../components/common/FeatureTag';

const Settings = ({ navigation }) => {
    const { logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [twoFactor, setTwoFactor] = useState(false);

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View className="px-6 pt-10 pb-6 flex-row justify-between items-end">
                        <View>
                            <FeatureTag text="System Config" subText="v1.0.4" />
                            <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase mb-1">Settings</Text>
                            <Text className="text-slate-400 font-cinzel text-sm">Fine-tune your financial matrix.</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={logout} 
                            className="w-14 h-14 bg-rose-500/10 rounded-2xl items-center justify-center border border-rose-500/20 shadow-lg shadow-rose-500/10"
                        >
                            <LogOut size={20} color="#f43f5e" strokeWidth={2.5} />
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 space-y-8">
                        {/* Interface Section */}
                        <SettingsSection title="Visual Interface" icon={<Eye size={18} color="#818cf8" strokeWidth={2.5} />}>
                            <SettingItem
                                icon={<Moon size={18} color="#94a3b8" />}
                                title="Dark Mode"
                                desc="Adaptive low-light illumination"
                                action={
                                    <Switch
                                        value={theme === 'dark'}
                                        onValueChange={toggleTheme}
                                        trackColor={{ false: '#1e293b', true: '#4f46e5' }}
                                        thumbColor="#fff"
                                    />
                                }
                            />
                            <SettingItem
                                icon={<Globe size={18} color="#94a3b8" />}
                                title="Linguistic Protocol"
                                desc="Define primary interface language"
                                action={<Text className="text-indigo-400 text-[10px] font-cinzel-bold uppercase tracking-widest italic">English</Text>}
                            />
                        </SettingsSection>

                        {/* Security Section */}
                        <SettingsSection title="Security & Access" icon={<Shield size={18} color="#10b981" strokeWidth={2.5} />}>
                            <SettingItem
                                icon={<Lock size={18} color="#94a3b8" />}
                                title="Access Credentials"
                                desc="Update identification hash"
                                action={
                                    <TouchableOpacity className="bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-inner">
                                         <Text className="text-indigo-400 text-[9px] font-cinzel-bold uppercase tracking-widest italic">Update</Text>
                                    </TouchableOpacity>
                                }
                            />
                            <SettingItem
                                icon={<ShieldCheck size={18} color="#94a3b8" />}
                                title="Multi-Factor Auth"
                                desc="Layered identity verification"
                                action={
                                    <Switch
                                        value={twoFactor}
                                        onValueChange={setTwoFactor}
                                        trackColor={{ false: '#1e293b', true: '#10b981' }}
                                        thumbColor="#fff"
                                    />
                                }
                            />
                        </SettingsSection>

                        {/* Notifications Section */}
                        <SettingsSection title="Comms & Alerts" icon={<Bell size={18} color="#f59e0b" strokeWidth={2.5} />}>
                            <SettingItem
                                icon={<Bell size={18} color="#94a3b8" />}
                                title="Hyper-Alerts"
                                desc="Real-time protocol updates"
                                action={
                                    <Switch
                                        value={notifications}
                                        onValueChange={setNotifications}
                                        trackColor={{ false: '#1e293b', true: '#f59e0b' }}
                                        thumbColor="#fff"
                                    />
                                }
                            />
                            <SettingItem
                                icon={<Smartphone size={18} color="#94a3b8" />}
                                title="SMS Proxy"
                                desc="Redundant fallback notifications"
                                action={
                                    <Switch
                                        disabled
                                        value={false}
                                        trackColor={{ false: '#0f172a', true: '#4f46e5' }}
                                        thumbColor="#1e293b"
                                    />
                                }
                            />
                        </SettingsSection>

                        {/* Version Info Card */}
                        <GlassCard intensity={8} style={{ padding: 24, flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <View className="w-14 h-14 bg-indigo-500/10 rounded-2xl items-center justify-center border border-indigo-500/20 shadow-inner">
                                <Code size={24} color="#818cf8" strokeWidth={2.5} />
                            </View>
                             <View className="flex-1">
                                 <Text className="text-slate-500 text-[9px] font-cinzel-bold uppercase tracking-[0.3em] mb-1 italic">Software Manifest</Text>
                                 <Text className="text-white text-base font-grenze-bold italic uppercase tracking-tight">v1.2.0-STABLE</Text>
                             </View>
                            <Hexagon size={20} color="#1e293b" />
                        </GlassCard>

                        <TouchableOpacity 
                            onPress={logout}
                            className="w-full h-20 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 items-center justify-center flex-row gap-4 mb-4"
                        >
                             <LogOut size={18} color="#f43f5e" strokeWidth={2.5} />
                             <Text className="text-rose-400 font-grenze-bold text-[11px] uppercase tracking-[0.4em] italic">Terminate Session</Text>
                         </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const SettingsSection = ({ title, icon, children }) => (
    <MotiView 
        from={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ type: 'timing', duration: 400 }}
    >
        <GlassCard intensity={5} style={{ padding: 0, overflow: 'hidden' }}>
            <View className="flex-row items-center gap-4 px-6 py-5 border-b border-white/5 bg-white/5">
                <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/5 shadow-inner">
                    {icon}
                </View>
                 <Text className="text-white text-base font-grenze-bold uppercase italic tracking-tight">{title}</Text>
            </View>
            <View className="px-6 py-2">
                {children}
            </View>
        </GlassCard>
    </MotiView>
);

const SettingItem = ({ icon, title, desc, action }) => (
    <View className="flex-row items-center justify-between py-5 border-b border-white/5 last:border-b-0">
        <View className="flex-row items-center gap-4 flex-1">
            <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/5">
                {icon}
            </View>
             <View className="flex-1">
                 <Text className="text-white text-sm font-grenze-bold uppercase italic tracking-tight">{title}</Text>
                 <Text className="text-slate-500 text-[10px] font-cinzel mt-1 uppercase tracking-widest" numberOfLines={1}>{desc}</Text>
             </View>
        </View>
        <View className="ml-6">{action}</View>
    </View>
);

export default Settings;
