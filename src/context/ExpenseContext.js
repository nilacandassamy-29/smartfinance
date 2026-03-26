import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setExpenses([]);
            setFamilyMembers([]);
            setLoading(false);
            return;
        }

        // Real-time listener for expenses
        const qExpenses = query(
            collection(db, 'expenses'),
            where('userId', '==', user.uid)
        );
        const unsubscribeExpenses = onSnapshot(qExpenses,
            (snapshot) => {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Manual sort by date descending
                list.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpenses(list);
                setLoading(false);
            },
            (error) => {
                console.error("Expenses Snapshot Error:", error);
                setLoading(false);
            }
        );

        // Real-time listener for family members
        const qFamily = query(
            collection(db, 'family'),
            where('userId', '==', user.uid)
        );
        const unsubscribeFamily = onSnapshot(qFamily,
            (snapshot) => {
                const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFamilyMembers(list);
            },
            (error) => {
                console.error("Family Snapshot Error:", error);
            }
        );

        return () => {
            unsubscribeExpenses();
            unsubscribeFamily();
        };
    }, [user]);

    const addExpense = async (data) => {
        await addDoc(collection(db, 'expenses'), {
            ...data,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
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

    const getMonthlyIncome = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenses
            .filter(e => {
                const date = new Date(e.date);
                return date >= firstDay && e.type === 'income';
            })
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    const getMonthlyExpenses = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        return expenses
            .filter(e => {
                const date = new Date(e.date);
                return date >= firstDay && e.type === 'expense';
            })
            .reduce((sum, e) => sum + Number(e.amount), 0);
    };

    return (
        <ExpenseContext.Provider value={{
            expenses,
            familyMembers,
            loading,
            addExpense,
            deleteExpense,
            addFamilyMember,
            deleteFamilyMember,
            getMonthlyIncome,
            getMonthlyExpenses
        }}>
            {children}
        </ExpenseContext.Provider>
    );
};
