import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const OnboardingContext = createContext();

export const useOnboarding = () => useContext(OnboardingContext);

export const OnboardingProvider = ({ children }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [familySize, setFamilySize] = useState(0);
    const [members, setMembers] = useState([{
        id: 0,
        name: '',
        gender: '',
        dob: '',
        contact: '',
        occupation: '',
        role: '',
        income: 0,
        sector: '',
        school: '',
        totalFees: 0,
        term1Fees: 0,
        term2Fees: 0,
        term3Fees: 0
    }]);
    const [expenses, setExpenses] = useState({
        groceries: 0, electricity: 0, water: 0, gas: 0, internet: 0,
        mobile: 0, rent: 0, transport: 0, insurance: 0, medical: 0,
        education: 0, loans: 0, maintenance: 0, subscriptions: 0,
        personal: 0, miscellaneous: 0
    });
    const [reserveAmount, setReserveAmount] = useState(0);
    const [savingsAmount, setSavingsAmount] = useState(0);
    const [savingsError, setSavingsError] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // 1. Initial Load: AsyncStorage -> Firestore
    useEffect(() => {
        const loadInitialData = async () => {
            // Priority 1: Cloud Sync (Firestore)
            if (user) {
                try {
                    const docRef = doc(db, 'onboarding', user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.step) setStep(data.step);
                        if (data.familySize) setFamilySize(data.familySize);
                        if (data.members) setMembers(data.members);
                        if (data.expenses) setExpenses(data.expenses);
                        if (data.reserveAmount !== undefined) setReserveAmount(data.reserveAmount);
                        if (data.savingsAmount !== undefined) setSavingsAmount(data.savingsAmount);
                        console.log("Onboarding: Loaded from Firestore");
                        setIsInitialized(true);
                        return; // Firestore loaded, skip AsyncStorage
                    }
                } catch (error) {
                    console.error("Firestore Load Error:", error);
                }
            }

            // Priority 2: AsyncStorage
            const saved = await AsyncStorage.getItem('onboarding_data');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data.step) setStep(data.step);
                    if (data.familySize) setFamilySize(data.familySize);
                    if (data.members) setMembers(data.members);
                    if (data.expenses) setExpenses(data.expenses);
                    if (data.reserveAmount !== undefined) setReserveAmount(data.reserveAmount);
                    console.log("Onboarding: Loaded from AsyncStorage");
                } catch (e) {
                    console.error("Error parsing AsyncStorage data");
                }
            }
            setIsInitialized(true);
        };

        loadInitialData().then(() => {
            // Cleanup: If gender is 'Male' but name is empty (legacy default), clear it
            setMembers(prev => prev.map(m =>
                (m.gender === 'Male' && !m.name) ? { ...m, gender: '' } : m
            ));
        });
    }, [user]);

    // 2. Persistence: AsyncStorage + Firestore Sync
    useEffect(() => {
        if (!isInitialized) return;

        const dataToSave = {
            step,
            familySize,
            members,
            expenses,
            reserveAmount,
            savingsAmount,
            updatedAt: new Date().toISOString()
        };

        const syncData = async () => {
            // Always save to AsyncStorage for quick responsiveness
            await AsyncStorage.setItem('onboarding_data', JSON.stringify(dataToSave));

            // Sync to cloud ONLY when logged in
            if (user) {
                setIsSyncing(true);
                try {
                    const onboardingRef = doc(db, 'onboarding', user.uid);
                    await setDoc(onboardingRef, dataToSave, { merge: true });
                    console.log("Onboarding: Cloud Sync Successful");
                } catch (error) {
                    console.error("Onboarding: Cloud Sync Error:", error);
                } finally {
                    setTimeout(() => setIsSyncing(false), 800);
                }
            }
        };

        if (step !== 1) {
            syncData();
        } else {
            const timeout = setTimeout(syncData, 2000);
            return () => clearTimeout(timeout);
        }
    }, [step, familySize, members, expenses, reserveAmount, savingsAmount, user, isInitialized]);

    const mode = familySize > 1 ? 'Family' : (familySize === 1 ? 'Single' : null);

    const updateFamilySize = (size) => {
        setFamilySize(size);
        setMembers(prev => {
            const currentMembers = [...prev];
            if (size > prev.length) {
                // Add new members while preserving existing ones
                const additions = Array(size - prev.length).fill(null).map((_, i) => ({
                    id: prev.length + i, name: '', gender: '', dob: '', contact: '',
                    occupation: '', role: '', income: 0, sector: '', school: '',
                    totalFees: 0, term1Fees: 0, term2Fees: 0, term3Fees: 0
                }));
                return [...currentMembers, ...additions];
            } else if (size < prev.length) {
                // Keep existing members up to the new size
                return currentMembers.slice(0, size);
            }
            return currentMembers;
        });
    };

    const updateMember = (index, data) => {
        setMembers(prev => {
            const newMembers = [...prev];
            newMembers[index] = { ...newMembers[index], ...data };
            return newMembers;
        });
    };

    const updateExpenses = (newExpenses) => {
        setExpenses(prev => ({ ...prev, ...newExpenses }));
    };

    const safeNumber = (val) => {
        const n = Number(val);
        return isNaN(n) ? 0 : n;
    };

    const totalIncome = members.reduce((acc, m) => acc + safeNumber(m.income), 0);

    const annualEducationFees = members
        .filter(m => m.occupation === 'Student')
        .reduce((acc, m) => acc + safeNumber(m.totalFees), 0);

    const gridExpensesTotal = Object.values(expenses).reduce((acc, v) => acc + safeNumber(v), 0);
    const totalAnnualEducationFees = annualEducationFees;
    const totalExpenses = gridExpensesTotal + totalAnnualEducationFees;

    const initialSurplus = Math.round(totalIncome - totalExpenses);
    const investableSurplus = safeNumber(savingsAmount) - safeNumber(reserveAmount);

    const finalizeOnboarding = async () => {
        if (!user) return;

        try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                income: totalIncome,
                savingsAmount: safeNumber(savingsAmount),
                reserveAmount: safeNumber(reserveAmount),
                onboardingComplete: true,
                updatedAt: serverTimestamp()
            }, { merge: true });

            const familyRef = collection(db, 'family');
            for (const member of members) {
                if (member.name || member.income > 0) {
                    await addDoc(familyRef, {
                        ...member,
                        userId: user.uid,
                        createdAt: serverTimestamp()
                    });
                }
            }

            const expensesRef = collection(db, 'expenses');
            for (const [category, amount] of Object.entries(expenses)) {
                if (Number(amount) > 0) {
                    await addDoc(expensesRef, {
                        category,
                        amount: Number(amount),
                        description: `Monthly ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                        type: 'expense',
                        date: new Date().toISOString().split('T')[0],
                        userId: user.uid,
                        createdAt: serverTimestamp()
                    });
                }
            }

            await deleteDoc(doc(db, 'onboarding', user.uid));
            await AsyncStorage.removeItem('onboarding_data');

            console.log("Onboarding: Migration successful!");
            return true;
        } catch (error) {
            console.error("Onboarding: Migration Error:", error);
            throw error;
        }
    };

    const value = {
        step, setStep, familySize, updateFamilySize, members, updateMember,
        expenses, updateExpenses, reserveAmount, setReserveAmount,
        savingsAmount, setSavingsAmount, savingsError, setSavingsError, mode,
        totalIncome, totalExpenses, gridExpensesTotal, totalAnnualEducationFees,
        initialSurplus, investableSurplus, safeNumber,
        annualEducationFees, isInitialized, finalizeOnboarding, isSyncing
    };

    return (
        <OnboardingContext.Provider value={value}>
            {children}
        </OnboardingContext.Provider>
    );
};
