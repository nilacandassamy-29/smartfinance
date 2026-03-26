import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Target, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';

const EmergencyFundCard = ({ monthlyExpenses = 0, gap = 0, coverage = 0 }) => {
    const navigation = useNavigation();
    const isSecure = gap <= 0;

    return (
        <View className="overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
            <BlurView intensity={20} tint="dark" className="p-8 bg-slate-900/40">
                <View className="flex-row items-center justify-between mb-10">
                    <View>
                        <Text className="text-xl font-black text-white uppercase tracking-tight">Safety Buffer</Text>
                        <Text className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Capital Reserves</Text>
                    </View>
                    <View className={`w-14 h-14 rounded-2xl items-center justify-center border border-white/5 shadow-inner ${isSecure ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                        {isSecure ? (
                            <ShieldCheck size={28} color="#10b981" strokeWidth={2.5} />
                        ) : (
                            <AlertTriangle size={28} color="#f43f5e" strokeWidth={2.5} />
                        )}
                    </View>
                </View>

                <View className="space-y-8">
                    <View>
                        <View className="flex-row justify-between items-end mb-4">
                            <Text className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Resilience Index</Text>
                            <Text className="text-lg font-black text-white tracking-tighter">{coverage.toFixed(0)}% Maturity</Text>
                        </View>
                        <View className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1 shadow-inner">
                            <MotiView
                                from={{ width: '0%' }}
                                animate={{ width: `${Math.min(coverage, 100)}%` }}
                                transition={{ type: 'timing', duration: 1000 }}
                                className={`h-full rounded-full ${isSecure ? 'bg-emerald-500' : 'bg-indigo-600 shadow-lg shadow-indigo-600/40'}`}
                            />
                        </View>
                    </View>

                    <View className="flex-row space-x-4">
                        <View className="flex-1 bg-white/5 p-5 rounded-2xl border border-white/5">
                            <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Cycle Cost</Text>
                            <Text className="text-xl font-black text-white tracking-tighter">₹{monthlyExpenses.toLocaleString()}</Text>
                        </View>
                        <View className="flex-1 bg-white/5 p-5 rounded-2xl border border-white/5">
                            <Text className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Asset Gap</Text>
                            <Text className={`text-xl font-black tracking-tighter ${isSecure ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {isSecure ? 'Nominal' : `₹${gap.toLocaleString()}`}
                            </Text>
                        </View>
                    </View>

                    {!isSecure && (
                        <View className="p-6 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20 flex-row items-start space-x-5">
                            <View className="w-10 h-10 bg-indigo-500/20 rounded-xl border border-indigo-500/20 items-center justify-center">
                                <Target size={20} color="#818cf8" strokeWidth={2.5} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Optimization Loop</Text>
                                <Text className="font-bold text-slate-400 text-xs leading-relaxed">
                                    Strategic allocation: close this gap via 5% yield redirection within 4 cycles.
                                </Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => navigation.navigate('FinalPlan')}
                        activeOpacity={0.7}
                        className="w-full flex-row items-center justify-between pt-4 border-t border-white/5 mt-4"
                    >
                        <Text className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Query Logic Mapping</Text>
                        <ArrowRight size={18} color="#475569" strokeWidth={2.5} />
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );
};

export default EmergencyFundCard;
