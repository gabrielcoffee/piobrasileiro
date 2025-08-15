'use client';

import { createContext, ReactNode, useEffect, useState } from "react";

// Defining the user type
interface User {
    avatar_url?: string;
    nome_completo: string;
    email: string;
}

// Defining what the context provides (the data passed without prop drilling)
// A promise is used for the login because it's an async function (querying the database)
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

// Creating the context with the type being authentication or undefined (user not authenticated)
// Undefined by default so it catches error if useAuth is used outside of authProvider scope
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component that wraps the app with the context
export function AuthProvider(children: ReactNode) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Check for already logged user
    useEffect(() => {
        checkAuthStatus();
    }, [])

    // Check authentication status from localStorage
    const checkAuthStatus = async () => {
        try {
            // Check for token
            const token = localStorage.getItem('token');

            if (token) {
                // Try to fetch user data if it works token is valid
                const userData = await fetchUserData();
                if (userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                }
            }
        } catch (error) {
            console.log('Auth check failed', error);
        } finally {
            // Only remove the loading state after the auth check ends
            setIsLoading(false);
        }
    }

    const fetchUserData = async (): Promise<User | null> => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:3003/auth/perfil', {
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const json = await response.json();
                return json.data;
            }

            return null;
            
        } catch (error) {
            console.log('Failed to fetch user data', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3003/auth/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const json = await response.json();
                const token = json.token;
                const userData = json.data.user;

                // Save token, user data and auth status
                localStorage.setItem('token', token);
                setUser(userData);
                setIsAuthenticated(true);

                return true
            }

            return false;

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            return false
        }

    }

    // Logout
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        window.location.href = '/login';
    }

    // Context data that is send by the provider
    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            { children /* Children might be wrong in the props */ }
        </AuthContext.Provider>
    )
}