import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, ShieldCheck, Target, Zap, Banknote } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = { text: '#0F172A', sub: '#64748B', muted: '#94A3B8', border: '#E2E8F0', card: '#F8FAFC', input: '#F1F5F9', placeholder: '#CBD5E1', accent: '#6366f1' };

const Step5_Reserve = () => {
  const { width } = Dimensions.get('window');
  const { initialSurplus, reserveAmount, setReserveAmount, setStep } = useOnboarding();
  const navigation = useNavigation();

  const handleNext = () => { setStep(6); navigation.navigate('Step6_Advice'); };

  return (
    <OnboardingLayout currentStep={5}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={() => { setStep(4); navigation.navigate('Step4_Analysis'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.sub }}>Backtrack</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5, color: C.accent }}>Liquidity Vault</Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 28 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textTransform: 'uppercase', color: C.text }}>Resilience Buffer</Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.5, lineHeight: 20, color: C.sub }}>
          Defining the absolute safety net from your ₹{initialSurplus.toLocaleString('en-IN')} surplus.
        </Text>
      </View>

      {/* Main card */}
      <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ borderRadius: 26, borderWidth: 1.5, borderColor: C.border, backgroundColor: '#ffffff', marginBottom: 28, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 14, elevation: 3 }}>
        <View style={{ padding: 28 }}>
          {/* Shield + label */}
          <View style={{ alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <View style={{ width: 80, height: 80, backgroundColor: '#ECFDF5', borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#BBF7D0', shadowColor: '#10b981', shadowOpacity: 0.15, shadowRadius: 10, elevation: 3 }}>
              <ShieldCheck size={36} color="#10b981" strokeWidth={2.5} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', color: C.text }}>Safety Lock Amount</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#FFFBEB', borderWidth: 1.5, borderColor: '#FDE68A', gap: 6 }}>
                <Target size={12} color="#d97706" strokeWidth={2.5} />
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: '#d97706' }}>Objective: 6 Cycle Resilience</Text>
              </View>
            </View>
          </View>

          {/* Input */}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 20, height: 72, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.input, marginBottom: 20 }}>
            <Banknote size={26} color={C.muted} strokeWidth={2.5} />
            <TextInput
              style={{ flex: 1, fontFamily: 'Poppins_700Bold', fontSize: 36, letterSpacing: -1, marginLeft: 16, color: C.text }}
              placeholder="0"
              placeholderTextColor={C.placeholder}
              keyboardType="numeric"
              value={String(reserveAmount || '')}
              onChangeText={(val) => setReserveAmount(Number(val) || 0)}
            />
          </View>

          {/* Hint */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: '#EEF2FF', borderRadius: 18, borderWidth: 1.5, borderColor: '#C7D2FE' }}>
            <Zap size={16} color={C.accent} strokeWidth={2.5} />
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, lineHeight: 20, textTransform: 'uppercase', letterSpacing: 1.5, flex: 1, color: C.sub }}>
              Allocating a buffer ensures your investment protocol remains uninterrupted during volatility.
            </Text>
          </View>
        </View>
      </MotiView>

      {/* CTA */}
      <TouchableOpacity onPress={handleNext} activeOpacity={0.9} style={{ width: '100%', backgroundColor: C.accent, height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 }}>
        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff' }}>Lock Resilience Buffer</Text>
        <ChevronRight size={22} color="#ffffff" strokeWidth={3} />
      </TouchableOpacity>
    </OnboardingLayout>
  );
};

export default Step5_Reserve;
