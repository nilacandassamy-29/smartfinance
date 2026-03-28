import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import Investments from '../screens/Investments';
import Settings from '../screens/Settings';
import SchemeDetails from '../screens/SchemeDetails';
import ExpenseHistoryScreen from '../screens/ExpenseHistoryScreen';
import ExpenseHistoryDetailScreen from '../screens/ExpenseHistoryDetailScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FAQScreen from '../screens/FAQScreen';
import ProfileMenuScreen from '../screens/ProfileMenuScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SecurityScreen from '../screens/SecurityScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ThemeScreen from '../screens/ThemeScreen';

const Stack = createNativeStackNavigator();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="Investments" component={Investments} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="SchemeDetails" component={SchemeDetails} />
      <Stack.Screen name="ExpenseHistory" component={ExpenseHistoryScreen} />
      <Stack.Screen name="ExpenseHistoryDetail" component={ExpenseHistoryDetailScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="FAQScreen" component={FAQScreen} />
      <Stack.Screen name="ThemeScreen" component={ThemeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileMenuScreen" component={ProfileMenuScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HelpSupportScreen" component={HelpSupportScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
