import React, { useState } from 'react';
import styles from './styles/InputText.module.css';

interface InputTextProps extends React.ComponentProps<"input"> {
    value?: string;
    label?: string;
    error?: string;
}

export function InputText({ value, label, error, className, ...props }: InputTextProps) {

    const [inputValue, setInputValue] = useState(value || '');
    
    return (
        <div className={styles.container}>
        {label && (
            <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
            {label}
            </label>
        )}
        <input
            className={`${styles.input} ${className || ''}`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            {...props}
        />
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
} 