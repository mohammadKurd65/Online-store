import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { decodeToken } from "../utils/jwtDecode";
import NotificationBell from "../components/NotificationBell";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(true);
const token = localStorage.getItem("adminToken");
const decoded = decodeToken(token);
const adminId = decoded?.id;


useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
    });

    return unsubscribe;
}, []);

const value = {
    currentUser,
};

return (
<AuthContext.Provider value={value}>
    {!loading && children}
    {adminId && <NotificationBell adminId={adminId} />}
</AuthContext.Provider>
);
}