import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, StatusBar, SafeAreaView, Platform } from 'react-native';
import { Search, ArrowRight, ShieldCheck, Wallet, TrendingUp, Umbrella, Info, ChevronRight } from 'lucide-react-native';
import { schemes } from '../data/schemesList';
import { MotiView } from 'moti';
import { useNavigation } from '@react-navigation/native';
import FeatureTag from '../components/common/FeatureTag';
import { GlassCard } from '../components/GlassCard';

const Schemes = () => {
    const navigation = useNavigation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const schemesList = Object.values(schemes);
    const categories = ['All', 'Savings', 'Government', 'Insurance', 'Investments'];

    const filteredSchemes = schemesList.filter(scheme => {
        const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Savings': return <Wallet size={20} color="#10b981" strokeWidth={2.5} />;
            case 'Government': return <ShieldCheck size={20} color="#818cf8" strokeWidth={2.5} />;
            case 'Insurance': return <Umbrella size={20} color="#f43f5e" strokeWidth={2.5} />;
            case 'Investments': return <TrendingUp size={20} color="#3b82f6" strokeWidth={2.5} />;
            default: return <ShieldCheck size={20} color="#94a3b8" strokeWidth={2.5} />;
        }
    };

    const getCategoryGlow = (category) => {
        switch (category) {
            case 'Savings': return 'bg-emerald-500/10';
            case 'Government': return 'bg-indigo-500/10';
            case 'Insurance': return 'bg-rose-500/10';
            case 'Investments': return 'bg-blue-500/10';
            default: return 'bg-slate-800/50';
        }
    };

    const renderHeader = () => (
        <View>
            <View className="px-6 pt-10 pb-6">
                <FeatureTag text="Protocol Library" subText="v2.0" />
                <Text className="text-5xl font-grenze-bold text-white tracking-tighter italic uppercase mb-1">Smart{'\n'}Schemes</Text>
                <Text className="text-slate-500 font-cinzel text-xs mb-6 tracking-widest uppercase">Elite Financial Protocols</Text>
            </View>

            {/* Search */}
            <View className="mx-6 mb-8">
                <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl h-14 px-5 shadow-inner">
                    <Search size={18} color="#475569" />
                    <TextInput
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        placeholder="Search protocols..."
                        placeholderTextColor="#475569"
                        className="flex-1 ml-4 text-white text-sm font-cinzel"
                    />
                </View>
            </View>

            {/* Category Filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6 mb-10" contentContainerStyle={{ gap: 12 }}>
                {categories.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        activeOpacity={0.7}
                        className={`px-6 py-3 rounded-2xl border ${selectedCategory === cat ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-white/5 border-white/10'}`}
                    >
                        <Text className={`text-[10px] font-cinzel-bold uppercase tracking-[0.2em] ${selectedCategory === cat ? 'text-white' : 'text-slate-500'}`}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View className="px-6 mb-6 flex-row items-center gap-3">
                <View className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <Text className="text-xl font-grenze-bold text-white uppercase tracking-tight italic">Protocol Log</Text>
            </View>
        </View>
    );

    const renderItem = ({ item, index }) => (
        <MotiView
            from={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 50, type: 'timing', duration: 400 }}
            className="mx-6 mb-6"
        >
            <GlassCard intensity={15} style={{ padding: 28 }}>
                <View className="flex-row justify-between items-start mb-6">
                    <View className={`w-14 h-14 rounded-2xl items-center justify-center border border-white/5 ${getCategoryGlow(item.category)} shadow-inner`}>
                        {getCategoryIcon(item.category)}
                    </View>
                    <View className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 shadow-sm">
                        <Text className="text-slate-500 text-[8px] font-grenze-semibold uppercase tracking-widest">{item.category}</Text>
                    </View>
                </View>

                <Text className="text-white text-2xl font-grenze-bold tracking-tight uppercase italic mb-3">{item.name}</Text>
                <Text className="text-slate-400 text-sm leading-relaxed mb-8 font-cinzel">{item.description}</Text>

                {item.details && (
                    <View className="flex-row flex-wrap gap-4 mb-8">
                        {Object.entries(item.details).slice(0, 3).map(([key, val]) => (
                            <View key={key} className="bg-white/5 rounded-2xl px-5 py-3 border border-white/5 shadow-inner">
                                <Text className="text-slate-500 text-[8px] uppercase font-cinzel-semibold tracking-[0.2em] mb-1">{key}</Text>
                                <Text className="text-white text-[11px] font-grenze-semibold tracking-tight">{val}</Text>
                            </View>
                        ))}
                    </View>
                )}

                <TouchableOpacity 
                    onPress={() => navigation.navigate('SchemeDetails', { schemeId: Object.keys(schemes)[index] })}
                    activeOpacity={0.8}
                    className="flex-row items-center justify-between bg-indigo-600 rounded-[1.5rem] px-8 py-5 shadow-2xl shadow-indigo-600/20"
                >
                    <Text className="text-white text-[11px] font-cinzel-bold uppercase tracking-[0.3em]">Analyze Details</Text>
                    <ArrowRight size={18} color="#fff" strokeWidth={3} />
                </TouchableOpacity>
            </GlassCard>
        </MotiView>
    );

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" backgroundColor="#020617" />
            
            {/* Background Glow */}
            <View className="absolute top-0 right-0 w-full h-full" pointerEvents="none">
                <View className="absolute top-[-5%] right-[-10%] w-[80%] h-[40%] bg-indigo-600/5 rounded-full blur-[100px]" />
                <View className="absolute bottom-[20%] left-[-10%] w-[70%] h-[30%] bg-blue-600/5 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1">
                <FlatList
                    data={filteredSchemes}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={
                        <View className="py-24 items-center justify-center border border-white/5 border-dashed mx-6 rounded-[3rem] bg-white/5">
                            <View className="w-20 h-20 bg-white/5 rounded-[2.5rem] items-center justify-center mb-6 border border-white/5">
                                <Search size={32} color="#334155" />
                            </View>
                            <Text className="text-slate-500 font-outfit-bold text-[10px] uppercase tracking-[0.4em] italic mb-2">Protocol Mismatch</Text>
                            <Text className="text-slate-600 text-[9px] font-outfit-semibold uppercase tracking-widest">No matching nodes in local library</Text>
                        </View>
                    }
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
};

export default Schemes;
