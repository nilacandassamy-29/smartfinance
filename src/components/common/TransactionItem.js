import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';

const TransactionItem = ({ item, index, onDelete }) => {
    const isIncome = item.type === 'income';

    return (
        <MotiView
            from={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 50, type: 'timing', duration: 400 }}
            className="mb-4 bg-white/5 border border-white/5 rounded-[2.5rem] p-5 flex-row items-center justify-between shadow-sm overflow-hidden"
        >
            <View className="flex-row items-center gap-4">
                <View className={`w-14 h-14 rounded-2xl items-center justify-center border border-white/5 shadow-inner ${isIncome ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                    {isIncome ? (
                        <ArrowDownLeft size={22} color="#10b981" strokeWidth={2.5} />
                    ) : (
                        <ArrowUpRight size={22} color="#f43f5e" strokeWidth={2.5} />
                    )}
                </View>
                <View>
                    <Text className="text-white text-base font-grenze-bold uppercase tracking-tight italic">
                        {item.description || item.title}
                    </Text>
                    <View className="flex-row items-center mt-1.5 space-x-2">
                        <Text className="text-indigo-400 text-[10px] font-cinzel-bold uppercase tracking-[0.2em]">
                            {item.category}
                        </Text>
                        <View className="w-1 h-1 rounded-full bg-slate-700" />
                        <Text className="text-slate-500 text-[10px] font-cinzel uppercase tracking-widest">
                            {item.date}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="items-end space-y-2">
                <Text className={`text-lg font-grenze-bold tracking-tighter italic ${isIncome ? 'text-emerald-400' : 'text-white'}`}>
                    {isIncome ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
                </Text>
                {onDelete && (
                    <TouchableOpacity 
                        onPress={() => onDelete(item.id)}
                        className="w-8 h-8 rounded-lg bg-rose-500/10 items-center justify-center border border-rose-500/20"
                    >
                        <Trash2 size={14} color="#f43f5e" />
                    </TouchableOpacity>
                )}
            </View>
        </MotiView>
    );
};

export default TransactionItem;
