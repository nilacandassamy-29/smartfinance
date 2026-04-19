import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar, KeyboardAvoidingView, Platform, Alert, Modal, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useTheme } from '../context/ThemeContext';
import { MotiView } from 'moti';
import * as Icons from 'lucide-react-native';

// ── Section-based monthly category config ──────────────────────────────────
const CATEGORY_SECTIONS = [
  {
    title: 'LIVING EXPENSES',
    data: [
      { id: 'groceries',     label: 'Groceries',     icon: 'ShoppingCart', ic: '#f97316', bg: '#FFF7ED', bd: '#FED7AA' },
      { id: 'rent',          label: 'Rent / EMI',    icon: 'Home',         ic: '#a855f7', bg: '#FAF5FF', bd: '#E9D5FF' }
    ]
  },
  {
    title: 'BILLS & UTILITIES',
    data: [
      { id: 'electricity',   label: 'Electricity',   icon: 'Zap',          ic: '#eab308', bg: '#FEFCE8', bd: '#FDE68A' },
      { id: 'water',         label: 'Water Bill',    icon: 'Droplets',     ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
      { id: 'gas',           label: 'Gas Bill',      icon: 'Flame',        ic: '#f97316', bg: '#FFF7ED', bd: '#FED7AA' },
      { id: 'internet',      label: 'Internet',      icon: 'Wifi',         ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
      { id: 'mobile',        label: 'Mobile',        icon: 'Smartphone',   ic: '#64748b', bg: '#F8FAFC', bd: '#E2E8F0' }
    ]
  },
  {
    title: 'LIFESTYLE & OTHER',
    data: [
      { id: 'transport',     label: 'Transport',     icon: 'Car',          ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
      { id: 'insurance',     label: 'Insurance',     icon: 'Shield',       ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' },
      { id: 'medical',       label: 'Medical',       icon: 'HeartPulse',   ic: '#ef4444', bg: '#FEF2F2', bd: '#FECACA' },
      { id: 'education',     label: 'Education',     icon: 'GraduationCap',ic: '#a855f7', bg: '#FAF5FF', bd: '#E9D5FF' },
      { id: 'loans',         label: 'Loan / EMI',    icon: 'CreditCard',   ic: '#71717a', bg: '#FAFAFA', bd: '#E4E4E7' },
      { id: 'maintenance',   label: 'Repairs',       icon: 'Wrench',       ic: '#d97706', bg: '#FFFBEB', bd: '#FDE68A' },
      { id: 'subscriptions', label: 'Subscriptions', icon: 'Youtube',      ic: '#ef4444', bg: '#FEF2F2', bd: '#FECACA' },
      { id: 'personal',      label: 'Personal Care', icon: 'User',         ic: '#ec4899', bg: '#FDF2F8', bd: '#FBCFE8' },
      { id: 'miscellaneous', label: 'Other',         icon: 'MoreHorizontal',ic:'#64748b', bg: '#F8FAFC', bd: '#E2E8F0' },
    ]
  }
];

const DEFAULT_CATS = CATEGORY_SECTIONS.flatMap(s => s.data);

const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase().trim();
  if (cat === 'food' || cat === 'foof') return { icon: 'UtensilsCrossed', bg: '#FFF7ED', color: '#F97316' };
  if (cat === 'bills' || cat === 'utilities') return { icon: 'Zap', bg: '#FEFCE8', color: '#EAB308' };
  if (cat === 'transport') return { icon: 'Car', bg: '#F0F9FF', color: '#0EA5E9' };
  if (cat === 'personal' || cat === 'personal care') return { icon: 'User', bg: '#F5F3FF', color: '#8B5CF6' };
  if (cat === 'shopping') return { icon: 'ShoppingBag', bg: '#FDF2F8', color: '#EC4899' };
  if (cat === 'rent' || cat === 'rent/emi' || cat === 'emi') return { icon: 'Home', bg: '#EFF6FF', color: '#3D5AFE' };
  if (cat === 'subscriptions' || cat === 'subscription') return { icon: 'CreditCard', bg: '#F0FDF4', color: '#16A34A' };
  if (cat === 'health' || cat === 'medical') return { icon: 'Heart', bg: '#FFF1F2', color: '#F43F5E' };
  if (cat === 'education') return { icon: 'GraduationCap', bg: '#FFFBEB', color: '#D97706' };
  if (cat === 'general' || cat === 'miscellaneous') return { icon: 'Wallet', bg: '#EFF6FF', color: '#3B82F6' };
  return { icon: 'Receipt', bg: '#F8FAFC', color: '#64748B' };
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
  } catch { return 'No date'; }
};

export default function Expenses({ navigation }) {
  const { expenses, monthlyTotal, loading, addExpense, deleteExpense, updateExpense } = useExpenses();
  const { addIncome } = useIncome();
  const { theme, isDarkMode } = useTheme();

  // Default category input values
  const [catAmounts, setCatAmounts] = useState({});

  // Custom expense modal states
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  // Income modal states
  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [incTitle, setIncTitle] = useState('');
  const [incAmount, setIncAmount] = useState('');
  const [incCategory, setIncCategory] = useState('Salary');

  // Edit modal states
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDate, setEditDate] = useState('');

  const monthName = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  const totalCatAmount = Object.values(catAmounts).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const renderInputStyle = () => ({
    height: 48, borderRadius: 12, backgroundColor: theme.inputBg,
    borderWidth: 1, borderColor: theme.border, paddingHorizontal: 16,
    fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text,
  });

  const modalCategories = [
    { label: 'Food', icon: 'UtensilsCrossed', color: '#F97316', bg: '#FFF7ED' },
    { label: 'Bills', icon: 'Zap', color: '#EAB308', bg: '#FEFCE8' },
    { label: 'Transport', icon: 'Car', color: '#0EA5E9', bg: '#F0F9FF' },
    { label: 'Groceries', icon: 'ShoppingCart', color: '#16A34A', bg: '#F0FDF4' },
    { label: 'Personal', icon: 'User', color: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Subscriptions', icon: 'CreditCard', color: '#3D5AFE', bg: '#EFF6FF' },
    { label: 'Insurance', icon: 'Shield', color: '#EC4899', bg: '#FDF2F8' },
    { label: 'Rent/EMI', icon: 'Home', color: '#3D5AFE', bg: '#EFF6FF' },
    { label: 'Health', icon: 'Heart', color: '#F43F5E', bg: '#FFF1F2' },
    { label: 'Education', icon: 'GraduationCap', color: '#D97706', bg: '#FFFBEB' },
    { label: 'General', icon: 'Wallet', color: '#64748B', bg: '#F8FAFC' },
    { label: 'Other', icon: 'MoreHorizontal', color: '#64748B', bg: '#F8FAFC' },
  ];

  const handleAdd = async () => {
    if (!title.trim()) { Alert.alert('Error', 'Please enter a title'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Error', 'Please enter a valid amount'); return; }
    setSubmitting(true);
    try {
      await addExpense({ title: title.trim(), amount: parseFloat(amount), category });
      setTitle(''); setAmount(''); setCategory('General'); setIsAdding(false);
    } catch (err) {}
    setSubmitting(false);
  };

  const handleAddIncome = async () => {
    if (!incTitle.trim() || !incAmount.trim()) { Alert.alert('Error', 'Please fill in title and amount.'); return; }
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
    if (!editTitle || !editAmount) { Alert.alert('Error', 'Please fill in title and amount.'); return; }
    let processedDate = editingExpense.date || editingExpense.createdAt;
    try { const d = new Date(editDate); if (!isNaN(d.getTime())) processedDate = d.toISOString(); } catch (e) {}
    await updateExpense(editingExpense.id, { title: editTitle, amount: parseFloat(editAmount).toString(), category: editCategory || 'General', date: processedDate });
    setEditModalVisible(false);
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Expense', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteExpense(id); setEditModalVisible(false); } },
    ]);
  };

  // Save all category amounts as individual expense entries
  const handleSaveCategoryExpenses = async () => {
    const entries = Object.entries(catAmounts).filter(([, v]) => parseFloat(v) > 0);
    if (entries.length === 0) { Alert.alert('Nothing to save', 'Please enter at least one amount.'); return; }
    setSubmitting(true);
    try {
      for (const [catId, val] of entries) {
        const cat = DEFAULT_CATS.find(c => c.id === catId);
        await addExpense({ title: cat?.label || catId, amount: parseFloat(val), category: cat?.label || catId });
      }
      setCatAmounts({});
      Alert.alert('Saved!', 'Your monthly expenses have been recorded.');
    } catch (e) {}
    setSubmitting(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={isDarkMode ? '#0F172A' : '#FFFFFF'} />
      <SafeAreaView style={{ flex: 1 }}>

        {/* ── Header ── */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 26, color: isDarkMode ? '#F8FAFC' : '#1E293B' }}>Expenses</Text>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: '#94A3B8', marginTop: 0 }}>
              ₹{monthlyTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })} spent in {monthName}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ExpenseHistory')}
            style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: isDarkMode ? '#334155' : '#BFDBFE', backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF' }}
          >
            <Text style={{ color: '#3D5AFE', fontSize: 13, fontFamily: 'Poppins-SemiBold' }}>History</Text>
          </TouchableOpacity>
        </View>



        {/* ── Add Expense Modal ── */}
        <Modal visible={isAdding} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setIsAdding(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Add Expense</Text>
                    <TouchableOpacity onPress={() => setIsAdding(false)}><Icons.X size={20} color={theme.subText} /></TouchableOpacity>
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
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, gap: 10 }}>
                          {modalCategories.map((cat, idx) => {
                            const isSelected = category === cat.label;
                            const IconComp = Icons[cat.icon] || Icons['Receipt'];
                            return (
                              <TouchableOpacity key={idx} onPress={() => setCategory(cat.label)}
                                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: isSelected ? '#3D5AFE' : theme.border, backgroundColor: isSelected ? '#EEF0FF' : theme.inputBg }}>
                                <IconComp size={16} color={isSelected ? '#3D5AFE' : theme.subText} />
                                <Text style={{ fontFamily: isSelected ? 'Poppins-SemiBold' : 'Poppins-Medium', fontSize: 13, color: isSelected ? '#3D5AFE' : theme.text }}>{cat.label}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    </View>
                    <TouchableOpacity disabled={submitting} onPress={handleAdd} style={{ backgroundColor: submitting ? theme.border : '#3D5AFE', borderRadius: 12, paddingVertical: 14, alignItems: 'center', width: '100%' }}>
                      <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Add Expense</Text>
                    </TouchableOpacity>
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ── Add Income Modal ── */}
        <Modal visible={isAddingIncome} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setIsAddingIncome(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Add Income</Text>
                    <TouchableOpacity onPress={() => setIsAddingIncome(false)}><Icons.X size={20} color={theme.subText} /></TouchableOpacity>
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

        {/* ── Edit Expense Modal ── */}
        <Modal visible={editModalVisible} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setEditModalVisible(false)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
              <TouchableWithoutFeedback>
                <View style={{ backgroundColor: theme.modalBg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <Text style={{ fontSize: 17, fontFamily: 'Poppins-Bold', color: theme.text }}>Edit Expense</Text>
                    <TouchableOpacity onPress={() => setEditModalVisible(false)}><Icons.X size={20} color={theme.subText} /></TouchableOpacity>
                  </View>
                  <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <View style={{ gap: 12, marginBottom: 24 }}>
                      <View><Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Title</Text><TextInput value={editTitle} onChangeText={setEditTitle} style={renderInputStyle()} /></View>
                      <View><Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Amount (₹)</Text><TextInput value={editAmount} onChangeText={setEditAmount} keyboardType="numeric" style={renderInputStyle()} /></View>
                      <View><Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Category</Text><TextInput value={editCategory} onChangeText={setEditCategory} style={renderInputStyle()} /></View>
                      <View><Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginBottom: 6 }}>Date (DD MMM YYYY)</Text><TextInput value={editDate} onChangeText={setEditDate} style={renderInputStyle()} /></View>
                    </View>
                    <View style={{ gap: 12 }}>
                      <TouchableOpacity onPress={handleUpdate} style={{ backgroundColor: '#3D5AFE', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#ffffff' }}>Save Changes</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(editingExpense?.id)} style={{ backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.border, borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.danger }}>Delete Expense</Text>
                      </TouchableOpacity>
                    </View>
                  </KeyboardAvoidingView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* ── Main Content ── */}
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

          {/* ── Summary Card ── */}
          <View style={{ backgroundColor: '#3D5AFE', borderRadius: 24, padding: 24, marginBottom: 24, marginTop: 10 }}>
            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>Total Spent</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginTop: 4, marginBottom: 16 }}>
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 32, color: '#FFFFFF', lineHeight: 40 }}>₹{monthlyTotal.toLocaleString('en-IN')}</Text>
              <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginLeft: 8, marginBottom: 6 }}>of ₹25,000 budget</Text>
            </View>
            
            <View style={{ width: '100%', height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginBottom: 12 }}>
                <View style={{ width: `${Math.min(100, (monthlyTotal/25000)*100)}%`, height: 6, backgroundColor: '#FFFFFF', borderRadius: 3 }} />
            </View>

            <View style={{ alignSelf: 'flex-end', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#FFFFFF' }}>{Math.max(0, Math.round((1 - monthlyTotal/25000) * 100))}% left</Text>
            </View>
          </View>

          {/* ── Sectioned Categories ── */}
          {CATEGORY_SECTIONS.map((section, sIdx) => (
            <View key={sIdx} style={{ marginBottom: 24 }}>
              <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 11, color: '#94A3B8', letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 }}>
                {section.title}
              </Text>

              <View style={{ backgroundColor: 'transparent' }}>
                {section.data.map((cat, idx) => {
                  const IconComp = Icons[cat.icon] || Icons['Receipt'];
                  const val = catAmounts[cat.id] || '';
                  return (
                    <View key={cat.id} style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: isDarkMode ? '#1E293B' : '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isDarkMode ? '#1E293B' : cat.bg, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                          <IconComp size={20} color={cat.ic} />
                        </View>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                          <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: isDarkMode ? '#F8FAFC' : '#1E293B', marginBottom: 6 }}>{cat.label}</Text>
                          {/* Placeholder progress bar */}
                          <View style={{ width: '100%', height: 4, backgroundColor: isDarkMode ? '#334155' : '#F1F5F9', borderRadius: 2 }} />
                        </View>
                      </View>
                      
                      <View style={{ width: 90, alignItems: 'flex-end' }}>
                        <TextInput
                          style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: isDarkMode ? '#F8FAFC' : '#0F172A', textAlign: 'right', width: '100%' }}
                          keyboardType="numeric"
                          placeholder="₹0"
                          placeholderTextColor="#94A3B8"
                          value={val}
                          onChangeText={(v) => setCatAmounts(prev => ({ ...prev, [cat.id]: v }))}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveCategoryExpenses}
            disabled={submitting || totalCatAmount === 0}
            style={{ backgroundColor: submitting || totalCatAmount === 0 ? (isDarkMode ? '#334155' : '#CBD5E1') : '#3D5AFE', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
          >
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: '#fff' }}>
              {submitting ? 'Saving…' : 'Save Expenses'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Floating Action Buttons ── */}
        <View style={{ position: 'absolute', bottom: 24, right: 20, flexDirection: 'row', gap: 12, zIndex: 999 }}>
          <TouchableOpacity
            onPress={() => Alert.alert('Export Data', 'Export functionality is coming in the next update!')}
            style={{ backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: isDarkMode ? '#334155' : '#CBD5E1', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}
          >
             <Icons.Upload size={22} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsAdding(true)}
            style={{ backgroundColor: '#3D5AFE', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#3D5AFE', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 }}
          >
            <Icons.Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}
