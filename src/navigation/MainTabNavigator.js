import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
    LayoutDashboard, 
    ReceiptIndianRupee, 
    Binary, 
    UserCircle 
} from 'lucide-react-native';

// Core Screens
import Dashboard from '../screens/Dashboard';
import Expenses from '../screens/Expenses';
import Schemes from '../screens/Schemes';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#020617',
                    borderTopColor: 'rgba(255,255,255,0.05)',
                    height: 90,
                    paddingBottom: 30,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    position: 'absolute',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#818cf8', // indigo-400
                tabBarInactiveTintColor: '#475569', // slate-500
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginTop: 4,
                }
            }}
        >
            <Tab.Screen 
                name="Dashboard" 
                component={Dashboard}
                options={{
                    tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
                }}
            />
            <Tab.Screen 
                name="Expenses" 
                component={Expenses}
                options={{
                    tabBarIcon: ({ color, size }) => <ReceiptIndianRupee color={color} size={size} />
                }}
            />
            <Tab.Screen 
                name="Schemes" 
                component={Schemes}
                options={{
                    tabBarIcon: ({ color, size }) => <Binary color={color} size={size} />
                }}
            />
            <Tab.Screen 
                name="Profile" 
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => <UserCircle color={color} size={size} />
                }}
            />
        </Tab.Navigator>
    );
}
