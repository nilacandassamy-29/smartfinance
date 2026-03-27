import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useInvestments } from '../context/InvestmentContext';
import { ArrowUp, ArrowDown, UtensilsCrossed, Wallet, User, Receipt, Car, Zap, ShoppingBag } from 'lucide-react-native';

export const getCategoryDetails = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('foof')) return { bg: '#fff7ed', icon: <UtensilsCrossed size={20} color="#f97316" /> };
    if (cat.includes('general')) return { bg: '#eff6ff', icon: <Wallet size={20} color="#3b82f6" /> };
    if (cat.includes('personal')) return { bg: '#faf5ff', icon: <User size={20} color="#a855f7" /> };
    if (cat.includes('transport')) return { bg: '#f0f9ff', icon: <Car size={20} color="#0ea5e9" /> };
    if (cat.includes('bill')) return { bg: '#fefce8', icon: <Zap size={20} color="#eab308" /> };
    if (cat.includes('shop')) return { bg: '#fdf2f8', icon: <ShoppingBag size={20} color="#ec4899" /> };
    return { bg: '#f8fafc', icon: <Receipt size={20} color="#64748b" /> };
};

export default function Dashboard({ navigation }) {
    const { userProfile, profileImageURL } = useAuth();
    const { expenses, getLastMonthTotal } = useExpenses();
    const { monthlyIncome } = useIncome();
    const { totalPortfolioValue } = useInvestments();

    const [percentageChange, setPercentageChange] = useState(0);
    const [lastMonthData, setLastMonthData] = useState(0);

    const monthlyOut = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);

    useEffect(() => {
        const fetchChange = async () => {
            const last = await getLastMonthTotal();
            setLastMonthData(last);
            if (last === 0) setPercentageChange(0);
            else setPercentageChange(((monthlyOut - last) / last) * 100);
        };
        fetchChange();
    }, [monthlyOut, getLastMonthTotal]);

    const recentTransactions = expenses.slice(0, 4);
    const sign = percentageChange >= 0 ? '+' : '';
    const badgeColor = percentageChange <= 0 ? '#10b981' : '#ef4444'; // Negative spending = good (emerald)

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}>
                    
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#64748b' }}>Good morning,</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: '#0f172a' }}>{userProfile?.name || 'Investor'}</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Profile')}
                            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                        >
                            {profileImageURL ? (
                                <Image source={{ uri: profileImageURL }} style={{ width: 44, height: 44, borderRadius: 22 }} />
                            ) : (
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#ffffff' }}>{(userProfile?.name || 'U').charAt(0)}</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Portfolio Card */}
                    <View style={{ backgroundColor: '#2563eb', borderRadius: 20, padding: 24, marginTop: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Total Portfolio Value</Text>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 32, color: '#ffffff', marginVertical: 4 }}>
                            ₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <View style={{ backgroundColor: badgeColor, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#ffffff' }}>
                                    {lastMonthData === 0 ? 'No data' : `${sign}${percentageChange.toFixed(1)}%`}
                                </Text>
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>vs last month</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowUp size={18} color="#10b981" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b', marginTop: 8 }}>Monthly In</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#0f172a' }}>₹{monthlyIncome.toLocaleString('en-IN')}</Text>
                        </View>

                        <View style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowDown size={18} color="#ef4444" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b', marginTop: 8 }}>Monthly Out</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: '#ef4444' }}>₹{monthlyOut.toLocaleString('en-IN')}</Text>
                        </View>
                    </View>

                    {/* Recent Transactions Section */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#0f172a' }}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#2563eb' }}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {recentTransactions.length > 0 ? (
                        <View style={{ gap: 8 }}>
                            {recentTransactions.map((exp, i) => {
                                const catDetails = getCategoryDetails(exp.category);
                                return (
                                    <View key={exp.id || i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                                        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: catDetails.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                            {catDetails.icon}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#0f172a' }}>{exp.title}</Text>
                                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{exp.category}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#ef4444' }}>
                                            -₹{parseFloat(exp.amount).toFixed(0)}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 32, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <Receipt size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#64748b' }}>No transactions yet</Text>
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
