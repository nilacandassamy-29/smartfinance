import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Activity, Zap, ShieldCheck, Heart } from 'lucide-react-native';
import { MotiView } from 'moti';

const HealthScoreCard = ({ score, dark }) => {
 const getScoreColor = (s) => {
 if (s >= 80) return '#10b981';
 if (s >= 60) return '#f59e0b';
 return '#f43f5e';
 };

 const getScoreLabel = (s) => {
 if (s >= 80) return 'Optimal Performance';
 if (s >= 60) return 'Operational Stability';
 return 'Critical Calibration Required';
 };

 const color = getScoreColor(score);

 return (
 <View className="relative">
 <View className="flex-row items-center justify-between mb-8">
 <View className="flex-row items-center space-x-4">
 <View className="w-12 h-12 rounded-2xl bg-indigo-500/10 items-center justify-center border border-indigo-500/20">
 <Activity size={24} color="#818cf8" strokeWidth={2.5} />
 </View>
 <View>
 <Text className="text-xl font-black text-white uppercase tracking-tight">Bio-Metric Score</Text>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Capital Health Index</Text>
 </View>
 </View>
 <View className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
 <Text className="text-xs font-black text-white uppercase tracking-widest">{score}% Efficiency</Text>
 </View>
 </View>

 <View className="items-center justify-center py-6">
 <View className="w-40 h-40 rounded-full border-[10px] border-white/5 items-center justify-center relative">
 <MotiView
 from={{ rotate: '0deg' }}
 animate={{ rotate: `${(score / 100) * 360}deg` }}
 transition={{ type: 'timing', duration: 1000 }}
 className="absolute inset-x-[-10px] inset-y-[-10px] items-center"
 >
 <View style={{ backgroundColor: color }} className="w-6 h-6 rounded-full border-4 border-slate-950 shadow-lg" />
 </MotiView>
 <View className="items-center">
 <Text style={{ color }} className="text-6xl font-black tracking-tighter ">{score}</Text>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Alpha Yield</Text>
 </View>
 </View>
 </View>

 <View className="mt-8 flex-row items-center justify-center space-x-3">
 <Heart size={16} color={color} fill={color} />
 <Text className="text-xs font-black text-white uppercase tracking-widest">{getScoreLabel(score)}</Text>
 </View>
 </View>
 );
};

export default HealthScoreCard;
