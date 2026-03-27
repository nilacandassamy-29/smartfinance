import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarDays, ChevronRight, ChevronLeft, ChevronDown, Scale, X, Check } from 'lucide-react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { MotiView } from 'moti';

export default function ExpenseHistoryScreen({ navigation }) {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const [compareM1, setCompareM1] = useState(null);
    const [compareM2, setCompareM2] = useState(null);
    const [pickerType, setPickerType] = useState(null);

    useEffect(() => {
        if (!user) return;
        const fetchHistory = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'users', user.uid, 'expenseHistory'));
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort newest first
                list.sort((a, b) => b.id.localeCompare(a.id));
                setHistory(list);
            } catch (err) { } finally { setLoading(false); }
        };
        fetchHistory();
    }, [user]);

    const formatMonthId = (id) => {
        if (!id) return 'Select';
        const doc = history.find(h => h.id === id);
        return doc ? doc.monthLabel : 'Select';
    };

    const getShortMonthId = (id) => {
        if (!id) return 'Select';
        const [year, month] = id.split('-');
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
    };

    const renderComparisonBar = () => {
        if (history.length < 2) return null;

        let diffDisplay = null;
        if (compareM1 && compareM2 && compareM1 !== compareM2) {
            const m1Data = history.find(h => h.id === compareM1);
            const m2Data = history.find(h => h.id === compareM2);
            
            const t1 = m1Data?.total || 0;
            const t2 = m2Data?.total || 0;
            const diff = t1 - t2; 
            const isLess = diff < 0; // M1 is less than M2
            const absoluteDiff = Math.abs(diff);

            // "Feb 2026: ₹19,350 vs Oct 2025: ₹24,800"
            // "You spent ₹5,450 less in February 👍"
            const short1 = getShortMonthId(compareM1);
            const short2 = getShortMonthId(compareM2);
            const color = isLess ? '#10b981' : '#ef4444';
            const term = isLess ? 'less' : 'more';
            const emoji = isLess ? '👍' : '⚠️';
            const label1 = short1.split(' ')[0]; // "Feb"

            diffDisplay = (
                <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#64748b', marginBottom: 6 }}>
                        {short1}: ₹{t1.toLocaleString('en-IN')} vs {short2}: ₹{t2.toLocaleString('en-IN')}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: color }}>
                        You spent ₹{absoluteDiff.toLocaleString('en-IN')} {term} in {label1} {emoji}
                    </Text>
                </View>
            );
        }

        return (
            <View style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Scale size={18} color="#2563eb" style={{ marginRight: 8 }} />
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#0f172a' }}>Compare Spending</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => setPickerType('M1')} style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: compareM1 ? '#0f172a' : '#94a3b8' }}>{formatMonthId(compareM1)}</Text>
                        <ChevronDown size={14} color="#64748b" />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#94a3b8' }}>vs</Text>
                    <TouchableOpacity onPress={() => setPickerType('M2')} style={{ flex: 1, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: compareM2 ? '#0f172a' : '#94a3b8' }}>{formatMonthId(compareM2)}</Text>
                        <ChevronDown size={14} color="#64748b" />
                    </TouchableOpacity>
                </View>
                {diffDisplay}
            </View>
        );
    };

    const avgTotal = history.length > 0 ? history.reduce((s, h) => s + (h.total || 0), 0) / history.length : 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: '#ffffff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: '#0f172a', marginLeft: 16 }}>Expense History</Text>
                </View>

                {/* Summary Bar */}
                {history.length > 0 && (
                    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                        <View style={{ backgroundColor: '#eff6ff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#1e40af' }}>
                                {history.length} months tracked · Avg ₹{Math.round(avgTotal).toLocaleString('en-IN')}/month
                            </Text>
                        </View>
                    </View>
                )}

                {/* Month Picker Modal */}
                <Modal visible={!!pickerType} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={() => setPickerType(null)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#ffffff', borderRadius: 20, padding: 24, maxHeight: 400 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#0f172a' }}>Select Month</Text>
                                        <TouchableOpacity onPress={() => setPickerType(null)}><X size={20} color="#64748b" /></TouchableOpacity>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {history.map(h => {
                                            const isSelected = pickerType === 'M1' ? compareM1 === h.id : compareM2 === h.id;
                                            return (
                                                <TouchableOpacity 
                                                    key={h.id} 
                                                    onPress={() => {
                                                        if (pickerType === 'M1') setCompareM1(h.id);
                                                        if (pickerType === 'M2') setCompareM2(h.id);
                                                        setPickerType(null);
                                                    }}
                                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                                                >
                                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: isSelected ? '#2563eb' : '#334155' }}>{h.monthLabel}</Text>
                                                    {isSelected && <Check size={18} color="#2563eb" />}
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
                        <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Loading Archives...</Text>
                    </View>
                ) : (
                    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                        {renderComparisonBar()}

                        {history.length === 0 ? (
                            <View style={{ alignItems: 'center', marginTop: 40 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#94a3b8', fontSize: 13, textAlign: 'center', lineHeight: 22 }}>No history yet.{"\n"}History will appear after your first month completes.</Text>
                            </View>
                        ) : (
                            history.map((monthDoc, i) => {
                                const count = Array.isArray(monthDoc.expenses) ? monthDoc.expenses.length : 0;
                                const tot = monthDoc.total || 0;
                                let colorCode = '#10b981'; // emerald-500
                                if (tot > 20000 && tot <= 25000) colorCode = '#eab308'; // yellow-500
                                else if (tot > 25000) colorCode = '#ef4444'; // red-500

                                return (
                                    <MotiView key={monthDoc.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50 }}>
                                        <TouchableOpacity 
                                            activeOpacity={0.8}
                                            onPress={() => navigation.navigate('ExpenseHistoryDetail', { monthDoc })}
                                            style={{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, flexDirection: 'row', alignItems: 'center' }}
                                        >
                                            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                                <CalendarDays size={20} color="#2563eb" />
                                            </View>
                                            
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#0f172a' }}>{monthDoc.monthLabel}</Text>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b', marginTop: 2 }}>
                                                    {count} expenses · <Text style={{ color: colorCode }}>₹{tot.toLocaleString('en-IN')}</Text> total
                                                </Text>
                                            </View>
                                            
                                            <ChevronRight size={20} color="#94a3b8" />
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
