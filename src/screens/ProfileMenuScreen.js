import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, History, HelpCircle, Settings as SettingsIcon, Lock, Info, Moon, LogOut } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ProfileMenuScreen({ navigation }) {
    const { userProfile, logout } = useAuth();
    const { isDarkMode, toggleDarkMode, theme } = useTheme();

    const handleLogout = async () => {
        await logout();
    };

    const DrawerItem = ({ icon, label, onPress }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16 }}>
            {icon}
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: theme.text }}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header Section */}
                <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View>
                            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: '#fff' }}>{(userProfile?.name || 'U').charAt(0).toUpperCase()}</Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 17, color: theme.text }}>{userProfile?.name || 'Investor'}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: theme.subText, marginTop: 2 }}>{userProfile?.email || 'user@example.com'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: theme.inputBg, borderRadius: 24 }}>
                            <X size={20} color={theme.subText} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* MENU Section */}
                    <View style={{ paddingVertical: 24, paddingHorizontal: 24 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, marginBottom: 8 }}>MENU</Text>
                        <DrawerItem icon={<History size={20} color={theme.text} />} label="History" onPress={() => navigation.navigate('ExpenseHistory')} />
                        <DrawerItem icon={<HelpCircle size={20} color={theme.text} />} label="FAQ" onPress={() => navigation.navigate('FAQScreen')} />
                        <DrawerItem icon={<SettingsIcon size={20} color={theme.text} />} label="Settings" onPress={() => navigation.navigate('Settings')} />
                    </View>

                    {/* LEGAL & INFO Section */}
                    <View style={{ paddingVertical: 8, paddingHorizontal: 24 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, marginBottom: 8 }}>LEGAL & INFO</Text>
                        <DrawerItem icon={<Lock size={20} color={theme.text} />} label="Privacy Policy" onPress={() => Alert.alert('Privacy Policy', 'Your privacy is essential to us. All data is securely encrypted using military-grade protocols and stored safely.')} />
                        <DrawerItem icon={<Info size={20} color={theme.text} />} label="About" onPress={() => Alert.alert('SmartFinance', 'Version 2.1.0\n\nPowered by React Native, Nativewind, and Deepmind.')} />
                    </View>

                    {/* BOTTOM Section */}
                    <View style={{ paddingHorizontal: 24, marginTop: 40 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                <Moon size={20} color={theme.text} />
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: theme.text }}>Dark Mode</Text>
                            </View>
                            <Switch 
                                value={isDarkMode} 
                                onValueChange={toggleDarkMode} 
                                trackColor={{ false: '#CBD5E1', true: '#2563EB' }} 
                                thumbColor={'#FFFFFF'}
                            />
                        </View>
                        
                        <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: isDarkMode ? theme.inputBg : '#fef2f2', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                            <LogOut size={20} color={theme.danger} />
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.danger }}>Log Out</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
