import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, query, where, deleteDoc, doc, updateDoc, getDocs, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useUserProfileSettings } from './UserProfileContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);
export const useExpense = useExpenses; // Alias for compatibility with user instructions

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const { profileSettings } = useUserProfileSettings();
    const [expenses, setExpenses] = useState([]);
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    useEffect(() => {
        const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
        setMonthlyTotal(total);
    }, [expenses]);

    const fetchExpenses = async (uid) => {
        setLoading(true);
        try {
            const snap = await getDocs(query(
                collection(db, 'expenses'),
                where('userId', '==', uid),
                where('month', '==', currentMonth),
                where('year', '==', currentYear)
            ));
            const data = snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate ? d.data().createdAt.toDate() : new Date(d.data().createdAt || Date.now())
            }));
            data.sort((a, b) => b.createdAt - a.createdAt);
            setExpenses(data);
        } catch (e) {
            console.error("fetchExpenses err:", e);
        }
        setLoading(false);
    };

    const fetchFamily = async (uid) => {
        try {
            const snap = await getDocs(query(collection(db, 'family'), where('userId', '==', uid)));
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setFamilyMembers(data);
        } catch (e) {}
    };

    useEffect(() => {
        if (!user) {
            setExpenses([]);
            setFamilyMembers([]);
            setLoading(false);
            return;
        }

        // Fix broken existing expenses once
        const fixBrokenExpenses = async (uid) => {
            try {
                const metaRef = doc(db, 'users', uid, 'meta', 'expensesFixed');
                const metaSnap = await getDoc(metaRef);
                if (metaSnap.exists() && metaSnap.data().isFixed === true) {
                    return; // Already fixed
                }

                const snap = await getDocs(collection(db, 'expenses'));
                const batch = writeBatch(db);
                let needsFix = false;

                snap.docs.forEach(docSnap => {
                    const data = docSnap.data();
                    if (data.userId !== uid) return;
                    
                    let updates = {};

                    if (!data.date || data.date === 'undefined' || String(data.date).includes('NaN') || String(data.date).includes('undefined')) {
                        let fixedDate;
                        if (data.createdAt?.toDate) {
                            fixedDate = data.createdAt.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        } else if (data.month && data.year) {
                            fixedDate = `01 ${new Date(data.year, data.month - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`;
                        } else {
                            fixedDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        }
                        updates.date = fixedDate;
                    }

                    if (!data.month || !data.year) {
                        updates.month = new Date().getMonth() + 1;
                        updates.year = new Date().getFullYear();
                    }

                    if (Object.keys(updates).length > 0) {
                        batch.update(docSnap.ref, updates);
                        needsFix = true;
                    }
                });

                if (needsFix) await batch.commit();
                await setDoc(metaRef, { isFixed: true }, { merge: true });
            } catch (err) {
                console.error("Failed to fix expenses:", err);
            }
        };

        fixBrokenExpenses(user.uid);

        // Auto-Archive verification
        const checkAndArchive = async (uid) => {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
          
            const metaDoc = await getDoc(doc(db, 'users', uid, 'meta', 'archive'));
            const lastArchived = metaDoc.exists() ? metaDoc.data() : null;
          
            if (!lastArchived || lastArchived.month !== currentMonth || lastArchived.year !== currentYear) {
                const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
                const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            
                const prevSnap = await getDocs(query(
                    collection(db, 'expenses'),
                    where('userId', '==', uid),
                    where('month', '==', prevMonth),
                    where('year', '==', prevYear)
                ));
            
                if (!prevSnap.empty) {
                    const prevExpenses = prevSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                    const prevTotal = prevExpenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
            
                    const archiveId = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
            
                    await setDoc(doc(db, 'users', uid, 'expenseHistory', archiveId), {
                        month: prevMonth,
                        year: prevYear,
                        monthLabel: new Date(prevYear, prevMonth - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
                        total: prevTotal,
                        expenses: prevExpenses,
                        archivedAt: new Date()
                    });
            
                    await setDoc(doc(db, 'users', uid, 'meta', 'archive'), { 
                        month: currentMonth, 
                        year: currentYear,
                        lastArchivedAt: new Date()
                    });
                } else {
                    await setDoc(doc(db, 'users', uid, 'meta', 'archive'), { 
                        month: currentMonth, 
                        year: currentYear,
                        lastArchivedAt: new Date()
                    });
                }
            }
        };

        checkAndArchive(user.uid);

        // Fetch manual data once on load
        fetchExpenses(user.uid);
        fetchFamily(user.uid);

    }, [user]);

    const addExpense = async (expenseData) => {
        try {
            const uid = user?.uid;
            if (!uid) throw new Error('Not authenticated');

            const now = new Date();
            const currentMonth = now.getMonth() + 1;
            const currentYear = now.getFullYear();

            const newExpense = {
                userId: uid,
                title: expenseData.title?.trim() || 'Expense',
                amount: parseFloat(expenseData.amount) || 0,
                category: expenseData.category || 'General',
                date: now.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                month: currentMonth,
                year: currentYear,
                type: 'expense',
                createdAt: now.toISOString()
            };

            const docRef = await addDoc(collection(db, 'expenses'), newExpense);

            const savedExpense = { 
                id: docRef.id, 
                ...newExpense,
                createdAt: now
            };

            setExpenses(prev => [savedExpense, ...prev]);
            
            // Check budget limits manually
            if (profileSettings?.alertPreference === 'Auto (AI)') {
                const limit = (profileSettings.dailyTarget || 1000) * 30;
                const projectedTotal = monthlyTotal + savedExpense.amount;
                const usage = (projectedTotal / limit) * 100;

                if (usage >= 100) {
                    Alert.alert('🚨 Budget Exceeded', 'You have exceeded your monthly budget limit!');
                } else if (usage >= 80) {
                    Alert.alert('⚠️ Budget Warning', `You have used ${usage.toFixed(0)}% of your monthly budget.`);
                }
            }

            return savedExpense;

        } catch (error) {
            console.error('Add expense error:', error);
            Alert.alert('Error', 'Could not save expense. Try again.');
            throw error;
        }
    };

    const updateExpense = async (id, data) => {
        const docRef = doc(db, 'expenses', id);
        await updateDoc(docRef, data);
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
    };

    const deleteExpense = async (id) => {
        await deleteDoc(doc(db, 'expenses', id));
        setExpenses(prev => prev.filter(e => e.id !== id));
    };

    const addFamilyMember = async (data) => {
        const addedRef = await addDoc(collection(db, 'family'), {
            ...data,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
        setFamilyMembers(prev => [...prev, { id: addedRef.id, ...data }]);
    };

    const deleteFamilyMember = async (id) => {
        await deleteDoc(doc(db, 'family', id));
        setFamilyMembers(prev => prev.filter(f => f.id !== id));
    };

    const getLastMonthTotal = async () => {
        if (!user) return 0;
        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth < 1) {
            prevMonth = 12;
            prevYear -= 1;
        }
        try {
            const q = query(
                collection(db, 'expenses'),
                where('userId', '==', user.uid),
                where('month', '==', prevMonth),
                where('year', '==', prevYear)
            );
            const snap = await getDocs(q);
            let total = 0;
            snap.forEach(d => total += (parseFloat(d.data().amount) || 0));
            return total;
        } catch(e) {
            return 0;
        }
    };

    const getMonthlyExpenses = () => monthlyTotal;
    const getMonthlyIncome = () => { console.warn("Use IncomeContext for fetching incomes."); return 0; };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            monthlyTotal, // EXPORTED NOW
            familyMembers,
            loading,
            addExpense,
            updateExpense,
            deleteExpense,
            addFamilyMember,
            deleteFamilyMember,
            getLastMonthTotal,
            getMonthlyExpenses,
            getMonthlyIncome,
            fetchExpenses // EXPORTED NOW
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
