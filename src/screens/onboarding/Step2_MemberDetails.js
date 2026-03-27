import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
 ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, 
 Home, Heart, Phone, Calendar, IndianRupee, Landmark, ShieldCheck, 
 AtSign, Cpu, Target, UserCircle
} from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView, AnimatePresence } from 'moti';
import { BlurView } from 'expo-blur';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import { Picker } from '@react-native-picker/picker';

const Step2_MemberDetails = () => {
 const {
 members, updateMember, familySize, setStep, mode
 } = useOnboarding();
 const navigation = useNavigation();
 const [currentIndex, setCurrentIndex] = useState(0);

 const activeMember = members[currentIndex] || {};

 const handleInputChange = (name, value) => {
 if (name === 'contact') {
 const cleaned = value.replace(/\D/g, '').slice(0, 10);
 updateMember(currentIndex, { [name]: cleaned });
 return;
 }
 updateMember(currentIndex, { [name]: value });
 };

 const isDobValid = () => {
 if (!activeMember.dob) return false;
 const selectedDate = new Date(activeMember.dob);
 const todayDate = new Date();
 todayDate.setHours(0, 0, 0, 0);
 return selectedDate <= todayDate;
 };

 const isContactValid = () => {
 const isSchoolStudent = activeMember.occupation === 'Student' && activeMember.educationType === 'School Student';
 const contact = activeMember.contact || '';
 if (isSchoolStudent) return true;
 return contact.length === 10;
 };

 const handleBack = () => {
 if (currentIndex > 0) {
 setCurrentIndex(currentIndex - 1);
 } else {
 setStep(1);
 navigation.navigate('Step1_FamilySize');
 }
 };

 const isStepValid = () => {
 const hasName = activeMember.name && activeMember.name.trim().length > 0;
 const hasGender = activeMember.gender && activeMember.gender !== '';
 const hasOccupation = activeMember.occupation && activeMember.occupation !== '';
 const dobValid = isDobValid();
 const contactValid = isContactValid();

 if (activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') {
 const hasIncome = activeMember.income && Number(activeMember.income) > 0;
 const hasSector = activeMember.sector && activeMember.sector !== '';
 return hasName && hasGender && hasOccupation && dobValid && contactValid && hasIncome && hasSector;
 }
 return hasName && hasGender && hasOccupation && dobValid && contactValid;
 };

 const handleNext = () => {
 if (!isStepValid()) return;
 if (currentIndex < familySize - 1) {
 setCurrentIndex(currentIndex + 1);
 } else {
 setStep(3);
 navigation.navigate('Step3_Expenses');
 }
 };

 const occupations = [
 { id: 'Student', label: 'Scholastic', icon: <GraduationCap size={24} /> },
 { id: 'Working', label: 'Industrial', icon: <Briefcase size={24} /> },
 { id: 'Homemaker', label: 'Domestic', icon: <Home size={24} /> },
 { id: 'Retired', label: 'Emeritus', icon: <Heart size={24} /> },
 ];

 return (
 <OnboardingLayout currentStep={2}>
 <View className="mb-10 flex-row items-center justify-between">
 <TouchableOpacity onPress={handleBack} className="flex-row items-center space-x-3">
 <View className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 items-center justify-center">
 <ChevronLeft size={16} color="#475569" strokeWidth={3} />
 </View>
 <Text className="text-slate-500 font-black text-xs uppercase tracking-[0.3em] ">Backtrack</Text>
 </TouchableOpacity>
 <BlurView intensity={20} tint="dark" className="px-4 py-2 rounded-xl border border-white/5 overflow-hidden">
 <Text className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">
 {mode === 'Family' ? `Node ${currentIndex + 1} // ${familySize}` : 'Persona Calibration'}
 </Text>
 </BlurView>
 </View>

 <View className="mb-12">
 <Text className="text-4xl font-black text-white tracking-tighter uppercase ">
 {mode === 'Family' ? `${activeMember.name || 'Entity Profile'}` : 'Neural Profile'}
 </Text>
 <Text className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest leading-relaxed">
 Executing demographic mapping for biometric alignment.
 </Text>
 </View>

 <AnimatePresence exitBeforeEnter>
 <MotiView
 key={currentIndex}
 from={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 className="space-y-10"
 >
 {/* Primary Data Input Group */}
 <View className="space-y-8">
 <InputField 
 label="Biological Identity (Name) *" 
 icon={<User size={18} color="#475569" />}
 placeholder="Full Alias"
 value={activeMember.name}
 onChangeText={(val) => handleInputChange('name', val)}
 />

 <View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 ml-1">Cellular Classification (Gender) *</Text>
 <View className="w-full h-14 bg-white/5 rounded-[1.25rem] border border-white/5 justify-center px-2">
 <Picker
 selectedValue={activeMember.gender}
 onValueChange={(val) => handleInputChange('gender', val)}
 dropdownIconColor="#475569"
 style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
 >
 <Picker.Item label="SELECT GENDER" value="" />
 <Picker.Item label="MALE // XY" value="Male" />
 <Picker.Item label="FEMALE // XX" value="Female" />
 <Picker.Item label="NON-BINARY // OTHER" value="Other" />
 </Picker>
 </View>
 </View>

 <InputField 
 label="Origin Pulse (DOB: YYYY-MM-DD) *" 
 icon={<Calendar size={18} color="#475569" />}
 placeholder="YYYY-MM-DD"
 value={activeMember.dob}
 onChangeText={(val) => handleInputChange('dob', val)}
 error={activeMember.dob && !isDobValid()}
 />

 <InputField 
 label="Signal Uplink (Contact) *" 
 icon={<Phone size={18} color="#475569" />}
 placeholder="10-Digit Mobile"
 keyboardType="numeric"
 value={activeMember.contact}
 onChangeText={(val) => handleInputChange('contact', val)}
 error={activeMember.contact && !isContactValid()}
 />
 </View>

 {/* Operational Directive Group */}
 <View className="mt-4">
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-1">Functional Directive (Occupation)</Text>
 <View className="flex-row flex-wrap gap-4">
 {occupations.map((occ) => (
 <TouchableOpacity
 key={occ.id}
 onPress={() => updateMember(currentIndex, { occupation: occ.id })}
 style={{ width: '47%' }}
 activeOpacity={0.8}
 className={`p-6 rounded-[1.5rem] border-2 flex-col items-center shadow-xl ${activeMember.occupation === occ.id ? 'bg-indigo-600/20 border-indigo-500' : 'bg-white/5 border-white/5 shadow-inner'}`}
 >
 <View className={`w-12 h-12 rounded-xl items-center justify-center mb-3 ${activeMember.occupation === occ.id ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
 {React.cloneElement(occ.icon, { color: activeMember.occupation === occ.id ? '#818cf8' : '#475569', strokeWidth: 2.5 })}
 </View>
 <Text className={`font-black text-xs uppercase tracking-[0.2em] ${activeMember.occupation === occ.id ? 'text-white' : 'text-slate-500'}`}>{occ.label}</Text>
 </TouchableOpacity>
 ))}
 </View>
 </View>

 {/* Conditional Logic Modules */}
 {activeMember.occupation === 'Student' && (
 <MotiView from={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
 <View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 ml-1">Academic Tier</Text>
 <View className="flex-row space-x-3">
 {['School Student', 'College Student'].map(type => (
 <TouchableOpacity
 key={type}
 onPress={() => updateMember(currentIndex, { educationType: type, school: '', college: '', std: '', course: '', year: '', totalFees: 0 })}
 className={`flex-1 h-12 rounded-xl items-center justify-center border ${activeMember.educationType === type ? 'bg-indigo-600 border-indigo-500' : 'bg-white/5 border-white/5'}`}
 >
 <Text className={`text-xs font-black uppercase tracking-widest ${activeMember.educationType === type ? 'text-white' : 'text-slate-500'}`}>{type}</Text>
 </TouchableOpacity>
 ))}
 </View>
 </View>

 <InputField 
 label={activeMember.educationType === 'School Student' ? "Institution Alias (School)" : "Institution Alias (College)"}
 icon={<GraduationCap size={18} color="#475569" />}
 value={activeMember.educationType === 'School Student' ? activeMember.school : activeMember.college}
 onChangeText={(val) => handleInputChange(activeMember.educationType === 'School Student' ? 'school' : 'college', val)}
 placeholder="Alias Name"
 />

 <View className="p-6 bg-indigo-500/10 rounded-[2rem] border border-indigo-500/20">
 <Text className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-4">Cumulative Fees (Annual)</Text>
 <View className="flex-row items-center bg-white/5 h-14 rounded-xl px-4 border border-white/5">
 <IndianRupee size={16} color="#818cf8" strokeWidth={2.5} />
 <TextInput
 className="flex-1 font-black text-lg text-white ml-3"
 placeholder="0"
 placeholderTextColor="rgba(255,255,255,0.2)"
 keyboardType="numeric"
 value={String(activeMember.totalFees || '')}
 onChangeText={(val) => handleInputChange('totalFees', Number(val) || 0)}
 />
 </View>
 </View>
 </MotiView>
 )}

 {(activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') && (
 <MotiView from={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
 <View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-1 ml-1">Economic Sector</Text>
 <View className="w-full h-14 bg-white/5 rounded-[1.25rem] border border-white/5 justify-center px-2">
 <Picker
 selectedValue={activeMember.sector}
 onValueChange={(val) => handleInputChange('sector', val)}
 dropdownIconColor="#475569"
 style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
 >
 <Picker.Item label="SELECT SECTOR" value="" />
 <Picker.Item label="PRIVATE // CORP" value="Private" />
 <Picker.Item label="PUBLIC // GOVT" value="Public" />
 <Picker.Item label="BUSINESS // OPS" value="Business" />
 <Picker.Item label="FREELANCE // INDIE" value="Freelance" />
 </Picker>
 </View>
 </View>

 <View className="p-6 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10">
 <Text className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Monthly Inflow (Income)</Text>
 <View className="flex-row items-center bg-white/5 h-14 rounded-xl px-4 border border-white/5 shadow-inner">
 <IndianRupee size={16} color="#10b981" strokeWidth={3} />
 <TextInput
 className="flex-1 font-black text-lg text-white ml-3"
 placeholder="0"
 placeholderTextColor="rgba(255,255,255,0.2)"
 keyboardType="numeric"
 value={String(activeMember.income || '')}
 onChangeText={(val) => handleInputChange('income', Number(val) || 0)}
 />
 </View>
 </View>
 </MotiView>
 )}

 <TouchableOpacity
 onPress={handleNext}
 activeOpacity={0.9}
 disabled={!isStepValid()}
 className={`mt-10 w-full h-16 rounded-[1.5rem] flex-row items-center justify-center shadow-2xl ${isStepValid() ? 'bg-indigo-600 shadow-indigo-600/40' : 'bg-white/5 border border-white/5'}`}
 >
 <Text className={`font-black text-xs uppercase tracking-[0.3em] ${isStepValid() ? 'text-white' : 'text-slate-600'}`}>
 {currentIndex < familySize - 1 ? 'Next Node Sync' : 'Commit Ledger Phase'}
 </Text>
 <ChevronRight size={20} color={isStepValid() ? '#ffffff' : '#334155'} strokeWidth={3} className="ml-4" />
 </TouchableOpacity>
 </MotiView>
 </AnimatePresence>
 </OnboardingLayout>
 );
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default', error }) => (
 <View>
 <Text className="text-xs font-black text-slate-500 uppercase tracking-[0.4em] mb-3 ml-1">{label}</Text>
 <View className={`flex-row items-center space-x-4 bg-white/5 h-14 rounded-[1.25rem] px-5 border ${error ? 'border-rose-500' : 'border-white/5'}`}>
 {icon}
 <TextInput
 className="flex-1 font-black text-sm leading-[22px] text-white"
 placeholder={placeholder}
 placeholderTextColor="rgba(255,255,255,0.2)"
 keyboardType={keyboardType}
 value={value}
 onChangeText={onChangeText}
 />
 </View>
 {error && <Text className="text-xs font-black text-rose-500 uppercase tracking-widest mt-1.5 ml-1">Protocol field invalid</Text>}
 </View>
);

export default Step2_MemberDetails;
