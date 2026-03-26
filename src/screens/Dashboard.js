import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import {
    TrendingUp, TrendingDown, Zap, BarChart3, ChevronRight, 
    LayoutGrid, Bell, Settings as SettingsIcon, Wallet, Target, Download, Filter, 
    ArrowUpRight, Sparkles, AlertCircle
} from 'lucide-react-native';
import { MotiView } from 'moti';
import { calculateFinancialMetrics } from '../utils/financialMetrics';
import { generateFinancialReport } from '../utils/PDFGenerator';
import StatsCard from '../components/common/StatsCard';
import TransactionItem from '../components/common/TransactionItem';
import { GlassCard } from '../components/GlassCard';
import { 
    HealthScoreCard, 
    EmergencyFundCard, 
    ExpenseCharts, 
    SmartInsights 
} from '../components/dashboard';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
    const { userProfile, loading: authLoading } = useAuth();
    const { expenses, loading: expensesLoading } = useExpenses();
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [isExporting, setIsExporting] = useState(false);

    const metrics = calculateFinancialMetrics(expenses, userProfile?.income || 0);

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        try {
            await generateFinancialReport(userProfile, metrics, expenses);
        } catch (error) {
            console.error('Export Failed:', error);
            // Optional: Add an alert here if needed
        } finally {
            setIsExporting(false);
        }
    };

    if (authLoading || (expensesLoading && expenses.length === 0)) {
        return (
            <View className="flex-1 bg-[#050816] items-center justify-center">
                <ActivityIndicator size="large" color="#6366f1" />
                <Text className="text-slate-500 font-grenze-bold text-[10px] uppercase tracking-[0.4em] mt-4">Syncing Matrix...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            {/* Background Glows */}
            <View className="absolute top-0 right-0 w-full h-full">
                <View className="absolute top-[-10%] right-[-20%] w-[100%] h-[60%] bg-indigo-600/10 rounded-full blur-[120px]" />
                <View className="absolute bottom-[-10%] left-[-20%] w-[100%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]" />
            </View>

            <SafeAreaView className="flex-1">
                <ScrollView 
                    className="flex-1" 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {/* Header */}
                    <View className="px-6 pt-8 pb-6 flex-row justify-between items-end">
                        <View>
                            <View className="flex-row items-center gap-2 mb-2">
                                <Text className="text-[10px] font-cinzel-semibold text-slate-500 uppercase tracking-[0.4em]">Main Console</Text>
                                <View className="w-1 h-1 rounded-full bg-slate-800" />
                                <Text className="text-[10px] font-cinzel-semibold text-slate-500 uppercase tracking-[0.4em]">
                                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                </Text>
                            </View>
                            <Text className="text-4xl font-grenze-bold text-white tracking-tighter italic uppercase">Overview</Text>
                        </View>
                        <View className="flex-row gap-3">
                            <TouchableOpacity 
                                onPress={handleDownloadPDF}
                                className="w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center border border-indigo-500/30 shadow-lg shadow-indigo-600/20"
                            >
                                {isExporting ? <ActivityIndicator size="small" color="#fff" /> : <Download size={20} color="#fff" />}
                            </TouchableOpacity>
                            <TouchableOpacity className="w-12 h-12 rounded-2xl bg-white/5 items-center justify-center border border-white/10">
                                <Bell size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* HERO CARD: Total Portfolio Balance */}
                    <View className="px-6 mb-8">
                        <MotiView
                            from={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'timing', duration: 800 }}
                        >
                            <LinearGradient
                                colors={['#4f46e5', '#3b82f6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="rounded-[3rem] p-8 overflow-hidden relative shadow-2xl shadow-indigo-500/50"
                            >
                                <View className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                                
                                <View className="flex-row justify-between items-center mb-10">
                                    <View>
                                        <Text className="text-indigo-100 text-[10px] font-cinzel-semibold uppercase tracking-[0.4em] mb-1">Net Portfolio</Text>
                                        <Text className="text-white text-5xl font-grenze-bold tracking-tight italic">
                                            ₹{metrics.balance.toLocaleString()}
                                        </Text>
                                    </View>
                                    <View className="w-16 h-16 bg-white/20 rounded-[1.5rem] items-center justify-center border border-white/30 backdrop-blur-md">
                                        <Wallet color="#fff" size={32} strokeWidth={2.5} />
                                    </View>
                                </View>

                                <View className="flex-row items-center justify-between pt-6 border-t border-white/20">
                                    <View className="flex-row items-center gap-3">
                                        <View className="px-3 py-1 bg-white/20 rounded-lg border border-white/30">
                                            <Text className="text-white text-[9px] font-grenze-bold uppercase tracking-widest italic">
                                                {metrics.savingsRate.toFixed(1)}% Growth
                                            </Text>
                                        </View>
                                        <View className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/50" />
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => navigation.navigate('Expenses')}
                                        className="flex-row items-center gap-2"
                                    >
                                        <Text className="text-indigo-100 text-[9px] font-cinzel-semibold uppercase tracking-widest italic">View Ledger</Text>
                                        <ArrowUpRight size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </MotiView>
                    </View>

                    {/* QUICK STATS ROWS */}
                    <View className="px-6 flex-row gap-4 mb-10">
                        <StatsCard 
                            title="Monthly Inflow"
                            value={`₹${(userProfile?.income || 0).toLocaleString()}`}
                            icon={<TrendingUp size={20} color="#10b981" strokeWidth={3} />}
                            trend="Stable"
                        />
                        <StatsCard 
                            title="Total Outflow"
                            value={`₹${metrics.totalExpenses.toLocaleString()}`}
                            icon={<TrendingDown size={20} color="#f43f5e" strokeWidth={3} />}
                            trend="-12%"
                            style={{ backgroundColor: 'rgba(244, 63, 94, 0.05)' }}
                        />
                    </View>

                    {/* MAIN DASHBOARD GRID */}
                    <View className="px-6 space-y-8">
                        
                        {/* Health Score Section */}
                        <GlassCard intensity={30}>
                            <HealthScoreCard score={metrics.healthScore} dark />
                        </GlassCard>

                        {/* Analytics Section */}
                        <GlassCard intensity={15}>
                            <View className="flex-row items-center justify-between mb-8">
                                <View>
                                    <Text className="text-sm font-grenze-bold text-white uppercase tracking-widest italic">Capital Flow</Text>
                                    <Text className="text-[9px] font-cinzel-semibold text-slate-500 uppercase tracking-[0.4em] mt-1">Analytics Engine</Text>
                                </View>
                                <View className="flex-row bg-white/5 p-1 rounded-xl border border-white/10">
                                    <TouchableOpacity 
                                        onPress={() => setTimePeriod('monthly')}
                                        className={`px-4 py-1.5 rounded-lg ${timePeriod === 'monthly' ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : ''}`}
                                    >
                                        <Text className={`text-[8px] font-cinzel-bold uppercase tracking-widest ${timePeriod === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Weekly</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => setTimePeriod('quarterly')}
                                        className={`px-4 py-1.5 rounded-lg ${timePeriod === 'quarterly' ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : ''}`}
                                    >
                                        <Text className={`text-[8px] font-cinzel-bold uppercase tracking-widest ${timePeriod === 'quarterly' ? 'text-white' : 'text-slate-500'}`}>Quarter</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ExpenseCharts expenses={expenses} timePeriod={timePeriod} />
                        </GlassCard>

                        {/* Smart Insights Section */}
                        <SmartInsights insights={metrics.insights} />

                        {/* Emergency Fund Tracker */}
                        <EmergencyFundCard 
                            monthlyExpenses={metrics.totalExpenses > 0 ? metrics.totalExpenses : (userProfile?.income || 0) * 0.7}
                            gap={metrics.emergencyGap}
                            coverage={metrics.emergencyCoverage}
                        />

                        {/* Recent Transactions List */}
                        <View>
                            <View className="flex-row items-center justify-between mb-6">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                                    <Text className="text-xl font-grenze-bold text-white uppercase tracking-tight italic">Recent Protocols</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                                    <Text className="text-indigo-400 text-[10px] font-cinzel-semibold uppercase tracking-[0.3em]">Flush Ledger</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {expenses.length > 0 ? (
                                expenses.slice(0, 5).map((expense, idx) => (
                                    <TransactionItem 
                                        key={expense.id || idx} 
                                        item={expense} 
                                        index={idx}
                                    />
                                ))
                            ) : (
                                <View className="py-12 items-center justify-center border border-white/5 border-dashed rounded-[2.5rem] bg-white/5">
                                    <AlertCircle size={32} color="#334155" />
                                    <Text className="text-slate-500 font-cinzel-semibold text-[10px] uppercase tracking-[0.4em] mt-4 italic">No Transaction Protocols</Text>
                                </View>
                            )}
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default Dashboard;
