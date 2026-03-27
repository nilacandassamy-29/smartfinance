import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
 ChevronRight, ChevronLeft, CheckCircle2, TrendingUp,
 ShieldCheck, Wallet, ArrowRight, Sparkles, Bot, Cpu, Target, Zap
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const Step7_FinalSummary = () => {
 const {
 totalIncome, totalExpenses, reserveAmount,
 investableSurplus, setStep, finalizeOnboarding, safeNumber
 } = useOnboarding();
 const navigation = useNavigation();
 const [isFinalizing, setIsFinalizing] = useState(false);

 const handleFinalize = async () => {
 setIsFinalizing(true);
 try {
 const success = await finalizeOnboarding();
 if (success) {
 // Reset navigation to main dashboard
 navigation.replace('MainDrawer');
 }
 } catch (error) {
 console.error("Finalization failed", error);
 } finally {
 setIsFinalizing(false);
 }
 };

 const summaries = [
 { label: 'Total Inflow', value: totalIncome, icon: <TrendingUp size={18} color="#10b981" /> },
 { label: 'Flux Leakage', value: totalExpenses, icon: <TrendingUp size={18} color="#f43f5e" style={{ transform: [{ rotate: '180deg' }] }} /> },
 { label: 'Buffer Active', value: reserveAmount, icon: <ShieldCheck size={18} color="#3b82f6" /> },
 { label: 'Growth Vector', value: investableSurplus, icon: <Wallet size={18} color="#818cf8" /> },
 ];

 return (
 <OnboardingLayout currentStep={7}>
 <View className="mb-10 flex-row items-center justify-start">
 <TouchableOpacity onPress={() => { setStep(6); navigation.navigate('Step6_Advice'); }} className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
 <ChevronLeft size={16} color="#475569" strokeWidth={3} />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Backtrack</Text>
 </TouchableOpacity>
 </View>

 <View className="items-center space-y-6 mb-12">
 <MotiView
 from={{ scale: 0.5, opacity: 0, rotate: '180deg' }}
 animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
 className="w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/40"
 >
 <CheckCircle2 size={48} color="#10b981" strokeWidth={2.5} />
 </MotiView>
 <View className="items-center px-4">
 <Text className="text-4xl font-black text-white tracking-tighter uppercase text-center leading-none">Matrix Ready</Text>
 <BlurView intensity={10} tint="dark" className="px-6 py-3 rounded-2xl border border-white/5 bg-white/5 mt-6">
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mt-2 text-center ">
 Personalized {totalIncome > 50000 ? 'Wealth Acceleration' : 'Financial Resilience'} protocol engaged.
 </Text>
 </BlurView>
 </View>
 </View>

 <MotiView 
 from={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="overflow-hidden rounded-[3rem] border border-white/10 mb-12 shadow-2xl"
 >
 <BlurView intensity={30} tint="dark" className="p-10 bg-slate-900/40">
 <View className="flex-row flex-wrap">
 {summaries.map((item, i) => (
 <MotiView 
 key={i} 
 from={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 200 + (i * 100) }}
 style={{ width: '50%' }} 
 className="space-y-4 mb-10"
 >
 <View className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 items-center justify-center">
 {React.cloneElement(item.icon, { strokeWidth: 2.5 })}
 </View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] ">{item.label}</Text>
 </View>
 <Text className="text-3xl font-black text-white tracking-tighter leading-none">
 ₹{safeNumber(item.value).toLocaleString('en-IN')}
 </Text>
 </MotiView>
 ))}
 </View>

 <MotiView 
 from={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 800 }}
 className="bg-indigo-600/10 p-6 rounded-[2rem] border border-indigo-600/20 mt-4 flex-row items-center space-x-5"
 >
 <View className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center border border-white/20 shadow-2xl shadow-indigo-600/40">
 <Bot size={28} color="#ffffff" strokeWidth={2.5} />
 </View>
 <View className="flex-1">
 <Text className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
 Activation will synchronize node data and initialize global growth trackers.
 </Text>
 </View>
 </MotiView>
 </BlurView>
 </MotiView>

 <TouchableOpacity
 disabled={isFinalizing}
 onPress={handleFinalize}
 activeOpacity={0.9}
 className={`w-full h-18 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl mb-12 ${isFinalizing ? 'bg-slate-900 border border-white/5' : 'bg-indigo-600 shadow-indigo-600/60'}`}
 >
 {isFinalizing ? (
 <View className="flex-row items-center space-x-4">
 <ActivityIndicator size="small" color="#818cf8" />
 <Text className="text-indigo-400 font-black text-xs uppercase tracking-[0.4em] mb-0.5 ml-2">Syncing Matrix...</Text>
 </View>
 ) : (
 <View className="flex-row items-center">
 <Text className="text-white font-black text-xs uppercase tracking-[0.3em] ">Activate Synth Tracker</Text>
 <ArrowRight size={22} color="#ffffff" strokeWidth={3} className="ml-4" />
 </View>
 )}
 </TouchableOpacity>
 </OnboardingLayout>
 );
};

export default Step7_FinalSummary;
