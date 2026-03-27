import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthStackNavigator from './AuthStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import { View, ActivityIndicator, Text, ImageBackground, StatusBar } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

// Theme moved to App.js

export default function RootNavigator() {
 const { user, userProfile, loading } = useAuth();

 if (loading) {
 return (
 <ImageBackground 
 source={{ uri: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000' }}
 className="flex-1"
 >
 <StatusBar barStyle="light-content" />
 <LinearGradient 
 colors={['rgba(2, 6, 23, 0.9)', 'rgba(2, 6, 23, 1)']}
 className="flex-1 items-center justify-center px-10"
 >
 <View className="items-center space-y-8">
 <View className="w-24 h-24 bg-indigo-600/20 rounded-[2.5rem] items-center justify-center border border-indigo-500/30 shadow-2xl shadow-indigo-600/40">
 <ActivityIndicator size="large" color="#818cf8" />
 </View>
 <View className="items-center">
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.5em] ">Neural Link Active</Text>
 <Text className="text-4xl font-black text-white tracking-tighter mt-2 uppercase">SmartFinance</Text>
 <BlurView intensity={10} tint="dark" className="px-6 py-2 rounded-xl mt-6 border border-white/5 opacity-40">
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Syncing Matrix Core...</Text>
 </BlurView>
 </View>
 </View>
 </LinearGradient>
 </ImageBackground>
 );
 }

 return (
 <>
 {!user ? (
 <AuthStackNavigator />
 ) : userProfile && !userProfile.onboardingComplete ? (
 <OnboardingNavigator />
 ) : (
 <AppStackNavigator />
 )}
 </>
 );
}
