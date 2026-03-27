import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import TransactionItem from '../components/common/TransactionItem';

export default function ExpenseHistoryDetailScreen({ navigation, route }) {
    const { monthDoc } = route.params;

    if (!monthDoc) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Error loading history data</Text>
            </SafeAreaView>
        );
    }

    const { monthLabel, total, expenses } = monthDoc;

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: '#ffffff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color="#0f172a" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#0f172a' }}>{monthLabel}</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#64748b', marginTop: -2 }}>
                            ₹{Number(total).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total Spent
                        </Text>
                    </View>
                </View>

                {/* Ledger View */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
                    {(!expenses || expenses.length === 0) ? (
                        <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#64748b' }}>No transactions recorded for this month.</Text>
                        </View>
                    ) : (
                        expenses.map((exp, i) => (
                            <MotiView key={exp.id || i} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                                <TransactionItem item={exp} />
                            </MotiView>
                        ))
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
