'use client';

import { createContext, ReactNode, useContext, useState } from "react";
import { Toast } from "@/components/general/Toast";

interface ToastItem {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const newToast: ToastItem = { id, message, type };
        
        setToasts(prevToasts => [...prevToasts, newToast]);
    };

    const handleClose = (toastId: string) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== toastId));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{ 
                position: 'fixed', 
                top: '20px', 
                right: '20px', 
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => handleClose(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

