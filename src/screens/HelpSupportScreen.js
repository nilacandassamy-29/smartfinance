import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, HelpCircle, MessageCircle, Bug, Info, Shield, FileText, X, Phone, Mail } from 'lucide-react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function HelpSupportScreen({ navigation }) {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    
    // Modals state
    const [contactVisible, setContactVisible] = useState(false);
    const [bugVisible, setBugVisible] = useState(false);
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);

    // Bug Report state
    const [bugText, setBugText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitBug = async () => {
        if (!bugText.trim()) return;
        setSubmitting(true);
        try {
            const timestamp = Date.now().toString();
            await setDoc(doc(db, 'bugReports', timestamp), {
                uid: user?.uid || 'unknown',
                email: user?.email || 'unknown',
                description: bugText.trim(),
                timestamp: new Date().toISOString()
            });
            Alert.alert('Success', 'Thank you! We will look into this.');
            setBugVisible(false);
            setBugText('');
        } catch (error) {
            Alert.alert('Error', 'Failed to submit bug report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCall = () => Linking.openURL('tel:+919876543210');
    const handleEmail = () => Linking.openURL('mailto:support@smartfinance.in');

    const Row = ({ icon, title, subtitle, onPress, rightContent }) => (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
            <View style={{ marginRight: 16 }}>{icon}</View>
            <View style={{ flex: 1, paddingRight: 16 }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>{title}</Text>
                {subtitle && <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>{subtitle}</Text>}
            </View>
            {rightContent || <ChevronRight size={18} color={theme.subText} />}
        </TouchableOpacity>
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
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>Help & Support</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    
                    {/* SECTION 1 - GET HELP */}
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>GET HELP</Text>
                    <View style={{ backgroundColor: theme.card, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        
                        <Row 
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#eff6ff', alignItems: 'center', justifyContent: 'center' }}><HelpCircle size={20} color="#2563eb" /></View>}
                            title="Frequently Asked Questions" subtitle="Find answers to common questions"
                            onPress={() => navigation.navigate('FAQScreen')}
                        />
                        <Row 
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}><MessageCircle size={20} color="#10b981" /></View>}
                            title="Contact Us" subtitle="Reach out to our support team"
                            onPress={() => setContactVisible(true)}
                        />
                        <View style={{ borderBottomWidth: 0 }}>
                            <Row 
                                icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#fef2f2', alignItems: 'center', justifyContent: 'center' }}><Bug size={20} color="#ef4444" /></View>}
                                title="Report a Bug" subtitle="Help us improve the app"
                                onPress={() => setBugVisible(true)} rightContent={<ChevronRight size={18} color={theme.subText} />}
                            />
                        </View>
                    </View>

                    {/* SECTION 2 - ABOUT */}
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: theme.sectionLabel, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>ABOUT</Text>
                    <View style={{ backgroundColor: theme.card, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 }}>
                        
                        <Row 
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}><Info size={20} color={theme.subText} /></View>}
                            title="App Version"
                            rightContent={<Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText }}>v1.0.0</Text>}
                            onPress={() => {}}
                        />
                        <Row 
                            icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} color={theme.subText} /></View>}
                            title="Privacy Policy"
                            onPress={() => setPrivacyVisible(true)}
                        />
                        <View style={{ borderBottomWidth: 0 }}>
                            <Row 
                                icon={<View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isDarkMode ? theme.iconBg : '#f8fafc', alignItems: 'center', justifyContent: 'center' }}><FileText size={20} color={theme.subText} /></View>}
                                title="Terms of Service"
                                onPress={() => setTermsVisible(true)} rightContent={<ChevronRight size={18} color={theme.subText} />}
                            />
                        </View>

                    </View>
                </ScrollView>

                {/* MODALS */}
                
                {/* Contact Us Modal */}
                <Modal visible={contactVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                        <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Contact Us</Text>
                                <TouchableOpacity onPress={() => setContactVisible(false)}><X size={20} color={theme.subText} /></TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={handleEmail} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                                <Mail size={20} color="#2563eb" style={{ marginRight: 16 }} />
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText }}>Email Support</Text>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>support@smartfinance.in</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCall} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, padding: 16 }}>
                                <Phone size={20} color="#10b981" style={{ marginRight: 16 }} />
                                <View>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText }}>Call Support</Text>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>+91 98765 43210</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Report Bug Modal */}
                <Modal visible={bugVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                            <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Report a Bug</Text>
                                    <TouchableOpacity onPress={() => setBugVisible(false)}><X size={20} color={theme.subText} /></TouchableOpacity>
                                </View>
                                <TextInput
                                    multiline
                                    numberOfLines={4}
                                    style={{ minHeight: 100, backgroundColor: theme.inputBg, borderRadius: 12, padding: 16, paddingTop: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text, textAlignVertical: 'top', borderWidth: 1, borderColor: theme.border, marginBottom: 20 }}
                                    placeholder="Describe the issue you're facing..."
                                    placeholderTextColor={theme.placeholder}
                                    value={bugText}
                                    onChangeText={setBugText}
                                />
                                <TouchableOpacity onPress={handleSubmitBug} disabled={submitting} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: submitting ? 0.7 : 1 }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>{submitting ? 'Submitting...' : 'Submit Report'}</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Privacy Policy Modal */}
                <Modal visible={privacyVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                        <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Privacy Policy</Text>
                                <TouchableOpacity onPress={() => setPrivacyVisible(false)}><X size={20} color={theme.subText} /></TouchableOpacity>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text, lineHeight: 24 }}>
                                SmartFinance collects expense and profile data solely to provide personal finance management features. Your data is stored securely in Firebase and is never shared with third parties.
                            </Text>
                        </View>
                    </View>
                </Modal>

                {/* Terms Modal */}
                <Modal visible={termsVisible} transparent animationType="fade">
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                        <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Terms of Service</Text>
                                <TouchableOpacity onPress={() => setTermsVisible(false)}><X size={20} color={theme.subText} /></TouchableOpacity>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text, lineHeight: 24 }}>
                                By using SmartFinance you agree to use the app for personal finance tracking purposes only. We reserve the right to update these terms at any time.
                            </Text>
                        </View>
                    </View>
                </Modal>

            </SafeAreaView>
        </View>
    );
}
