import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './styles/DropdownInput.module.css';

interface DropdownOption {
    key: string;
    value: string;
}

interface DropdownInputProps {
    value?: string;
    label?: string;
    error?: string;
    options: DropdownOption[];
    placeholder?: string;
    onChange?: (key: string) => void;
    disabled?: boolean;
    variant?: 'white' | 'slate';
}

export function DropdownInput({ value, label, error, options, placeholder, onChange, disabled, variant = 'slate' }: DropdownInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const hasError = error && error.length > 0;

    // Find the display value for the current key
    const selectedOption = options.find(option => option.key === value);
    const displayValue = selectedOption ? selectedOption.value : '';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggle = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (option: DropdownOption) => {
        onChange?.(option.key);
        setIsOpen(false);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            {label && (
                <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
                    {label}
                </label>
            )}
            <div 
                style={{
                    backgroundColor: variant === 'white' ? 'var(--color-white)' : 'var(--color-slate-100)'
                }}
                className={`${styles.dropdown} ${hasError ? styles.dropdownError : ''} ${disabled ? styles.disabled : ''}`}
                onClick={handleToggle}
            >
                <span className={styles.selectedValue}>
                    {displayValue || placeholder || 'Selecione uma opção'}
                </span>
                <ChevronDown 
                    size={16} 
                    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                />
            </div>
            {isOpen && (
                <div className={styles.optionsList}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`${styles.option} ${value === option.key ? styles.optionSelected : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.value}
                        </div>
                    ))}
                </div>
            )}
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
