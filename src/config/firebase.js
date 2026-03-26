import { initializeApp } from "firebase/app";
import { 
    initializeAuth, 
    getReactNativePersistence 
} from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Using existing web config - Firebase JS SDK handles both
const firebaseConfig = {
    apiKey: "AIzaSyCCP5o0_4pueqn7nLoMFHqU6p6wHhdqFlM",
    authDomain: "smartfinance-273e5.firebaseapp.com",
    projectId: "smartfinance-273e5",
    storageBucket: "smartfinance-273e5.firebasestorage.app",
    messagingSenderId: "183437003488",
    appId: "1:183437003488:web:372307dd32d1febc101e85"
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence for React Native
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export default app;
