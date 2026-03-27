import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, User, Mail, Phone, Save } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function EditProfileScreen({ navigation }) {
    const { userProfile, updateUserProfile } = useAuth();
    const { theme, isDarkMode } = useTheme();

    const [name, setName] = useState(userProfile?.name || '');
    const [phone, setPhone] = useState(userProfile?.phone || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty.');
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile({ name: name.trim(), phone: phone.trim() });
            Alert.alert('Saved', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const Field = ({ label, icon, value, onChange, keyboardType = 'default', editable = true }) => (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>{label}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: editable ? theme.inputBg : (isDarkMode ? '#0f172a' : '#f1f5f9'), borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 14, height: 50 }}>
                <View style={{ marginRight: 10 }}>{icon}</View>
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    keyboardType={keyboardType}
                    editable={editable}
                    style={{ flex: 1, fontFamily: 'Poppins-Medium', fontSize: 14, color: editable ? theme.text : theme.subText }}
                    placeholderTextColor={theme.placeholder}
                />
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text, marginLeft: 16 }}>Edit Profile</Text>
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ padding: 24 }} showsVerticalScrollIndicator={false}>
                        {/* Avatar */}
                        <View style={{ alignItems: 'center', marginBottom: 32 }}>
                            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 30, color: '#ffffff' }}>{(name || 'U').charAt(0).toUpperCase()}</Text>
                            </View>
                        </View>

                        <Field label="Full Name" icon={<User size={18} color={theme.subText} />} value={name} onChange={setName} />
                        <Field label="Email Address" icon={<Mail size={18} color={theme.subText} />} value={userProfile?.email || ''} onChange={() => {}} editable={false} />
                        <Field label="Phone Number" icon={<Phone size={18} color={theme.subText} />} value={phone} onChange={setPhone} keyboardType="phone-pad" />

                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={saving}
                            style={{ marginTop: 16, backgroundColor: saving ? '#93c5fd' : '#2563eb', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                        >
                            <Save size={18} color="#ffffff" />
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>{saving ? 'Saving...' : 'Save Changes'}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
