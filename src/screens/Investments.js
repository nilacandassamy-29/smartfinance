import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useInvestments } from '../context/InvestmentContext';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, Plus, X, TrendingUp, TrendingDown, Landmark, Coins, Briefcase, FileText } from 'lucide-react-native';
import { MotiView } from 'moti';

const getCategoryIcon = (category, isDarkMode, theme) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('mutual')) return { bg: isDarkMode ? theme.iconBg : '#eff6ff', icon: <Briefcase size={20} color="#3b82f6" /> };
    if (cat.includes('gold')) return { bg: isDarkMode ? theme.iconBg : '#fefce8', icon: <Coins size={20} color="#eab308" /> };
    if (cat.includes('stock')) return { bg: isDarkMode ? theme.iconBg : '#f0fdf4', icon: <TrendingUp size={20} color="#22c55e" /> };
    if (cat.includes('fd')) return { bg: isDarkMode ? theme.iconBg : '#faf5ff', icon: <Landmark size={20} color="#a855f7" /> };
    return { bg: isDarkMode ? theme.iconBg : '#f8fafc', icon: <FileText size={20} color={theme.subText} /> };
};

export default function Investments({ navigation }) {
    const { investments, totalPortfolioValue, addInvestment } = useInvestments();
    const { theme, isDarkMode } = useTheme();
    
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

    const renderInputStyle = () => ({
        height: 48, borderRadius: 12, backgroundColor: theme.inputBg,
        borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16,
        fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text
    });

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: theme.text }}>My Portfolio</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText, marginTop: -2 }}>
                            ₹{totalPortfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total
                        </Text>
                    </View>
                </View>

                {/* Add Modal */}
                <Modal visible={isAdding} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setIsAdding(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Add Investment</Text>
                                        <TouchableOpacity onPress={() => setIsAdding(false)} style={{ padding: 4 }}>
                                            <X size={20} color={theme.subText} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Scheme Name</Text>
                                                <TextInput value={schemeName} onChangeText={setSchemeName} placeholder="e.g. HDFC Small Cap" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Amount Invested (₹)</Text>
                                                <TextInput value={amountInvested} onChangeText={setAmountInvested} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Current Value (₹)</Text>
                                                <TextInput value={currentValue} onChangeText={setCurrentValue} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Category (Mutual Fund, Gold, Stocks, FD...)</Text>
                                                <TextInput value={category} onChangeText={setCategory} placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
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
                            <Briefcase size={48} color={theme.placeholder} />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: theme.text }}>No investments yet</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>Start building your portfolio</Text>
                        </View>
                    ) : investments.map((inv, i) => {
                        const iconData = getCategoryIcon(inv.category, isDarkMode, theme);
                        const gain = (inv.currentValue || 0) - (inv.amountInvested || 0);
                        const isGain = gain >= 0;
                        return (
                        <MotiView key={inv.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                            <View style={{
                                backgroundColor: theme.card, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                    <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: iconData.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                        {iconData.icon}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.text }}>{inv.schemeName}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText }}>{inv.category}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: theme.text }}>₹{Number(inv.currentValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            {isGain ? <TrendingUp size={12} color="#10b981" /> : <TrendingDown size={12} color={theme.danger} />}
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: isGain ? '#10b981' : theme.danger, marginLeft: 4 }}>
                                                {isGain ? '+' : ''}₹{Math.abs(gain).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.divider, paddingTop: 12 }}>
                                    <View>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: theme.subText }}>INVESTED</Text>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: theme.text }}>₹{Number(inv.amountInvested || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</Text>
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: theme.subText }}>DATE</Text>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.text }}>
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
