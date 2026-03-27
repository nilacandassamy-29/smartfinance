import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
 return (
 <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
 <Stack.Screen name="Welcome" component={WelcomeScreen} />
 <Stack.Screen name="GetStarted" component={GetStartedScreen} />
 <Stack.Screen name="Login" component={LoginScreen} />
 <Stack.Screen name="Register" component={RegisterScreen} />
 </Stack.Navigator>
 );
}
