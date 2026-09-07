import React from 'react';
import styles from './styles/InputTextBox.module.css';

interface InputTextBoxProps extends React.ComponentProps<"textarea"> {
    value?: string;
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    /** Hard cap on the value length. Defaults to 250 (historic behaviour). */
    maxLength?: number;
}

export function InputTextBox({ value, label, error, className, leftIcon, maxLength = 250, ...props }: InputTextBoxProps) {

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
        <textarea
            className={`${styles.textarea} ${className || ''}`}
            style={{ 
                borderColor: hasError ? 'var(--color-error)' : 'var(--color-border)',
                color: props.disabled ? 'var(--color-text-muted)' : 'var(--color-text)'
            }}
            value={value && value.length > maxLength ? value.slice(0, maxLength) : value || ''}
            maxLength={maxLength}
            rows={3}
            {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
