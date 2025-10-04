'use client';

import { useEffect, useState } from 'react';
import { Check, X, AlertTriangle, Info } from 'lucide-react';
import styles from './styles/Toast.module.css';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    onClose?: () => void;
}

export const Toast = ({
    message,
    type = 'info',
    onClose
}: ToastProps) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Start fade out at 4 seconds
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 4000);

        // Remove toast at 5 seconds
        const closeTimer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(closeTimer);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300); // Wait for animation to complete
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <Check size={18} />;
            case 'error':
                return <X size={18} />;
            case 'warning':
                return <AlertTriangle size={18} />;
            case 'info':
            default:
                return <Info size={18} />;
        }
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : styles.hidden} ${isFading ? styles.fading : ''}`}>
            <div className={styles.toastContent}>
                <span className={styles.icon}>{getIcon()}</span>
                <span className={styles.message}>{message}</span>
            </div>
        </div>
    );
};