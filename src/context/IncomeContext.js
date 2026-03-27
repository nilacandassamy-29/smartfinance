import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const IncomeContext = createContext();

export const useIncome = () => useContext(IncomeContext);

export const IncomeProvider = ({ children }) => {
    const { user } = useAuth();
    const [incomes, setIncomes] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIncomes([]);
            setMonthlyIncome(0);
            setLoading(false);
            return;
        }

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const q = query(
            collection(db, 'incomes'),
            where('userId', '==', user.uid),
            where('month', '==', currentMonth),
            where('year', '==', currentYear)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            setIncomes(list);
            const total = list.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
            setMonthlyIncome(total);
            setLoading(false);
        }, (err) => {
            console.error("Incomes snapshot error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addIncome = async (data) => {
        const d = new Date(data.date || new Date());
        await addDoc(collection(db, 'incomes'), {
            ...data,
            userId: user.uid,
            month: d.getMonth() + 1,
            year: d.getFullYear(),
            createdAt: new Date().toISOString()
        });
    };

    const deleteIncome = async (id) => {
        await deleteDoc(doc(db, 'incomes', id));
    };

    return (
        <IncomeContext.Provider value={{ incomes, monthlyIncome, addIncome, deleteIncome, loading }}>
            {children}
        </IncomeContext.Provider>
    );
};
