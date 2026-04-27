import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, PieChart } from 'lucide-react-native';

const FinancialSummary = ({ navigation }) => {
    return (
        <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-950">
            <View className="px-6 pt-12 pb-24">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mb-8">
                    <ArrowLeft size={24} color="#64748b" />
                </TouchableOpacity>

                <View className="items-center mb-10">
                    <View className="w-16 h-16 bg-emerald-500/10 rounded-2xl items-center justify-center mb-6">
                        <PieChart size={32} color="#10b981" />
                    </View>
                    <Text className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter text-center">Financial Summary</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mt-2 text-center">A comprehensive overview of your current asset allocation.</Text>
                </View>

                {/* Placeholder Content */}
                <View className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Text className="text-lg font-black text-slate-900 dark:text-white mb-4">Portfolio Overview</Text>
                    <Text className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                        This summary encapsulates your liquid capital, invested assets, and liabilities. Regular review of this summary ensures alignment with your Final Plan.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default FinancialSummary;
