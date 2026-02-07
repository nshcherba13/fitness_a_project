import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedToken = localStorage.getItem('access_token') || null;
        const storedRole = localStorage.getItem('role') || null;

        return {
            token: storedToken,
            role: storedRole,
        };
    });

    useEffect(() => {
        if (auth?.token && auth?.role) {
            localStorage.setItem("access_token", auth.token);
            localStorage.setItem("role", auth.role);
        } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("role");
        }
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
