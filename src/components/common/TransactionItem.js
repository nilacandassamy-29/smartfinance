import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Trash2, UtensilsCrossed, Wallet, User, Receipt, Plane, Zap, Shield } from 'lucide-react-native';
import { MotiView } from 'moti';

const getCategoryDetails = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('food')) return { bg: '#fff7ed', icon: <UtensilsCrossed size={18} color="#f97316" /> };
    if (cat.includes('personal')) return { bg: '#faf5ff', icon: <User size={18} color="#a855f7" /> };
    if (cat.includes('general')) return { bg: '#eff6ff', icon: <Wallet size={18} color="#3b82f6" /> };
    if (cat.includes('transport')) return { bg: '#ccfbf1', icon: <Plane size={18} color="#14b8a6" /> };
    if (cat.includes('bill')) return { bg: '#fee2e2', icon: <Zap size={18} color="#ef4444" /> };
    if (cat.includes('shop')) return { bg: '#fce7f3', icon: <Shield size={18} color="#ec4899" /> };
    return { bg: '#f8fafc', icon: <Receipt size={18} color="#64748b" /> };
};

const TransactionItem = ({ item, index, onDelete }) => {
    const isIncome = item.type === 'income';
    const catDetails = getCategoryDetails(item.category);

    return (
        <MotiView
            from={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 40, type: 'timing', duration: 400 }}
            style={{ 
                flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', 
                borderRadius: 14, padding: 14, marginBottom: 8,
                shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, shadowOffset: { width: 0, height: 4 }
            }}
        >
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: catDetails.bg, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                {catDetails.icon}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: '#0f172a' }}>{item.description || item.title}</Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{item.category}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: isIncome ? '#10b981' : '#ef4444' }}>
                    {isIncome ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </Text>
                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}</Text>
            </View>
            {onDelete && (
                <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 16 }}>
                    <Trash2 size={16} color="#cbd5e1" />
                </TouchableOpacity>
            )}
        </MotiView>
    );
};

export default TransactionItem;
