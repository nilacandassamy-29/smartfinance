import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const InvestmentContext = createContext();

export const useInvestments = () => useContext(InvestmentContext);

export const InvestmentProvider = ({ children }) => {
    const { user } = useAuth();
    const [investments, setInvestments] = useState([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setInvestments([]);
            setTotalPortfolioValue(0);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'investments'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
            setInvestments(list);
            
            const total = list.reduce((sum, item) => sum + parseFloat(item.currentValue || item.amountInvested || 0), 0);
            setTotalPortfolioValue(total);
            setLoading(false);
        }, (err) => {
            console.error("Investments snapshot error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addInvestment = async (data) => {
        await addDoc(collection(db, 'investments'), {
            ...data,
            userId: user.uid,
            createdAt: new Date().toISOString()
        });
    };

    const deleteInvestment = async (id) => {
        await deleteDoc(doc(db, 'investments', id));
    };

    return (
        <InvestmentContext.Provider value={{ investments, totalPortfolioValue, addInvestment, deleteInvestment, loading }}>
            {children}
        </InvestmentContext.Provider>
    );
};
