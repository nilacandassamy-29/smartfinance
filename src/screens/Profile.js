import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Alert, Modal, TouchableWithoutFeedback, Platform, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MoreVertical, ChevronRight, Activity, CheckCircle, Shield, Sun, Camera, Bell, Lock, HelpCircle, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../context/AuthContext';
import { useUserProfileSettings } from '../context/UserProfileContext';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useInvestments } from '../context/InvestmentContext';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MotiView } from 'moti';

export default function Profile({ navigation }) {
    const { userProfile, user, profileImageURL, setProfileImageURL } = useAuth();
    const { profileSettings, updateProfileSetting } = useUserProfileSettings();
    const { expenses } = useExpenses();
    const { monthlyIncome } = useIncome();
    const { totalPortfolioValue } = useInvestments();

    const [expenseHistory, setExpenseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalConfig, setModalConfig] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                const snap = await getDocs(query(collection(db, 'users', user.uid, 'expenseHistory')));
                const list = snap.docs.map(doc => doc.data());
                setExpenseHistory(list);
            } catch(e) { } finally { setLoading(false); }
        };
        fetchHistory();
    }, [user]);

    // ─── IMAGE PICKER ───────────────────────────────────────
    const handlePickImage = () => {
        Alert.alert(
            'Change Profile Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: openCamera },
                { text: 'Choose from Gallery', onPress: openGallery },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow camera access.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets[0].uri) {
            await uploadProfileImage(result.assets[0].uri);
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Please allow photo library access.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled && result.assets[0].uri) {
            await uploadProfileImage(result.assets[0].uri);
        }
    };

    const uploadProfileImage = async (uri) => {
        try {
            setUploading(true);
            const response = await fetch(uri);
            const blob = await response.blob();

            const storage = getStorage();
            const storageRef = ref(storage, `profileImages/${user.uid}/profile.jpg`);
            await uploadBytes(storageRef, blob);

            const downloadURL = await getDownloadURL(storageRef);
            await updateDoc(doc(db, 'users', user.uid), { profileImageURL: downloadURL });
            setProfileImageURL(downloadURL);
            Alert.alert('Success', 'Profile photo updated!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to upload photo. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // ─── HEALTH MATH ─────────────────────────────────────────
    const dailyTarget = profileSettings?.dailyTarget || 1000;
    const monthlyBudget = dailyTarget * 30;
    const currentMonthOut = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

    let overspent = 0;
    let perfectMonths = 0;

    expenseHistory.forEach(h => {
        if ((h.total || 0) > monthlyBudget) overspent++;
        if ((h.total || 0) <= monthlyBudget) perfectMonths++;
    });

    if (currentMonthOut > monthlyBudget) overspent++;
    if (currentMonthOut <= monthlyBudget) perfectMonths++;

    const totalMonths = expenseHistory.length + 1;
    const ratio = overspent / totalMonths;

    let healthGrade = 'Deficient';
    let healthColor = '#ef4444';
    let healthIconColor = '#fef2f2';

    if (monthlyIncome === 0 || ratio > 0.5) {
        healthGrade = 'Deficient'; healthColor = '#ef4444'; healthIconColor = '#fef2f2';
    } else if (ratio === 0) {
        healthGrade = 'Excellent'; healthColor = '#10b981'; healthIconColor = '#ecfdf5';
    } else if (ratio <= 0.2) {
        healthGrade = 'Good'; healthColor = '#3b82f6'; healthIconColor = '#eff6ff';
    } else if (ratio <= 0.5) {
        healthGrade = 'Average'; healthColor = '#eab308'; healthIconColor = '#fefce8';
    }

    let velocityDisplay = profileSettings?.capitalVelocity || 'Not Set';
    if (!profileSettings?.capitalVelocity || profileSettings.capitalVelocity === 'Not Set') {
        const velScore = monthlyIncome > 0 ? (totalPortfolioValue / monthlyIncome) * 100 : 0;
        if (monthlyIncome === 0 || velScore < 20) velocityDisplay = 'Low';
        else if (velScore >= 50) velocityDisplay = 'High';
        else velocityDisplay = 'Medium';
    }

    // ─── MODAL HANDLER ──────────────────────────────────────
    const handleSaveSetting = async () => {
        if (!modalConfig) return;
        const { type, inputValue } = modalConfig;
        let val = inputValue;
        if (type === 'dailyTarget') {
            val = parseFloat(inputValue);
            if (isNaN(val) || val <= 0) val = 1000;
        }
        await updateProfileSetting(type, val);
        setModalConfig(null);
    };

    const openEditModal = (type, title) => {
        let currentVal = profileSettings?.[type] || '';
        if (type === 'dailyTarget') currentVal = String(currentVal || 1000);
        if (type === 'capitalVelocity' && (!currentVal || currentVal === 'Not Set')) currentVal = velocityDisplay;
        setModalConfig({ type, title, inputValue: currentVal });
    };

    const renderModalContent = () => {
        if (!modalConfig) return null;
        if (modalConfig.type === 'dailyTarget') {
            const { TextInput } = require('react-native');
            return (
                <View>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#475569', marginBottom: 6 }}>Daily Budget Target (₹)</Text>
                    <TextInput
                        value={modalConfig.inputValue}
                        onChangeText={(t) => setModalConfig({ ...modalConfig, inputValue: t })}
                        keyboardType="numeric"
                        placeholder="1000"
                        placeholderTextColor="#94a3b8"
                        style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }}
                    />
                </View>
            );
        }
        let options = [];
        if (modalConfig.type === 'riskProfile') options = ['Conservative', 'Moderate', 'Aggressive'];
        if (modalConfig.type === 'alertPreference') options = ['Manual', 'Auto (AI)'];
        if (modalConfig.type === 'capitalVelocity') options = ['Low', 'Medium', 'High'];

        return (
            <View style={{ gap: 8 }}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        onPress={() => setModalConfig({ ...modalConfig, inputValue: opt })}
                        style={{ paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: modalConfig.inputValue === opt ? '#eff6ff' : '#f8fafc', borderWidth: 1, borderColor: modalConfig.inputValue === opt ? '#3b82f6' : '#e2e8f0' }}
                    >
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: modalConfig.inputValue === opt ? '#1d4ed8' : '#334155' }}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const NavRow = ({ icon, label, value, onPress, isLast }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: isLast ? 0 : 1, borderBottomColor: '#f1f5f9' }}>
            <View style={{ width: 24, alignItems: 'center', marginRight: 12 }}>{icon}</View>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#1e293b', flex: 1 }}>{label}</Text>
            {value ? <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#64748b', marginRight: 8, textTransform: 'capitalize' }}>{value}</Text> : null}
            <ChevronRight size={18} color="#94a3b8" />
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('ProfileMenuScreen')} style={{ padding: 4 }}>
                        <MoreVertical size={24} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#0f172a' }}>My Profile</Text>
                    <View style={{ width: 32 }} />
                </View>

                {/* Edit Setting Modal */}
                <Modal visible={!!modalConfig} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setModalConfig(null)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0f172a' }}>{modalConfig?.title}</Text>
                                        <TouchableOpacity onPress={() => setModalConfig(null)} style={{ padding: 4 }}>
                                            <X size={20} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ marginBottom: 24 }}>{renderModalContent()}</View>
                                        <TouchableOpacity onPress={handleSaveSetting} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Save Changes</Text>
                                        </TouchableOpacity>
                                    </KeyboardAvoidingView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                    {/* Avatar Section */}
                    <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 400 }}>
                        <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 32 }}>
                            {/* Avatar with camera badge */}
                            <TouchableOpacity onPress={handlePickImage} activeOpacity={0.85} style={{ position: 'relative', marginBottom: 12 }}>
                                {/* Avatar circle */}
                                <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {profileImageURL ? (
                                        <Image source={{ uri: profileImageURL }} style={{ width: 80, height: 80, borderRadius: 40 }} />
                                    ) : (
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 28, color: '#ffffff' }}>{(userProfile?.name || 'U').charAt(0)}</Text>
                                    )}
                                </View>

                                {/* Uploading overlay */}
                                {uploading && (
                                    <View style={{ position: 'absolute', top: 0, left: 0, width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator color="#ffffff" size="small" />
                                    </View>
                                )}

                                {/* Camera badge */}
                                <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#f97316', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#ffffff', zIndex: 10 }}>
                                    <Camera size={14} color="#ffffff" />
                                </View>
                            </TouchableOpacity>

                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#0f172a', marginBottom: 2 }}>{userProfile?.name || 'Investor'}</Text>
                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: '#94a3b8' }}>{userProfile?.email || 'user@example.com'}</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('EditProfileScreen')} style={{ marginTop: 12, borderWidth: 1.5, borderColor: '#fed7aa', backgroundColor: '#fff7ed', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#ea580c' }}>Edit Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </MotiView>

                    {/* Stats Cards */}
                    <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 32, gap: 12 }}>
                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: healthIconColor, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                <Activity size={20} color={healthColor} />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: healthColor, marginBottom: 4 }}>{healthGrade}</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' }}>AVG HEALTH</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                                <CheckCircle size={20} color="#fb923c" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#0f172a', marginBottom: 4 }}>{perfectMonths}</Text>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 10, color: '#94a3b8', letterSpacing: 1, textTransform: 'uppercase' }}>PERFECT MONTHS</Text>
                        </View>
                    </View>

                    {/* SMART PROFILE SECTION */}
                    <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>MY SMART PROFILE</Text>
                        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <NavRow icon={<Shield size={24} color="#f97316" />} label="Risk Profile" value={profileSettings?.riskProfile || 'Moderate'} onPress={() => openEditModal('riskProfile', 'Edit Risk Profile')} />
                            <NavRow icon={<Sun size={24} color="#f97316" />} label="Alert Preference" value={profileSettings?.alertPreference || 'Auto (AI)'} onPress={() => openEditModal('alertPreference', 'Edit Alert Preference')} />
                            <NavRow icon={<Activity size={24} color="#f97316" />} label="Capital Velocity" value={velocityDisplay} onPress={() => openEditModal('capitalVelocity', 'Override Capital Velocity')} />
                            <NavRow icon={<CheckCircle size={24} color="#f97316" />} label="Daily Target" value={`₹${dailyTarget.toLocaleString('en-IN')}`} onPress={() => openEditModal('dailyTarget', 'Edit Daily Target')} isLast={true} />
                        </View>
                    </View>

                    {/* GENERAL SECTION */}
                    <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#94a3b8', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>GENERAL</Text>
                        <View style={{ backgroundColor: '#ffffff', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <NavRow icon={<Bell size={24} color="#3b82f6" />} label="Notifications" onPress={() => {}} />
                            <NavRow icon={<Lock size={24} color="#3b82f6" />} label="Security" onPress={() => {}} />
                            <NavRow icon={<HelpCircle size={24} color="#3b82f6" />} label="Help & Support" onPress={() => navigation.navigate('FAQScreen')} isLast={true} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
