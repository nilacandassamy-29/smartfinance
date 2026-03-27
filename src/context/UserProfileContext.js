import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export const useUserProfileSettings = () => useContext(UserProfileContext);

export const UserProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profileSettings, setProfileSettings] = useState({
        dailyTarget: 1000,
        riskProfile: 'Moderate',
        alertPreference: 'Auto (AI)',
        capitalVelocity: 'Not Set'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setProfileSettings({
                dailyTarget: 1000,
                riskProfile: 'Moderate',
                alertPreference: 'Auto (AI)',
                capitalVelocity: 'Not Set'
            });
            setLoading(false);
            return;
        }

        const docRef = doc(db, 'users', user.uid, 'profile', 'settings');

        const unsubscribe = onSnapshot(docRef, async (docSnap) => {
            if (docSnap.exists()) {
                setProfileSettings(docSnap.data());
            } else {
                const defaults = {
                    dailyTarget: 1000,
                    riskProfile: 'Moderate',
                    alertPreference: 'Auto (AI)',
                    capitalVelocity: 'Not Set'
                };
                try {
                    await setDoc(docRef, defaults);
                } catch(e) {} // Handle first-time creation gracefully
                setProfileSettings(defaults);
            }
            setLoading(false);
        }, (err) => {
            console.error("Profile Settings snapshot error:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const updateProfileSetting = async (key, value) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid, 'profile', 'settings');
        await updateDoc(docRef, { [key]: value });
    };

    return (
        <UserProfileContext.Provider value={{ profileSettings, updateProfileSetting, loading }}>
            {children}
        </UserProfileContext.Provider>
    );
};
