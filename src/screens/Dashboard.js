import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useInvestments } from '../context/InvestmentContext';
import { useTheme } from '../context/ThemeContext';
import { ArrowUp, ArrowDown, UtensilsCrossed, Wallet, User, Receipt, Car, Zap, ShoppingBag, TrendingDown } from 'lucide-react-native';

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

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning,';
    if (hour >= 12 && hour < 17) return 'Good afternoon,';
    if (hour >= 17 && hour < 21) return 'Good evening,';
    return 'Good night,';
};

export default function Dashboard({ navigation }) {
    const { userProfile, profileImageURL } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const { expenses, monthlyTotal, getLastMonthTotal, loading: expensesLoading } = useExpenses();
    const { monthlyIncome } = useIncome();
    const { totalPortfolioValue, loading: investmentsLoading } = useInvestments();

    const [percentageChange, setPercentageChange] = useState(null);
    const [greeting, setGreeting] = useState(getGreeting());

    useEffect(() => {
        setGreeting(getGreeting());
        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchChange = async () => {
            const last = await getLastMonthTotal();
            if (last === 0) {
                setPercentageChange(null);
            } else {
                setPercentageChange(((monthlyTotal - last) / last) * 100);
            }
        };
        fetchChange();
    }, [monthlyTotal, getLastMonthTotal]);

    const recentTransactions = [...expenses]
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      })
      .slice(0, 4);

    // Dynamic portfolio = Income - Expenses (updates instantly)
    const dynamicPortfolio = Math.max(0, (monthlyIncome || 0) - (monthlyTotal || 0));

    let badgeText = "New";
    let badgeColor = isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.2)';

    if (percentageChange !== null) {
        if (percentageChange < 0) {
            badgeText = `${percentageChange.toFixed(1)}%`;
            badgeColor = 'rgba(16,185,129,0.3)';
        } else {
            badgeText = `+${percentageChange.toFixed(1)}%`;
            badgeColor = 'rgba(239,68,68,0.3)';
        }
    }

    // Loading skeleton component
    const Skeleton = ({ w = 100, h = 18, radius = 8 }) => (
        <View style={{ width: w, height: h, borderRadius: radius, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : '#E2E8F0' }} />
    );

    const isLoadingData = expensesLoading || investmentsLoading;

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}>
                    
                    {/* Header */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24 }}>
                        <View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText }}>{greeting}</Text>
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 22, color: theme.text }}>{userProfile?.name || 'Investor'}</Text>
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
                    <View style={{ backgroundColor: isDarkMode ? '#1D4ED8' : '#2563eb', borderRadius: 20, padding: 24, marginTop: 20, width: '100%', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Total Portfolio Value</Text>
                        {isLoadingData ? (
                            <View style={{ width: 160, height: 38, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.28)', marginVertical: 6 }} />
                        ) : (
                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 32, color: '#ffffff', marginVertical: 4 }}>
                                ₹{dynamicPortfolio.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Text>
                        )}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <View style={{ backgroundColor: badgeColor, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 }}>
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#ffffff' }}>
                                    {badgeText}
                                </Text>
                            </View>
                            {percentageChange !== null && (
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>vs last month</Text>
                            )}
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                        <View style={{ flex: 1, backgroundColor: theme.card, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : '#ecfdf5', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowUp size={18} color="#10b981" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 8 }}>Monthly In</Text>
                            {isLoadingData ? (
                                <View style={{ width: 80, height: 24, borderRadius: 6, backgroundColor: isDarkMode ? '#334155' : '#E2E8F0', marginTop: 4 }} />
                            ) : (
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>₹{(monthlyIncome || 0).toLocaleString('en-IN')}</Text>
                            )}
                        </View>

                        <View style={{ flex: 1, backgroundColor: theme.card, borderRadius: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2', alignItems: 'center', justifyContent: 'center' }}>
                                <ArrowDown size={18} color="#ef4444" />
                            </View>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 8 }}>Monthly Out</Text>
                            {isLoadingData ? (
                                <View style={{ width: 80, height: 24, borderRadius: 6, backgroundColor: isDarkMode ? '#334155' : '#E2E8F0', marginTop: 4 }} />
                            ) : (
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.danger }}>₹{(monthlyTotal || 0).toLocaleString('en-IN')}</Text>
                            )}
                        </View>
                    </View>

                    {/* Recent Transactions Section */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: theme.text }}>Recent Transactions</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#2563eb' }}>See all</Text>
                        </TouchableOpacity>
                    </View>

                    {recentTransactions.length > 0 ? (
                        <View style={{ gap: 8 }}>
                            {recentTransactions.map((exp, i) => {
                                const catDetails = getCategoryDetails(exp.category);
                                return (
                                    <View key={exp.id || i} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: theme.card, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                                        <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: isDarkMode ? theme.iconBg : catDetails.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                            {catDetails.icon}
                                        </View>
                                        <View style={{ flex: 1, marginRight: 8, overflow: 'hidden' }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }} numberOfLines={1}>{exp.title}</Text>
                                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, textTransform: 'capitalize' }} numberOfLines={1}>{exp.category}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: theme.danger, flexShrink: 0 }} numberOfLines={1}>
                                            −₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center', backgroundColor: theme.card, borderRadius: 14, paddingVertical: 32, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 }}>
                            <Receipt size={32} color={theme.subText} style={{ marginBottom: 10 }} />
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>No transactions yet</Text>
                        </View>
                    )}

                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
