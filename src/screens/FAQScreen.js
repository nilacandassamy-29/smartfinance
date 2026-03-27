import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

export default function FAQScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f1f5f9' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={20} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#0f172a', marginLeft: 16 }}>FAQ</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <Text style={{ fontSize: 15, color: '#64748b', textAlign: 'center' }}>Frequently Asked Questions will be populated here soon.</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}
