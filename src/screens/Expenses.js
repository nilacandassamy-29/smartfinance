import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, TextInput, FlatList,
    ActivityIndicator, KeyboardAvoidingView, Platform, Alert, StatusBar, SafeAreaView
} from 'react-native';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import {
    Plus, Search, ArrowUpRight, ArrowDownLeft, Briefcase, Trash2, X, Wallet, TrendingUp, TrendingDown
} from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { calculateFinancialMetrics } from '../utils/financialMetrics';
import { Picker } from '@react-native-picker/picker';
import FeatureTag from '../components/common/FeatureTag';

const Expenses = () => {
    const { userProfile } = useAuth();
    const { expenses, addExpense, deleteExpense, loading } = useExpenses();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Technology',
        date: new Date().toISOString().split('T')[0]
    });

    const metrics = calculateFinancialMetrics(expenses, userProfile?.income || 0);

    const handleCommit = async () => {
        if (!formData.description || !formData.amount) {
            Alert.alert('Protocol Error', 'Data fields required for initialization.');
            return;
        }
        setIsSubmitting(true);
        try {
            await addExpense({
                description: formData.description,
                amount: Number(formData.amount),
                type: formData.type,
                category: formData.category,
                date: formData.date
            });
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: 'Technology',
                date: new Date().toISOString().split('T')[0]
            });
            setShowForm(false);
        } catch (error) {
            Alert.alert('System Error', error.message || 'Transmission failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredExpenses = expenses.filter(ex =>
        ex.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderHeader = () => (
        <View>
            {/* Page Header */}
            <View className="px-6 pt-10 pb-6">
                <FeatureTag text="Cashflow Hub" subText="Matrix" />
                <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase mb-1">
                    {'Protocol\nLedger'}
                </Text>
                <Text className="text-slate-500 font-cinzel text-xs mb-6 uppercase tracking-widest">
                    Record your capital flow with absolute precision.
                </Text>

                <TouchableOpacity
                    onPress={() => setShowForm(prev => !prev)}
                    activeOpacity={0.8}
                    style={{
                        height: 56, backgroundColor: '#4f46e5', borderRadius: 20,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
                        borderWidth: 1, borderColor: 'rgba(99,102,241,0.3)'
                    }}
                >
                    {showForm ? (
                        <>
                            <X size={20} color="#fff" strokeWidth={3} />
                            <Text style={{ color: '#fff', fontFamily: 'Cinzel-Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>Abort</Text>
                        </>
                    ) : (
                        <>
                            <Plus size={20} color="#fff" strokeWidth={3} />
                            <Text style={{ color: '#fff', fontFamily: 'Cinzel-Bold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2 }}>New Entry</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* Summary Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingHorizontal: 24, marginBottom: 32 }}
                contentContainerStyle={{ gap: 16 }}
            >
                <SummaryCard
                    title="Net Balance"
                    amount={`₹${metrics.balance.toLocaleString()}`}
                    status={metrics.balance >= 0 ? 'SURPLUS' : 'DEFICIT'}
                    icon={<Wallet size={18} color="#fff" />}
                    isPrimary
                />
                <SummaryCard
                    title="Monthly Revenue"
                    amount={`₹${metrics.income.toLocaleString()}`}
                    status="ACTIVE"
                    icon={<TrendingUp size={18} color="#10b981" />}
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={`₹${metrics.expenses.toLocaleString()}`}
                    status="TRACKED"
                    icon={<TrendingDown size={18} color="#f43f5e" />}
                />
            </ScrollView>

            {/* Add Form */}
            <AnimatePresence>
                {showForm && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        exit={{ opacity: 0, translateY: -20 }}
                        style={{
                            marginHorizontal: 24,
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 40, padding: 28, marginBottom: 32
                        }}
                    >
                        <Text style={{ color: '#fff', fontFamily: 'GrenzeGotisch-Bold', fontSize: 14, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24 }}>
                            New Transaction Protocol
                        </Text>

                        <FormLabel label="Asset Description" />
                        <TextInput
                            value={formData.description}
                            onChangeText={text => setFormData({ ...formData, description: text })}
                            placeholder="e.g. AWS Subscription, Groceries..."
                            placeholderTextColor="#475569"
                            style={inputStyle}
                        />

                        <FormLabel label="Capital Value (₹)" />
                        <TextInput
                            value={formData.amount}
                            onChangeText={text => setFormData({ ...formData, amount: text })}
                            placeholder="0.00"
                            keyboardType="numeric"
                            placeholderTextColor="#475569"
                            style={[inputStyle, { height: 64, fontSize: 24, fontFamily: 'GrenzeGotisch-Bold' }]}
                        />

                        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
                            <View style={{ flex: 1 }}>
                                <FormLabel label="Flow Type" />
                                <View style={pickerStyle}>
                                    <Picker
                                        selectedValue={formData.type}
                                        onValueChange={val => setFormData({ ...formData, type: val })}
                                        dropdownIconColor="#818cf8"
                                        style={{ color: '#fff', flex: 1 }}
                                    >
                                        <Picker.Item label="Expense" value="expense" />
                                        <Picker.Item label="Income" value="income" />
                                    </Picker>
                                </View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FormLabel label="Sector" />
                                <View style={pickerStyle}>
                                    <Picker
                                        selectedValue={formData.category}
                                        onValueChange={val => setFormData({ ...formData, category: val })}
                                        dropdownIconColor="#818cf8"
                                        style={{ color: '#fff', flex: 1 }}
                                    >
                                        <Picker.Item label="Technology" value="Technology" />
                                        <Picker.Item label="Rent" value="Rent" />
                                        <Picker.Item label="Salary" value="Salary" />
                                        <Picker.Item label="Food" value="Food" />
                                        <Picker.Item label="Entertainment" value="Entertainment" />
                                        <Picker.Item label="Groceries" value="Groceries" />
                                        <Picker.Item label="Other" value="Other" />
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleCommit}
                            disabled={isSubmitting}
                            style={{
                                height: 56, backgroundColor: '#4f46e5', borderRadius: 20,
                                alignItems: 'center', justifyContent: 'center',
                                borderWidth: 1, borderColor: 'rgba(99,102,241,0.3)',
                                opacity: isSubmitting ? 0.7 : 1
                            }}
                        >
                            {isSubmitting
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={{ fontFamily: 'Cinzel-Bold', color: '#fff', fontSize: 11, textTransform: 'uppercase', letterSpacing: 3 }}>Initialize Entry</Text>
                            }
                        </TouchableOpacity>
                    </MotiView>
                )}
            </AnimatePresence>

            {/* Search Bar */}
            <View style={{ marginHorizontal: 24, marginBottom: 24 }}>
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 20, height: 48, paddingHorizontal: 16
                }}>
                    <Search size={16} color="#475569" />
                    <TextInput
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Scan entries..."
                        placeholderTextColor="#475569"
                        style={{ flex: 1, marginLeft: 12, color: '#fff', fontSize: 14, fontFamily: 'Cinzel-Regular' }}
                    />
                    {searchTerm.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchTerm('')}>
                            <X size={14} color="#475569" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Section Header */}
            <View style={{ paddingHorizontal: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 4, height: 20, backgroundColor: '#4f46e5', borderRadius: 2 }} />
                <Text style={{ fontFamily: 'GrenzeGotisch-Bold', color: '#fff', fontSize: 15, textTransform: 'uppercase', letterSpacing: 3 }}>Protocol Log</Text>
                <View style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 8 }} />
                <Text style={{ color: '#475569', fontSize: 10, fontFamily: 'Cinzel-Bold', textTransform: 'uppercase', letterSpacing: 2 }}>
                    {filteredExpenses.length} entries
                </Text>
            </View>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <MotiView
            from={{ opacity: 0, translateX: -10 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 40 }}
            style={{
                marginHorizontal: 24, marginBottom: 12,
                backgroundColor: 'rgba(255,255,255,0.04)',
                borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
                borderRadius: 28, padding: 20,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 }}>
                <View style={{
                    width: 48, height: 48, borderRadius: 16,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: item.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
                }}>
                    {item.type === 'income'
                        ? <ArrowDownLeft size={20} color="#10b981" strokeWidth={2.5} />
                        : <ArrowUpRight size={20} color="#f43f5e" strokeWidth={2.5} />
                    }
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'GrenzeGotisch-Bold', color: '#fff', fontSize: 15, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {item.description}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 6 }}>
                        <Text style={{ color: '#818cf8', fontSize: 10, fontFamily: 'Cinzel-Bold', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            {item.category}
                        </Text>
                        <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#334155' }} />
                        <Text style={{ color: '#475569', fontSize: 10, fontFamily: 'Cinzel-Regular' }}>{item.date}</Text>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <Text style={{
                    fontFamily: 'GrenzeGotisch-Bold', fontSize: 16, fontStyle: 'italic', letterSpacing: -0.5,
                    color: item.type === 'income' ? '#10b981' : '#fff'
                }}>
                    {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                </Text>
                <TouchableOpacity
                    onPress={() => deleteExpense(item.id)}
                    style={{
                        width: 32, height: 32, borderRadius: 10,
                        backgroundColor: 'rgba(244,63,94,0.1)',
                        borderWidth: 1, borderColor: 'rgba(244,63,94,0.2)',
                        alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Trash2 size={14} color="#f43f5e" />
                </TouchableOpacity>
            </View>
        </MotiView>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#020617' }}>
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <FlatList
                        data={filteredExpenses}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        ListHeaderComponent={renderHeader}
                        ListEmptyComponent={
                            <View style={{ paddingVertical: 80, alignItems: 'center', justifyContent: 'center' }}>
                                {loading ? (
                                    <ActivityIndicator color="#6366f1" size="large" />
                                ) : (
                                    <View style={{ alignItems: 'center' }}>
                                        <View style={{
                                            width: 80, height: 80, borderRadius: 40,
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
                                            alignItems: 'center', justifyContent: 'center', marginBottom: 16
                                        }}>
                                            <Briefcase size={32} color="#334155" />
                                        </View>
                                        <Text style={{ color: '#475569', fontFamily: 'GrenzeGotisch-Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 4, fontStyle: 'italic' }}>
                                            No protocols initialized
                                        </Text>
                                        <Text style={{ color: '#334155', fontSize: 12, fontFamily: 'Cinzel-Regular', marginTop: 8 }}>
                                            Add your first transaction above
                                        </Text>
                                    </View>
                                )}
                            </View>
                        }
                        contentContainerStyle={{ paddingBottom: 120 }}
                        showsVerticalScrollIndicator={false}
                    />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const inputStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, paddingHorizontal: 16,
    height: 52, color: '#fff', fontSize: 14, fontFamily: 'Cinzel-Regular',
    marginBottom: 20
};

const pickerStyle = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16, overflow: 'hidden', height: 52,
    justifyContent: 'center'
};

const SummaryCard = ({ title, amount, status, icon, isPrimary }) => (
    <View style={{
        width: 192, borderRadius: 32, padding: 24,
        borderWidth: 1,
        backgroundColor: isPrimary ? '#4f46e5' : 'rgba(255,255,255,0.04)',
        borderColor: isPrimary ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'
    }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <View style={{
                width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isPrimary ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
            }}>
                {icon}
            </View>
            <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
                backgroundColor: isPrimary ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
            }}>
                <Text style={{ fontSize: 8, fontFamily: 'GrenzeGotisch-Bold', textTransform: 'uppercase', letterSpacing: 1.5, color: isPrimary ? '#fff' : '#94a3b8' }}>
                    {status}
                </Text>
            </View>
        </View>
        <Text style={{ fontSize: 10, fontFamily: 'Cinzel-Bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6, color: isPrimary ? '#c7d2fe' : '#94a3b8' }}>
            {title}
        </Text>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'GrenzeGotisch-Bold', letterSpacing: -0.5 }}>{amount}</Text>
    </View>
);

const FormLabel = ({ label }) => (
    <Text style={{ color: '#475569', fontSize: 10, fontFamily: 'Cinzel-Bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, marginLeft: 4 }}>
        {label}
    </Text>
);

export default Expenses;
