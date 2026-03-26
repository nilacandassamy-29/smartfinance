import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GlassCard } from '../GlassCard';

const StatsCard = ({ title, value, icon, trend, style }) => (
    <TouchableOpacity activeOpacity={0.8} className="flex-1">
        <GlassCard intensity={15} style={[{ padding: 24 }, style]}>
            <View className="flex-row items-center justify-between mb-5">
                <View className="w-12 h-12 bg-white/5 rounded-2xl items-center justify-center border border-white/10 shadow-inner">
                    {icon}
                </View>
                {trend && (
                    <View className={`px-2.5 py-1 rounded-lg border ${trend.startsWith('+') || trend === 'Stable' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
                        <Text className={`text-[9px] font-cinzel-bold italic ${trend.startsWith('+') || trend === 'Stable' ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</Text>
                    </View>
                )}
            </View>
            <View>
                <Text className="text-slate-500 text-[10px] font-cinzel-bold uppercase tracking-[0.3em] mb-2 italic">{title}</Text>
                <Text className="text-white text-3xl font-grenze-bold tracking-tighter italic uppercase">{value}</Text>
            </View>
        </GlassCard>
    </TouchableOpacity>
);

export default StatsCard;
