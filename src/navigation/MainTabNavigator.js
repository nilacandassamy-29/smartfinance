import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Compass, User, CreditCard } from 'lucide-react-native';
import Dashboard from '../screens/Dashboard';
import Expenses from '../screens/Expenses';
import Schemes from '../screens/Schemes';
import Profile from '../screens/Profile';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: theme.subText,
                tabBarStyle: {
                    backgroundColor: theme.tabBar,
                    borderTopWidth: 1,
                    borderTopColor: theme.tabBarBorder,
                    elevation: 10,
                    height: 85,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontFamily: 'Inter-Medium',
                    fontSize: 12,
                    marginTop: 4,
                },
                tabBarIcon: ({ color, focused, size }) => {
                    let IconComponent;
                    if (route.name === 'Home') IconComponent = Home;
                    else if (route.name === 'Expenses') IconComponent = CreditCard;
                    else if (route.name === 'Schemes') IconComponent = Compass;
                    else if (route.name === 'Profile') IconComponent = User;

                    return (
                        <View className={`items-center justify-center ${focused ? 'scale-110' : ''}`}>
                            <IconComponent size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={Dashboard} />
            <Tab.Screen name="Expenses" component={Expenses} />
            <Tab.Screen name="Schemes" component={Schemes} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
