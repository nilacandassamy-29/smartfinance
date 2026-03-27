import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, StatusBar as RNStatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { LayoutDashboard, CheckCircle2, ChevronLeft, Loader2, ShieldCheck, Lock } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MotiView, AnimatePresence } from 'moti';

const OnboardingLayout = ({ children, currentStep }) => {
 const navigation = useNavigation();
 const { mode, isInitialized, isSyncing } = useOnboarding();
 const { user, loading: authLoading } = useAuth();

 if (authLoading || !isInitialized) {
 return (
 <View className="flex-1 bg-slate-950 items-center justify-center">
 <View className="flex-col items-center">
 <ActivityIndicator size="large" color="#6366f1" />
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] mt-6 ">Securing Neural Link...</Text>
 </View>
 </View>
 );
 }

 const totalSteps = 7;
 const steps = [
 { id: 1, label: 'Node' },
 { id: 2, label: 'Cluster' },
 { id: 3, label: 'Flux' },
 { id: 4, label: 'Matrix' },
 { id: 5, label: 'Buffer' },
 { id: 6, label: 'Logic' },
 { id: 7, label: 'Commit' }
 ];

 return (
 <ImageBackground 
 source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000' }}
 className="flex-1"
 >
 <RNStatusBar barStyle="light-content" />
 <LinearGradient 
 colors={['rgba(2, 6, 23, 0.85)', 'rgba(2, 6, 23, 0.98)']}
 className="flex-1"
 >
 <View className="flex-1 pt-16">
 {/* Header Hub */}
 <View className="w-full px-6 mb-8">
 <View className="flex-row items-center justify-between mb-8">
 <View className="flex-row items-center space-x-4">
 <View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center shadow-lg shadow-indigo-600/30 border border-white/20">
 <LayoutDashboard size={20} color="#ffffff" strokeWidth={2.5} />
 </View>
 <View>
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em]">Initialization</Text>
 <Text className="text-xl font-black text-white tracking-tighter leading-none mt-1">SmartFinance</Text>
 </View>
 </View>
 
 <View className="flex-row items-center space-x-4">
 <View className="items-end">
 {isSyncing ? (
 <View className="flex-row items-center space-x-2">
 <ActivityIndicator size="small" color="#818cf8" />
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-widest ">Syncing...</Text>
 </View>
 ) : (
 <View className="flex-row items-center space-x-2">
 <ShieldCheck size={12} color="#10b981" />
 <Text className="text-xs font-black text-emerald-400 uppercase tracking-widest">Secured</Text>
 </View>
 )}
 </View>
 <BlurView intensity={20} tint="dark" className="px-3 py-1.5 rounded-xl border border-white/5 overflow-hidden">
 <Text className="text-white text-xs font-black uppercase tracking-widest ">{currentStep} / {totalSteps}</Text>
 </BlurView>
 </View>
 </View>

 {/* Modern Stepper Matrix */}
 <View className="flex-row items-center space-x-1.5 h-1.5 mb-10">
 {steps.map((s) => (
 <View 
 key={s.id} 
 className={`flex-1 h-full rounded-full ${s.id <= currentStep ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50' : 'bg-white/5'}`} 
 />
 ))}
 </View>
 </View>

 {/* Content Matrix Area */}
 <ScrollView 
 className="flex-1 px-6" 
 showsVerticalScrollIndicator={false}
 contentContainerStyle={{ paddingBottom: 60 }}
 >
 <MotiView
 from={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ type: 'timing', duration: 400 }}
 className="bg-transparent mb-12"
 >
 {children}
 </MotiView>

 {/* Bottom Integrity Markers */}
 <View className="flex-row items-center justify-center space-x-6 mb-10 opacity-40">
 <View className="flex-row items-center space-x-2">
 <Lock size={12} color='#64748b' />
 <Text className="text-xs font-black text-slate-500 uppercase tracking-widest">End-to-End Encryption</Text>
 </View>
 <View className="w-1.5 h-1.5 rounded-full bg-slate-800" />
 <View className="flex-row items-center space-x-2">
 <ShieldCheck size={12} color='#64748b' />
 <Text className="text-xs font-black text-slate-500 uppercase tracking-widest">Biometric Ready</Text>
 </View>
 </View>
 </ScrollView>
 </View>
 </LinearGradient>
 </ImageBackground>
 );
};

export default OnboardingLayout;
