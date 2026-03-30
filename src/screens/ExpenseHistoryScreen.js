import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { CalendarDays, ChevronRight, ChevronLeft, ChevronDown, Scale, X, Check } from 'lucide-react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';

export default function ExpenseHistoryScreen({ navigation }) {
    const { user } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const [monthsData, setMonthsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryStats, setSummaryStats] = useState({ monthsTracked: 0, avgPerMonth: 0 });

    const [compareMonth1, setCompareMonth1] = useState(null);
    const [compareMonth2, setCompareMonth2] = useState(null);
    const [pickerType, setPickerType] = useState(null);

    const loadHistory = async () => {
        setLoading(true);
        const uid = user?.uid;
        if (!uid) {
            setLoading(false);
            return;
        }

        try {
            const historySnap = await getDocs(collection(db, 'users', uid, 'expenseHistory'));

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            const currentSnap = await getDocs(query(
                collection(db, 'expenses'),
                where('userId', '==', uid),
                where('month', '==', currentMonth),
                where('year', '==', currentYear)
            ));

            const currentExpenses = currentSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            const currentTotal = currentExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);

            const currentMonthObj = {
                id: `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
                monthLabel: now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                month: currentMonth,
                year: currentYear,
                total: currentTotal,
                expenses: currentExpenses,
                isCurrentMonth: true
            };

            const historyMonths = historySnap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                isCurrentMonth: false
            }));

            const allMonths = [currentMonthObj, ...historyMonths].sort((a, b) => {
                if (b.year !== a.year) return b.year - a.year;
                return b.month - a.month;
            });

            setMonthsData(allMonths);

            const totalTracked = allMonths.length;
            const avgPerMonth = totalTracked > 0
                ? Math.round(allMonths.reduce((sum, m) => sum + (m.total || 0), 0) / totalTracked)
                : 0;

            setSummaryStats({
                monthsTracked: totalTracked,
                avgPerMonth: avgPerMonth
            });

        } catch (err) {
            console.error('History load error:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadHistory();
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
            loadHistory();
        }, [])
    );

    const formatMonthId = (id) => {
        if (!id) return 'Select';
        const doc = monthsData.find(h => h.id === id);
        return doc ? doc.monthLabel : 'Select';
    };

    const renderComparisonBar = () => {
        if (monthsData.length < 2) return null;

        let diffDisplay = null;
        if (compareMonth1 && compareMonth2 && compareMonth1 !== compareMonth2) {
            const m1Data = monthsData.find(m => m.id === compareMonth1);
            const m2Data = monthsData.find(m => m.id === compareMonth2);
            
            if (m1Data && m2Data) {
                const diff = m1Data.total - m2Data.total;
                let color = theme.subText;
                let text = "Same spending in both months";

                if (diff < 0) {
                    color = '#10B981';
                    text = `You spent ₹${Math.abs(diff).toLocaleString('en-IN')} less in ${m1Data.monthLabel}`;
                } else if (diff > 0) {
                    color = '#EF4444';
                    text = `You spent ₹${Math.abs(diff).toLocaleString('en-IN')} more in ${m1Data.monthLabel}`;
                }

                diffDisplay = (
                    <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: theme.divider }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText, marginBottom: 6 }}>
                            {m1Data.monthLabel}: ₹{m1Data.total.toLocaleString('en-IN')} vs {m2Data.monthLabel}: ₹{m2Data.total.toLocaleString('en-IN')}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: color }}>
                            {text}
                        </Text>
                    </View>
                );
            }
        }

        return (
            <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Scale size={18} color="#2563EB" style={{ marginRight: 8 }} />
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.text }}>Compare Spending</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => setPickerType('M1')} style={{ flex: 1, backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: compareMonth1 ? theme.text : theme.placeholder }}>{formatMonthId(compareMonth1)}</Text>
                        <ChevronDown size={14} color={theme.subText} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText }}>vs</Text>
                    <TouchableOpacity onPress={() => setPickerType('M2')} style={{ flex: 1, backgroundColor: theme.inputBg, borderRadius: 12, borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: compareMonth2 ? theme.text : theme.placeholder }}>{formatMonthId(compareMonth2)}</Text>
                        <ChevronDown size={14} color={theme.subText} />
                    </TouchableOpacity>
                </View>
                {diffDisplay}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: theme.text, marginLeft: 16 }}>Expense History</Text>
                </View>

                {/* Summary Bar */}
                {monthsData.length > 0 && (
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <View style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#EFF6FF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: isDarkMode ? '#bfdbfe' : '#1e40af' }}>
                                {summaryStats.monthsTracked} months tracked · Avg ₹{Math.round(summaryStats.avgPerMonth).toLocaleString('en-IN')}/month
                            </Text>
                        </View>
                    </View>
                )}

                {/* Month Picker Modal */}
                <Modal visible={!!pickerType} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setPickerType(null)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: theme.modalBg, borderRadius: 20, padding: 24, maxHeight: 400 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>Select Month</Text>
                                        <TouchableOpacity onPress={() => setPickerType(null)}><X size={20} color={theme.subText} /></TouchableOpacity>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {monthsData.map(m => {
                                            const isSelected = pickerType === 'M1' ? compareMonth1 === m.id : compareMonth2 === m.id;
                                            return (
                                                <TouchableOpacity 
                                                    key={m.id} 
                                                    onPress={() => {
                                                        if (pickerType === 'M1') setCompareMonth1(m.id);
                                                        if (pickerType === 'M2') setCompareMonth2(m.id);
                                                        setPickerType(null);
                                                    }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.divider }}
                                                >
                                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: isSelected ? '#2563EB' : theme.text }}>{m.monthLabel}</Text>
                                                    {isSelected && <Check size={18} color="#2563EB" />}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', color: theme.subText, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Loading Archives...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                        {renderComparisonBar()}

                        {monthsData.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', color: theme.subText, fontSize: 13, textAlign: 'center', lineHeight: 22 }}>No history yet.{"\n"}History will appear after your first month completes.</Text>
                            </View>
                        ) : (
                            monthsData.map((monthObj, i) => {
                                const count = monthObj.expenses?.length || 0;
                                const tot = monthObj.total || 0;
                                let colorCode = '#10B981'; // emerald-500
                                if (tot > 20000 && tot <= 25000) colorCode = '#F59E0B'; // amber-500
                                else if (tot > 25000) colorCode = '#EF4444'; // red-500

                                return (
                                    <MotiView key={monthObj.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50 }}>
                                        <TouchableOpacity 
                                            activeOpacity={0.8}
                                            onPress={() => navigation.navigate('ExpenseHistoryDetailScreen', { monthData: monthObj })}
                                            style={{ backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: isDarkMode ? theme.iconBg : '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                                <CalendarDays size={20} color="#2563EB" />
                                            </View>
                                            
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: theme.text }}>{monthObj.monthLabel}</Text>
                                                    {monthObj.isCurrentMonth && (
                                                        <View style={{ backgroundColor: '#DBEAFE', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                                                            <Text style={{ color: '#2563EB', fontSize: 10, fontFamily: 'Poppins-SemiBold' }}>Current</Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>
                                                    {count} expenses · <Text style={{ color: colorCode }}>₹{tot.toLocaleString('en-IN')}</Text> total
                                                </Text>
                                            </View>
                                            
                                            <ChevronRight size={20} color={theme.subText} />
                                        </TouchableOpacity>
                                    </MotiView>
                                );
                            })
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
