import React, { createContext, useState, useEffect } from 'react';
import { checkAuth } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth()
            .then(() => {
                setAuthenticated(true);
            })
            .catch(() => {
                setAuthenticated(false);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {loading ? <div>Загрузка...</div> : children}
        </AuthContext.Provider>
    );
};