import React, { useState } from 'react';
import styles from './styles/InputTextSearch.module.css';

type Option = {
    key: string;
    value: string;
}

interface InputTextSearchProps {
    value?: string;
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    searchOptions?: Option[];
    onSelect?: (option: Option) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export function InputTextSearch({ value, label, error, leftIcon, searchOptions, onSelect, disabled, className, placeholder, ...props }: InputTextSearchProps) {

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const handleSearchOptionChange = (option: Option) => {
        setSelectedOption(option);
        setShowOptions(false);
        onSelect?.(option);
    }

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
                color: disabled ? 'var(--color-text-muted)' : 'var(--color-text)',
                backgroundColor: selectedOption ? 'var(--color-slate-100)' : 'var(--color-white)'
            }}
            value={value}
            onChange={(e) => setSelectedOption({key: selectedOption?.key || '', value: e.target.value})}
            onFocus={() => setShowOptions(true)}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
        />
        {showOptions && searchOptions && searchOptions.length > 0 &&(
            <div className={styles.searchOptionsContainer}>
                <div className={styles.searchOptions}>
                    {searchOptions.map((option) => (
                        <div className={styles.option} key={option.key} onClick={() => handleSearchOptionChange(option)}>{option.value}</div>
                    ))}
                </div>
            </div>

        )}
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
} 