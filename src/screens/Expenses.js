import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';
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
  return '−₹' + num.toLocaleString('en-IN');
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
    if (expense.month && expense.year) {
      return `01 ${new Date(expense.year, expense.month - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
    }
    return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return 'No date';
  }
};

export default function Expenses({ navigation }) {
    const { expenses, addExpense, deleteExpense, updateExpense } = useExpenses();
    const { addIncome } = useIncome();
    const { theme, isDarkMode } = useTheme();
    
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
        const formattedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        await addExpense({ title, amount: parseFloat(amount).toString(), category, date: formattedDate, createdAt: new Date() });
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

    const headerTotal = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const monthName = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

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
                <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: theme.text }}>Expenses</Text>
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: theme.subText, marginTop: -2 }}>
                            ₹{headerTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} spent in {monthName}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ExpenseHistory')}
                        style={{ backgroundColor: theme.card, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: theme.border }}
                    >
                        <Text style={{ color: theme.text, fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>History</Text>
                    </TouchableOpacity>
                </View>

                {/* Add Expense Modal */}
                <Modal visible={isAdding} transparent animationType="slide">
                    <TouchableWithoutFeedback onPress={() => setIsAdding(false)}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Add Expense</Text>
                                        <TouchableOpacity onPress={() => setIsAdding(false)} style={{ padding: 4 }}>
                                            <X size={20} color={theme.subText} />
                                        </TouchableOpacity>
                                    </View>
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Title</Text>
                                                <TextInput value={title} onChangeText={setTitle} placeholder="e.g. Groceries" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Category</Text>
                                                <TextInput value={category} onChangeText={setCategory} placeholder="Food, Transport, Bills..." placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
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
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Add Income</Text>
                                        <TouchableOpacity onPress={() => setIsAddingIncome(false)} style={{ padding: 4 }}>
                                            <X size={20} color={theme.subText} />
                                        </TouchableOpacity>
                                    </View>
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Source Title</Text>
                                                <TextInput value={incTitle} onChangeText={setIncTitle} placeholder="e.g. March Salary" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={incAmount} onChangeText={setIncAmount} keyboardType="numeric" placeholder="0.00" placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Category (Salary, Freelance, Business, Gift...)</Text>
                                                <TextInput value={incCategory} onChangeText={setIncCategory} placeholderTextColor={theme.placeholder} style={renderInputStyle()} />
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
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                        <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Edit Expense</Text>
                                        <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ padding: 4 }}>
                                            <X size={20} color={theme.subText} />
                                        </TouchableOpacity>
                                    </View>
                                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                                        <View style={{ gap: 12, marginBottom: 24 }}>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Title</Text>
                                                <TextInput value={editTitle} onChangeText={setEditTitle} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Amount (₹)</Text>
                                                <TextInput value={editAmount} onChangeText={setEditAmount} keyboardType="numeric" style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Category</Text>
                                                <TextInput value={editCategory} onChangeText={setEditCategory} style={renderInputStyle()} />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Date (DD MMM YYYY)</Text>
                                                <TextInput value={editDate} onChangeText={setEditDate} style={renderInputStyle()} />
                                            </View>
                                        </View>
                                        <View style={{ gap: 12 }}>
                                            <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Save Changes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleDelete(editingExpense?.id)} style={{ backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.danger }}>Delete Expense</Text>
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
                            <Receipt size={48} color={theme.subText} />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: theme.text }}>No expenses yet</Text>
                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>Tap + to add your first entry</Text>
                        </View>
                    ) : sortedExpenses.map((exp, i) => {
                        const { icon, bg, color } = getCategoryIcon(exp.category);
                        const IconComponent = Icons[icon] || Icons['Receipt'];

                        return (
                        <MotiView key={exp.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                            <View style={{
                                flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
                                backgroundColor: '#FFFFFF', borderRadius: 14, marginBottom: 8,
                                shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
                            }}>
                                {/* LEFT - Icon Container */}
                                <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginRight: 12, flexShrink: 0 }}>
                                    <IconComponent size={20} color={color} />
                                </View>

                                {/* CENTER - Text Column */}
                                <View style={{ flex: 1, marginRight: 8, overflow: 'hidden' }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#0F172A' }} numberOfLines={1} ellipsizeMode="tail">{exp.title}</Text>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: '#94A3B8' }} numberOfLines={1} ellipsizeMode="tail">{exp.category}</Text>
                                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 11, color: '#94A3B8', marginTop: 2 }} numberOfLines={1}>{formatExpenseDate(exp)}</Text>
                                </View>

                                {/* RIGHT - Amount + Action Icons */}
                                <View style={{ alignItems: 'flex-end', flexShrink: 0, minWidth: 90 }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#EF4444', textAlign: 'right' }} numberOfLines={1}>
                                        {formatAmount(exp.amount)}
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 4, alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => openEditModal(exp)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <Icons.Pencil size={15} color="#CBD5E1" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(exp.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <Icons.Trash2 size={15} color="#CBD5E1" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </MotiView>
                    )})}
                </ScrollView>

                {/* Floating Action Buttons */}
                <View style={{ position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', gap: 12, zIndex: 999 }}>
                    <TouchableOpacity 
                        onPress={() => setIsAddingIncome(true)}
                        style={{ backgroundColor: '#10B981', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
                    >
                        <Icons.ArrowDownLeft size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setIsAdding(true)}
                        style={{ backgroundColor: '#2563EB', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
                    >
                        <Icons.Plus size={24} color="#ffffff" />
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </View>
    );
}
