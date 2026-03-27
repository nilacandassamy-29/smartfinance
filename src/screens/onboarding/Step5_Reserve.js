import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
 ChevronRight, ChevronLeft, ShieldCheck, Info,
 CheckCircle2, AlertCircle, Banknote, Landmark, Target, Zap
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const Step5_Reserve = () => {
 const {
 initialSurplus, reserveAmount, setReserveAmount,
 setStep, mode
 } = useOnboarding();
 const navigation = useNavigation();

 const handleNext = () => {
 setStep(6);
 navigation.navigate('Step6_Advice');
 };

 return (
 <OnboardingLayout currentStep={5}>
 <View className="mb-10 flex-row items-center justify-between">
 <TouchableOpacity onPress={() => { setStep(4); navigation.navigate('Step4_Analysis'); }} className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
 <ChevronLeft size={16} color="#475569" strokeWidth={3} />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Backtrack</Text>
 </TouchableOpacity>
 <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/5 overflow-hidden">
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] ">
 Liquidity Vault
 </Text>
 </BlurView>
 </View>

 <View className="mb-12">
 <Text className="text-4xl font-black text-white tracking-tighter uppercase ">Resilience Buffer</Text>
 <Text className="text-slate-500 font-bold text-xs mt-3 uppercase tracking-widest leading-relaxed">
 Defining the absolute safety net from your ₹{initialSurplus.toLocaleString('en-IN')} surplus.
 </Text>
 </View>

 <MotiView 
 from={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="overflow-hidden rounded-[3rem] border border-white/10 mb-12 shadow-2xl"
 >
 <BlurView intensity={25} tint="dark" className="p-10 bg-slate-900/40">
 <View className="items-center space-y-6 mb-10">
 <View className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] items-center justify-center border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
 <ShieldCheck size={38} color="#10b981" strokeWidth={2.5} />
 </View>
 <View className="items-center">
 <Text className="font-black text-white text-sm leading-[22px] uppercase tracking-[0.4em] text-center">Safety Lock Amount</Text>
 <View className="flex-row items-center mt-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
 <Target size={14} color="#f59e0b" strokeWidth={2.5} className="mr-3" />
 <Text className="text-xs text-slate-500 font-black uppercase tracking-[0.2em]">Objective: 6 Cycle Resilience</Text>
 </View>
 </View>
 </View>

 <View className="flex-row items-center bg-white/5 rounded-[1.5rem] px-6 h-20 border border-white/5 shadow-inner">
 <Banknote size={28} color="#475569" strokeWidth={2.5} />
 <TextInput
 className="flex-1 font-black text-4xl text-white ml-5 tracking-tighter"
 placeholder="0"
 placeholderTextColor="rgba(255,255,255,0.05)"
 keyboardType="numeric"
 value={String(reserveAmount || '')}
 onChangeText={(val) => setReserveAmount(Number(val) || 0)}
 />
 </View>
 
 <View className="flex-row items-center space-x-4 mt-10 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
 <Zap size={18} color="#818cf8" strokeWidth={2.5} />
 <Text className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-widest opacity-80">
 Allocating a buffer ensures your investment protocol remains uninterrupted during volatility.
 </Text>
 </View>
 </BlurView>
 </MotiView>

 <TouchableOpacity
 onPress={handleNext}
 activeOpacity={0.9}
 className="w-full bg-indigo-600 h-18 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl shadow-indigo-600/50 mb-10"
 >
 <Text className="text-white font-black text-xs uppercase tracking-[0.3em] ">Lock Resilience Buffer</Text>
 <ChevronRight size={22} color="#ffffff" strokeWidth={3} className="ml-4" />
 </TouchableOpacity>
 </OnboardingLayout>
 );
};

export default Step5_Reserve;
