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

    const base = (title, reasoning, risk, riskColor, riskBg, riskBorder, recs) => ({ title, reasoning, risk, riskColor, riskBg, riskBorder, recommendations: recs });

    if (b <= 2000) return base('Ultra-Safe Stability Plan', 'Maintaining high liquidity and absolute capital safety is critical at this surplus level.', 'No Risk', '#10b981', '#ECFDF5', '#BBF7D0', [
      { name: 'Savings Account', target: 'Instant Cash', portion: '70%', icon: Wallet, ic: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE' },
      { name: 'Recurring Deposit', target: 'Planned Saving', portion: '30%', icon: Landmark, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
    ]);
    if (b <= 10000) return base('Stable + Growth Core', 'A balanced mix to ensure your money beats inflation while keeping the principal protected.', 'Low-Moderate', '#d97706', '#FFFBEB', '#FDE68A', [
      { name: 'Fixed Deposit', target: 'Shield Principal', portion: '60%', icon: Shield, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
      { name: 'Bluechip SIP', target: 'Steady Growth', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
    ]);
    if (b <= 25000) {
      const recs = [
        { name: 'Emergency Buffer', target: 'Security', portion: '40%', icon: Banknote, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
        { name: 'Flexi-Cap SIP', target: 'Wealth Building', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
        hasGirl
          ? { name: 'Sukanya Samriddhi', target: 'Girl Growth', portion: '20%', icon: HeartPulse, ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' }
          : { name: 'PPF', target: 'Tax-Free', portion: '20%', icon: Landmark, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
      ];
      return base('Balanced Wealth Strategy', 'Optimized for tax-efficiency and long-term goal planning for the entire family.', 'Moderate', '#d97706', '#FFFBEB', '#FDE68A', recs);
    }
    return base('Diversified Growth Portfolio', 'Aggressive wealth compounding strategy utilizing multiple asset classes to maximize returns.', 'Growth Oriented', '#6366f1', '#EEF2FF', '#C7D2FE', [
      { name: 'Mid-Cap SIP', target: 'High Returns', portion: '40%', icon: TrendingUp, ic: '#6366f1', bg: '#EEF2FF', bd: '#C7D2FE' },
      { name: 'Gold Bonds', target: 'Asset Hedge', portion: '30%', icon: Coins, ic: '#d97706', bg: '#FFFBEB', bd: '#FDE68A' },
      { name: 'Index Fund Mix', target: 'Security + Alpha', portion: '30%', icon: CircleDollarSign, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
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
            <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textTransform: 'uppercase', textAlign: 'center', color: C.text }}>Strategy Offline</Text>
            <Text style={{ textAlign: 'center', fontFamily: 'Poppins_500Medium', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 14, lineHeight: 20, color: C.sub }}>
              System detect: Total outflows match or exceed inflows. Capital allocation protocol cannot initialize.
            </Text>
          </View>
          <TouchableOpacity onPress={() => { setStep(3); navigation.navigate('Step3_Expenses'); }} activeOpacity={0.8}
            style={{ paddingHorizontal: 36, height: 54, backgroundColor: C.accent, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff' }}>Re-calibrate Flux</Text>
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
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.sub }}>Backtrack</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Bot size={11} color={C.accent} strokeWidth={3} />
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5, color: C.accent }}>Strategic Logic</Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textTransform: 'uppercase', color: C.text }}>Growth Blueprint</Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.5, lineHeight: 20, color: C.sub }}>
          Optimizing <Text style={{ color: C.accent, fontFamily: 'Poppins_600SemiBold' }}>₹{balance.toLocaleString('en-IN')}</Text> deployment after ₹{safeNumber(reserveAmount).toLocaleString('en-IN')} resilience buffer.
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
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5, color: strategy.riskColor }}>{strategy.risk} Profile</Text>
              </View>
            </View>
          </View>

          {/* Reasoning */}
          <View style={{ padding: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, marginBottom: 18 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', lineHeight: 22, fontSize: 13, color: C.sub }}>
              <Text style={{ color: C.accent, fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5 }}>Logic: </Text>
              {strategy.reasoning}
            </Text>
          </View>

          {/* Allocations */}
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, marginLeft: 2, color: C.sub }}>Proposed Allocations</Text>
          <View style={{ gap: 10 }}>
            {strategy.recommendations.map((rec, idx) => (
              <MotiView key={idx} from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 + idx * 100 }}
                style={{ padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: rec.bg, borderWidth: 1.5, borderColor: rec.bd, alignItems: 'center', justifyContent: 'center' }}>
                  <rec.icon size={18} color={rec.ic} strokeWidth={2.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, letterSpacing: 0, color: C.text }}>{rec.name}</Text>
                  <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, color: C.muted }}>{rec.target}</Text>
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
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff' }}>Commit Deployment Plan</Text>
        <ChevronRight size={22} color="#ffffff" strokeWidth={3} />
      </TouchableOpacity>
    </OnboardingLayout>
  );
};

export default Step6_Advice;
