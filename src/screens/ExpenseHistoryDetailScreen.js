import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import TransactionItem from '../components/common/TransactionItem';
import { useTheme } from '../context/ThemeContext';

export default function ExpenseHistoryDetailScreen({ navigation, route }) {
    const { monthDoc } = route.params;
    const { theme, isDarkMode } = useTheme();

    if (!monthDoc) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontFamily: 'Poppins-Medium' }}>Error loading history data</Text>
            </SafeAreaView>
        );
    }

    const { monthLabel, total, expenses } = monthDoc;

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>{monthLabel}</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText, marginTop: -2 }}>
                            ₹{Number(total).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total Spent
                        </Text>
                    </View>
                </View>

                {/* Ledger View */}
                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
                    {(!expenses || expenses.length === 0) ? (
                        <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>No transactions recorded for this month.</Text>
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
