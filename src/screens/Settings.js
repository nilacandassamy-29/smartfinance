import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function Settings({ navigation }) {
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    const Section = ({ title, children }) => (
        <View>
            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 }}>{title}</Text>
            <View style={{
                backgroundColor: '#ffffff', borderRadius: 20,
                shadowColor: '#64748b', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
            }}>{children}</View>
        </View>
    );

    const ToggleRow = ({ icon, label, value, onChange }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: '#0f172a' }}>{label}</Text>
            </View>
            <Switch value={value} onValueChange={onChange} trackColor={{ false: '#e2e8f0', true: '#2563eb' }} thumbColor={'#ffffff'} />
        </View>
    );

    const Divider = () => <View style={{ height: 1, backgroundColor: '#f1f5f9', marginLeft: 72 }} />;

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' }}>
                        <Text style={{ fontSize: 18, color: '#0f172a' }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: '#0f172a' }}>Settings</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, gap: 20 }} showsVerticalScrollIndicator={false}>
                    <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 400 }}>

                        <Section title="Appearance">
                            <ToggleRow icon="🌙" label="Dark Mode" value={theme === 'dark'} onChange={toggleTheme} />
                        </Section>

                        <View style={{ marginTop: 20 }}>
                            <Section title="Notifications">
                                <ToggleRow icon="🔔" label="Push Notifications" value={notifications} onChange={setNotifications} />
                                <Divider />
                                <ToggleRow icon="📊" label="Weekly Reports" value={notifications} onChange={setNotifications} />
                            </Section>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Section title="Security">
                                <ToggleRow icon="🔒" label="Biometric Auth" value={biometrics} onChange={setBiometrics} />
                            </Section>
                        </View>

                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 24 }}>
                            SmartFinance v2.1.0 · All data encrypted
                        </Text>
                    </MotiView>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
