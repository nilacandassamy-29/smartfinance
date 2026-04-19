import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, Home, Heart, Phone, Calendar, IndianRupee } from 'lucide-react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { MotiView, AnimatePresence } from 'moti';
import OnboardingLayout from '../../components/onboarding/OnboardingLayout';
import { Picker } from '@react-native-picker/picker';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const C = {
  text: '#0F172A', sub: '#64748B', muted: '#94A3B8',
  border: '#E2E8F0', card: '#F8FAFC', input: '#F1F5F9',
  placeholder: '#CBD5E1', accent: '#3D5AFE',
};

const InputField = ({ label, icon, value, onChangeText, placeholder, keyboardType = 'default', error }) => (
  <View>
    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>
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
    {!!error && <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 10, color: '#f43f5e', letterSpacing: 0.3, marginTop: 5, marginLeft: 2 }}>Please check this field</Text>}
  </View>
);

const Step2_MemberDetails = () => {
  const { width } = Dimensions.get('window');
  const { members, updateMember, familySize, setStep, mode } = useOnboarding();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeMember = members[currentIndex] || {};

  // Part 3: State Management
  const [studentType, setStudentType] = useState('SCHOOL');
  const [schoolName, setSchoolName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [term1, setTerm1] = useState('');
  const [term2, setTerm2] = useState('');
  const [term3, setTerm3] = useState('');
  const [sem1, setSem1] = useState('');
  const [sem2, setSem2] = useState('');
  const [sem3, setSem3] = useState('');

  // Auto-calculated totals
  const schoolTotal = (parseFloat(term1) || 0) + (parseFloat(term2) || 0) + (parseFloat(term3) || 0);
  const collegeTotal = (parseFloat(sem1) || 0) + (parseFloat(sem2) || 0) + (parseFloat(sem3) || 0);

  // Sync state when active member changes (so we don't bleed values between members)
  useEffect(() => {
    setStudentType(activeMember.studentType || 'SCHOOL');
    setSchoolName(activeMember.schoolName || '');
    setCollegeName(activeMember.collegeName || '');
    setCourseName(activeMember.courseName || '');
    setSelectedClass(activeMember.selectedClass || null);
    setSelectedYear(activeMember.selectedYear || null);
    setTerm1(activeMember.term1 || '');
    setTerm2(activeMember.term2 || '');
    setTerm3(activeMember.term3 || '');
    setSem1(activeMember.sem1 || '');
    setSem2(activeMember.sem2 || '');
  }, [currentIndex]); // ONLY depend on index, not name, to prevent reset while typing

  // Handle Android hardware back button to cycle members
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true; // Always return true to prevent GO_BACK error
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [currentIndex])
  );

  const handleStudentTypeSwitch = (type) => {
    if (studentType === type) return;
    setStudentType(type);
    updateMember(currentIndex, { studentType: type }); // Sync to context
    setSchoolName('');
    setCollegeName('');
    setSelectedClass(null);
    setSelectedYear(null);
    setTerm1(''); setTerm2(''); setTerm3('');
    setSem1(''); setSem2(''); setSem3('');
  };

  const handleInputChange = (name, value) => {
    if (name === 'contact') { updateMember(currentIndex, { [name]: value.replace(/\D/g, '').slice(0, 10) }); return; }
    updateMember(currentIndex, { [name]: value });
  };

  const handleDobChange = (v) => {
    let text = v.replace(/\D/g, '');
    if (text.length > 8) text = text.slice(0, 8);
    let formatted = '';
    if (text.length > 0) {
      formatted = text.slice(0, 2);
      if (text.length > 2) {
        formatted += '-' + text.slice(2, 4);
        if (text.length > 4) {
          formatted += '-' + text.slice(4, 8);
        }
      }
    }
    handleInputChange('dob', formatted);
  };

  const isDobValid = () => {
    if (!activeMember.dob) return false;
    const parts = activeMember.dob.split('-');
    if (parts.length !== 3 || parts[0].length !== 2 || parts[1].length !== 2 || parts[2].length !== 4) return false;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date <= new Date() && date.getDate() === day;
  };
  
  const isContactValid = () => {
    if (activeMember.occupation === 'Student' && studentType === 'SCHOOL') {
      return (activeMember.contact || '').length === 0 || (activeMember.contact || '').length === 10;
    }
    return (activeMember.contact || '').length === 10;
  };

  const handleBack = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); } else { setStep(1); navigation.navigate('Step1_FamilySize'); } };

  // Button disabled logic (base fields must be filled)
  const isStepValid = () => {
    const base = activeMember.name?.trim() && activeMember.gender && activeMember.occupation && isDobValid() && isContactValid();
    if (activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') return base && activeMember.income > 0 && activeMember.sector;
    return !!base;
  };

  // Next button click handler
  const handleNext = async () => {
    if (!isStepValid()) return;

    // Part 4: Save to Firestore on Next
    if (activeMember.occupation === 'Student') {
      if (studentType === 'SCHOOL') {
        if (!schoolName || !selectedClass) {
          Alert.alert('Incomplete', 'Please fill in all required fields (School Name and Class).');
          return;
        }
      } else {
        if (!collegeName || !selectedYear) {
          Alert.alert('Incomplete', 'Please fill in all required fields (College Name and Year).');
          return;
        }
      }

      const totalFees = studentType === 'SCHOOL' ? schoolTotal : collegeTotal;
      
      // Update global context so other steps can access it
      updateMember(currentIndex, {
        studentType, schoolName, collegeName, courseName, selectedClass, selectedYear,
        term1, term2, term3, sem1, sem2, sem3, totalFees
      });

      try {
        if (user && user.uid) {
          const firestoreData = {
            studentType,
            studentName: activeMember.name,
            institutionName: studentType === 'SCHOOL' ? schoolName : collegeName,
            courseName: studentType === 'COLLEGE' ? courseName : null,
            classOrYear: studentType === 'SCHOOL' ? selectedClass : selectedYear,
            term1Fees: parseFloat(term1) || 0,
            term2Fees: parseFloat(term2) || 0,
            term3Fees: parseFloat(term3) || 0,
            sem1Fees: parseFloat(sem1) || 0,
            sem2Fees: parseFloat(sem2) || 0,
            sem3Fees: parseFloat(sem3) || 0,
            totalAnnualFees: totalFees
          };
          // Requirements specifically ask for `users/{uid}/onboarding/step2`
          await setDoc(doc(db, `users/${user.uid}/onboarding`, 'step2'), firestoreData, { merge: true });
        }
      } catch (e) {
        console.error("Firestore save failed:", e);
      }
    }

    if (currentIndex < familySize - 1) { 
      setCurrentIndex(currentIndex + 1); 
    } else { 
      setStep(3); navigation.navigate('Step3_Expenses'); 
    }
  };

  let occupations = [
    { id: 'Student',   label: 'Student',   icon: GraduationCap },
    { id: 'Working',   label: 'Working',   icon: Briefcase },
    { id: 'Homemaker', label: 'Homemaker', icon: Home },
    { id: 'Retired',   label: 'Retired',   icon: Heart },
  ];
  if (familySize === 1) {
    occupations = occupations.filter(o => o.id !== 'Student');
  }

  // Helper renderers
// Class and Year selector remain as helper functions for cleanliness
  const renderClassPills = () => {
    const classes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    return (
      <View>
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>Class</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 20 }}>
          {classes.map(cls => (
            <TouchableOpacity key={cls} onPress={() => { setSelectedClass(cls); updateMember(currentIndex, { selectedClass: cls }); }}
              style={{ borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: selectedClass === cls ? C.accent : '#F1F5F9' }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: selectedClass === cls ? '#FFFFFF' : '#64748B' }}>{cls}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderYearPills = () => {
    const years = ['1st', '2nd', '3rd', '4th'];
    return (
      <View>
        <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 12, marginLeft: 2, color: C.sub }}>Year</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
          {years.map(yr => (
            <TouchableOpacity 
              key={yr} 
              onPress={() => { setSelectedYear(yr); updateMember(currentIndex, { selectedYear: yr }); }}
              style={{ 
                width: 60, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', 
                backgroundColor: selectedYear === yr ? C.accent : '#F1F5F9',
                borderWidth: selectedYear === yr ? 0 : 1, borderColor: '#E2E8F0'
              }}>
              <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, color: selectedYear === yr ? '#FFFFFF' : '#64748B' }}>{yr}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };


  return (
    <OnboardingLayout currentStep={2}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <TouchableOpacity onPress={handleBack} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} color={C.sub} strokeWidth={3} />
          </View>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.sub }}>Go Back</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: '#EFF6FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: C.accent }}>
            {mode === 'Family' ? `Member ${currentIndex + 1} of ${familySize}` : 'Your Profile'}
          </Text>
        </View>
      </View>

      <View style={{ marginBottom: 32 }}>
        <Text style={{ fontFamily: 'Poppins_800ExtraBold', fontSize: 28, letterSpacing: 0.3, color: C.text }}>
          {mode === 'Family' ? (activeMember.name || 'Family Member') : 'About You'}
        </Text>
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, marginTop: 6, letterSpacing: 0.2, lineHeight: 20, color: C.sub }}>
          Fill in the details for each family member.
        </Text>
      </View>

      <View key={currentIndex}>
        <View>
          <View style={{ gap: 20, marginBottom: 24 }}>
            <InputField label="Full Name *" icon={<User size={16} color={C.muted} />} placeholder="Enter full name" value={activeMember.name} onChangeText={(v) => handleInputChange('name', v)} />

            <View>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>Gender *</Text>
              <View style={{ height: 52, borderRadius: 18, backgroundColor: C.input, borderWidth: 1.5, borderColor: C.border, justifyContent: 'center', paddingHorizontal: 8 }}>
                <Picker selectedValue={activeMember.gender} onValueChange={(v) => handleInputChange('gender', v)} dropdownIconColor={C.sub} style={{ fontFamily: 'Poppins_500Medium', color: C.text, fontSize: 14 }}>
                  <Picker.Item label="Select gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <InputField label="Date of Birth (DD-MM-YYYY) *" icon={<Calendar size={16} color={C.muted} />} placeholder="DD-MM-YYYY" keyboardType="numeric" value={activeMember.dob} onChangeText={handleDobChange} error={!!activeMember.dob && !isDobValid()} />
            <InputField label={`Mobile Number ${activeMember.occupation === 'Student' && studentType === 'SCHOOL' ? '(Optional)' : '*'}`} icon={<Phone size={16} color={C.muted} />} placeholder="10-digit mobile number" keyboardType="numeric" value={activeMember.contact} onChangeText={(v) => handleInputChange('contact', v)} error={!!activeMember.contact && !isContactValid()} />
          </View>

          <View style={{ marginBottom: 24 }}>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 16, marginLeft: 2, color: C.sub }}>What Do They Do?</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {occupations.map((occ) => {
                const isActive = activeMember.occupation === occ.id;
                return (
                  <TouchableOpacity key={occ.id} onPress={() => updateMember(currentIndex, { occupation: occ.id })} activeOpacity={0.8}
                    style={{ width: '47%', padding: 20, borderRadius: 22, alignItems: 'center', backgroundColor: isActive ? C.accent : C.card, borderWidth: 1.5, borderColor: isActive ? C.accent : C.border, shadowColor: isActive ? C.accent : '#000', shadowOpacity: isActive ? 0.2 : 0.03, shadowRadius: 8, elevation: isActive ? 4 : 1 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                      <occ.icon size={22} color={isActive ? '#ffffff' : C.accent} strokeWidth={2.5} />
                    </View>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 12, letterSpacing: 0.5, color: isActive ? '#ffffff' : C.muted }}>{occ.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {activeMember.occupation === 'Student' && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={{ gap: 18, marginBottom: 24 }}>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 12, marginLeft: 2, color: C.sub }}>Level of Study</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => handleStudentTypeSwitch('SCHOOL')}
                    style={{ flex: 1, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, backgroundColor: studentType === 'SCHOOL' ? C.accent : C.card, borderColor: studentType === 'SCHOOL' ? C.accent : C.border }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, letterSpacing: 0.5, color: studentType === 'SCHOOL' ? '#ffffff' : C.muted }}>School Student</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleStudentTypeSwitch('COLLEGE')}
                    style={{ flex: 1, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, backgroundColor: studentType === 'COLLEGE' ? C.accent : C.card, borderColor: studentType === 'COLLEGE' ? C.accent : C.border }}>
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 11, letterSpacing: 0.5, color: studentType === 'COLLEGE' ? '#ffffff' : C.muted }}>College Student</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View>
                {studentType === 'SCHOOL' ? (
                  <MotiView key="school" from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 250 }} style={{ gap: 20 }}>
                    <View>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>School Name</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 18, paddingHorizontal: 18, height: 52, borderWidth: 1.5, borderColor: '#E2E8F0' }}>
                        <GraduationCap size={18} color="#94A3B8" />
                        <TextInput placeholder="Enter your school name" placeholderTextColor={C.placeholder} style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: C.text, marginLeft: 12 }} value={schoolName} onChangeText={setSchoolName} />
                      </View>
                    </View>
                    {renderClassPills()}
                    <View style={{ backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16 }}>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 12, color: C.sub }}>Annual Education Fees</Text>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {[{ label: 'Term 1', val: term1, set: setTerm1 }, { label: 'Term 2', val: term2, set: setTerm2 }, { label: 'Term 3', val: term3, set: setTerm3 }].map((item, idx) => (
                          <View key={idx} style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: C.accent, marginBottom: 6 }}>{item.label}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 10, padding: 10 }}>
                              <IndianRupee size={12} color={C.text} style={{ marginRight: 4 }} />
                              <TextInput placeholder="0" keyboardType="numeric" style={{ flex: 1, fontSize: 14, fontFamily: 'Poppins_500Medium', color: C.text, padding: 0 }} value={item.val} onChangeText={item.set} />
                            </View>
                          </View>
                        ))}
                      </View>
                      <Text style={{ fontSize: 12, fontFamily: 'Poppins_700Bold', color: C.accent, textAlign: 'right', marginTop: 8 }}>Total Annual Fees: ₹{schoolTotal.toLocaleString('en-IN')}</Text>
                    </View>
                  </MotiView>
                ) : (
                  <MotiView key="college" from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 250 }} style={{ gap: 24 }}>
                    <View>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>College Name</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 18, paddingHorizontal: 18, height: 52, borderWidth: 1.5, borderColor: '#E2E8F0' }}>
                        <GraduationCap size={18} color="#94A3B8" />
                        <TextInput placeholder="Enter your college name" placeholderTextColor={C.placeholder} style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: C.text, marginLeft: 12 }} value={collegeName} onChangeText={(v) => { setCollegeName(v); updateMember(currentIndex, { collegeName: v }); }} />
                      </View>
                    </View>
                    <View>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>Course Name</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 18, paddingHorizontal: 18, height: 52, borderWidth: 1.5, borderColor: '#E2E8F0' }}>
                        <GraduationCap size={18} color="#94A3B8" />
                        <TextInput placeholder="e.g. B.Tech, BCA, MBA" placeholderTextColor={C.placeholder} style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 14, color: C.text, marginLeft: 12 }} value={courseName} onChangeText={(v) => { setCourseName(v); updateMember(currentIndex, { courseName: v }); }} />
                      </View>
                    </View>
                    {renderYearPills()}
                    <View style={{ backgroundColor: '#F8FAFC', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E2E8F0' }}>
                      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 16, color: C.sub }}>Annual Education Fees</Text>
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        {[{ label: 'Sem 1', val: sem1, set: (v) => { setSem1(v); updateMember(currentIndex, { sem1: v }); } }, { label: 'Sem 2', val: sem2, set: (v) => { setSem2(v); updateMember(currentIndex, { sem2: v }); } }, { label: 'Sem 3', val: sem3, set: (v) => { setSem3(v); updateMember(currentIndex, { sem3: v }); } }].map((item, idx) => (
                          <View key={idx} style={{ flex: 1 }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Poppins_600SemiBold', color: C.accent, marginBottom: 8, marginLeft: 2 }}>{item.label}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E2E8F0' }}>
                              <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: C.text, marginRight: 2 }}>₹</Text>
                              <TextInput placeholder="0" placeholderTextColor={C.placeholder} keyboardType="numeric" style={{ flex: 1, fontSize: 14, fontFamily: 'Poppins_500Medium', color: C.text, padding: 0 }} value={item.val} onChangeText={item.set} />
                            </View>
                          </View>
                        ))}
                      </View>
                      <View style={{ marginTop: 16, alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 13, fontFamily: 'Poppins_700Bold', color: C.accent }}>Total Annual Fees: ₹{collegeTotal.toLocaleString('en-IN')}</Text>
                      </View>
                    </View>
                  </MotiView>
                )}
              </View>
            </MotiView>
          )}

          {(activeMember.occupation === 'Working' || activeMember.occupation === 'Retired') && (
            <MotiView from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }} style={{ gap: 18, marginBottom: 24 }}>
              <View>
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, marginBottom: 10, marginLeft: 2, color: C.sub }}>Work Sector</Text>
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
                <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 11, letterSpacing: 0.5, color: '#16a34a', marginBottom: 14 }}>Monthly Income</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 14, paddingHorizontal: 14, backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: C.border }}>
                  <IndianRupee size={15} color="#10b981" strokeWidth={3} />
                  <TextInput style={{ flex: 1, fontFamily: 'Poppins_500Medium', fontSize: 16, color: C.text, marginLeft: 10 }} placeholder="0" placeholderTextColor={C.placeholder} keyboardType="numeric" value={String(activeMember.income || '')} onChangeText={(v) => handleInputChange('income', Number(v) || 0)} />
                </View>
              </View>
            </MotiView>
          )}

          <TouchableOpacity onPress={handleNext} activeOpacity={0.9} disabled={!isStepValid()}
            style={{ marginTop: 12, width: '100%', height: 58, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: isStepValid() ? C.accent : C.input, borderWidth: isStepValid() ? 0 : 1.5, borderColor: C.border, shadowColor: C.accent, shadowOpacity: isStepValid() ? 0.3 : 0, shadowRadius: 14, elevation: isStepValid() ? 6 : 0 }}>
            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 13, letterSpacing: 0.5, color: isStepValid() ? '#ffffff' : C.muted }}>
              {currentIndex < familySize - 1 ? 'Next Member' : 'Next Step'}
            </Text>
            <ChevronRight size={20} color={isStepValid() ? '#ffffff' : C.muted} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default Step2_MemberDetails;
