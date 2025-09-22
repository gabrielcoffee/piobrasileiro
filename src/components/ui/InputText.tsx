import React from 'react';
import styles from './styles/InputText.module.css';

interface InputTextProps extends React.ComponentProps<"input"> {
    value?: string;
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    onlyNumber?: boolean;
    numberValue?: number;
}

export function InputText({ value, label, error, className, leftIcon, numberValue = 0, onlyNumber = false, ...props }: InputTextProps) {

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
                color: props.disabled ? 'var(--color-text-muted)' : 'var(--color-text)'
            }}
            type={onlyNumber ? 'number' : props.type ?? 'text'}
            value={onlyNumber ? numberValue.toString() : (value && value.length > 100 ? value.slice(0, 100) : value || '')}
            onChange={(e) => {
                if (onlyNumber) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                }

                props.onChange?.(e);
            }}
            {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
} 