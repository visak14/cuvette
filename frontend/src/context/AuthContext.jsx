// src/context/AuthContext.js
import React, { createContext, useReducer, useContext, useEffect } from 'react';

// Initial state
const initialState = {
    isAuthenticated: false,
    token: null,
    email: null 
};

// Create context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'DASHBOARD':
            return { ...state, isAuthenticated: true, token: action.payload.token, email: action.payload.email };
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, token: null, email: null };
        default:
            return state;
    }
};

// Auth provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (token && email) {
            dispatch({ type: 'DASHBOARD', payload: { token, email } });
        }
    }, []);

    const login = (token, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        dispatch({ type: 'DASHBOARD', payload: { token, email } });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
