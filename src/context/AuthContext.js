import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety timeout to prevent infinite blank page if Firebase hangs
        const timer = setTimeout(() => {
            if (loading) {
                setLoading(false);
            }
        }, 8000);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const docRef = doc(db, 'users', currentUser.uid);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (err) {
                    console.error("AuthContext: Error getting user doc:", err);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
            clearTimeout(timer);
        });

        return () => {
            unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email, password, profileData) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: profileData.name });

        const userDoc = {
            ...profileData,
            email,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'users', result.user.uid), userDoc);
        setUserProfile(userDoc);
        return result;
    };

    const logout = () => signOut(auth);

    const updateUserProfile = async (data) => {
        if (!user) return;
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, data);
        setUserProfile(prev => ({ ...prev, ...data }));
    };

    const loginWithGoogle = async () => {
        // Placeholder for Google Auth in RN - Requires extra config
        console.warn("Google Sign-In needs mobile-specific implementation (expo-auth-session).");
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            login,
            loginWithGoogle,
            register,
            logout,
            updateUserProfile
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
