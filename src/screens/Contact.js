import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { MotiView, AnimatePresence } from 'moti';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
    });

    const handleSubmit = async () => {
        if (!formData.firstName || !formData.email || !formData.message) {
            Alert.alert('Error', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setStatus({ type: 'loading', message: 'Transmitting protocol...' });

        try {
            await addDoc(collection(db, 'support_messages'), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'new'
            });

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                message: ''
            });
            setStatus({ type: 'success', message: 'Message encrypted & sent' });
            Alert.alert('Success', 'Message encrypted & sent');
            setTimeout(() => setStatus({ type: '', message: '' }), 8000);
        } catch (error) {
            setStatus({ type: 'error', message: 'Communication failure: ' + (error.message || 'Unknown error') });
            Alert.alert('Error', 'Communication failure: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-slate-50 dark:bg-slate-950"
        >
            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="px-6 pt-12 pb-8">
                    {/* Header */}
                    <View className="mb-10">
                        <View className="px-3 py-1 bg-indigo-500/10 self-start rounded-lg border border-indigo-500/20 mb-4">
                            <Text className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Support Hub</Text>
                        </View>
                        <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Contact Support</Text>
                        <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">Have questions about SmartFinance? Our team is here to help you.</Text>
                    </View>

                    {/* Contact Info Card */}
                    <MotiView
                        from={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-indigo-600 rounded-[2.5rem] p-8 border border-white/10 shadow-lg shadow-indigo-600/20 mb-8 overflow-hidden relative"
                    >
                        <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[60px] -mr-20 -mt-20" />
                        <View className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[60px] -ml-20 -mb-20" />
                        
                        <View className="relative z-10 mb-10">
                            <Text className="text-2xl font-black text-white tracking-tight mb-2">Our Info</Text>
                            <Text className="text-indigo-200 text-xs font-medium leading-relaxed opacity-80">Send us a message and we'll get back to you as soon as possible.</Text>
                        </View>

                        <View className="space-y-6 relative z-10">
                            <View className="flex-row items-center space-x-4">
                                <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center border border-white/10 shadow-lg">
                                    <Mail size={20} color="#ffffff" />
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mb-0.5 opacity-80">Email Support</Text>
                                    <Text className="text-sm tracking-tight font-bold text-white">support@smartfinance.ai</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center space-x-4">
                                <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center border border-white/10 shadow-lg">
                                    <Phone size={20} color="#ffffff" />
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mb-0.5 opacity-80">Phone Support</Text>
                                    <Text className="text-sm tracking-tight font-bold text-white">+91-888-FINANCE</Text>
                                </View>
                            </View>
                            <View className="flex-row items-center space-x-4">
                                <View className="w-12 h-12 rounded-xl bg-white/10 items-center justify-center border border-white/10 shadow-lg">
                                    <MapPin size={20} color="#ffffff" />
                                </View>
                                <View>
                                    <Text className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest mb-0.5 opacity-80">Main Office</Text>
                                    <Text className="text-sm tracking-tight font-bold text-white">BKC, Mumbai, India</Text>
                                </View>
                            </View>
                        </View>
                    </MotiView>

                    {/* Form Card */}
                    <MotiView
                        from={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 100 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden"
                    >
                        <View className="mb-8 flex-row items-center justify-between">
                            <Text className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">New Protocol</Text>
                            {status.message && (
                                <View className="flex-row items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                                    {status.type === 'loading' ? <ActivityIndicator size="small" color="#6366f1" /> : <CheckCircle2 size={12} color="#6366f1" />}
                                    <Text className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{status.message}</Text>
                                </View>
                            )}
                        </View>

                        <View className="space-y-5">
                            <View className="flex-row space-x-4">
                                <View className="flex-1 space-y-2">
                                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</Text>
                                    <TextInput
                                        value={formData.firstName}
                                        onChangeText={(val) => setFormData({...formData, firstName: val})}
                                        className="h-12 px-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                                        placeholder="ALEX"
                                        placeholderTextColor="#cbd5e1"
                                    />
                                </View>
                                <View className="flex-1 space-y-2">
                                    <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</Text>
                                    <TextInput
                                        value={formData.lastName}
                                        onChangeText={(val) => setFormData({...formData, lastName: val})}
                                        className="h-12 px-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                                        placeholder="VAZ"
                                        placeholderTextColor="#cbd5e1"
                                    />
                                </View>
                            </View>

                            <View className="space-y-2">
                                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</Text>
                                <TextInput
                                    value={formData.email}
                                    onChangeText={(val) => setFormData({...formData, email: val})}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    className="h-12 px-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                                    placeholder="email@example.com"
                                    placeholderTextColor="#cbd5e1"
                                />
                            </View>

                            <View className="space-y-2">
                                <Text className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</Text>
                                <TextInput
                                    value={formData.message}
                                    onChangeText={(val) => setFormData({...formData, message: val})}
                                    multiline
                                    numberOfLines={4}
                                    className="px-4 py-3 h-32 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white text-left"
                                    placeholder="Write your message here..."
                                    placeholderTextColor="#cbd5e1"
                                    textAlignVertical="top"
                                />
                            </View>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full h-14 rounded-2xl items-center justify-center flex-row space-x-3 shadow-lg mt-2 ${isSubmitting ? 'bg-slate-400' : 'bg-indigo-600 shadow-indigo-600/20'}`}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <>
                                        <Text className="text-white font-black text-[10px] uppercase tracking-widest">Send Message</Text>
                                        <Send size={14} color="#ffffff" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Contact;
