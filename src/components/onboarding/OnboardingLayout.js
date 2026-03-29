import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StatusBar as RNStatusBar } from 'react-native';
import { LayoutDashboard, ShieldCheck, Lock } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { MotiView } from 'moti';

const F = {
  label:   { fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3 },
  header:  { fontFamily: 'Poppins_700Bold',      fontSize: 18, letterSpacing: 0 },
  counter: { fontFamily: 'Poppins_600SemiBold',  fontSize: 13 },
  secured: { fontFamily: 'Poppins_600SemiBold',  fontSize: 11, letterSpacing: 0.3 },
  caption: { fontFamily: 'Poppins_500Medium',    fontSize: 10, letterSpacing: 0.3 },
};

const OnboardingLayout = ({ children, currentStep }) => {
  const navigation = useNavigation();
  const { isInitialized, isSyncing } = useOnboarding();
  const { loading: authLoading } = useAuth();

  if (authLoading || !isInitialized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ ...F.label, color: '#94A3B8', marginTop: 24 }}>
          Setting up your profile...
        </Text>
      </View>
    );
  }

  const totalSteps = 7;
  const steps = [1, 2, 3, 4, 5, 6, 7];

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={{ flex: 1, paddingTop: 48 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, marginBottom: 32 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 40, height: 40, backgroundColor: '#2563EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#2563EB', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }}>
                <LayoutDashboard size={20} color="#ffffff" strokeWidth={2.5} />
              </View>
              <View>
                <Text style={{ ...F.label, color: '#94A3B8' }}>Getting Started</Text>
                <Text style={{ ...F.header, color: '#0F172A', marginTop: 1 }}>SmartFinance</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {isSyncing ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ActivityIndicator size="small" color="#2563EB" />
                  <Text style={{ ...F.secured, color: '#2563EB' }}>Saving...</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <ShieldCheck size={13} color="#22c55e" />
                  <Text style={{ ...F.secured, color: '#22c55e' }}>Secured</Text>
                </View>
              )}
              <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 }}>
                <Text style={{ ...F.counter, color: '#64748B' }}>{currentStep} / {totalSteps}</Text>
              </View>
            </View>
          </View>

          {/* Progress bar */}
          <View style={{ flexDirection: 'row', gap: 4, height: 5 }}>
            {steps.map((s) => (
              <View key={s} style={{ flex: 1, height: '100%', borderRadius: 10, backgroundColor: s <= currentStep ? '#2563EB' : '#E2E8F0', shadowColor: '#2563EB', shadowOpacity: s <= currentStep ? 0.35 : 0, shadowRadius: 4, elevation: s <= currentStep ? 2 : 0 }} />
            ))}
          </View>
        </View>

        {/* Content */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
          <MotiView from={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 380 }}>
            {children}
          </MotiView>

          {/* Bottom badges */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 32, marginBottom: 24, opacity: 0.45 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Lock size={11} color="#94A3B8" />
              <Text style={{ ...F.caption, color: '#94A3B8' }}>End-to-End Encryption</Text>
            </View>
            <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <ShieldCheck size={11} color="#94A3B8" />
              <Text style={{ ...F.caption, color: '#94A3B8' }}>Biometric Ready</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OnboardingLayout;
