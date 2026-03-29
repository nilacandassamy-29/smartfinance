import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, ShoppingCart, Zap, Droplets, Flame, Wifi, Smartphone, Home, Car, Shield, HeartPulse, GraduationCap, CreditCard, Wrench, Youtube, User, MoreHorizontal, Activity, TrendingUp } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = {
  text: '#0F172A', sub: '#64748B', muted: '#94A3B8',
  border: '#E2E8F0', card: '#F8FAFC', input: '#F1F5F9',
  placeholder: '#CBD5E1', accent: '#2563EB',
};

const Step3_Expenses = () => {
  const { width } = Dimensions.get('window');
  const { expenses, updateExpenses, totalExpenses, totalIncome, setStep, mode } = useOnboarding();
  const navigation = useNavigation();

  const cats = [
    { id: 'groceries',     label: 'Groceries',     icon: ShoppingCart, ic: '#f97316', bg: '#FFF7ED', bd: '#FED7AA' },
    { id: 'electricity',   label: 'Electricity',   icon: Zap,          ic: '#eab308', bg: '#FEFCE8', bd: '#FDE68A' },
    { id: 'water',         label: 'Water Bill',    icon: Droplets,     ic: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE' },
    { id: 'gas',           label: 'Gas Bill',      icon: Flame,        ic: '#f97316', bg: '#FFF7ED', bd: '#FED7AA' },
    { id: 'internet',      label: 'Internet',      icon: Wifi,         ic: '#2563EB', bg: '#EFF6FF', bd: '#BFDBFE' },
    { id: 'mobile',        label: 'Mobile',        icon: Smartphone,   ic: '#64748b', bg: '#F8FAFC', bd: '#E2E8F0' },
    { id: 'rent',          label: 'Rent / EMI',    icon: Home,         ic: '#a855f7', bg: '#FAF5FF', bd: '#E9D5FF' },
    { id: 'transport',     label: 'Transport',     icon: Car,          ic: '#0ea5e9', bg: '#F0F9FF', bd: '#BAE6FD' },
    { id: 'insurance',     label: 'Insurance',     icon: Shield,       ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' },
    { id: 'medical',       label: 'Medical',       icon: HeartPulse,   ic: '#ef4444', bg: '#FEF2F2', bd: '#FECACA' },
    { id: 'education',     label: 'Education',     icon: GraduationCap,ic: '#a855f7', bg: '#FAF5FF', bd: '#E9D5FF' },
    { id: 'loans',         label: 'Loan / EMI',    icon: CreditCard,   ic: '#71717a', bg: '#FAFAFA', bd: '#E4E4E7' },
    { id: 'maintenance',   label: 'Repairs',       icon: Wrench,       ic: '#d97706', bg: '#FFFBEB', bd: '#FDE68A' },
    { id: 'subscriptions', label: 'Subscriptions', icon: Youtube,      ic: '#ef4444', bg: '#FEF2F2', bd: '#FECACA' },
    { id: 'personal',      label: 'Personal Care', icon: User,         ic: '#ec4899', bg: '#FDF2F8', bd: '#FBCFE8' },
    { id: 'miscellaneous', label: 'Other',         icon: MoreHorizontal,ic:'#64748b', bg: '#F8FAFC', bd: '#E2E8F0' },
  ];

  const handleNext = () => { setStep(4); navigation.navigate('Step4_Analysis'); };
  const isDeficit = totalExpenses > totalIncome;
  const cw = (width - 80) / 2;

  return (
    <OnboardingLayout currentStep={3}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={() => { setStep(2); navigation.navigate('Step2_MemberDetails'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: C.accent }}>Monthly Expenses</Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0.3, color: C.text }}>
          {mode === 'Family' ? 'Family Expenses' : 'My Expenses'}
        </Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, letterSpacing: 0.2, lineHeight: 20, color: C.sub }}>
          Enter how much you spend each month in each category.
        </Text>
      </View>

      {/* Expense grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        {cats.map((cat, idx) => (
          <MotiView key={cat.id} from={{ opacity: 0, scale: 0.9, translateY: 10 }} animate={{ opacity: 1, scale: 1, translateY: 0 }} transition={{ delay: idx * 30 }}
            style={{ width: cw, padding: 16, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: cat.bg, borderWidth: 1, borderColor: cat.bd, alignItems: 'center', justifyContent: 'center' }}>
                <cat.icon size={14} color={cat.ic} />
              </View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.sub }}>{cat.label}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1.5, borderBottomColor: C.border, paddingBottom: 4 }}>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginRight: 4, color: C.muted }}>₹</Text>
              <TextInput style={{ flex: 1, fontFamily: 'Poppins_700Bold', fontSize: 18, padding: 0, color: C.text }} keyboardType="numeric" placeholder="0" placeholderTextColor={C.placeholder} value={String(expenses[cat.id] || '')} onChangeText={(v) => updateExpenses({ [cat.id]: Math.max(0, Number(v) || 0) })} />
            </View>
          </MotiView>
        ))}
      </View>

      {/* Summary box */}
      <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: 500 }}
        style={{ borderRadius: 28, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#ffffff', marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 2 }}>
        <View style={{ padding: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' }} />
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.sub }}>Income</Text>
              </View>
              <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 26, letterSpacing: -0.5, color: C.text }}>₹{totalIncome.toLocaleString('en-IN')}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.sub }}>Expenses</Text>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: isDeficit ? '#f43f5e' : C.accent }} />
              </View>
              <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 26, letterSpacing: -0.5, color: C.text }}>₹{totalExpenses.toLocaleString('en-IN')}</Text>
            </View>
          </View>
          <View style={{ padding: 18, borderRadius: 20, borderWidth: 1.5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: isDeficit ? '#FFF1F2' : '#F0FDF4', borderColor: isDeficit ? '#FECDD3' : '#BBF7D0' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{ width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, backgroundColor: isDeficit ? '#FFE4E6' : '#DCFCE7', borderColor: isDeficit ? '#FECDD3' : '#BBF7D0' }}>
                {isDeficit ? <Activity size={22} color="#f43f5e" /> : <TrendingUp size={22} color="#10b981" />}
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, marginBottom: 3, color: C.sub }}>
                  {isDeficit ? 'You are overspending' : 'Money left over'}
                </Text>
                <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 22, letterSpacing: -0.5, color: isDeficit ? '#f43f5e' : '#10b981' }}>
                  ₹{Math.abs(totalIncome - totalExpenses).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
            <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1.5, backgroundColor: isDeficit ? '#FFE4E6' : '#DCFCE7', borderColor: isDeficit ? '#FECDD3' : '#BBF7D0' }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, letterSpacing: 0.3, color: isDeficit ? '#f43f5e' : '#10b981' }}>
                {isDeficit ? 'Overspent' : 'On Track'}
              </Text>
            </View>
          </View>
        </View>
      </MotiView>

      {/* CTA */}
      <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={{ width: '100%', backgroundColor: C.accent, height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 0.5, color: '#ffffff' }}>Next Step</Text>
        <ChevronRight size={22} color="#ffffff" strokeWidth={3} />
      </TouchableOpacity>
    </OnboardingLayout>
  );
};

export default Step3_Expenses;
