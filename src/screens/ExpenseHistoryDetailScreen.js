import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Receipt } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import * as Icons from 'lucide-react-native';

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase().trim();
  if (cat === 'food' || cat === 'foof') return { icon: 'UtensilsCrossed', bg: '#FFF7ED', color: '#F97316' };
  if (cat === 'bills' || cat === 'utilities') return { icon: 'Zap', bg: '#FEFCE8', color: '#EAB308' };
  if (cat === 'transport') return { icon: 'Car', bg: '#F0F9FF', color: '#0EA5E9' };
  if (cat === 'personal' || cat === 'personal care') return { icon: 'User', bg: '#F5F3FF', color: '#8B5CF6' };
  if (cat === 'shopping') return { icon: 'ShoppingBag', bg: '#FDF2F8', color: '#EC4899' };
  if (cat === 'rent' || cat === 'rent/emi' || cat === 'emi') return { icon: 'Home', bg: '#EFF6FF', color: '#2563EB' };
  if (cat === 'subscriptions' || cat === 'subscription') return { icon: 'CreditCard', bg: '#F0FDF4', color: '#16A34A' };
  if (cat === 'health' || cat === 'medical') return { icon: 'Heart', bg: '#FFF1F2', color: '#F43F5E' };
  if (cat === 'education') return { icon: 'GraduationCap', bg: '#FFFBEB', color: '#D97706' };
  if (cat === 'general' || cat === 'miscellaneous') return { icon: 'Wallet', bg: '#EFF6FF', color: '#3B82F6' };
  return { icon: 'Receipt', bg: '#F8FAFC', color: '#64748B' };
};

const formatAmount = (amount) => {
  const num = parseFloat(amount) || 0;
  return '-₹' + num.toLocaleString('en-IN');
};

const formatExpenseDate = (expense) => {
  try {
    if (expense.date && typeof expense.date === 'string' && expense.date !== 'undefined') {
      if (!expense.date.includes('NaN')) return expense.date;
    }
    if (expense.createdAt?.toDate) {
      return expense.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    if (expense.createdAt instanceof Date) {
      return expense.createdAt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return 'No date';
  }
};

export default function ExpenseHistoryDetailScreen({ route, navigation }) {
    const { monthData } = route.params || {};
    const { theme, isDarkMode } = useTheme();

    const expenses = monthData?.expenses || [];
    
    // Sort expenses by date descending
    const sortedExpenses = [...expenses].sort((a,b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    // Calculate Category Breakdown
    const categoryTotals = useMemo(() => {
        const acc = {};
        expenses.forEach(exp => {
            const cat = exp.category || 'General';
            acc[cat] = (acc[cat] || 0) + (parseFloat(exp.amount) || 0);
        });
        return Object.entries(acc)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5); // top 5
    }, [expenses]);

    const totalSpent = monthData?.total || 0;

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
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>{monthData?.monthLabel}</Text>
                        {monthData?.isCurrentMonth && (
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#2563EB' }}>Current Month</Text>
                        )}
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                    
                    {/* Summary Card */}
                    <View style={{ backgroundColor: '#2563EB', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#ffffff' }}>Total Spent</Text>
                        <Text style={{ fontFamily: 'Poppins-ExtraBold', fontSize: 28, color: '#ffffff', marginVertical: 4 }}>
                            ₹{totalSpent.toLocaleString('en-IN')}
                        </Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#ffffff', opacity: 0.8 }}>
                            {expenses.length} expenses · {monthData?.monthLabel}
                        </Text>
                    </View>

                    {/* Category Breakdown */}
                    {categoryTotals.length > 0 && (
                        <View style={{ backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.text, marginBottom: 16 }}>Category Breakdown</Text>
                            {categoryTotals.map((cat, i) => {
                                const { icon, color, bg } = getCategoryIcon(cat.name);
                                const IconComp = Icons[icon] || Icons['Receipt'];
                                const pct = totalSpent > 0 ? (cat.amount / totalSpent) * 100 : 0;
                                return (
                                    <View key={i} style={{ marginBottom: 16 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                            <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                                                <IconComp size={16} color={color} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: theme.text }}>{cat.name}</Text>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: theme.subText }}>{pct.toFixed(1)}%</Text>
                                            </View>
                                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 13, color: theme.text }}>
                                                ₹{cat.amount.toLocaleString('en-IN')}
                                            </Text>
                                        </View>
                                        <View style={{ height: 6, backgroundColor: isDarkMode ? '#334155' : '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                                            <View style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 3 }} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* All Expenses List */}
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.text, marginBottom: 12 }}>All Expenses</Text>
                    
                    {sortedExpenses.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Receipt size={48} color={theme.subText} />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text, marginTop: 12 }}>No expenses recorded for this month</Text>
                        </View>
                    ) : (
                        sortedExpenses.map((exp, i) => {
                            const { icon, color, bg } = getCategoryIcon(exp.category);
                            const IconComp = Icons[icon] || Icons['Receipt'];
                            return (
                                <View key={exp.id || i} style={{
                                    flexDirection: 'row', alignItems: 'center', padding: 14,
                                    backgroundColor: theme.card, borderRadius: 12, marginBottom: 8,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1
                                }}>
                                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                                        <IconComp size={18} color={color} />
                                    </View>
                                    <View style={{ flex: 1, marginRight: 8, overflow: 'hidden' }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }} numberOfLines={1} ellipsizeMode="tail">{exp.title}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: theme.subText }} numberOfLines={1} ellipsizeMode="tail">{exp.category}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: theme.subText, marginTop: 2 }} numberOfLines={1}>{formatExpenseDate(exp)}</Text>
                                    </View>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#EF4444', textAlign: 'right', flexShrink: 0, minWidth: 80 }} numberOfLines={1}>
                                        {formatAmount(exp.amount)}
                                    </Text>
                                </View>
                            );
                        })
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
