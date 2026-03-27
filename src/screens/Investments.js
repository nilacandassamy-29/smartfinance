import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useInvestments } from '../context/InvestmentContext';
import { ChevronLeft, Plus, X, TrendingUp, TrendingDown, Landmark, Coins, Briefcase, FileText } from 'lucide-react-native';
import { MotiView } from 'moti';

const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('mutual')) return { bg: '#eff6ff', icon: <Briefcase size={20} color="#3b82f6" /> };
    if (cat.includes('gold')) return { bg: '#fefce8', icon: <Coins size={20} color="#eab308" /> };
    if (cat.includes('stock')) return { bg: '#f0fdf4', icon: <TrendingUp size={20} color="#22c55e" /> };
    if (cat.includes('fd')) return { bg: '#faf5ff', icon: <Landmark size={20} color="#a855f7" /> };
    return { bg: '#f8fafc', icon: <FileText size={20} color="#64748b" /> };
};

export default function Investments({ navigation }) {
    const { investments, totalPortfolioValue, addInvestment } = useInvestments();
    
    const [isAdding, setIsAdding] = useState(false);
    const [schemeName, setSchemeName] = useState('');
    const [amountInvested, setAmountInvested] = useState('');
    const [currentValue, setCurrentValue] = useState('');
    const [category, setCategory] = useState('Mutual Fund');

    const handleAdd = async () => {
        if (!schemeName.trim() || !amountInvested.trim() || !currentValue.trim()) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        await addInvestment({
            schemeName,
            amountInvested: parseFloat(amountInvested),
            currentValue: parseFloat(currentValue),
            category,
            date: new Date().toISOString()
        });
        setSchemeName(''); setAmountInvested(''); setCurrentValue(''); setCategory('Mutual Fund');
        setIsAdding(false);
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: '#ffffff', borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color="#0f172a" />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#0f172a' }}>My Portfolio</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#64748b', marginTop: -2 }}>
                            ₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total
                        </Text>
                    </View>
                </View>

                {/* Add Modal */}
                <Modal visible={isAdding} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setIsAdding(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0f172a' }}>Add Investment</Text>
                                        <TouchableOpacity onPress={() => setIsAdding(false)} style={{ padding: 4 }}>
                                            <X size={20} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Scheme Name</Text>
                                                <TextInput value={schemeName} onChangeText={setSchemeName} placeholder="e.g. HDFC Small Cap" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Amount Invested (₹)</Text>
                                                <TextInput value={amountInvested} onChangeText={setAmountInvested} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Current Value (₹)</Text>
                                                <TextInput value={currentValue} onChangeText={setCurrentValue} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Category (Mutual Fund, Gold, Stocks, FD...)</Text>
                                                <TextInput value={category} onChangeText={setCategory} placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Save Investment</Text>
                                        </TouchableOpacity>
                                    </KeyboardAvoidingView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                    {investments.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
                            <Briefcase size={48} color="#cbd5e1" />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#0f172a' }}>No investments yet</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#64748b' }}>Start building your portfolio</Text>
                        </View>
                    ) : investments.map((inv, i) => {
                        const iconData = getCategoryIcon(inv.category);
                        const gain = (inv.currentValue || 0) - (inv.amountInvested || 0);
                        const isGain = gain >= 0;
                        return (
                        <MotiView key={inv.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                            <View style={{
                                backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: iconData.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                        {iconData.icon}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#0f172a' }}>{inv.schemeName}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b' }}>{inv.category}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#0f172a' }}>₹{Number(inv.currentValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            {isGain ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color="#ef4444" />}
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: isGain ? '#10b981' : '#ef4444', marginLeft: 4 }}>
                                                {isGain ? '+' : ''}₹{Math.abs(gain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12 }}>
                                    <View>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#94a3b8' }}>INVESTED</Text>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: '#334155' }}>₹{Number(inv.amountInvested || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#94a3b8' }}>DATE</Text>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#334155' }}>
                                            {inv.date ? new Date(inv.date).toLocaleDateString('en-GB') : '-'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </MotiView>
                    )})}
                </ScrollView>

                {/* Floating Action Button */}
                <TouchableOpacity 
                    onPress={() => setIsAdding(true)}
                    style={{ position: 'absolute', bottom: 24, right: 24, backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}
                >
                    <Plus size={24} color="#ffffff" />
                </TouchableOpacity>

            </SafeAreaView>
        </View>
    );
}
