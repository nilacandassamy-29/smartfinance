import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc, getDocs, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useUserProfileSettings } from './UserProfileContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const { profileSettings } = useUserProfileSettings();
    const [expenses, setExpenses] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

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
                console.log('Fixed broken expenses data for user:', uid);
            } catch (err) {
                console.error("Failed to fix expenses:", err);
            }
        };

        fixBrokenExpenses(user.uid);

        // Auto-Archive verification
        const checkAutoArchive = async () => {
            const metaRef = doc(db, 'users', user.uid, 'meta', 'archiveInfo');
            const metaSnap = await getDoc(metaRef);
            const currentPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
            
            let lastArchiveMonth = null;
            if (metaSnap.exists()) {
                lastArchiveMonth = metaSnap.data().archiveMonth;
            }

            if (lastArchiveMonth !== currentPrefix) {
                // Must archive previous month
                let prevMonthIndex = currentMonth - 1;
                let prevYear = currentYear;
                if (prevMonthIndex < 1) {
                    prevMonthIndex = 12;
                    prevYear -= 1;
                }
                
                const qPrev = query(
                    collection(db, 'expenses'),
                    where('userId', '==', user.uid),
                    where('month', '==', prevMonthIndex),
                    where('year', '==', prevYear)
                );
                
                try {
                    const snap = await getDocs(qPrev);
                    const prevItems = [];
                    let prevTotal = 0;
                    snap.forEach(d => {
                        const data = d.data();
                        prevItems.push({ id: d.id, ...data });
                        prevTotal += parseFloat(data.amount || 0);
                    });

                    const prevPrefix = `${prevYear}-${String(prevMonthIndex).padStart(2, '0')}`;
                    const historyRef = doc(db, 'users', user.uid, 'expenseHistory', prevPrefix);
                    
                    await setDoc(historyRef, {
                        expenses: prevItems,
                        total: prevTotal,
                        month: prevMonthIndex,
                        year: prevYear
                    });

                    await setDoc(metaRef, { archiveMonth: currentPrefix }, { merge: true });
                    console.log(`Archived ${prevItems.length} expenses for ${prevPrefix}`);
                } catch (err) {
                    console.error("Auto Archive failed:", err);
                }
            }
        };

        checkAutoArchive();

        // Snapshot current month expenses
        const qExpenses = query(
            collection(db, 'expenses'),
            where('userId', '==', user.uid),
            where('month', '==', currentMonth),
            where('year', '==', currentYear)
        );
        
        const unsubscribeExpenses = onSnapshot(qExpenses, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
            setExpenses(list);
            setLoading(false);
        }, (error) => {
            console.error("Expenses Snapshot Error:", error);
            setLoading(false);
        });

        const qFamily = query(collection(db, 'family'), where('userId', '==', user.uid));
        const unsubscribeFamily = onSnapshot(qFamily, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFamilyMembers(list);
        });

        return () => {
            unsubscribeExpenses();
            unsubscribeFamily();
        };
    }, [user, currentMonth, currentYear]);

    const addExpense = async (data) => {
        const d = new Date(data.date || new Date().toISOString());
        const expenseMonth = d.getMonth() + 1;
        const expenseYear = d.getFullYear();
        const numAmount = parseFloat(data.amount || 0);

        const addedDoc = await addDoc(collection(db, 'expenses'), {
            ...data,
            userId: user.uid,
            month: expenseMonth,
            year: expenseYear,
            createdAt: new Date().toISOString(),
            type: 'expense'
        });

        // Trigger Alert if applicable and if it's counting towards current month
        if (expenseMonth === currentMonth && expenseYear === currentYear) {
            if (profileSettings?.alertPreference === 'Auto (AI)') {
                const limit = (profileSettings.dailyTarget || 1000) * 30;
                const currentTotal = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0) + numAmount;
                const usage = (currentTotal / limit) * 100;

                if (usage >= 100) {
                    Alert.alert('🚨 Budget Exceeded', 'You have exceeded your monthly budget limit!');
                } else if (usage >= 80) {
                    Alert.alert('⚠️ Budget Warning', `You have used ${usage.toFixed(0)}% of your monthly budget.`);
                }
            }
        }
        return addedDoc;
    };

    const updateExpense = async (id, data) => {
        const docRef = doc(db, 'expenses', id);
        await updateDoc(docRef, data);
    };

    const deleteExpense = async (id) => {
        await deleteDoc(doc(db, 'expenses', id));
    };

    const addFamilyMember = async (data) => {
        await addDoc(collection(db, 'family'), {
            ...data,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
    };

    const deleteFamilyMember = async (id) => {
        await deleteDoc(doc(db, 'family', id));
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
            snap.forEach(d => total += parseFloat(d.data().amount || 0));
            return total;
        } catch(e) {
            return 0;
        }
    };

    // To prevent breaking legacy method bindings during migration:
    const getMonthlyExpenses = () => expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
    // getMonthlyIncome is moved to IncomeContext but we return a stub if some old code explicitly depends on expenseContext's old method
    const getMonthlyIncome = () => { console.warn("Use IncomeContext for fetching incomes."); return 0; };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            familyMembers,
            loading,
            addExpense,
            updateExpense,
            deleteExpense,
            addFamilyMember,
            deleteFamilyMember,
            getLastMonthTotal,
            getMonthlyExpenses,
            getMonthlyIncome
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
