import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, CheckCircle2, TrendingUp, ShieldCheck, Wallet, ArrowRight, Bot } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = { text: '#0F172A', sub: '#64748B', muted: '#94A3B8', border: '#E2E8F0', card: '#F8FAFC', accent: '#6366f1' };

const Step7_FinalSummary = () => {
  const { updateUserProfile } = useAuth();
  const { width } = Dimensions.get('window');
  const { totalIncome, totalExpenses, reserveAmount, investableSurplus, setStep, finalizeOnboarding, safeNumber } = useOnboarding();
  const navigation = useNavigation();
  const [isFinalizing, setIsFinalizing] = useState(false);

  const handleFinalize = async () => {
    setIsFinalizing(true);
    try {
      const success = await finalizeOnboarding();
      if (success) await updateUserProfile({ onboardingComplete: true });
    } catch (e) { console.error('Finalization failed', e); }
    finally { setIsFinalizing(false); }
  };

  const summaries = [
    { label: 'Monthly Income',    value: totalIncome,       icon: TrendingUp,  ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
    { label: 'Monthly Expenses',  value: totalExpenses,     icon: TrendingUp,  ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' },
    { label: 'Emergency Fund',    value: reserveAmount,     icon: ShieldCheck, ic: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE' },
    { label: 'Ready to Invest',   value: investableSurplus, icon: Wallet,      ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
  ];

  return (
    <OnboardingLayout currentStep={7}>
      {/* Back */}
      <View style={{ marginBottom: 36 }}>
        <TouchableOpacity onPress={() => { setStep(6); navigation.navigate('Step6_Advice'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
      </View>

      {/* Hero */}
      <View style={{ alignItems: 'center', gap: 20, marginBottom: 36 }}>
        <MotiView
          from={{ scale: 0.5, opacity: 0, rotate: '180deg' }}
          animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
          style={{ width: 96, height: 96, backgroundColor: '#ECFDF5', borderRadius: 36, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#BBF7D0', shadowColor: '#10b981', shadowOpacity: 0.2, shadowRadius: 16, elevation: 4 }}
        >
          <CheckCircle2 size={46} color="#10b981" strokeWidth={2.5} />
        </MotiView>
        <View style={{ alignItems: 'center', paddingHorizontal: 16 }}>
          <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textTransform: 'uppercase', textAlign: 'center', color: C.text }}>You Are All Set!</Text>
          <View style={{ paddingHorizontal: 20, paddingVertical: 12, borderRadius: 18, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card, marginTop: 16 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, textAlign: 'center', lineHeight: 20, color: C.sub }}>
              Your SmartFinance plan is ready. Start tracking your money and growing your wealth.
            </Text>
          </View>
        </View>
      </View>

      {/* Summary card */}
      <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }}
        style={{ borderRadius: 26, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#ffffff', marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 }}>
        <View style={{ padding: 24 }}>
          {/* 2×2 grid */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 }}>
            {summaries.map((item, i) => (
              <MotiView key={i} from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 200 + i * 100 }}
                style={{ width: '50%', paddingRight: i % 2 === 0 ? 10 : 0, paddingLeft: i % 2 === 1 ? 10 : 0, marginBottom: 22 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: item.bg, borderWidth: 1.5, borderColor: item.bd, alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={15} color={item.ic} strokeWidth={2.5} style={i === 1 ? { transform: [{ rotate: '180deg' }] } : {}} />
                  </View>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: C.muted }}>{item.label}</Text>
                </View>
                <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 20, letterSpacing: -0.5, color: C.text }}>
                  ₹{safeNumber(item.value).toLocaleString('en-IN')}
                </Text>
              </MotiView>
            ))}
          </View>

          {/* Note */}
          <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 800 }}
            style={{ backgroundColor: '#EEF2FF', padding: 18, borderRadius: 20, borderWidth: 1.5, borderColor: '#C7D2FE', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 50, height: 50, backgroundColor: C.accent, borderRadius: 16, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
              <Bot size={24} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 20, textTransform: 'uppercase', letterSpacing: 1.5, color: C.sub }}>
                Tap below to save your plan and start using SmartFinance.
              </Text>
            </View>
          </MotiView>
        </View>
      </MotiView>

      {/* CTA */}
      <TouchableOpacity disabled={isFinalizing} onPress={handleFinalize} activeOpacity={0.9}
        style={{ width: '100%', height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: isFinalizing ? C.card : C.accent, borderWidth: isFinalizing ? 1.5 : 0, borderColor: C.border, shadowColor: C.accent, shadowOpacity: isFinalizing ? 0 : 0.35, shadowRadius: 16, elevation: isFinalizing ? 0 : 8 }}>
        {isFinalizing ? (
          <>
            <ActivityIndicator size="small" color={C.accent} />
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: C.accent }}>Saving Your Plan...</Text>
          </>
        ) : (
          <>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff' }}>Start Using SmartFinance</Text>
            <ArrowRight size={22} color="#ffffff" strokeWidth={3} />
          </>
        )}
      </TouchableOpacity>
    </OnboardingLayout>
  );
};

export default Step7_FinalSummary;
