import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (err) {
                console.error('Auth check error:', err);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError('');
            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login mislukt');
            return false;
        }
    };

    const register = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password
            });
            
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError('');
            return true;
        } catch (err) {
            console.error('Register error:', err);
            setError(err.response?.data?.message || 'Registratie mislukt');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setError('');
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    if (loading) {
        return null; // or a loading spinner
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext; 