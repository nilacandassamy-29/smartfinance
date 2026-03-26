import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
    ChevronRight, ChevronLeft, Bot, Sparkles, Shield, TrendingUp,
    Wallet, Banknote, Landmark, Target, AlertCircle,
    Users, HeartPulse, CircleDollarSign, Coins, Cpu, ShieldCheck, Zap
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const Step6_Advice = () => {
    const { investableSurplus, savingsAmount, reserveAmount, setStep, safeNumber, mode, members } = useOnboarding();
    const navigation = useNavigation();

    const getStrategy = () => {
        const balance = safeNumber(investableSurplus);
        const hasGirlChild = members.some(m => m.gender === 'Female' || m.gender === 'Female // XX');
        const workers = members.filter(m => m.occupation === 'Working');
        const isSingleEarner = workers.length === 1;

        if (balance <= 2000) {
            return {
                title: "Ultra-Safe Stability Plan",
                reasoning: "Maintaining high liquidity and absolute capital safety is critical at this surplus level.",
                risk: "No Risk",
                recommendations: [
                    { id: 'sb', name: "Savings Account", target: "Instant Cash", portion: "70%", icon: <Wallet size={16} color="#3b82f6" /> },
                    { id: 'rd', name: "Recurring Deposit", target: "Planned Saving", portion: "30%", icon: <Landmark size={16} color="#6366f1" /> }
                ]
            };
        } else if (balance <= 10000) {
            return {
                title: "Stable + Growth Core",
                reasoning: "A balanced mix to ensure your money beats inflation while keeping the principal protected.",
                risk: "Low-Moderate Risk",
                recommendations: [
                    { id: 'fd', name: "Fixed Deposit", target: "Shield Principal", portion: "60%", icon: <Shield size={16} color="#10b981" /> },
                    { id: 'mutual', name: "Bluechip SIP", target: "Steady Growth", portion: "40%", icon: <TrendingUp size={16} color="#6366f1" /> }
                ]
            };
        } else if (balance <= 25000) {
            const schemes = [
                { id: 'fd', name: "Emergency Buffer", target: "Security", portion: "40%", icon: <Banknote size={16} color="#10b981" /> },
                { id: 'mutual', name: "Flexi-Cap SIP", target: "Wealth Building", portion: "40%", icon: <TrendingUp size={16} color="#6366f1" /> }
            ];
            if (hasGirlChild) {
                schemes.push({ id: 'ssy', name: "Sukanya Samriddhi", target: "Girl Growth", portion: "20%", icon: <HeartPulse size={16} color="#f43f5e" /> });
            } else {
                schemes.push({ id: 'ppf', name: "PPF", target: "Tax-Free", portion: "20%", icon: <Landmark size={16} color="#6366f1" /> });
            }
            return {
                title: "Balanced Wealth Strategy",
                reasoning: "Optimized for tax-efficiency and long-term goal planning for the entire family.",
                risk: "Moderate Risk",
                recommendations: schemes
            };
        } else {
            return {
                title: "Diversified Growth Portfolio",
                reasoning: "Aggressive wealth compounding strategy utilizing multiple asset classes to maximize returns.",
                risk: "Growth Oriented",
                recommendations: [
                    { id: 'mutual', name: "Mid-Cap SIP", target: "High Returns", portion: "40%", icon: <TrendingUp size={16} color="#6366f1" /> },
                    { id: 'sgb', name: "Gold Bonds", target: "Asset Hedge", portion: "30%", icon: <Coins size={16} color="#f59e0b" /> },
                    { id: 'mutual', name: "Index Fund Mix", target: "Security + Alpha", portion: "30%", icon: <CircleDollarSign size={16} color="#10b981" /> }
                ]
            };
        }
    };

    const balance = safeNumber(investableSurplus);
    const strategy = getStrategy();

    if (balance <= 0) {
        return (
            <OnboardingLayout currentStep={6}>
                <View className="items-center py-20 space-y-8">
                    <View className="w-24 h-24 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 items-center justify-center shadow-2xl shadow-rose-500/20">
                        <AlertCircle size={48} color="#f43f5e" strokeWidth={2.5} />
                    </View>
                    <View className="items-center px-6">
                        <Text className="text-3xl font-black text-white italic tracking-tighter uppercase text-center leading-none">Strategy Offline</Text>
                        <Text className="text-slate-500 text-center font-bold text-xs uppercase tracking-widest mt-4 leading-relaxed">
                            System detect: Total outflows match or exceed inflows. Capital allocation protocol cannot initialize.
                        </Text>
                    </View>
                    <TouchableOpacity 
                        onPress={() => { setStep(3); navigation.navigate('Step3_Expenses'); }} 
                        activeOpacity={0.8}
                        className="px-10 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-2xl shadow-indigo-600/40"
                    >
                        <Text className="text-white font-black text-xs uppercase tracking-[0.3em] italic">Re-calibrate Flux</Text>
                    </TouchableOpacity>
                </View>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout currentStep={6}>
            <View className="mb-10 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => { setStep(5); navigation.navigate('Step5_Reserve'); }} className="flex-row items-center space-x-3">
                    <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
                        <ChevronLeft size={16} color="#475569" strokeWidth={3} />
                    </View>
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] italic">Backtrack</Text>
                </TouchableOpacity>
                <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/5 overflow-hidden flex-row items-center">
                    <Bot size={12} color="#818cf8" strokeWidth={3} />
                    <Text className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-2 italic">
                        Strategic Logic
                    </Text>
                </BlurView>
            </View>

            <View className="mb-12">
                <Text className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">Growth Blueprint</Text>
                <Text className="text-slate-500 font-bold text-xs mt-3 uppercase tracking-widest leading-relaxed">
                    Optimizing <Text className="text-indigo-400">₹{balance.toLocaleString()}</Text> deployment after ₹{safeNumber(reserveAmount).toLocaleString()} resilience buffer.
                </Text>
            </View>

            <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="overflow-hidden rounded-[3rem] border border-white/10 mb-12 shadow-2xl"
            >
                <BlurView intensity={30} tint="dark" className="p-8 bg-slate-900/40">
                    <View className="flex-row items-center space-x-6 mb-8 border-b border-white/5 pb-8">
                        <View className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 items-center justify-center border border-white/20 shadow-2xl shadow-indigo-600/60">
                            <TrendingUp size={32} color="#ffffff" strokeWidth={2.5} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{strategy.title}</Text>
                            <View className="flex-row items-center mt-2 bg-emerald-500/10 self-start px-3 py-1 rounded-lg border border-emerald-500/20">
                                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-sm shadow-emerald-500" />
                                <Text className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">{strategy.risk} Profile</Text>
                            </View>
                        </View>
                    </View>

                    <View className="mb-10 p-5 bg-white/5 rounded-2xl border border-white/5 italic">
                        <Text className="text-slate-400 font-bold leading-relaxed text-[13px]">
                            <Text className="text-indigo-400 font-black uppercase tracking-widest">Logic: </Text>
                            {strategy.reasoning}
                        </Text>
                    </View>

                    <View className="space-y-4">
                        <Text className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2 ml-1">Proposed Allocations</Text>
                        {strategy.recommendations.map((rec, idx) => (
                            <MotiView 
                                key={idx} 
                                from={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 300 + (idx * 100) }}
                                className="p-5 rounded-[2rem] bg-white/5 border border-white/5 flex-row items-center space-x-5 shadow-inner"
                            >
                                <View className="w-12 h-12 rounded-xl bg-slate-900 items-center justify-center border border-white/5 shadow-2xl">
                                    {React.cloneElement(rec.icon, { strokeWidth: 2.5 })}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-black text-white text-sm italic tracking-tight">{rec.name}</Text>
                                    <Text className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 italic">{rec.target}</Text>
                                </View>
                                <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/10 overflow-hidden bg-indigo-500/10">
                                    <Text className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] italic">{rec.portion}</Text>
                                </BlurView>
                            </MotiView>
                        ))}
                    </View>
                </BlurView>
            </MotiView>

            <TouchableOpacity
                onPress={() => { setStep(7); navigation.navigate('Step7_FinalSummary'); }}
                activeOpacity={0.9}
                className="w-full bg-indigo-600 h-18 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl shadow-indigo-600/50 mb-10"
            >
                <Text className="text-white font-black text-xs uppercase tracking-[0.3em] italic">Commit Deployment Plan</Text>
                <ChevronRight size={22} color="#ffffff" strokeWidth={3} className="ml-4" />
            </TouchableOpacity>
        </OnboardingLayout>
    );
};

export default Step6_Advice;
