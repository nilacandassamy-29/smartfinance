import React from 'react';
import { View, Text } from 'react-native';

const FeatureTag = ({ text, subText }) => {
    return (
        <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 self-start mb-4">
            <View className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <Text className="text-indigo-400 text-[10px] font-grenze-bold uppercase tracking-[0.2em]">
                {text} {subText && <Text className="font-cinzel opacity-60">{subText}</Text>}
            </Text>
        </View>
    );
};

export default FeatureTag;
