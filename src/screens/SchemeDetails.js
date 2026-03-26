import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    ShieldCheck,
    TrendingUp,
    HelpCircle,
    Globe,
    ExternalLink,
    Calculator,
    Target,
    CheckCircle2,
    Zap,
    Scale,
    ChevronRight
} from 'lucide-react-native';
import { schemes } from '../data/schemesList';
import { MotiView } from 'moti';
import Slider from '@react-native-community/slider';
import { GlassCard } from '../components/GlassCard';
import FeatureTag from '../components/common/FeatureTag';

const SchemeDetails = ({ route, navigation }) => {
    const { schemeId } = route.params;
    const scheme = schemes[schemeId];

    // Calculator State (Preserved logic)
    const [amount, setAmount] = useState(10000);
    const [tenure, setTenure] = useState(5);
    const [rate, setRate] = useState(0);
    const [results, setResults] = useState({ maturity: 0, returns: 0 });

    useEffect(() => {
        if (scheme) {
            const extractedRate = parseFloat(scheme.rate) || 7;
            setRate(extractedRate);
        }
    }, [scheme]);

    useEffect(() => {
        const p = amount;
        const r = rate / 100;
        const t = tenure;
        const a = p * Math.pow((1 + r), t);
        setResults({
            maturity: Math.round(a),
            returns: Math.round(a - p)
        });
    }, [amount, tenure, rate]);

    if (!scheme) return null;

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            {/* Background Glow */}
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                {/* Header Hub */}
                <View className="pt-6 px-6 pb-6 flex-row items-center justify-between">
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()} 
                        className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/10"
                    >
                        <ArrowLeft size={20} color="#818cf8" strokeWidth={3} />
                    </TouchableOpacity>
                    <View className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                        <Text className="text-[9px] font-cinzel-bold text-indigo-400 uppercase tracking-[0.4em] italic">{scheme.category}</Text>
                    </View>
                </View>

                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
                    <View className="px-6 py-4">
                        {/* Hero Section */}
                        <MotiView 
                            from={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <FeatureTag text="Protocol Detail" subText="Matrix" />
                            <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase leading-none mb-6">{scheme.name}</Text>
                            <GlassCard intensity={10} style={{ padding: 24 }}>
                                <Text className="text-sm text-slate-400 font-cinzel leading-relaxed">{scheme.description}</Text>
                            </GlassCard>
                        </MotiView>

                        {/* Return Analysis Calculator */}
                        <MotiView 
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 100 }}
                            className="mb-12"
                        >
                            <GlassCard intensity={15} style={{ padding: 28, backgroundColor: 'rgba(15, 23, 42, 0.4)' }}>
                                <View className="flex-row items-center justify-between mb-10">
                                    <View>
                                        <Text className="text-2xl font-grenze-bold text-white uppercase tracking-tight italic">Yield Delta Scanner</Text>
                                        <Text className="text-[9px] font-cinzel-bold text-slate-500 uppercase tracking-[0.4em] mt-2">Projection Protocol</Text>
                                    </View>
                                    <View className="w-14 h-14 bg-indigo-500/15 rounded-2xl items-center justify-center border border-indigo-500/20 shadow-inner">
                                        <Calculator size={24} color="#818cf8" strokeWidth={2.5} />
                                    </View>
                                </View>

                                <View className="space-y-12">
                                    <View>
                                        <View className="flex-row justify-between items-end mb-4">
                                            <Text className="text-[10px] font-cinzel-bold text-slate-500 uppercase tracking-[0.2em] italic">Capital Influx</Text>
                                            <Text className="text-xl font-grenze-bold text-white tracking-tighter italic">₹{amount.toLocaleString()}</Text>
                                        </View>
                                        <Slider
                                            minimumValue={1000}
                                            maximumValue={1000000}
                                            step={1000}
                                            value={amount}
                                            onValueChange={setAmount}
                                            minimumTrackTintColor="#818cf8"
                                            maximumTrackTintColor="rgba(255,255,255,0.05)"
                                            thumbTintColor="#fff"
                                        />
                                    </View>

                                    <View>
                                        <View className="flex-row justify-between items-end mb-4">
                                            <Text className="text-[10px] font-cinzel-bold text-slate-500 uppercase tracking-[0.2em] italic">Temporal Horizon</Text>
                                            <Text className="text-xl font-grenze-bold text-white tracking-tighter italic">{tenure} Cycles (Years)</Text>
                                        </View>
                                        <Slider
                                            minimumValue={1}
                                            maximumValue={30}
                                            step={1}
                                            value={tenure}
                                            onValueChange={setTenure}
                                            minimumTrackTintColor="#818cf8"
                                            maximumTrackTintColor="rgba(255,255,255,0.05)"
                                            thumbTintColor="#fff"
                                        />
                                    </View>

                                    <View className="flex-row gap-4 mt-8">
                                        <View className="flex-1 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-inner">
                                            <Text className="text-[9px] font-cinzel-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Yield Alpha</Text>
                                            <Text className="text-2xl font-grenze-bold text-emerald-400 tracking-tighter italic">+₹{results.returns.toLocaleString()}</Text>
                                        </View>
                                        <LinearGradient 
                                            colors={['#4f46e5', '#3b82f6']}
                                            className="flex-1 p-6 rounded-[2.5rem] shadow-xl shadow-indigo-600/30"
                                        >
                                            <Text className="text-[9px] font-cinzel-bold text-indigo-100 uppercase tracking-[0.2em] mb-2">Portfolio Value</Text>
                                            <Text className="text-2xl font-grenze-bold text-white tracking-tighter italic">₹{results.maturity.toLocaleString()}</Text>
                                        </LinearGradient>
                                    </View>
                                </View>
                            </GlassCard>
                        </MotiView>

                        {/* Protocol Specs */}
                        <View className="flex-row gap-4 mb-12">
                            <View className="flex-1 min-h-[140px]">
                                <GlassCard intensity={8} style={{ padding: 24, flex: 1 }}>
                                    <View className="flex-row items-center gap-3 mb-5">
                                        <CheckCircle2 size={18} color="#10b981" />
                                        <Text className="text-[10px] font-cinzel-bold text-white uppercase tracking-widest italic">Uptime</Text>
                                    </View>
                                    <Text className="text-slate-400 text-xs font-cinzel leading-relaxed">{scheme.benefits}</Text>
                                </GlassCard>
                            </View>
                            <View className="flex-1 min-h-[140px]">
                                <GlassCard intensity={8} style={{ padding: 24, flex: 1, borderLeftWidth: 4, borderLeftColor: '#f59e0b' }}>
                                    <View className="flex-row items-center gap-3 mb-5">
                                        <Scale size={18} color="#f59e0b" />
                                        <Text className="text-[10px] font-cinzel-bold text-amber-500 uppercase tracking-widest italic">Stability</Text>
                                    </View>
                                    <View className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 shadow-inner">
                                        <Text className="text-[10px] font-cinzel-bold uppercase tracking-[0.3em] text-center text-amber-400 italic">{scheme.risk} Risk</Text>
                                    </View>
                                </GlassCard>
                            </View>
                        </View>

                        {/* Implementation steps */}
                        <View className="mb-12">
                            <GlassCard intensity={5} style={{ padding: 32 }}>
                                <View className="flex-row items-center gap-4 mb-10">
                                    <Zap size={22} color="#10b981" strokeWidth={2.5} />
                                    <Text className="text-2xl font-grenze-bold text-white uppercase tracking-tight italic">Execution Path</Text>
                                </View>
                                <View className="space-y-8">
                                    {[
                                        "Secure fund deployment into verified instrument.",
                                        `Targeted benchmark yield of ${scheme.rate}.`,
                                        "Compound equity accumulation over temporal horizon.",
                                        "Liquidity event or maturity disbursement."
                                    ].map((step, i) => (
                                        <View key={i} className="flex-row gap-5 items-start">
                                            <View className="w-8 h-8 rounded-xl bg-indigo-500/15 items-center justify-center mt-0.5 border border-indigo-500/20 shadow-inner">
                                                <Text className="text-indigo-400 font-grenze-bold text-xs italic">{i + 1}</Text>
                                            </View>
                                            <Text className="flex-1 text-slate-400 font-cinzel text-sm leading-relaxed">{step}</Text>
                                        </View>
                                    ))}
                                </View>
                            </GlassCard>
                        </View>

                        {/* Target Eligibility */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 200 }}
                            className="mb-12 shadow-2xl shadow-indigo-600/40"
                        >
                            <LinearGradient 
                                colors={['#4f46e5', '#3b82f6']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                className="rounded-[3rem] p-10 relative overflow-hidden"
                            >
                                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                <View className="flex-row items-center gap-6">
                                    <View className="w-16 h-16 rounded-[1.5rem] bg-white/20 items-center justify-center border border-white/30 shadow-2xl backdrop-blur-md">
                                        <Target size={32} color="#ffffff" strokeWidth={2.5} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-indigo-100 text-[10px] font-cinzel-bold uppercase tracking-[0.4em] mb-2 italic opacity-80">Protocol Access</Text>
                                        <Text className="text-2xl font-grenze-bold text-white tracking-tight leading-tight italic uppercase">{scheme.eligibility.split('.')[0]}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </MotiView>

                        {/* Partner Nodes */}
                        <View className="pb-10">
                            <View className="flex-row items-center gap-3 mb-10 ml-2">
                                <View className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                                <Text className="text-[10px] font-cinzel-bold text-slate-500 uppercase tracking-[0.4em] italic">Verification Nodes</Text>
                            </View>
                            {scheme.institutions?.map((inst, i) => (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => Linking.openURL(inst.website)}
                                    activeOpacity={0.8}
                                    className="mb-4"
                                >
                                    <GlassCard intensity={5} style={{ padding: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View className="flex-row items-center gap-6">
                                            <View className="w-14 h-14 bg-indigo-500/10 rounded-2xl items-center justify-center border border-indigo-500/20 shadow-inner">
                                                <Globe size={22} color="#818cf8" strokeWidth={2.5} />
                                            </View>
                                             <View>
                                                 <Text className="font-grenze-bold text-white text-base italic uppercase tracking-tight">{inst.name}</Text>
                                                 <Text className="text-indigo-400 text-[9px] font-cinzel-bold uppercase tracking-[0.3em] mt-1.5">{scheme.rate} Benchmark</Text>
                                             </View>
                                        </View>
                                        <View className="w-12 h-12 rounded-2xl bg-white/5 items-center justify-center border border-white/5">
                                            <ExternalLink size={20} color="#475569" />
                                        </View>
                                    </GlassCard>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default SchemeDetails;
