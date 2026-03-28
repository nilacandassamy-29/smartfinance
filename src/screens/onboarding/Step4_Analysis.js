import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Wallet, Bot, Cpu } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = { text: '#0F172A', sub: '#64748B', muted: '#94A3B8', border: '#E2E8F0', card: '#F8FAFC', accent: '#6366f1' };

const Step4_Analysis = () => {
  const { width } = Dimensions.get('window');
  const { totalIncome, totalExpenses, initialSurplus, safeNumber, mode, setSavingsAmount, setStep } = useOnboarding();
  const navigation = useNavigation();

  const handleNext = () => { setSavingsAmount(initialSurplus); setStep(5); navigation.navigate('Step5_Reserve'); };

  const cards = [
    { label: 'Total Income',    value: totalIncome,     icon: TrendingUp,   ic: '#10b981', tint: '#F0FDF4', border: '#BBF7D0' },
    { label: 'Total Expenses',  value: totalExpenses,   icon: TrendingDown, ic: '#f43f5e', tint: '#FFF1F2', border: '#FECDD3' },
    { label: 'Money Available', value: initialSurplus,  icon: Wallet,       ic: '#6366f1', tint: '#EEF2FF', border: '#C7D2FE' },
  ];

  return (
    <OnboardingLayout currentStep={4}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={() => { setStep(3); navigation.navigate('Step3_Expenses'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0' }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: '#16a34a' }}>Your Summary</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={{ alignItems: 'center', marginBottom: 36 }}>
        <View style={{ width: 80, height: 80, backgroundColor: '#ECFDF5', borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#BBF7D0', marginBottom: 20, shadowColor: '#10b981', shadowOpacity: 0.15, shadowRadius: 12, elevation: 3 }}>
          <Cpu size={32} color="#10b981" strokeWidth={2.5} />
        </View>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0.3, textAlign: 'center', color: C.text }}>
          {mode === 'Family' ? 'Family Summary' : 'Your Summary'}
        </Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 8, textAlign: 'center', paddingHorizontal: 24, letterSpacing: 0.2, lineHeight: 20, color: C.sub }}>
          Here is a summary of your monthly money flow.
        </Text>
      </View>

      {/* Metric cards */}
      <View style={{ gap: 12, marginBottom: 28 }}>
        {cards.map((card, i) => (
          <MotiView key={i} from={{ opacity: 0, translateX: -20 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: i * 150 }}
            style={{ borderRadius: 22, borderWidth: 1.5, borderColor: card.border, backgroundColor: card.tint, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: card.ic, shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: card.border, alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={22} color={card.ic} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 4, color: C.sub }}>{card.label}</Text>
                <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 24, letterSpacing: -0.5, color: C.text }}>
                  ₹{safeNumber(card.value).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
            <View style={{ width: 4, height: 36, borderRadius: 2, backgroundColor: card.ic, opacity: 0.3 }} />
          </MotiView>
        ))}
      </View>

      {/* Smart advice card */}
      <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 600 }}
        style={{ borderRadius: 26, borderWidth: 1.5, borderColor: '#C7D2FE', backgroundColor: '#EEF2FF', marginBottom: 28, shadowColor: C.accent, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3 }}>
        <View style={{ padding: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 16 }}>
          <View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 }}>
            <Bot size={26} color="#ffffff" strokeWidth={2.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 8, color: '#4f46e5' }}>Smart Advice</Text>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, lineHeight: 22, letterSpacing: 0.2, color: C.sub }}>
              {initialSurplus > 0
                ? `Great news! You have ₹${initialSurplus.toLocaleString('en-IN')} left each month after expenses. Let's put that money to work for you.`
                : "Your expenses are equal to or more than your income. Let's set an emergency fund first to keep you safe."}
            </Text>
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

export default Step4_Analysis;
