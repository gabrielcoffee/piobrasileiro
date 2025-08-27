import React from 'react';
import styles from './styles/InputText.module.css';

interface InputTextProps extends React.ComponentProps<"input"> {
    value?: string;
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

export function InputText({ value, label, error, className, leftIcon, ...props }: InputTextProps) {

    const hasError = error && error.length > 0;
    
    return (
        <div className={styles.container}>
        {label && (
            <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
            {label}
            </label>
        )}
        {leftIcon && (
            <div className={styles.leftIcon}>
                {leftIcon}
            </div>
        )}
        <input
            className={`${styles.input} ${className || ''}`}
            style={{ 
                borderColor: hasError ? 'var(--color-error)' : 'var(--color-border)',
                color: props.disabled ? 'var(--color-text-muted)' : 'var(--color-text)'
            }}
            value={value || ''}
            {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
} 