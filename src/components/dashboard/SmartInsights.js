import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { Sparkles, TrendingUp, AlertCircle, Info, ArrowUpRight, AlertTriangle, ShieldAlert, FileText, ChevronRight } from 'lucide-react-native';
import { MotiView } from 'moti';
import { GlassCard } from '../GlassCard';

const SmartInsights = ({ insights = [] }) => {
 const getInsightIcon = (type) => {
 switch (type) {
 case 'positive': return <TrendingUp size={20} color="#10b981" strokeWidth={3} />;
 case 'warning': return <AlertCircle size={20} color="#f43f5e" strokeWidth={3} />;
 case 'alert': return <AlertTriangle size={20} color="#f59e0b" strokeWidth={3} />;
 case 'critical': return <ShieldAlert size={20} color="#a855f7" strokeWidth={3} />;
 case 'info': return <Info size={20} color="#818cf8" strokeWidth={3} />;
 default: return <Sparkles size={20} color="#818cf8" strokeWidth={3} />;
 }
 };

 const getInsightGlow = (type) => {
 switch (type) {
 case 'positive': return 'bg-emerald-500/15';
 case 'warning': return 'bg-rose-500/15';
 case 'alert': return 'bg-amber-500/15';
 case 'critical': return 'bg-purple-500/15';
 case 'info': return 'bg-blue-500/15';
 default: return 'bg-indigo-500/15';
 }
 };

 return (
 <View className="mb-10">
 <View className="flex-row items-center justify-between mb-8 px-2">
 <View className="flex-row items-center gap-4">
 <View className="w-12 h-12 bg-indigo-600 rounded-2xl items-center justify-center shadow-2xl shadow-indigo-600/40 border border-white/20">
 <Sparkles size={24} color="#ffffff" strokeWidth={2.5} />
 </View>
 <View>
 <Text className="text-2xl font-black text-white uppercase tracking-tight ">AI Advisor</Text>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mt-1 ">Cognitive Wealth Engine</Text>
 </View>
 </View>
 <TouchableOpacity className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center border border-white/10">
 <ChevronRight size={18} color="#475569" />
 </TouchableOpacity>
 </View>

 {insights.length > 0 ? (
 insights.map((insight, index) => (
 <MotiView
 key={index}
 from={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: index * 100, type: 'timing', duration: 400 }}
 className="mb-5"
 >
 <GlassCard intensity={15} style={{ padding: 24, paddingVertical: 28 }}>
 <View className="flex-row items-start gap-6">
 <View className={`w-14 h-14 rounded-2xl items-center justify-center border border-white/5 ${getInsightGlow(insight.type)} shadow-inner`}>
 {getInsightIcon(insight.type)}
 </View>
 <View className="flex-1">
 <View className="flex-row justify-between items-start mb-3">
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] ">{insight.category || 'Core Registry'}</Text>
 <ArrowUpRight size={16} color="#475569" />
 </View>
 <Text className="text-sm leading-[22px] font-bold text-white leading-relaxed pr-4 mb-4">
 {insight.text}
 </Text>
 <View className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
 <View className={`h-full w-2/3 rounded-full ${getInsightGlow(insight.type)} shadow-lg`} />
 </View>
 </View>
 </View>
 </GlassCard>
 </MotiView>
 ))
 ) : (
 <View className="bg-white/5 border border-white/10 border-dashed rounded-[3rem] py-16 items-center justify-center">
 <View className="w-20 h-20 bg-white/5 rounded-[2.5rem] items-center justify-center mb-6 border border-white/5">
 <Info size={32} color="#334155" />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.4em] mb-2">Heuristic Scan Complete</Text>
 <Text className="text-slate-600 text-xs font-black uppercase tracking-widest ">No anomalies detected in current cycle</Text>
 </View>
 )}

 <TouchableOpacity
 activeOpacity={0.8}
 className="w-full mt-6 h-20 rounded-[2.5rem] bg-indigo-600/5 items-center justify-center flex-row gap-4 border border-indigo-500/10 shadow-2xl shadow-indigo-600/5 mb-4"
 >
 <FileText size={20} color="#818cf8" strokeWidth={2.5} />
 <Text className="text-indigo-400 text-xs font-black uppercase tracking-[0.4em] ">Initialize Deep Audit</Text>
 </TouchableOpacity>
 </View>
 );
};

export default SmartInsights;
