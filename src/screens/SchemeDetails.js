import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { schemes } from '../data/schemesList';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';

export default function SchemeDetails({ route, navigation }) {
    const { schemeId } = route.params;
    const scheme = schemes[schemeId];
    const [amount, setAmount] = useState(10000);
    const [tenure, setTenure] = useState(5);
    const [rate, setRate] = useState(7);
    const [results, setResults] = useState({ maturity: 0, returns: 0 });

    const { theme, isDarkMode } = useTheme();

    useEffect(() => { if (scheme) setRate(parseFloat(scheme.interestRate) || 7); }, [scheme]);
    useEffect(() => {
        const a = amount * Math.pow(1 + rate / 100, tenure);
        setResults({ maturity: Math.round(a), returns: Math.round(a - amount) });
    }, [amount, tenure, rate]);

    if (!scheme) return null;

    const SectionTitle = ({ title }) => (
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 17, color: theme.text, marginBottom: 12, marginTop: 8 }}>{title}</Text>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 14, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: theme.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.border }}
                    >
                        <Text style={{ fontSize: 18, color: theme.text }}>←</Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text, flex: 1, flexShrink: 1, flexWrap: 'wrap' }}>{scheme.name}</Text>
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, gap: 14, paddingTop: 16 }} showsVerticalScrollIndicator={false}>

                    {/* Hero Tags */}
                    <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                        <View style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#2563eb' }}>{scheme.category}</Text>
                        </View>
                        <View style={{ backgroundColor: isDarkMode ? '#064e3b' : '#f0fdf4', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#10b981' }}>Rate: {scheme.rate}</Text>
                        </View>
                    </View>

                    <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.subText, lineHeight: 22 }}>{scheme.description}</Text>

                    {/* Calculator Card */}
                    <View style={{
                        backgroundColor: theme.card, borderRadius: 20, padding: 22,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: isDarkMode ? 0.2 : 0.08, shadowRadius: 12, elevation: 3, gap: 16,
                        borderWidth: isDarkMode ? 1 : 0, borderColor: theme.border,
                    }}>
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: theme.text }}>🧮 Yield Calculator</Text>

                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>Investment Amount</Text>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: theme.text }}>₹{amount.toLocaleString('en-IN')}</Text>
                            </View>
                            <Slider
                                minimumValue={1000} maximumValue={1000000} step={1000}
                                value={amount} onValueChange={setAmount}
                                minimumTrackTintColor="#2563eb"
                                maximumTrackTintColor={isDarkMode ? '#475569' : '#e2e8f0'}
                                thumbTintColor="#2563eb"
                            />
                        </View>

                        <View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.subText }}>Tenure (Years)</Text>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: theme.text }}>{tenure} yrs</Text>
                            </View>
                            <Slider
                                minimumValue={1} maximumValue={30} step={1}
                                value={tenure} onValueChange={setTenure}
                                minimumTrackTintColor="#2563eb"
                                maximumTrackTintColor={isDarkMode ? '#475569' : '#e2e8f0'}
                                thumbTintColor="#2563eb"
                            />
                        </View>

                        {/* Result Boxes */}
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <View style={{ flex: 1, backgroundColor: isDarkMode ? '#064e3b' : '#f0fdf4', borderRadius: 14, padding: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: isDarkMode ? '#6ee7b7' : '#065f46', marginBottom: 4 }}>Returns Gained</Text>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#10b981' }}>+₹{results.returns.toLocaleString('en-IN')}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: '#2563eb', borderRadius: 14, padding: 16 }}>
                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#bfdbfe', marginBottom: 4 }}>Maturity Value</Text>
                                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 18, color: '#ffffff' }}>₹{results.maturity.toLocaleString('en-IN')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Benefits */}
                    <View style={{
                        backgroundColor: theme.card, borderRadius: 20, padding: 20,
                        shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: isDarkMode ? 0.2 : 0.06, shadowRadius: 10, elevation: 2,
                        borderWidth: isDarkMode ? 1 : 0, borderColor: theme.border,
                    }}>
                        <SectionTitle title="✅ Key Benefits" />
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: theme.subText, lineHeight: 22 }}>{scheme.benefits}</Text>
                    </View>

                    {/* Institutions */}
                    {scheme.institutions && (
                        <View>
                            <SectionTitle title="🏛️ Available At" />
                            <View style={{ gap: 10 }}>
                                {scheme.institutions.map((inst, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => Linking.openURL(inst.website)}
                                        activeOpacity={0.8}
                                        style={{
                                            backgroundColor: theme.card, borderRadius: 14, padding: 16,
                                            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                            shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isDarkMode ? 0.2 : 0.05, shadowRadius: 8, elevation: 2,
                                            borderWidth: isDarkMode ? 1 : 0, borderColor: theme.border,
                                        }}
                                    >
                                        <View>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: theme.text }}>{inst.name}</Text>
                                            <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: theme.subText }}>{inst.type}</Text>
                                        </View>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#2563eb' }}>Visit →</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
