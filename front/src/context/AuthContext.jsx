import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * AuthContext — IEEE Trace: privilegios-engine | Frontend Context
 * Provides: user, login, logout, canRead, canWrite, canExec, isAuthenticated, isAdmin
 */
const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [privileges, setPrivileges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Restore session from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.data.user);
                    setPrivileges(res.data.data.privileges);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    delete api.defaults.headers.common['Authorization'];
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user: userData, token, privileges: privs } = res.data.data;
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        setPrivileges(privs);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        setPrivileges([]);
    };

    // Capability-based access checks (privilegios-engine pattern)
    const checkPrivilege = (moduleName, action) => {
        const wildcard = privileges.find(p => p.ref_modulo === '*');
        if (wildcard && wildcard[action]) return true;
        const priv = privileges.find(p => p.ref_modulo === moduleName);
        return priv?.[action] === 1 || priv?.[action] === true;
    };

    const canRead = (mod) => checkPrivilege(mod, 'read');
    const canWrite = (mod) => checkPrivilege(mod, 'write');
    const canExec = (mod) => checkPrivilege(mod, 'excec');

    const value = {
        user, privileges, loading, login, logout,
        canRead, canWrite, canExec,
        isAuthenticated: !!user,
        isAdmin: privileges.some(p => p.ref_modulo === '*' && p.read)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
