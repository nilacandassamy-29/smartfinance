import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    { q: "How do I add an expense?", a: "Tap the + button on the Expenses screen. Fill in the title, amount, category and date, then tap Add Expense to save it." },
    { q: "How is Monthly Out calculated?", a: "Monthly Out shows the total of all expenses you have added during the current calendar month." },
    { q: "What is Daily Target?", a: "Daily Target is the maximum amount you want to spend per day. Set it in Profile → Daily Target. It is used to calculate your AVG Health score." },
    { q: "How does AVG Health work?", a: "AVG Health grades your spending habits. Excellent means you are within budget. Deficient means you are regularly overspending or have not added any income." },
    { q: "How do I view previous month expenses?", a: "Go to Expenses screen and tap the History button to view past months." },
    { q: "What is Risk Profile?", a: "Risk Profile tells the app how much investment risk you are comfortable with. It filters the Schemes page to show suitable options for you." },
    { q: "How do I change my password?", a: "Go to Profile → Security → Change Password." },
    { q: "How do I log out?", a: "Tap the three-dot menu on Profile screen and tap Log Out at the bottom." }
];

export default function FAQScreen({ navigation }) {
    const [expanded, setExpanded] = useState(null);
    const { theme, isDarkMode } = useTheme();

    const toggleAccordion = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(expanded === index ? null : index);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <SafeAreaView style={{ flex: 1 }}>
                
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.divider }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 20, zIndex: 10, padding: 8, backgroundColor: theme.card, borderRadius: 20, borderWidth: 1, borderColor: theme.border, elevation: 1 }}>
                        <ChevronLeft size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 20, color: theme.text }}>FAQs</Text>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                    {FAQS.map((faq, index) => {
                        const isExpanded = expanded === index;
                        return (
                            <TouchableOpacity 
                                key={index} 
                                onPress={() => toggleAccordion(index)}
                                activeOpacity={0.8}
                                style={{ backgroundColor: theme.card, borderRadius: 16, marginBottom: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: isExpanded ? '#2563eb' : theme.border }}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ flex: 1, fontFamily: 'Poppins-SemiBold', fontSize: 14, color: isExpanded ? '#2563eb' : theme.text, paddingRight: 16, lineHeight: 22 }}>{faq.q}</Text>
                                    {isExpanded ? <ChevronUp size={20} color="#2563eb" /> : <ChevronDown size={20} color={theme.subText} />}
                                </View>
                                {isExpanded && (
                                    <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.divider }}>
                                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 13, color: theme.subText, lineHeight: 22 }}>{faq.a}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
