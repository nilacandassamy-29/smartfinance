import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Users, User, ChevronRight, Minus, Plus, ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView, AnimatePresence } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';

const C = {
  text: '#0F172A', sub: '#64748B', muted: '#94A3B8',
  border: '#E2E8F0', card: '#F8FAFC', input: '#F1F5F9',
  accent: '#6366f1',
};

const Step1_FamilySize = () => {
  const { updateUserProfile } = useAuth();
  const { width } = Dimensions.get('window');
  const { familySize, updateFamilySize, setStep } = useOnboarding();
  const navigation = useNavigation();

  const handleNext = () => { setStep(2); navigation.navigate('Step2_MemberDetails'); };
  const adjustSize = (delta) => updateFamilySize(Math.max(1, Math.min(10, familySize + delta)));

  return (
    <OnboardingLayout currentStep={1}>
      <View style={{ marginBottom: 40 }}>

        {/* Go Back button */}
        <TouchableOpacity
          onPress={async () => await updateUserProfile({ onboardingComplete: true })}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 }}
        >
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, color: C.sub, textTransform: 'uppercase' }}>
            Go Back
          </Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={{ alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <MotiView
            from={{ scale: 0.5, opacity: 0, rotate: '-45deg' }}
            animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
            style={{ width: 96, height: 96, backgroundColor: '#EEF2FF', borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#C7D2FE' }}
          >
            <Users size={40} color={C.accent} strokeWidth={2.5} />
          </MotiView>

          <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textAlign: 'center', textTransform: 'uppercase', color: C.text }}>
            Who Is This For?
          </Text>

          <View style={{ paddingHorizontal: 24, paddingVertical: 16, borderRadius: 20, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card, marginHorizontal: 8 }}>
            <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, letterSpacing: 1.5, textAlign: 'center', textTransform: 'uppercase', color: C.sub, lineHeight: 20 }}>
              Tell us if you are managing finances for yourself or your entire family.
            </Text>
          </View>
        </View>

        {/* Counter + selector */}
        <View style={{ alignItems: 'center', gap: 28 }}>
          <AnimatePresence exitBeforeEnter>
            {familySize > 1 && (
              <MotiView
                from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, translateY: 10 }}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 40, width: '100%', marginBottom: 8 }}
              >
                <TouchableOpacity onPress={() => adjustSize(-1)} activeOpacity={0.7} style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FECDD3' }}>
                  <Minus size={28} color="#f43f5e" strokeWidth={3} />
                </TouchableOpacity>

                <View style={{ alignItems: 'center', width: 80 }}>
                  <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 48, color: C.text, textAlign: 'center', letterSpacing: 0 }}>
                    {familySize}
                  </Text>
                  <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, color: C.sub, textTransform: 'uppercase', textAlign: 'center', marginTop: 2 }}>
                    Family Members
                  </Text>
                </View>

                <TouchableOpacity onPress={() => adjustSize(1)} activeOpacity={0.7} style={{ width: 64, height: 64, borderRadius: 24, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#BBF7D0' }}>
                  <Plus size={28} color="#10b981" strokeWidth={3} />
                </TouchableOpacity>
              </MotiView>
            )}
          </AnimatePresence>

          {/* Just Me / Family cards */}
          <View style={{ flexDirection: 'row', gap: 14, width: '100%' }}>
            {[
              { id: 'single', label: 'Just Me', icon: User, isActive: familySize === 1, onPress: () => updateFamilySize(1) },
              { id: 'family', label: 'Family', icon: Users, isActive: familySize > 1, onPress: () => updateFamilySize(Math.max(2, familySize)) },
            ].map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={opt.onPress}
                activeOpacity={0.8}
                style={{
                  flex: 1, paddingVertical: 28, paddingHorizontal: 16, borderRadius: 28, alignItems: 'center',
                  backgroundColor: opt.isActive ? C.accent : C.card,
                  borderWidth: 1.5, borderColor: opt.isActive ? C.accent : C.border,
                  shadowColor: opt.isActive ? C.accent : '#000',
                  shadowOpacity: opt.isActive ? 0.25 : 0.04, shadowRadius: 12, elevation: opt.isActive ? 6 : 2,
                }}
              >
                <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: opt.isActive ? 'rgba(255,255,255,0.2)' : '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <opt.icon size={28} color={opt.isActive ? '#ffffff' : C.accent} strokeWidth={2.5} />
                </View>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', color: opt.isActive ? '#ffffff' : C.muted }}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* CTA */}
      {familySize > 0 && (
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} style={{ marginTop: 24 }}>
          <TouchableOpacity
            onPress={handleNext}
            activeOpacity={0.9}
            style={{ width: '100%', backgroundColor: C.accent, height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: C.accent, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8 }}
          >
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#ffffff' }}>
              Continue
            </Text>
            <ChevronRight size={20} color="#ffffff" strokeWidth={3} />
          </TouchableOpacity>
        </MotiView>
      )}
    </OnboardingLayout>
  );
};

export default Step1_FamilySize;
