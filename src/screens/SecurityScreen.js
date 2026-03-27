import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, StatusBar, Modal, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, KeyRound, Mail, Lock, Fingerprint, Trash2, X } from 'lucide-react-native';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function SecurityScreen({ navigation }) {
    const { user, logout } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [appLock, setAppLock] = useState(false);
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    
    // Password Modal State
    const [pwdModalVisible, setPwdModalVisible] = useState(false);
    const [currentPwd, setCurrentPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [pwdError, setPwdError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchSecurity = async () => {
            try {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.appLock !== undefined) setAppLock(data.appLock);
                    if (data.biometricEnabled !== undefined) setBiometricEnabled(data.biometricEnabled);
                }
            } catch (e) { console.error(e) }
        };
        fetchSecurity();
    }, [user]);

    const handleToggle = async (type, val) => {
        if (!user) return;
        try {
            if (type === 'appLock') setAppLock(val);
            if (type === 'biometricEnabled') setBiometricEnabled(val);
            await updateDoc(doc(db, 'users', user.uid), { [type]: val });
        } catch (error) {
            console.error(error);
            if (type === 'appLock') setAppLock(!val);
            if (type === 'biometricEnabled') setBiometricEnabled(!val);
        }
    };

    const handleChangePassword = async () => {
        setPwdError('');
        if (!currentPwd) { setPwdError('Current password cannot be empty'); return; }
        if (newPwd.length < 6) { setPwdError('New password must be at least 6 characters'); return; }
        if (newPwd !== confirmPwd) { setPwdError('New passwords do not match'); return; }

        setLoading(true);
        try {
            const credential = EmailAuthProvider.credential(user.email, currentPwd);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newPwd);
            Alert.alert('Success', 'Password changed successfully');
            setPwdModalVisible(false);
            setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
        } catch (error) {
            setPwdError('Failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm', style: 'destructive',
                    onPress: () => {
                        Alert.prompt(
                            'Final Confirmation',
                            'Type DELETE to confirm account removal',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                    text: 'Delete', style: 'destructive',
                                    onPress: async (text) => {
                                        if (text === 'DELETE') executeAccountDeletion();
                                        else Alert.alert('Failed', 'Confirmation text did not match');
                                    }
                                }
                            ]
                        );
                    }
                }
            ]
        );
    };

    const executeAccountDeletion = async () => {
        try {
            const uid = user.uid;
            await deleteDoc(doc(db, 'users', uid));
            await user.delete();
            await logout();
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert('Error', 'Please log out and log back in before deleting your account for security purposes.');
            } else {
                Alert.alert('Error', error.message);
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, zIndex: 10, padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>Security</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                    
                    {/* SECTION 1 - ACCOUNT SECURITY */}
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>ACCOUNT SECURITY</Text>
                    <View style={{ backgroundColor: theme.card, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        
                        <TouchableOpacity onPress={() => setPwdModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <KeyRound size={20} color="#2563eb" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>Change Password</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>Update your account password</Text>
                            </View>
                            <ChevronRight size={18} color={theme.subText} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#f8fafc', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Mail size={20} color={theme.subText} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>Email Address</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>{user?.email}</Text>
                            </View>
                        </View>
                    </View>

                    {/* SECTION 2 - APP SECURITY */}
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>APP SECURITY</Text>
                    <View style={{ backgroundColor: theme.card, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#fff7ed', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Lock size={20} color="#f97316" />
                            </View>
                            <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>App Lock</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>Require authentication to open app</Text>
                            </View>
                            <Switch trackColor={{ false: '#CBD5E1', true: '#2563eb' }} thumbColor="#ffffff" onValueChange={(v) => handleToggle('appLock', v)} value={appLock} ios_backgroundColor="#CBD5E1" />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#ecfdf5', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Fingerprint size={20} color="#10b981" />
                            </View>
                            <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>Biometric Login</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>Use fingerprint or face ID to login</Text>
                            </View>
                            <Switch trackColor={{ false: '#CBD5E1', true: '#2563eb' }} thumbColor="#ffffff" onValueChange={(v) => handleToggle('biometricEnabled', v)} value={biometricEnabled} ios_backgroundColor="#CBD5E1" />
                        </View>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: theme.subText, textAlign: 'center', paddingBottom: 16 }}>Biometric support depends on your device hardware</Text>
                    </View>

                    {/* SECTION 3 - DANGER ZONE */}
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.danger, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>DANGER ZONE</Text>
                    <View style={{ backgroundColor: isDarkMode ? theme.inputBg : '#fef2f2', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        
                        <TouchableOpacity onPress={handleDeleteAccount} style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                <Trash2 size={20} color="#ef4444" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.danger }}>Delete Account</Text>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: isDarkMode ? '#f87171' : '#f87171', marginTop: 2 }}>Permanently delete your account and all data</Text>
                            </View>
                            <ChevronRight size={18} color="#f87171" />
                        </TouchableOpacity>

                    </View>

                </ScrollView>

                {/* Change Password Modal */}
                <Modal visible={pwdModalVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                            <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Change Password</Text>
                                    <TouchableOpacity onPress={() => setPwdModalVisible(false)}><X size={20} color={theme.subText} /></TouchableOpacity>
                                </View>

                                {pwdError ? <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.danger, marginBottom: 12 }}>{pwdError}</Text> : null}

                                <View style={{ gap: 12 }}>
                                    <TextInput style={{ height: 48, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 16, fontFamily: 'Poppins-Medium', color: theme.text }} placeholder="Current Password" placeholderTextColor={theme.placeholder} secureTextEntry value={currentPwd} onChangeText={setCurrentPwd} />
                                    <TextInput style={{ height: 48, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 16, fontFamily: 'Poppins-Medium', color: theme.text }} placeholder="New Password" placeholderTextColor={theme.placeholder} secureTextEntry value={newPwd} onChangeText={setNewPwd} />
                                    <TextInput style={{ height: 48, backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingHorizontal: 16, fontFamily: 'Poppins-Medium', color: theme.text }} placeholder="Confirm New Password" placeholderTextColor={theme.placeholder} secureTextEntry value={confirmPwd} onChangeText={setConfirmPwd} />
                                </View>

                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
                                    <TouchableOpacity onPress={() => setPwdModalVisible(false)} style={{ flex: 1, height: 48, borderRadius: 12, backgroundColor: isDarkMode ? theme.inputBg : '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.subText }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleChangePassword} disabled={loading} style={{ flex: 1, height: 48, borderRadius: 12, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#ffffff' }}>{loading ? 'Saving...' : 'Save'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

            </SafeAreaView>
        </View>
    );
}
