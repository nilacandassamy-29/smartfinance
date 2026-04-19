import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Modal, ScrollView, Linking, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  ChevronRight, ChevronLeft, Bot, Shield, TrendingUp, Wallet, Banknote, Landmark,
  HeartPulse, CircleDollarSign, Coins, AlertCircle, Calculator, CheckCircle2, ExternalLink, X
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import Slider from '@react-native-community/slider';

const C = { text: '#0F172A', sub: '#64748B', muted: '#94A3B8', border: '#E2E8F0', card: '#F8FAFC', accent: '#3D5AFE' };

// ─── Complete Scheme Data ────────────────────────────────────────────────────
const SCHEME_DATA = {
  'Mid-Cap Mutual Fund': {
    name: 'Mid-Cap Mutual Fund',
    category: 'Mutual Fund',
    tag: 'High Growth',
    rate: '12% - 18% p.a.',
    rateValue: 15,
    description:
      'Mid-cap mutual funds invest in medium-sized companies with high growth potential. Ideal for investors who want higher returns and can tolerate moderate to high market risk over a long period.',
    minAmount: 500,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 30,
    defaultAmount: 10000,
    defaultTenure: 5,
    keyBenefits: [
      'High growth potential',
      'Professional fund management',
      'SIP option from ₹500/month',
      'Long-term wealth creation',
    ],
    riskLevel: 'High Risk',
    riskColor: '#EF4444',
    tagColor: '#EFF6FF',
    tagTextColor: '#3D5AFE',
    officialLink: 'https://www.amfiindia.com',
  },
  'Gold Savings Bond': {
    name: 'Gold Savings Bond',
    category: 'Government',
    tag: 'Protect Value',
    rate: '2.5% + Capital Gain',
    rateValue: 8,
    description:
      'Sovereign Gold Bonds are government securities issued by RBI on behalf of the Government of India. They offer a fixed 2.5% annual interest plus the benefit of gold price appreciation over 8 years.',
    minAmount: 5000,
    maxAmount: 500000,
    minTenure: 5,
    maxTenure: 8,
    defaultAmount: 10000,
    defaultTenure: 8,
    keyBenefits: [
      'Government backed security',
      'Fixed 2.5% annual interest',
      'Gold price appreciation benefit',
      'Tax-free on maturity',
      'No storage risk',
    ],
    riskLevel: 'Low Risk',
    riskColor: '#22C55E',
    tagColor: '#FEF9C3',
    tagTextColor: '#CA8A04',
    officialLink: 'https://www.rbi.org.in',
  },
  'Index Fund': {
    name: 'Index Fund',
    category: 'Mutual Fund',
    tag: 'Safe + Growth',
    rate: '10% - 13% p.a.',
    rateValue: 11.5,
    description:
      'Index funds track a market index like Nifty 50 or Sensex. They offer broad market exposure with low costs and are ideal for long-term investors who want steady returns without active fund management risk.',
    minAmount: 500,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 30,
    defaultAmount: 10000,
    defaultTenure: 5,
    keyBenefits: [
      'Low expense ratio',
      'Tracks Nifty 50 or Sensex',
      'Diversified portfolio automatically',
      'Consistent long-term returns',
      'SIP from ₹500/month',
    ],
    riskLevel: 'Moderate Risk',
    riskColor: '#F59E0B',
    tagColor: '#F0FDF4',
    tagTextColor: '#16A34A',
    officialLink: 'https://www.amfiindia.com',
  },
  'Fixed Deposit': {
    name: 'Fixed Deposit',
    category: 'Savings',
    tag: 'Guaranteed Returns',
    rate: '6.5% - 7.25% p.a.',
    rateValue: 7,
    description:
      'Fixed Deposits are the most popular savings instrument in India. You deposit a lump sum for a fixed period and earn guaranteed interest regardless of market conditions.',
    minAmount: 1000,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 10,
    defaultAmount: 10000,
    defaultTenure: 5,
    keyBenefits: [
      'Guaranteed returns',
      'No market risk',
      'Flexible tenure from 7 days',
      'Senior citizen extra 0.5% interest',
      'Loan against FD up to 90%',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#EFF6FF',
    tagTextColor: '#3D5AFE',
    officialLink: 'https://www.sbi.co.in',
  },
  'Bluechip Mutual Fund': {
    name: 'Bluechip Mutual Fund',
    category: 'Mutual Fund',
    tag: 'Steady Growth',
    rate: '10% - 14% p.a.',
    rateValue: 12,
    description:
      'Bluechip mutual funds invest in large, established companies with strong financials. They offer relatively stable returns with lower volatility compared to mid and small-cap funds.',
    minAmount: 500,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 30,
    defaultAmount: 10000,
    defaultTenure: 5,
    keyBenefits: [
      'Investment in top 100 companies',
      'Lower volatility than mid-cap',
      'Consistent dividend history',
      'High liquidity',
      'SIP from ₹500/month',
    ],
    riskLevel: 'Moderate Risk',
    riskColor: '#F59E0B',
    tagColor: '#EFF6FF',
    tagTextColor: '#3D5AFE',
    officialLink: 'https://www.amfiindia.com',
  },
  'Savings Account': {
    name: 'Savings Account',
    category: 'Savings',
    tag: 'Easy to Access',
    rate: '2.7% - 4% p.a.',
    rateValue: 3.5,
    description:
      'A regular savings account offered by banks. Your money is always accessible while earning a small interest. Best for keeping your emergency fund and day-to-day spending money.',
    minAmount: 100,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 10,
    defaultAmount: 10000,
    defaultTenure: 3,
    keyBenefits: [
      'Instant access to funds',
      'No lock-in period',
      'Insured up to ₹5 lakh (DICGC)',
      'Zero market risk',
      'Online/UPI transfers anytime',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#F0FDF4',
    tagTextColor: '#16A34A',
    officialLink: 'https://www.sbi.co.in',
  },
  'Recurring Deposit': {
    name: 'Recurring Deposit',
    category: 'Savings',
    tag: 'Regular Saving',
    rate: '5.5% - 7% p.a.',
    rateValue: 6.5,
    description:
      'A Recurring Deposit allows you to save a fixed amount every month and earn guaranteed interest. It is the ideal product for building the habit of regular monthly saving.',
    minAmount: 100,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 10,
    defaultAmount: 2000,
    defaultTenure: 5,
    keyBenefits: [
      'Fixed monthly deposit habit',
      'Guaranteed returns',
      'Flexible tenure 6 months to 10 years',
      'No market risk',
      'Loan facility available',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#EFF6FF',
    tagTextColor: '#3D5AFE',
    officialLink: 'https://www.indiapost.gov.in',
  },
  'Emergency Reserve': {
    name: 'Emergency Reserve',
    category: 'Safety',
    tag: 'Safety First',
    rate: '3% - 5% p.a.',
    rateValue: 4,
    description:
      'An emergency reserve is money set aside in a liquid, accessible account (like a liquid fund or high-yield savings account) specifically for unexpected expenses like medical bills, job loss, or urgent repairs.',
    minAmount: 1000,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 5,
    defaultAmount: 10000,
    defaultTenure: 1,
    keyBenefits: [
      'Instant withdrawal anytime',
      'Covers 3-6 months of expenses',
      'Protects long-term investments',
      'Reduces financial stress',
      'No penalties on withdrawal',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#ECFDF5',
    tagTextColor: '#16A34A',
    officialLink: 'https://www.amfiindia.com',
  },
  'Flexi Mutual Fund': {
    name: 'Flexi Cap Mutual Fund',
    category: 'Mutual Fund',
    tag: 'Wealth Growth',
    rate: '11% - 16% p.a.',
    rateValue: 13,
    description:
      'Flexi Cap funds can invest across large, mid, and small-cap companies dynamically. The fund manager shifts allocation based on market conditions to maximize returns while managing risk.',
    minAmount: 500,
    maxAmount: 500000,
    minTenure: 1,
    maxTenure: 30,
    defaultAmount: 10000,
    defaultTenure: 7,
    keyBenefits: [
      'Dynamic allocation across market caps',
      'Professional active management',
      'Higher return potential',
      'Tax-efficient (LTCG after 1 year)',
      'SIP from ₹500/month',
    ],
    riskLevel: 'Moderate-High Risk',
    riskColor: '#F59E0B',
    tagColor: '#EFF6FF',
    tagTextColor: '#3D5AFE',
    officialLink: 'https://www.amfiindia.com',
  },
  'Sukanya Samriddhi': {
    name: 'Sukanya Samriddhi Yojana',
    category: 'Government',
    tag: 'Girl Child Fund',
    rate: '8.2% p.a.',
    rateValue: 8.2,
    description:
      "Sukanya Samriddhi Yojana is a government-backed savings scheme for the girl child. Parents can open this account for daughters below 10 years. The maturity amount can be used for higher education or marriage.",
    minAmount: 250,
    maxAmount: 150000,
    minTenure: 15,
    maxTenure: 21,
    defaultAmount: 10000,
    defaultTenure: 15,
    keyBenefits: [
      '100% government guarantee',
      'Highest interest rate among govt schemes',
      'Tax-free returns under Section 80C',
      'Partial withdrawal at age 18',
      'Up to ₹1.5 lakh per year',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#FFF1F2',
    tagTextColor: '#E11D48',
    officialLink: 'https://www.indiapost.gov.in',
  },
  'PPF Account': {
    name: 'Public Provident Fund',
    category: 'Government',
    tag: 'Tax-Free Savings',
    rate: '7.1% p.a.',
    rateValue: 7.1,
    description:
      'PPF is a long-term government savings scheme backed by the Government of India. It offers guaranteed returns, complete tax exemption and is one of the safest investment options available.',
    minAmount: 500,
    maxAmount: 150000,
    minTenure: 15,
    maxTenure: 15,
    defaultAmount: 10000,
    defaultTenure: 15,
    keyBenefits: [
      '100% government guaranteed',
      'Tax-free returns under Section 80C',
      'Loan facility after 3 years',
      'Partial withdrawal after 7 years',
      'Maximum ₹1.5 lakh per year',
    ],
    riskLevel: 'No Risk',
    riskColor: '#22C55E',
    tagColor: '#F0FDF4',
    tagTextColor: '#16A34A',
    officialLink: 'https://www.indiapost.gov.in',
  },
};

// ─── Scheme Detail Modal ─────────────────────────────────────────────────────
const SchemeDetailModal = ({ scheme, visible, onClose }) => {
  const [investmentAmount, setInvestmentAmount] = useState(10000);
  const [tenure, setTenure] = useState(5);

  useEffect(() => {
    if (scheme) {
      setInvestmentAmount(scheme.defaultAmount);
      setTenure(scheme.defaultTenure);
    }
  }, [scheme]);

  if (!scheme) return null;

  const rate = scheme.rateValue / 100;
  const maturityValue = Math.round(investmentAmount * Math.pow(1 + rate, tenure));
  const returnsGained = maturityValue - investmentAmount;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: 20, paddingTop: 52, paddingBottom: 16,
          borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0',
        }}>
          <TouchableOpacity
            onPress={onClose}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={22} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#0F172A', flex: 1, textAlign: 'center', marginHorizontal: 12 }} numberOfLines={1}>
            {scheme.name}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center' }}
          >
            <X size={18} color="#f43f5e" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>

          {/* Badges */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <View style={{ backgroundColor: scheme.tagColor || '#EFF6FF', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: scheme.tagTextColor || '#3D5AFE' }}>
                {scheme.category}
              </Text>
            </View>
            <View style={{ backgroundColor: '#F0FDF4', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: '#16A34A' }}>
                Rate: {scheme.rate}
              </Text>
            </View>
            <View style={{
              backgroundColor: scheme.riskColor + '20', borderRadius: 20,
              paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5,
            }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: scheme.riskColor }} />
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: scheme.riskColor }}>
                {scheme.riskLevel}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 14, color: '#64748B', lineHeight: 23, marginBottom: 24 }}>
            {scheme.description}
          </Text>

          {/* ── Yield Calculator Card ──────────────────────────── */}
          <View style={{
            backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16,
            shadowColor: '#3D5AFE', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
            borderWidth: 1.5, borderColor: '#E2E8F0',
          }}>
            {/* Card Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Calculator size={18} color="#3D5AFE" strokeWidth={2.5} />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#0F172A' }}>Yield Calculator</Text>
            </View>

            {/* Investment Amount Slider */}
            <View style={{ marginBottom: 18 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: '#64748B' }}>Investment Amount</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#0F172A' }}>
                  ₹{investmentAmount.toLocaleString('en-IN')}
                </Text>
              </View>
              <Slider
                minimumValue={scheme.minAmount}
                maximumValue={scheme.maxAmount}
                value={investmentAmount}
                onValueChange={(v) => setInvestmentAmount(Math.round(v / 500) * 500)}
                step={500}
                minimumTrackTintColor="#3D5AFE"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#3D5AFE"
                style={{ height: 36 }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8' }}>
                  ₹{scheme.minAmount.toLocaleString('en-IN')}
                </Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8' }}>
                  ₹{scheme.maxAmount.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>

            {/* Tenure Slider */}
            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: '#64748B' }}>Tenure (Years)</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: '#0F172A' }}>{tenure} yrs</Text>
              </View>
              <Slider
                minimumValue={scheme.minTenure}
                maximumValue={scheme.maxTenure}
                value={tenure}
                onValueChange={(v) => setTenure(Math.round(v))}
                step={1}
                minimumTrackTintColor="#3D5AFE"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#3D5AFE"
                style={{ height: 36 }}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8' }}>{scheme.minTenure} yr</Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#94A3B8' }}>{scheme.maxTenure} yrs</Text>
              </View>
            </View>

            {/* Results Row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: '#F0FDF4', borderRadius: 14, padding: 16 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: '#16A34A', marginBottom: 4 }}>Returns Gained</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#16A34A' }}>
                  +₹{returnsGained.toLocaleString('en-IN')}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: '#3D5AFE', borderRadius: 14, padding: 16 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: '#BFDBFE', marginBottom: 4 }}>Maturity Value</Text>
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: '#ffffff' }}>
                  ₹{maturityValue.toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Key Benefits Card ──────────────────────────────── */}
          <View style={{
            backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16,
            shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12, elevation: 3,
            borderWidth: 1.5, borderColor: '#E2E8F0',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: '#F0FDF4', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <CheckCircle2 size={18} color="#16A34A" strokeWidth={2.5} />
              </View>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#0F172A' }}>Key Benefits</Text>
            </View>
            {scheme.keyBenefits.map((benefit, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
                <CheckCircle2 size={15} color="#16A34A" strokeWidth={2.5} style={{ marginTop: 2, marginRight: 10 }} />
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: '#475569', flex: 1, lineHeight: 21 }}>
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Official Website Button */}
          <TouchableOpacity
            onPress={() => Linking.openURL(scheme.officialLink)}
            activeOpacity={0.85}
            style={{
              width: '100%', backgroundColor: '#3D5AFE', borderRadius: 16,
              paddingVertical: 16, flexDirection: 'row', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              shadowColor: '#3D5AFE', shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
              marginBottom: 8,
            }}
          >
            <ExternalLink size={18} color="#ffffff" strokeWidth={2.5} />
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: '#ffffff' }}>
              Visit Official Website
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

// ─── Main Step6 Component ────────────────────────────────────────────────────
const Step6_Advice = () => {
  const { width } = Dimensions.get('window');
  const { investableSurplus, reserveAmount, setStep, safeNumber, members } = useOnboarding();
  const navigation = useNavigation();

  // Handle Android hardware back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setStep(4);
        navigation.navigate('Step4_Analysis');
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const [selectedScheme, setSelectedScheme] = useState(null);
  const [showSchemeDetail, setShowSchemeDetail] = useState(false);

  const handleSchemePress = (recName) => {
    const data = SCHEME_DATA[recName] || null;
    if (data) {
      setSelectedScheme(data);
      setShowSchemeDetail(true);
    }
  };

  const getStrategy = () => {
    const b = safeNumber(investableSurplus);
    const hasGirl = members.some(m => m.gender === 'Female' || m.gender === 'Female // XX');

    const mke = (title, reasoning, risk, riskColor, riskBg, riskBorder, recs) =>
      ({ title, reasoning, risk, riskColor, riskBg, riskBorder, recommendations: recs });

    if (b <= 2000) return mke('Ultra-Safe Savings Plan', 'Your savings amount is small right now. We suggest keeping your money safe and easy to access.', 'No Risk', '#10b981', '#ECFDF5', '#BBF7D0', [
      { name: 'Savings Account', target: 'Easy to Access', portion: '70%', icon: Wallet, ic: '#3b82f6', bg: '#EFF6FF', bd: '#BFDBFE' },
      { name: 'Recurring Deposit', target: 'Regular Saving', portion: '30%', icon: Landmark, ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
    ]);
    if (b <= 10000) return mke('Safe Growth Plan', 'A good mix to protect your money and help it grow a little each month.', 'Low Risk', '#d97706', '#FFFBEB', '#FDE68A', [
      { name: 'Fixed Deposit', target: 'Safe & Secure', portion: '60%', icon: Shield, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
      { name: 'Bluechip Mutual Fund', target: 'Steady Growth', portion: '40%', icon: TrendingUp, ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
    ]);
    if (b <= 25000) {
      const recs = [
        { name: 'Emergency Reserve', target: 'Safety First', portion: '40%', icon: Banknote, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
        { name: 'Flexi Mutual Fund', target: 'Wealth Growth', portion: '40%', icon: TrendingUp, ic: C.accent, bg: '#EFF6FF', bd: '#BFDBFE' },
        hasGirl
          ? { name: 'Sukanya Samriddhi', target: 'Girl Child Fund', portion: '20%', icon: HeartPulse, ic: '#f43f5e', bg: '#FFF1F2', bd: '#FECDD3' }
          : { name: 'PPF Account', target: 'Tax-Free Savings', portion: '20%', icon: Landmark, ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
      ];
      return mke('Balanced Investment Plan', 'Save tax and grow your wealth at the same time with this balanced mix.', 'Moderate Risk', '#d97706', '#FFFBEB', '#FDE68A', recs);
    }
    return mke('Growth Investment Plan', 'You have a strong savings amount. This plan helps your money grow faster across different investments.', 'Growth', C.accent, '#EFF6FF', '#BFDBFE', [
      { name: 'Mid-Cap Mutual Fund', target: 'High Growth', portion: '40%', icon: TrendingUp, ic: '#3D5AFE', bg: '#EFF6FF', bd: '#BFDBFE' },
      { name: 'Gold Savings Bond', target: 'Protect Value', portion: '30%', icon: Coins, ic: '#d97706', bg: '#FFFBEB', bd: '#FDE68A' },
      { name: 'Index Fund', target: 'Safe + Growth', portion: '30%', icon: CircleDollarSign, ic: '#10b981', bg: '#ECFDF5', bd: '#BBF7D0' },
    ]);
  };

  const balance = safeNumber(investableSurplus);
  const strategy = getStrategy();

  if (balance <= 0) {
    return (
      <OnboardingLayout currentStep={5}>
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
    <>
      <OnboardingLayout currentStep={5}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
          <TouchableOpacity onPress={() => { setStep(4); navigation.navigate('Step4_Analysis'); }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F1F5F9', borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
            </View>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.3, color: C.sub }}>Go Back</Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
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
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, letterSpacing: 0.2, color: C.muted, marginBottom: 14 }}>
              Tap any card below to learn more and use the Yield Calculator 📊
            </Text>
            <View style={{ gap: 10 }}>
              {strategy.recommendations.map((rec, idx) => (
                <MotiView key={idx} from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }} transition={{ delay: 300 + idx * 100 }}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleSchemePress(rec.name)}
                    style={{
                      padding: 16, borderRadius: 18, borderWidth: 1.5, borderColor: C.border,
                      flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card,
                    }}
                  >
                    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: rec.bg, borderWidth: 1.5, borderColor: rec.bd, alignItems: 'center', justifyContent: 'center' }}>
                      <rec.icon size={18} color={rec.ic} strokeWidth={2.5} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 14, letterSpacing: 0, color: C.text }}>{rec.name}</Text>
                      <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 11, letterSpacing: 0.2, marginTop: 3, color: C.muted }}>{rec.target}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10, backgroundColor: '#EFF6FF', borderWidth: 1.5, borderColor: '#BFDBFE' }}>
                        <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: C.accent }}>{rec.portion}</Text>
                      </View>
                      <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 10, color: C.muted }}>Tap to explore →</Text>
                    </View>
                  </TouchableOpacity>
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

      {/* Scheme Detail Modal */}
      <SchemeDetailModal
        scheme={selectedScheme}
        visible={showSchemeDetail}
        onClose={() => setShowSchemeDetail(false)}
      />
    </>
  );
};

export default Step6_Advice;
