import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, History, HelpCircle, Settings as SettingsIcon, Lock, Info, Moon, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileMenuScreen({ navigation }) {
    const { userProfile, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = async () => {
        await logout();
    };

    const DrawerItem = ({ icon, label, onPress }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 }}>
            {icon}
            <Text style={{ fontSize: 15, fontWeight: '500', color: '#1e293b' }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header Section */}
                <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomWidth: 1, borderColor: '#f1f5f9' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <Text style={{ fontSize: 24, color: '#fff', fontWeight: '700' }}>{(userProfile?.name || 'U').charAt(0)}</Text>
                            </View>
                            <Text style={{ fontSize: 17, fontWeight: '700', color: '#0f172a' }}>{userProfile?.name || 'Investor'}</Text>
                            <Text style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{userProfile?.email || 'user@example.com'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: '#f8fafc', borderRadius: 24 }}>
                            <X size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* MENU Section */}
                    <View style={{ paddingVertical: 24, paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 8 }}>MENU</Text>
                        <DrawerItem icon={<History size={20} color="#475569" />} label="History" onPress={() => navigation.navigate('ExpenseHistory')} />
                        <DrawerItem icon={<HelpCircle size={20} color="#475569" />} label="FAQ" onPress={() => navigation.navigate('FAQScreen')} />
                        <DrawerItem icon={<SettingsIcon size={20} color="#475569" />} label="Settings" onPress={() => navigation.navigate('Settings')} />
                    </View>

                    {/* LEGAL & INFO Section */}
                    <View style={{ paddingVertical: 8, paddingHorizontal: 24 }}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 8 }}>LEGAL & INFO</Text>
                        <DrawerItem icon={<Lock size={20} color="#475569" />} label="Privacy Policy" onPress={() => Alert.alert('Privacy Policy', 'Your privacy is essential to us. All data is securely encrypted using military-grade protocols and stored safely.')} />
                        <DrawerItem icon={<Info size={20} color="#475569" />} label="About" onPress={() => Alert.alert('SmartFinance', 'Version 2.1.0\n\nPowered by React Native, Nativewind, and Deepmind.')} />
                    </View>

                    {/* BOTTOM Section */}
                    <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                <Moon size={20} color="#475569" />
                                <Text style={{ fontSize: 15, fontWeight: '500', color: '#0f172a' }}>Dark Mode</Text>
                            </View>
                            <Switch value={theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: '#e2e8f0', true: '#2563eb' }} />
                        </View>
                        
                        <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: '#f1f5f9', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <LogOut size={20} color="#ef4444" />
                            <Text style={{ fontWeight: '700', fontSize: 15, color: '#ef4444' }}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
