import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Step1_FamilySize from '../screens/onboarding/Step1_FamilySize';
import Step2_MemberDetails from '../screens/onboarding/Step2_MemberDetails';
import Step3_Expenses from '../screens/onboarding/Step3_Expenses';
import Step4_Analysis from '../screens/onboarding/Step4_Analysis';
import Step6_Advice from '../screens/onboarding/Step6_Advice';
import Step7_FinalSummary from '../screens/onboarding/Step7_FinalSummary';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
 return (
 <Stack.Navigator screenOptions={{ headerShown: false }}>
 <Stack.Screen name="Step1_FamilySize" component={Step1_FamilySize} />
 <Stack.Screen name="Step2_MemberDetails" component={Step2_MemberDetails} />
 <Stack.Screen name="Step3_Expenses" component={Step3_Expenses} />
 <Stack.Screen name="Step4_Analysis" component={Step4_Analysis} />
 <Stack.Screen name="Step6_Advice" component={Step6_Advice} />
 <Stack.Screen name="Step7_FinalSummary" component={Step7_FinalSummary} />
 </Stack.Navigator>
 );
}
