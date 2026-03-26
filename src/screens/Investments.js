import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    TrendingUp, PieChart as PieIcon, Briefcase, Gem, Wallet, Search, ArrowUpRight, ChevronRight
} from 'lucide-react-native';
import { useExpenses } from '../context/ExpenseContext';
import { MotiView } from 'moti';
import FeatureTag from '../components/common/FeatureTag';
import { GlassCard } from '../components/GlassCard';

const { width } = Dimensions.get('window');

const Investments = () => {
    const { expenses } = useExpenses();
    const investmentExpenses = expenses.filter(e => e.category === 'Investment' || e.category === 'Wealth' || e.category === 'Mutual Fund' || e.category === 'Capital');
    const goldInvestments = expenses.filter(e => e.category === 'Gold');

    const totalInvested = investmentExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const goldTotal = goldInvestments.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const mfYield = totalInvested * 1.15;
    const goldYield = goldTotal * 1.08;
    const currentValue = mfYield + goldYield;
    const totalBasis = totalInvested + goldTotal;
    const gains = currentValue - totalBasis;

    const allocationItems = [
        { label: 'Institutional SIP', value: totalInvested, color: '#6366f1', pct: totalBasis > 0 ? ((totalInvested / totalBasis) * 100).toFixed(0) : 0, icon: <Wallet size={16} color="#818cf8" /> },
        { label: 'Digital Bullion', value: goldTotal, color: '#f59e0b', pct: totalBasis > 0 ? ((goldTotal / totalBasis) * 100).toFixed(0) : 0, icon: <Gem size={16} color="#f59e0b" /> },
    ];

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            {/* Background Glow */}
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <View className="px-6 pt-10 pb-6">
                        <FeatureTag text="Wealth Matrix" subText="v4.2" />
                        <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase mb-1">Portfolio</Text>
                        <Text className="text-slate-400 font-cinzel text-sm mb-8">Unified asset allocation and yield analysis.</Text>
                        
                        <TouchableOpacity 
                            activeOpacity={0.8}
                            className="h-16 bg-indigo-600 rounded-2xl flex-row items-center justify-center gap-4 shadow-2xl shadow-indigo-600/30 border border-indigo-400/20"
                        >
                            <Briefcase size={20} color="#fff" strokeWidth={3} />
                            <Text className="text-white font-cinzel-bold text-xs uppercase tracking-[0.3em] italic">Execute Allocation</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="px-6">
                        {/* Main Portfolio Card */}
                        <MotiView 
                            from={{ opacity: 0, scale: 0.95 }} 
                            animate={{ opacity: 1, scale: 1 }} 
                            transition={{ type: 'timing', duration: 600 }}
                            className="mb-8"
                        >
                            <LinearGradient
                                colors={['#4f46e5', '#3b82f6']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                className="rounded-[3rem] p-10 relative overflow-hidden shadow-2xl shadow-indigo-500/40"
                            >
                                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                
                                <Text className="text-indigo-100 text-[10px] font-cinzel-bold uppercase tracking-[0.4em] mb-3 italic opacity-80">Net Asset Valuation</Text>
                                <Text className="text-white text-5xl font-grenze-bold tracking-tighter italic mb-6">₹{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                                
                                <View className="flex-row items-center gap-6">
                                    <View className="bg-white/20 px-4 py-2 rounded-xl flex-row items-center gap-3 backdrop-blur-md border border-white/20">
                                        <TrendingUp size={14} color="#fff" strokeWidth={3} />
                                        <Text className="text-white text-[11px] font-cinzel-bold italic">+12.0% Yield</Text>
                                    </View>
                                    <View>
                                        <Text className="text-indigo-100 text-[9px] font-cinzel-bold uppercase tracking-widest opacity-60">Gains Resonance</Text>
                                        <Text className="text-white text-sm font-cinzel-bold italic">₹{gains.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </MotiView>

                        {/* Basis & Bullion Cards */}
                        <View className="flex-row gap-4 mb-8">
                            <View className="flex-1">
                                <GlassCard intensity={10} style={{ padding: 24 }}>
                                    <View className="w-12 h-12 bg-indigo-500/10 rounded-2xl items-center justify-center mb-5 border border-indigo-500/20 shadow-inner">
                                        <Wallet size={20} color="#818cf8" strokeWidth={2.5} />
                                    </View>
                                    <Text className="text-slate-500 text-[9px] font-cinzel-bold uppercase tracking-[0.2em] mb-2 italic">Capital Basis</Text>
                                    <Text className="text-white text-xl font-grenze-bold tracking-tighter italic">₹{totalBasis.toLocaleString()}</Text>
                                </GlassCard>
                            </View>
                            <View className="flex-1">
                                <GlassCard intensity={10} style={{ padding: 24 }}>
                                    <View className="w-12 h-12 bg-amber-500/10 rounded-2xl items-center justify-center mb-5 border border-amber-500/20 shadow-inner">
                                        <Gem size={20} color="#f59e0b" strokeWidth={2.5} />
                                    </View>
                                    <Text className="text-slate-500 text-[9px] font-cinzel-bold uppercase tracking-[0.2em] mb-2 italic">Bullion</Text>
                                    <Text className="text-amber-400 text-xl font-grenze-bold tracking-tighter italic">₹{goldTotal.toLocaleString()}</Text>
                                </GlassCard>
                            </View>
                        </View>

                        {/* Allocation Breakdown */}
                        <GlassCard intensity={5} style={{ padding: 28, marginBottom: 32 }}>
                            <View className="flex-row justify-between items-center mb-8">
                                <View>
                                    <Text className="text-white text-2xl font-grenze-bold tracking-tight uppercase italic mb-1">Asset Distribution</Text>
                                    <Text className="text-slate-500 font-cinzel-bold text-[9px] uppercase tracking-[0.3em] italic">Sector Parity Analysis</Text>
                                </View>
                                <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/5">
                                    <PieIcon size={20} color="#475569" />
                                </View>
                            </View>

                            {allocationItems.map((item, i) => (
                                <View key={i} className="mb-8">
                                    <View className="flex-row justify-between items-end mb-4">
                                        <View className="flex-row items-center gap-3">
                                            {item.icon}
                                            <Text className="text-white text-sm font-cinzel-bold uppercase tracking-tight italic">{item.label}</Text>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-indigo-400 text-[11px] font-cinzel-bold tracking-widest">{item.pct}%</Text>
                                            <Text className="text-slate-500 text-[9px] font-cinzel-bold uppercase tracking-widest">₹{item.value.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    <View className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                                        <View style={{ width: `${item.pct}%`, backgroundColor: item.color }} className="h-full rounded-full shadow-lg" />
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity className="flex-row items-center justify-between border-t border-white/5 pt-6 mt-2">
                                 <Text className="text-slate-500 text-[10px] font-cinzel-bold uppercase tracking-[0.3em] italic">View Full Ledger</Text>
                                <ArrowUpRight size={16} color="#475569" />
                            </TouchableOpacity>
                        </GlassCard>

                        {/* Empty state */}
                        {totalBasis === 0 && (
                            <View className="bg-white/5 border border-white/10 border-dashed rounded-[3rem] py-20 items-center">
                                <View className="w-20 h-20 bg-white/5 rounded-[2.5rem] items-center justify-center mb-6 border border-white/5">
                                    <Search size={32} color="#334155" />
                                </View>
                                 <Text className="text-slate-500 font-cinzel-bold text-[10px] uppercase tracking-[0.4em] italic mb-2">Portfolio Void</Text>
                                 <Text className="text-slate-600 text-[9px] font-cinzel-bold uppercase tracking-widest">No spectral data detected in local nodes</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Investments;
