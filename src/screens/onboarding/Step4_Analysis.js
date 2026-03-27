import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
 ChevronRight, ChevronLeft, TrendingUp, TrendingDown,
 Wallet, AlertCircle, CheckCircle2, Bot, Target, Cpu, ShieldCheck
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const Step4_Analysis = () => {
 const {
 totalIncome, totalExpenses, initialSurplus, safeNumber,
 mode, setSavingsAmount, setStep
 } = useOnboarding();
 const navigation = useNavigation();

 const handleNext = () => {
 setSavingsAmount(initialSurplus); 
 setStep(5);
 navigation.navigate('Step5_Reserve');
 };

 const cards = [
 { label: 'Cumulative Inflow', value: totalIncome, icon: <TrendingUp size={24} color="#10b981" />, bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
 { label: 'System Outflow', value: totalExpenses, icon: <TrendingDown size={24} color="#f43f5e" />, bg: 'bg-rose-500/5', border: 'border-rose-500/10' },
 { label: 'Available Liquidity', value: initialSurplus, icon: <Wallet size={24} color="#818cf8" />, bg: 'bg-indigo-500/5', border: 'border-indigo-500/10' },
 ];

 return (
 <OnboardingLayout currentStep={4}>
 <View className="mb-10 flex-row items-center justify-between">
 <TouchableOpacity onPress={() => { setStep(3); navigation.navigate('Step3_Expenses'); }} className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
 <ChevronLeft size={16} color="#475569" strokeWidth={3} />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Backtrack</Text>
 </TouchableOpacity>
 <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/5 overflow-hidden">
 <Text className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] ">
 Processing Engine
 </Text>
 </BlurView>
 </View>

 <View className="mb-12 items-center">
 <View className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] items-center justify-center border border-emerald-500/30 mb-6 shadow-2xl shadow-emerald-500/20">
 <Cpu size={32} color="#10b981" strokeWidth={2.5} />
 </View>
 <Text className="text-4xl font-black text-white tracking-tighter uppercase text-center">
 {mode === 'Family' ? 'Cluster Status' : 'Health Metrics'}
 </Text>
 <Text className="text-slate-500 font-bold text-xs mt-3 text-center px-6 uppercase tracking-[0.2em] leading-relaxed">
 AI-Driven synth mapping of global cashflow dynamics.
 </Text>
 </View>

 <View className="space-y-6 mb-12">
 {cards.map((card, i) => (
 <MotiView
 key={i}
 from={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: i * 150 }}
 className={`overflow-hidden rounded-[2.5rem] border ${card.border} shadow-2xl`}
 >
 <BlurView intensity={15} tint="dark" className={`p-8 flex-row items-center justify-between ${card.bg}`}>
 <View className="flex-row items-center space-x-6">
 <View className="w-14 h-14 rounded-2xl bg-white/5 items-center justify-center border border-white/5 shadow-inner">
 {React.cloneElement(card.icon, { strokeWidth: 2.5 })}
 </View>
 <View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-2">{card.label}</Text>
 <Text className="text-3xl font-black text-white tracking-tighter">
 ₹{safeNumber(card.value).toLocaleString('en-IN')}
 </Text>
 </View>
 </View>
 <View className="w-2 h-10 bg-white/5 rounded-full" />
 </BlurView>
 </MotiView>
 ))}
 </View>

 {/* AI Insight Header Card */}
 <MotiView
 from={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 600 }}
 className="overflow-hidden rounded-[3rem] border border-white/10 mb-12 shadow-2xl"
 >
 <BlurView intensity={40} tint="dark" className="p-8 flex-row items-start space-x-6 bg-indigo-600/10">
 <View className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 items-center justify-center border border-white/20 shadow-2xl shadow-indigo-600/60">
 <Bot size={32} color="#ffffff" strokeWidth={2.5} />
 </View>
 <View className="flex-1">
 <Text className="font-black text-white uppercase tracking-[0.4em] text-xs mb-3">Advisor Synthesis</Text>
 <Text className="text-slate-500 font-bold leading-relaxed text-sm leading-[22px] ">
 {initialSurplus > 0
 ? `Protocol optimized! Monthly surplus of ₹${initialSurplus.toLocaleString('en-IN')} detected. Capital is primed for AI-accelerated growth loops.`
 : "Flux warning: Outflow equals or exceeds Inflow. Activating security buffer strategy for absolute stability."}
 </Text>
 </View>
 </BlurView>
 </MotiView>

 <TouchableOpacity
 onPress={handleNext}
 activeOpacity={0.9}
 className="w-full bg-indigo-600 h-18 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl shadow-indigo-600/50 mb-10"
 >
 <Text className="text-white font-black text-xs uppercase tracking-[0.3em] ">Generate Deployment Strategy</Text>
 <ChevronRight size={22} color="#ffffff" strokeWidth={3} className="ml-4" />
 </TouchableOpacity>
 </OnboardingLayout>
 );
};

export default Step4_Analysis;
