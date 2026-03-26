import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Users, User, ChevronRight, Minus, Plus, ChevronLeft, Target, Shield, Cpu } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const Step1_FamilySize = () => {
    const { familySize, updateFamilySize, setStep } = useOnboarding();
    const navigation = useNavigation();

    const handleNext = () => {
        setStep(2);
        navigation.navigate('Step2_MemberDetails');
    };

    const adjustSize = (delta) => {
        const newSize = Math.max(1, Math.min(10, familySize + delta));
        updateFamilySize(newSize);
    };

    return (
        <OnboardingLayout currentStep={1}>
            <View className="mb-10">
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Home')} 
                    className="flex-row items-center space-x-3 mb-10"
                >
                    <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
                        <ChevronLeft size={16} color="#64748b" strokeWidth={3} />
                    </View>
                    <Text className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] italic">Abort Node</Text>
                </TouchableOpacity>

                <View className="items-center space-y-6 mb-12">
                    <MotiView
                        from={{ scale: 0.5, opacity: 0, rotate: '-45deg' }}
                        animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
                        className="w-24 h-24 bg-indigo-600/20 rounded-[2rem] items-center justify-center mb-6 border border-indigo-500/30 shadow-2xl shadow-indigo-600/40"
                    >
                        <Users size={40} color="#818cf8" strokeWidth={2.5} />
                    </MotiView>
                    <Text className="text-4xl font-black text-white tracking-tighter text-center uppercase italic">Household Core</Text>
                    <BlurView intensity={10} tint="dark" className="px-6 py-4 rounded-2xl border border-white/5 bg-white/5 mx-4">
                        <Text className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] text-center leading-relaxed">
                            Synchronizing neural mapping based on total capital dependents.
                        </Text>
                    </BlurView>
                </View>

                <View className="items-center space-y-10">
                    <AnimatePresence exitBeforeEnter>
                        {familySize > 1 && (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="flex-row items-center justify-center space-x-10 w-full mb-6"
                            >
                                <TouchableOpacity
                                    onPress={() => adjustSize(-1)}
                                    activeOpacity={0.7}
                                    className="w-16 h-16 rounded-[1.5rem] bg-rose-500/10 items-center justify-center border border-rose-500/20 shadow-xl"
                                >
                                    <Minus size={28} color="#f43f5e" strokeWidth={3} />
                                </TouchableOpacity>
                                
                                <View className="items-center w-24">
                                    <Text className="text-6xl font-black text-white italic tracking-tighter">
                                        {familySize}
                                    </Text>
                                    <Text className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-2">Active Nodes</Text>
                                </View>
                                
                                <TouchableOpacity
                                    onPress={() => adjustSize(1)}
                                    activeOpacity={0.7}
                                    className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 items-center justify-center border border-emerald-500/20 shadow-xl"
                                >
                                    <Plus size={28} color="#10b981" strokeWidth={3} />
                                </TouchableOpacity>
                            </MotiView>
                        )}
                    </AnimatePresence>

                    <View className="flex-row space-x-5 w-full">
                        <TouchableOpacity
                            onPress={() => updateFamilySize(1)}
                            activeOpacity={0.8}
                            className={`flex-1 p-8 rounded-[2.5rem] border-2 items-center flex-col shadow-2xl ${familySize === 1 ? 'bg-indigo-600/20 border-indigo-500 shadow-indigo-600/40' : 'bg-white/5 border-white/5 shadow-inner'}`}
                        >
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-4 ${familySize === 1 ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                <User size={28} color={familySize === 1 ? '#818cf8' : '#475569'} strokeWidth={2.5} />
                            </View>
                            <Text className={`font-black text-xs uppercase tracking-[0.3em] italic ${familySize === 1 ? 'text-white' : 'text-slate-500'}`}>Single</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => updateFamilySize(Math.max(2, familySize))}
                            activeOpacity={0.8}
                            className={`flex-1 p-8 rounded-[2.5rem] border-2 items-center flex-col shadow-2xl ${familySize > 1 ? 'bg-indigo-600/20 border-indigo-500 shadow-indigo-600/40' : 'bg-white/5 border-white/5 shadow-inner'}`}
                        >
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-4 ${familySize > 1 ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                                <Users size={28} color={familySize > 1 ? '#818cf8' : '#475569'} strokeWidth={2.5} />
                            </View>
                            <Text className={`font-black text-xs uppercase tracking-[0.3em] italic ${familySize > 1 ? 'text-white' : 'text-slate-500'}`}>Cluster</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {familySize > 0 && (
                <MotiView
                    from={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12"
                >
                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.9}
                        className="w-full bg-indigo-600 h-16 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl shadow-indigo-600/50"
                    >
                        <Text className="text-white font-black text-xs uppercase tracking-[0.3em] italic">Initialize Cluster Mapping</Text>
                        <ChevronRight size={20} color="#ffffff" strokeWidth={3} className="ml-4" />
                    </TouchableOpacity>
                </MotiView>
            )}
        </OnboardingLayout>
    );
};

export default Step1_FamilySize;
