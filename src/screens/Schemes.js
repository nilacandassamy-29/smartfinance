import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserProfileSettings } from '../context/UserProfileContext';
import { schemes } from '../data/schemesList';
import { Search, ShieldAlert } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useTheme } from '../context/ThemeContext';

const schemesArray = Object.values(schemes);

export default function Schemes({ navigation }) {
    const { profileSettings } = useUserProfileSettings();
    const { theme, isDarkMode } = useTheme();
    const riskProfile = profileSettings?.riskProfile || 'Moderate';

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const riskColor = { 'Very Low': '#10b981', 'Low': '#10b981', 'Low-Medium': '#f59e0b', 'Moderate to High': theme.danger, 'High': theme.danger };

    // Risk Parsing logic
    const isSchemeAllowed = (scheme) => {
        const cat = (scheme.category || '').toLowerCase();
        const r = scheme.risk || 'High';
        if (riskProfile === 'Aggressive') return true;
        if (riskProfile === 'Conservative') {
            return cat.includes('government') || cat.includes('insurance');
        }
        if (riskProfile === 'Moderate') {
            if (cat.includes('government') || cat.includes('insurance')) return true;
            if (['Very Low', 'Low', 'Low-Medium'].includes(r)) return true;
        }
        return false;
    };

    const eligibleSchemes = schemesArray.filter(isSchemeAllowed);
    const categories = ['All', ...new Set(eligibleSchemes.map(s => s.category))];

    const filtered = eligibleSchemes.filter(s => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeTab === 'All' || s.category === activeTab;
        return matchSearch && matchCat;
    });

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Profile Banner */}
                <View style={{ backgroundColor: isDarkMode ? '#1e3a8a' : '#eff6ff', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <ShieldAlert size={16} color="#3b82f6" style={{ marginRight: 8 }} />
                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: isDarkMode ? '#bfdbfe' : '#1e3a8a', flexShrink: 1 }}>
                            Showing schemes for your <Text style={{ fontFamily: 'Poppins-Bold' }}>{riskProfile}</Text> profile.
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 12, color: '#3b82f6', marginLeft: 12, textDecorationLine: 'underline' }}>Change</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, color: theme.text, marginBottom: 16 }}>Schemes</Text>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', gap: 10,
                        backgroundColor: theme.inputBg, borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 14,
                        borderWidth: 1.5, borderColor: theme.border,
                    }}>
                        <Search size={20} color={theme.subText} />
                        <TextInput
                            value={search} onChangeText={setSearch}
                            placeholder="Search schemes..." placeholderTextColor={theme.placeholder}
                            style={{ flex: 1, fontFamily: 'Poppins-Medium', fontSize: 14, color: theme.text }}
                        />
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
                        {categories.map((cat, i) => (
                            <TouchableOpacity
                                key={i} onPress={() => setActiveTab(cat)}
                                style={{
                                    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                    backgroundColor: activeTab === cat ? '#2563eb' : theme.card,
                                    borderWidth: 1.5, borderColor: activeTab === cat ? '#2563eb' : theme.border,
                                }}
                            >
                                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 13, color: activeTab === cat ? '#fff' : theme.subText }}>{cat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 110, gap: 10 }} showsVerticalScrollIndicator={false}>
                    {filtered.map((scheme, i) => (
                        <MotiView key={scheme.id} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ delay: i * 50, type: 'timing', duration: 350 }}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('SchemeDetails', { schemeId: scheme.id })}
                                activeOpacity={0.88}
                                style={{
                                    backgroundColor: theme.card, borderRadius: 18, padding: 18,
                                    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
                                    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                                }}
                            >
                                <View style={{ flex: 1, marginRight: 16 }}>
                                    <View style={{ marginBottom: 6 }}>
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 11, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{scheme.category}</Text>
                                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 15, color: theme.text, lineHeight: 22 }}>{scheme.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: riskColor[scheme.risk] || theme.subText }} />
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText }}>{scheme.risk} Risk</Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#10b981' }}>{scheme.rate}</Text>
                                    <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: theme.subText, marginTop: 2 }}>→</Text>
                                </View>
                            </TouchableOpacity>
                        </MotiView>
                    ))}
                    {filtered.length === 0 && (
                        <View style={{ alignItems: 'center', paddingTop: 60 }}>
                            <Search size={40} color={theme.placeholder} style={{ marginBottom: 12 }} />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 15, color: theme.text }}>No matching schemes</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
