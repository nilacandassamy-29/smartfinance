import React from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
 ChevronRight, ChevronLeft, ShoppingCart, Zap, Droplets, Flame,
 Wifi, Smartphone, Home, Car, Shield, HeartPulse, GraduationCap,
 CreditCard, Wrench, Youtube, User, MoreHorizontal, Activity, TrendingUp, Info
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const { width } = Dimensions.get('window');

const Step3_Expenses = () => {
 const {
 members, expenses, updateExpenses, totalExpenses, totalIncome,
 setStep, mode
 } = useOnboarding();
 const navigation = useNavigation();

 const expenseCategories = [
 { id: 'groceries', label: 'Ration', icon: <ShoppingCart size={14} />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20', textColor: 'text-emerald-400' },
 { id: 'electricity', label: 'Grid', icon: <Zap size={14} />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20', textColor: 'text-yellow-400' },
 { id: 'water', label: 'Hydro', icon: <Droplets size={14} />, color: 'bg-blue-500/10', border: 'border-blue-500/20', textColor: 'text-blue-400' },
 { id: 'gas', label: 'Thermal', icon: <Flame size={14} />, color: 'bg-orange-500/10', border: 'border-orange-500/20', textColor: 'text-orange-400' },
 { id: 'internet', label: 'Fiber', icon: <Wifi size={14} />, color: 'bg-indigo-500/10', border: 'border-indigo-500/20', textColor: 'text-indigo-400' },
 { id: 'mobile', label: 'Cellular', icon: <Smartphone size={14} />, color: 'bg-slate-500/10', border: 'border-slate-500/20', textColor: 'text-slate-500' },
 { id: 'rent', label: 'Base', icon: <Home size={14} />, color: 'bg-violet-500/10', border: 'border-violet-500/20', textColor: 'text-violet-400' },
 { id: 'transport', label: 'Kinetic', icon: <Car size={14} />, color: 'bg-sky-500/10', border: 'border-sky-500/20', textColor: 'text-sky-400' },
 { id: 'insurance', label: 'Shield', icon: <Shield size={14} />, color: 'bg-rose-500/10', border: 'border-rose-500/20', textColor: 'text-rose-400' },
 { id: 'medical', label: 'Bio', icon: <HeartPulse size={14} />, color: 'bg-red-500/10', border: 'border-red-500/20', textColor: 'text-red-400' },
 { id: 'education', label: 'Scholarly', icon: <GraduationCap size={14} />, color: 'bg-purple-500/10', border: 'border-purple-500/20', textColor: 'text-purple-400' },
 { id: 'loans', label: 'Credit', icon: <CreditCard size={14} />, color: 'bg-zinc-500/10', border: 'border-zinc-500/20', textColor: 'text-zinc-400' },
 { id: 'maintenance', label: 'Repair', icon: <Wrench size={14} />, color: 'bg-amber-500/10', border: 'border-amber-500/20', textColor: 'text-amber-400' },
 { id: 'subscriptions', label: 'Media', icon: <Youtube size={14} />, color: 'bg-red-500/10', border: 'border-red-500/20', textColor: 'text-red-400' },
 { id: 'personal', label: 'Ego', icon: <User size={14} />, color: 'bg-pink-500/10', border: 'border-pink-500/20', textColor: 'text-pink-400' },
 { id: 'miscellaneous', label: 'Entropy', icon: <MoreHorizontal size={14} />, color: 'bg-slate-500/10', border: 'border-slate-500/20', textColor: 'text-slate-500' },
 ];

 const handleInputChange = (id, value) => {
 const val = Math.max(0, Number(value) || 0);
 updateExpenses({ [id]: val });
 };

 const handleNext = () => {
 setStep(4);
 navigation.navigate('Step4_Analysis');
 };

 const isDeficit = totalExpenses > totalIncome;

 return (
 <OnboardingLayout currentStep={3}>
 <View className="mb-10 flex-row items-center justify-between">
 <TouchableOpacity onPress={() => { setStep(2); navigation.navigate('Step2_MemberDetails'); }} className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
 <ChevronLeft size={16} color="#475569" strokeWidth={3} />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Backtrack</Text>
 </TouchableOpacity>
 <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/5 overflow-hidden">
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">
 Cashflow Matrix
 </Text>
 </BlurView>
 </View>

 <View className="mb-12">
 <Text className="text-4xl font-black text-white tracking-tighter uppercase ">
 {mode === 'Family' ? 'Cluster Outflow' : 'Flux Analysis'}
 </Text>
 <Text className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest leading-relaxed">Mapping recurring capital erosion vectors.</Text>
 </View>

 <View className="flex-row flex-wrap gap-4 mb-12">
 {expenseCategories.map((cat, idx) => (
 <MotiView
 key={cat.id}
 from={{ opacity: 0, scale: 0.9, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ delay: idx * 30 }}
 style={{ width: (width - 80) / 2 }}
 className="bg-white/5 p-5 rounded-[1.5rem] border border-white/5 shadow-inner"
 >
 <View className="flex-row items-center space-x-3 mb-4">
 <View className={`w-8 h-8 rounded-lg ${cat.color} items-center justify-center border ${cat.border}`}>
 {React.cloneElement(cat.icon, { color: cat.textColor.includes('text-white') ? '#ffffff' : undefined })}
 </View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">{cat.label}</Text>
 </View>
 <View className="flex-row items-center border-b border-white/5 pb-1">
 <Text className="text-slate-600 font-black text-xs mr-2 uppercase">Amount</Text>
 <TextInput
 className="flex-1 font-black text-xl text-white p-0 "
 keyboardType="numeric"
 placeholder="0"
 placeholderTextColor="rgba(255,255,255,0.1)"
 value={String(expenses[cat.id] || '')}
 onChangeText={(val) => handleInputChange(cat.id, val)}
 />
 </View>
 </MotiView>
 ))}
 </View>

 {/* Premium Reconciliation Hub */}
 <MotiView 
 from={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 500 }}
 className="overflow-hidden rounded-[3rem] border border-white/20 mb-12 shadow-2xl"
 >
 <BlurView intensity={30} tint="dark" className="p-8 bg-slate-900/40">
 <View className="flex-row justify-between mb-8">
 <View>
 <View className="flex-row items-center space-x-2 mb-2">
 <View className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Inflow</Text>
 </View>
 <Text className="text-3xl font-black text-white tracking-tighter">₹{totalIncome.toLocaleString('en-IN')}</Text>
 </View>

 <View className="items-end">
 <View className="flex-row items-center space-x-2 mb-2">
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">Outflow</Text>
 <View className={`w-2 h-2 rounded-full ${isDeficit ? 'bg-rose-500 shadow-rose-500/50' : 'bg-indigo-500 shadow-indigo-500/50'} shadow-lg`} />
 </View>
 <Text className="text-3xl font-black text-white tracking-tighter">₹{totalExpenses.toLocaleString('en-IN')}</Text>
 </View>
 </View>

 <View className={`p-6 rounded-[2rem] border-2 flex-row justify-between items-center ${isDeficit ? 'bg-rose-500/10 border-rose-500/20 shadow-rose-500/10' : 'bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/10'}`}>
 <View className="flex-row items-center space-x-5">
 <View className={`w-12 h-12 rounded-xl items-center justify-center border ${isDeficit ? 'bg-rose-500/20 border-rose-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
 {isDeficit ? <Activity size={24} color="#f43f5e" /> : <TrendingUp size={24} color="#10b981" />}
 </View>
 <View>
 <Text className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-1">
 {isDeficit ? 'Deficit Delta' : 'Net Surplus'}
 </Text>
 <Text className={`text-2xl font-black tracking-tighter ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
 ₹{Math.abs(totalIncome - totalExpenses).toLocaleString('en-IN')}
 </Text>
 </View>
 </View>
 <View className={`px-4 py-2 rounded-xl border ${isDeficit ? 'bg-rose-500/20 border-rose-500/30' : 'bg-emerald-500/20 border-emerald-500/30'}`}>
 <Text className={`text-xs font-black uppercase tracking-widest ${isDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>{isDeficit ? 'CRITICAL' : 'OPTIMAL'}</Text>
 </View>
 </View>
 </BlurView>
 </MotiView>

 <TouchableOpacity
 onPress={handleNext}
 activeOpacity={0.9}
 className="w-full h-18 bg-indigo-600 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl shadow-indigo-600/50 mb-10"
 >
 <Text className="text-white font-black text-xs uppercase tracking-[0.3em] ">Synthesize Intelligence</Text>
 <ChevronRight size={22} color="#ffffff" strokeWidth={3} className="ml-4" />
 </TouchableOpacity>
 </OnboardingLayout>
 );
};

export default Step3_Expenses;
