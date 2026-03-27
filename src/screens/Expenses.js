import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { MotiView } from 'moti';
import { Pencil, Trash2, X, Plus, ArrowDownLeft, UtensilsCrossed, Wallet, User, Receipt, Shield, Plane, Zap, ShoppingBag } from 'lucide-react-native';

const getCategoryDetails = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food') || cat.includes('foof')) return { bg: '#fff7ed', icon: <UtensilsCrossed size={20} color="#f97316" /> };
    if (cat.includes('general')) return { bg: '#eff6ff', icon: <Wallet size={20} color="#3b82f6" /> };
    if (cat.includes('personal')) return { bg: '#faf5ff', icon: <User size={20} color="#a855f7" /> };
    if (cat.includes('transport')) return { bg: '#f0f9ff', icon: <Plane size={20} color="#0ea5e9" /> };
    if (cat.includes('bill')) return { bg: '#fefce8', icon: <Zap size={20} color="#eab308" /> };
    if (cat.includes('shop')) return { bg: '#fdf2f8', icon: <ShoppingBag size={20} color="#ec4899" /> };
    return { bg: '#f8fafc', icon: <Receipt size={20} color="#64748b" /> };
};

export default function Expenses({ navigation }) {
    const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();
    const { addIncome } = useIncome();
    
    // Expense States
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('General');
    const [dateText, setDateText] = useState(new Date().toISOString());
    const [isAdding, setIsAdding] = useState(false);

    // Income States
    const [isAddingIncome, setIsAddingIncome] = useState(false);
    const [incTitle, setIncTitle] = useState('');
    const [incAmount, setIncAmount] = useState('');
    const [incCategory, setIncCategory] = useState('Salary');

    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editAmount, setEditAmount] = useState('');
    const [editCategory, setEditCategory] = useState('');
    const [editDate, setEditDate] = useState('');

    const formatDate = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    };

    const handleAdd = async () => {
        if (!title.trim() || !amount.trim()) {
            Alert.alert('Error', 'Please fill in title and amount.');
            return;
        }
        await addExpense({ title, amount: parseFloat(amount).toString(), category, date: dateText });
        setTitle(''); setAmount(''); setCategory('General'); setIsAdding(false);
    };

    const handleAddIncome = async () => {
        if (!incTitle.trim() || !incAmount.trim()) {
            Alert.alert('Error', 'Please fill in title and amount.');
            return;
        }
        await addIncome({ title: incTitle, amount: parseFloat(incAmount).toString(), category: incCategory, date: new Date().toISOString() });
        setIncTitle(''); setIncAmount(''); setIncCategory('Salary'); setIsAddingIncome(false);
        Alert.alert('Success', 'Income recorded successfully!');
    };

    const openEditModal = (exp) => {
        setEditingExpense(exp);
        setEditTitle(exp.title);
        setEditAmount(exp.amount?.toString() || '0');
        setEditCategory(exp.category || 'General');
        setEditDate(formatDate(exp.date || exp.createdAt));
        setEditModalVisible(true);
    };

    const handleUpdate = async () => {
        if (!editTitle || !editAmount) {
            Alert.alert('Error', 'Please fill in title and amount.');
            return;
        }
        let processedDate = editingExpense.date || editingExpense.createdAt;
        try {
           const d = new Date(editDate);
           if (!isNaN(d.getTime())) processedDate = d.toISOString();
        } catch(e) {}

        await updateExpense(editingExpense.id, {
            title: editTitle,
            amount: parseFloat(editAmount).toString(),
            category: editCategory || 'General',
            date: processedDate
        });
        
        setEditModalVisible(false);
    };

    const handleDelete = (id) => {
        Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: async () => {
                await deleteExpense(id);
                setEditModalVisible(false);
            }}
        ]);
    };

    const total = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    const sortedExpenses = [...expenses].sort((a,b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const currentYearNum = new Date().getFullYear();

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: '#0f172a' }}>Expenses</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#64748b', marginTop: -2 }}>
                            ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })} spent in {currentMonthName} {currentYearNum}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ExpenseHistory')}
                        style={{ backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0' }}
                    >
                        <Text style={{ color: '#334155', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Add Expense Modal */}
                <Modal visible={isAdding} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setIsAdding(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0f172a' }}>Add Expense</Text>
                                        <TouchableOpacity onPress={() => setIsAdding(false)} style={{ padding: 4 }}>
                                            <X size={20} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Title</Text>
                                                <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Groceries" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Category</Text>
                                                <TextInput value={category} onChangeText={setCategory} placeholder="Food, Transport, Bills..." placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={handleAdd} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Add Expense</Text>
                                        </TouchableOpacity>
                                    </KeyboardAvoidingView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Add Income Modal */}
                <Modal visible={isAddingIncome} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setIsAddingIncome(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0f172a' }}>Add Income</Text>
                                        <TouchableOpacity onPress={() => setIsAddingIncome(false)} style={{ padding: 4 }}>
                                            <X size={20} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Source Title</Text>
                                                <TextInput value={incTitle} onChangeText={setIncTitle} placeholder="e.g. March Salary" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={incAmount} onChangeText={setIncAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Category (Salary, Freelance, Business, Gift...)</Text>
                                                <TextInput value={incCategory} onChangeText={setIncCategory} placeholderTextColor="#94a3b8" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={handleAddIncome} style={{ backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Record Income</Text>
                                        </TouchableOpacity>
                                    </KeyboardAvoidingView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                {/* Edit Expense Modal */}
                <Modal visible={editModalVisible} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: '#0f172a' }}>Edit Expense</Text>
                                        <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ padding: 4 }}>
                                            <X size={20} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Title</Text>
                                                <TextInput value={editTitle} onChangeText={setEditTitle} style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={editAmount} onChangeText={setEditAmount} keyboardType="numeric" style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Category</Text>
                                                <TextInput value={editCategory} onChangeText={setEditCategory} style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#475569', marginBottom: 6 }}>Date (DD MMM YYYY)</Text>
                                                <TextInput value={editDate} onChangeText={setEditDate} style={{ height: 48, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 16, fontFamily: 'Poppins-Medium', fontSize: 14, color: '#0f172a' }} />
                                            </View>
                                        </View>

                                        <View style={{ gap: 12 }}>
                                            <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Save Changes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(editingExpense?.id)} style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ef4444' }}>Delete Expense</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </KeyboardAvoidingView>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
                    {sortedExpenses.length === 0 ? (
                        <View style={{ alignItems: 'center', paddingTop: 80, gap: 10 }}>
                            <Receipt size={48} color="#cbd5e1" />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#0f172a' }}>No expenses yet</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: '#64748b' }}>Tap + to add your first entry</Text>
                        </View>
                    ) : sortedExpenses.map((exp, i) => {
                        const cat = getCategoryDetails(exp.category);
                        return (
                        <MotiView key={exp.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                            <View style={{
                                backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 8,
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                                shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: cat.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                        {cat.icon}
                                    </View>
                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#0f172a', flexShrink: 1, flexWrap: 'wrap' }} numberOfLines={2}>{exp.title}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#94a3b8', textTransform: 'capitalize' }}>{exp.category}</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#ef4444' }}>
                                        -₹{parseFloat(exp.amount).toFixed(0)}
                                    </Text>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                        {formatDate(exp.date || exp.createdAt)}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, gap: 16 }}>
                                    <TouchableOpacity onPress={() => openEditModal(exp)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Pencil size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(exp.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                        <Trash2 size={18} color="#cbd5e1" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </MotiView>
                    )})}
                </ScrollView>

                {/* Floating Action Buttons */}
                <View style={{ position: 'absolute', bottom: 24, right: 24, flexDirection: 'row', gap: 16 }}>
                    <TouchableOpacity 
                        onPress={() => setIsAddingIncome(true)}
                        style={{ backgroundColor: '#10b981', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}
                    >
                        <ArrowDownLeft size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsAdding(true)}
                        style={{ backgroundColor: '#2563eb', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}
                    >
                        <Plus size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}
