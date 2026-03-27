import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, AlertTriangle, BarChart2, TrendingUp, RefreshCw } from 'lucide-react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function NotificationsScreen({ navigation }) {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [settings, setSettings] = useState({
        expenseAlerts: true,
        budgetWarnings: true,
        monthlyReport: true,
        schemeUpdates: false,
        appUpdates: true
    });
    const [savedStatus, setSavedStatus] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchSettings = async () => {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.notificationSettings) {
                    setSettings({ ...settings, ...data.notificationSettings });
                }
            }
        };
        fetchSettings();
    }, [user]);

    const handleToggle = async (key) => {
        if (!user) return;
        const newVal = !settings[key];
        const newSettings = { ...settings, [key]: newVal };
        
        // Optimistic UI Update
        setSettings(newSettings);
        
        // Save to Firestore
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                notificationSettings: newSettings
            });
            // Show saved status
            setSavedStatus(true);
            setTimeout(() => setSavedStatus(false), 1500);
        } catch (error) {
            console.error("Failed to update notification settings", error);
            // Revert on failure
            setSettings({ ...settings, [key]: !newVal });
        }
    };

    const ToggleRow = ({ icon, title, subtitle, isEnabled, onToggle, last = false }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: last ? 0 : 1, borderBottomColor: theme.divider }}>
            <View style={{ marginRight: 16 }}>{icon}</View>
            <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>{title}</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>{subtitle}</Text>
            </View>
            <Switch
                trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#CBD5E1"
                onValueChange={onToggle}
                value={isEnabled}
            />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, zIndex: 10, padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>Notifications</Text>
                    {savedStatus && (
                        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', right: 20 }}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: '#10b981' }}>Saved</Text>
                        </MotiView>
                    )}
                </View>

                {/* Content */}
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        <ToggleRow
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#eff6ff', alignItems: 'center', justifyContent: 'center' }}><Bell size={20} color="#2563eb" /></View>}
                            title="Expense Alerts"
                            subtitle="Get notified when you add an expense"
                            isEnabled={settings.expenseAlerts}
                            onToggle={() => handleToggle('expenseAlerts')}
                        />
                        <ToggleRow
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#fff7ed', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={20} color="#f97316" /></View>}
                            title="Budget Warnings"
                            subtitle="Warn me when I exceed 80% of monthly budget"
                            isEnabled={settings.budgetWarnings}
                            onToggle={() => handleToggle('budgetWarnings')}
                        />
                        <ToggleRow
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}><BarChart2 size={20} color="#10b981" /></View>}
                            title="Monthly Report"
                            subtitle="Receive monthly spending summary"
                            isEnabled={settings.monthlyReport}
                            onToggle={() => handleToggle('monthlyReport')}
                        />
                        <ToggleRow
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#faf5ff', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={20} color="#a855f7" /></View>}
                            title="Scheme Updates"
                            subtitle="Updates on government schemes and investments"
                            isEnabled={settings.schemeUpdates}
                            onToggle={() => handleToggle('schemeUpdates')}
                        />
                        <ToggleRow
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={20} color={theme.subText} /></View>}
                            title="App Updates"
                            subtitle="Get notified about new app features"
                            isEnabled={settings.appUpdates}
                            onToggle={() => handleToggle('appUpdates')}
                            last={true}
                        />
                    </View>

                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, textAlign: 'center', marginTop: 16 }}>
                        Notification delivery depends on your device permission settings.
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}
