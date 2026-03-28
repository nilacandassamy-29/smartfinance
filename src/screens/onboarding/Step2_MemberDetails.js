import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, Home, Heart, Phone, Calendar, IndianRupee } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { MotiView, AnimatePresence } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import { Picker } from '@react-native-picker/picker';

const C = {
  text: '#0F172A', sub: '#64748B', muted: '#94A3B8',
  border: '#E2E8F0', card: '#F8FAFC', input: '#F1F5F9',
  placeholder: '#CBD5E1', accent: '#6366f1',
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default', error }) => (
  <View>
    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginLeft: 2, color: C.sub }}>
      {label}
    </Text>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.input, height: 52, borderRadius: 18, paddingHorizontal: 18, borderWidth: 1.5, borderColor: error ? '#f43f5e' : C.border }}>
      {icon}
      <TextInput
        style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: C.text }}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
    {error && <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 5, marginLeft: 2 }}>Please check this field</Text>}
  </View>
);

const Step2_MemberDetails = () => {
  const { width } = Dimensions.get('window');
  const { members, updateMember, familySize, setStep, mode } = useOnboarding();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeMember = members[currentIndex] || {};

  const handleInputChange = (name, value) => {
    if (name === 'contact') { updateMember(currentIndex, { [name]: value.replace(/\D/g, '').slice(0, 10) }); return; }
    updateMember(currentIndex, { [name]: value });
  };

  const isDobValid = () => { if (!activeMember.dob) return false; return new Date(activeMember.dob) <= new Date(); };
  const isContactValid = () => {
    if (activeMember.occupation === 'Student' && activeMember.educationType === 'School Student') return true;
    return (activeMember.contact || '').length === 10;
  };
  const handleBack = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); } else { setStep(1); navigation.navigate('Step1_FamilySize'); } };
  const isStepValid = () => {
    const base = activeMember.name?.trim() && activeMember.gender && activeMember.occupation && isDobValid() && isContactValid();
    if (activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') return base && activeMember.income > 0 && activeMember.sector;
    return !!base;
  };
  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentIndex < familySize - 1) { setCurrentIndex(currentIndex + 1); } else { setStep(3); navigation.navigate('Step3_Expenses'); }
  };

  const occupations = [
    { id: 'Student',   label: 'Student',   icon: GraduationCap },
    { id: 'Working',   label: 'Working',   icon: Briefcase },
    { id: 'Homemaker', label: 'Homemaker', icon: Home },
    { id: 'Retired',   label: 'Retired',   icon: Heart },
  ];

  return (
    <OnboardingLayout currentStep={2}>
      {/* Header row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 1.5, color: C.accent }}>
            {mode === 'Family' ? `Member ${currentIndex + 1} of ${familySize}` : 'Your Profile'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0, textTransform: 'uppercase', color: C.text }}>
          {mode === 'Family' ? (activeMember.name || 'Family Member') : 'About You'}
        </Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1.5, lineHeight: 20, color: C.sub }}>
          Fill in the details for each family member.
        </Text>
      </View>

      <AnimatePresence exitBeforeEnter>
        <MotiView key={currentIndex} from={{ opacity: 0, translateX: 20 }} animate={{ opacity: 1, translateX: 0 }} exit={{ opacity: 0, translateX: -20 }}>
          <View style={{ gap: 20, marginBottom: 24 }}>
            <InputField label="Full Name *" icon={<User size={16} color={C.muted} />} placeholder="Enter full name" value={activeMember.name} onChangeText={(v) => handleInputChange('name', v)} />

            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginLeft: 2, color: C.sub }}>Gender *</Text>
              <View style={{ height: 52, borderRadius: 18, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, justifyContent: 'center', paddingHorizontal: 8 }}>
                <Picker selectedValue={activeMember.gender} onValueChange={(v) => handleInputChange('gender', v)} dropdownIconColor={C.sub} style={{ fontFamily: 'Poppins_500Medium', color: C.text, fontSize: 14 }}>
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <InputField label="Date of Birth (YYYY-MM-DD) *" icon={<Calendar size={16} color={C.muted} />} placeholder="YYYY-MM-DD" value={activeMember.dob} onChangeText={(v) => handleInputChange('dob', v)} error={activeMember.dob && !isDobValid()} />
            <InputField label="Mobile Number *" icon={<Phone size={16} color={C.muted} />} placeholder="10-digit mobile number" keyboardType="numeric" value={activeMember.contact} onChangeText={(v) => handleInputChange('contact', v)} error={activeMember.contact && !isContactValid()} />
          </View>

          {/* Occupation */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16, marginLeft: 2, color: C.sub }}>What Do They Do?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {occupations.map((occ) => {
                const isActive = activeMember.occupation === occ.id;
                return (
                  <TouchableOpacity key={occ.id} onPress={() => updateMember(currentIndex, { occupation: occ.id })} activeOpacity={0.8}
                    style={{ width: '47%', padding: 20, borderRadius: 22, alignItems: 'center', backgroundColor: isActive ? C.accent : C.card, borderWidth: 1.5, borderColor: isActive ? C.accent : C.border, shadowColor: isActive ? C.accent : '#000', shadowOpacity: isActive ? 0.2 : 0.03, shadowRadius: 8, elevation: isActive ? 4 : 1 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <occ.icon size={22} color={isActive ? '#ffffff' : C.accent} strokeWidth={2.5} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: isActive ? '#ffffff' : C.muted }}>{occ.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Student extras */}
          {activeMember.occupation === 'Student' && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={{ gap: 18, marginBottom: 24 }}>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12, marginLeft: 2, color: C.sub }}>Level of Study</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {['School Student', 'College Student'].map(type => (
                    <TouchableOpacity key={type} onPress={() => updateMember(currentIndex, { educationType: type, school: '', college: '', std: '', course: '', year: '', totalFees: 0 })}
                      style={{ flex: 1, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, backgroundColor: activeMember.educationType === type ? C.accent : C.card, borderColor: activeMember.educationType === type ? C.accent : C.border }}>
                      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: activeMember.educationType === type ? '#ffffff' : C.muted }}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <InputField label={activeMember.educationType === 'School Student' ? "School Name" : "College Name"} icon={<GraduationCap size={16} color={C.muted} />} value={activeMember.educationType === 'School Student' ? activeMember.school : activeMember.college} onChangeText={(v) => handleInputChange(activeMember.educationType === 'School Student' ? 'school' : 'college', v)} placeholder="Enter institution name" />
              <View style={{ padding: 20, backgroundColor: '#EEF2FF', borderRadius: 22, borderWidth: 1.5, borderColor: '#C7D2FE' }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: C.accent, marginBottom: 14 }}>Annual Education Fees</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, paddingHorizontal: 14, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: C.border }}>
                  <IndianRupee size={15} color={C.accent} strokeWidth={2.5} />
                  <TextInput style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 16, color: C.text, marginLeft: 10 }} placeholder="0" placeholderTextColor={C.placeholder} keyboardType="numeric" value={String(activeMember.totalFees || '')} onChangeText={(v) => handleInputChange('totalFees', Number(v) || 0)} />
                </View>
              </View>
            </MotiView>
          )}

          {/* Working / Retired extras */}
          {(activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={{ gap: 18, marginBottom: 24 }}>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, marginLeft: 2, color: C.sub }}>Work Sector</Text>
                <View style={{ height: 52, borderRadius: 18, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, justifyContent: 'center', paddingHorizontal: 8 }}>
                  <Picker selectedValue={activeMember.sector} onValueChange={(v) => handleInputChange('sector', v)} dropdownIconColor={C.sub} style={{ fontFamily: 'Poppins_500Medium', color: C.text, fontSize: 14 }}>
                    <Picker.Item label="Select sector" value="" />
                    <Picker.Item label="Private Company" value="Private" />
                    <Picker.Item label="Government" value="Public" />
                    <Picker.Item label="Business Owner" value="Business" />
                    <Picker.Item label="Freelancer" value="Freelance" />
                  </Picker>
                </View>
              </View>
              <View style={{ padding: 20, backgroundColor: '#F0FDF4', borderRadius: 22, borderWidth: 1.5, borderColor: '#BBF7D0' }}>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#16a34a', marginBottom: 14 }}>Monthly Income</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, paddingHorizontal: 14, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: C.border }}>
                  <IndianRupee size={15} color="#10b981" strokeWidth={3} />
                  <TextInput style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 16, color: C.text, marginLeft: 10 }} placeholder="0" placeholderTextColor={C.placeholder} keyboardType="numeric" value={String(activeMember.income || '')} onChangeText={(v) => handleInputChange('income', Number(v) || 0)} />
                </View>
              </View>
            </MotiView>
          )}

          {/* CTA */}
          <TouchableOpacity onPress={handleNext} activeOpacity={0.9} disabled={!isStepValid()}
            style={{ marginTop: 12, width: '100%', height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: isStepValid() ? C.accent : C.input, borderWidth: isStepValid() ? 0 : 1.5, borderColor: C.border, shadowColor: C.accent, shadowOpacity: isStepValid() ? 0.3 : 0, shadowRadius: 14, elevation: isStepValid() ? 6 : 0 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: isStepValid() ? '#ffffff' : C.muted }}>
              {currentIndex < familySize - 1 ? 'Next Member' : 'Next Step'}
            </Text>
            <ChevronRight size={20} color={isStepValid() ? '#ffffff' : C.muted} strokeWidth={3} />
          </TouchableOpacity>
        </MotiView>
      </AnimatePresence>
    </OnboardingLayout>
  );
};

export default Step2_MemberDetails;
