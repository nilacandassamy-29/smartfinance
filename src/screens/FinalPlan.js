import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, Map } from 'lucide-react-native';

const FinalPlan = ({ navigation }) => {
    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <View className="px-6 pt-12 pb-24">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
                    <ArrowLeft size={24} color="#64748b" />
                </TouchableOpacity>

                <View className="items-center mb-10">
                    <View className="w-16 h-16 bg-indigo-500/10 rounded-2xl items-center justify-center mb-6">
                        <Map size={32} color="#6366f1" />
                    </View>
                    <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter text-center">Your Final Plan</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-2 text-center">A strategic roadmap tailored to your financial goals.</Text>
                </View>

                {/* Placeholder Content */}
                <View className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">Strategic Execution Plan</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        This document serves as your personalized financial protocol. Please review your goals and timelines carefully. Adjustments can be made through your profile dashboard.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default FinalPlan;
