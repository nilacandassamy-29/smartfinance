import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, Bot, Shield, TrendingUp, Wallet, Banknote, Landmark, HeartPulse, CircleDollarSign, Coins, AlertCircle } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = { text: '#0F172A', sub: '#64748B', muted: '#94A3B8', border: '#E2E8F0', card: '#F8FAFC', accent: '#6366f1' };

const Step6_Advice = () => {
  const { width } = Dimensions.get('window');
  const { investableSurplus, reserveAmount, setStep, safeNumber, members } = useOnboarding();
  const navigation = useNavigation();

  const getStrategy = () => {
    const b = safeNumber(investableSurplus);
    const hasGirl = members.some(m => m.gender === 'Female' || m.gender === 'Female // XX');

    const mke = (title, reasoning, risk, riskColor, riskBg, riskBorder, recs) => ({ title, reasoning, risk, riskColor, riskBg, riskBorder, recommendations: recs });

    if (b <= 2000) return mke('Ultra-Safe Savings Plan', 'Your savings amount is small right now. We suggest keeping your money safe and easy to access.', 'No Risk', '#10b981', '#ECFDF5', '#BBF7D0', [
      { name: 'Savings Account', target: 'Easy to Access', portion: '70%', icon: Wallet, ic: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE' },
      { name: 'Recurring Deposit', target: 'Regular Saving', portion: '30%', icon: Landmark, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
    ]);
    if (b <= 10000) return mke('Safe Growth Plan', 'A good mix to protect your money and help it grow a little each month.', 'Low Risk', '#d97706', '#FFFBEB', '#FDE68A', [
      { name: 'Fixed Deposit', target: 'Safe & Secure', portion: '60%', icon: Shield, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
      { name: 'Bluechip Mutual Fund', target: 'Steady Growth', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
    ]);
    if (b <= 25000) {
      const recs = [
        { name: 'Emergency Reserve', target: 'Safety First', portion: '40%', icon: Banknote, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
        { name: 'Flexi Mutual Fund', target: 'Wealth Growth', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
        hasGirl
          ? { name: 'Sukanya Samriddhi', target: "Girl Child Fund", portion: '20%', icon: HeartPulse, ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' }
          : { name: 'PPF Account', target: 'Tax-Free Savings', portion: '20%', icon: Landmark, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
      ];
      return mke('Balanced Investment Plan', 'Save tax and grow your wealth at the same time with this balanced mix.', 'Moderate Risk', '#d97706', '#FFFBEB', '#FDE68A', recs);
    }
    return mke('Growth Investment Plan', 'You have a strong savings amount. This plan helps your money grow faster across different investments.', 'Growth', '#6366f1', '#EEF2FF', '#C7D2FE', [
      { name: 'Mid-Cap Mutual Fund', target: 'High Growth', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
      { name: 'Gold Savings Bond', target: 'Protect Value', portion: '30%', icon: Coins, ic: '#d97706', bg: '#FFFBEB', bd: '#FDE68A' },
      { name: 'Index Fund', target: 'Safe + Growth', portion: '30%', icon: CircleDollarSign, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
    ]);
  };

  const balance = safeNumber(investableSurplus);
  const strategy = getStrategy();

  if (balance <= 0) {
    return (
      <OnboardingLayout currentStep={6}>
        <View style={{ alignItems: 'center', paddingTop: 60, gap: 28 }}>
          <View style={{ width: 96, height: 96, borderRadius: 32, backgroundColor: '#FFF1F2', borderWidth: 1.5, borderColor: '#FECDD3', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={46} color="#f43f5e" strokeWidth={2.5} />
          </View>
          <View style={{ alignItems: 'center', paddingHorizontal: 24 }}>
            <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0.3, textAlign: 'center', color: C.text }}>Can't Invest Yet</Text>
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 0.2, marginTop: 14, lineHeight: 20, color: C.sub }}>
              Your expenses are equal to or more than your income. Please reduce your expenses first before investing.
            </Text>
          </View>
          <TouchableOpacity onPress={() => { setStep(3); navigation.navigate('Step3_Expenses'); }} activeOpacity={0.8}
            style={{ paddingHorizontal: 36, height: 54, backgroundColor: C.accent, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 0.5, color: '#ffffff' }}>Fix My Expenses</Text>
          </TouchableOpacity>
        </View>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={6}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={() => { setStep(5); navigation.navigate('Step5_Reserve'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Bot size={11} color={C.accent} strokeWidth={3} />
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: C.accent }}>Investment Plan</Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0.3, color: C.text }}>Your Investment Plan</Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, letterSpacing: 0.2, lineHeight: 20, color: C.sub }}>
          We recommend investing <Text style={{ color: C.accent, fontFamily: 'Poppins_600SemiBold' }}>₹{balance.toLocaleString('en-IN')}</Text> after setting aside ₹{safeNumber(reserveAmount).toLocaleString('en-IN')} for emergencies.
        </Text>
      </View>

      {/* Strategy card */}
      <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ borderRadius: 26, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#ffffff', marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 }}>
        <View style={{ padding: 22 }}>
          {/* Strategy header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 18, paddingBottom: 18, borderBottomWidth: 1.5, borderBottomColor: C.border }}>
            <View style={{ width: 58, height: 58, borderRadius: 20, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
              <TrendingUp size={26} color="#ffffff" strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, letterSpacing: 0, color: C.text }}>{strategy.title}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: strategy.riskBg, borderWidth: 1.5, borderColor: strategy.riskBorder, gap: 5 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: strategy.riskColor }} />
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: strategy.riskColor }}>{strategy.risk}</Text>
              </View>
            </View>
          </View>

          {/* Why this plan */}
          <View style={{ padding: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, marginBottom: 18 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', lineHeight: 22, fontSize: 13, letterSpacing: 0.2, color: C.sub }}>
              <Text style={{ color: C.accent, fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5 }}>Why: </Text>
              {strategy.reasoning}
            </Text>
          </View>

          {/* Where to invest */}
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 12, marginLeft: 2, color: C.sub }}>Where to Invest</Text>
          <View style={{ gap: 10 }}>
            {strategy.recommendations.map((rec, idx) => (
              <MotiView key={idx} from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 + idx * 100 }}
                style={{ padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: rec.bg, borderWidth: 1.5, borderColor: rec.bd, alignItems: 'center', justifyContent: 'center' }}>
                  <rec.icon size={18} color={rec.ic} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, letterSpacing: 0, color: C.text }}>{rec.name}</Text>
                  <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, letterSpacing: 0.2, marginTop: 3, color: C.muted }}>{rec.target}</Text>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, backgroundColor: '#EEF2FF', borderWidth: 1.5, borderColor: '#C7D2FE' }}>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: C.accent }}>{rec.portion}</Text>
                </View>
              </MotiView>
            ))}
          </View>
        </View>
      </MotiView>

      {/* CTA */}
      <TouchableOpacity onPress={() => { setStep(7); navigation.navigate('Step7_FinalSummary'); }} activeOpacity={0.9}
        style={{ width: '100%', backgroundColor: C.accent, height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 0.5, color: '#ffffff' }}>Looks Good, Continue</Text>
        <ChevronRight size={22} color="#ffffff" strokeWidth={3} />
      </TouchableOpacity>
    </OnboardingLayout>
  );
};

export default Step6_Advice;
