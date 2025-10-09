import React, { useEffect, useState, useRef } from 'react';
import styles from './styles/InputTextSearch.module.css';
import { AlertCircle, ChevronDown } from 'lucide-react';

type Option = {
    key: string;
    value: string;
    warningOnRight?: string;
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
    style?: React.CSSProperties;
    hasCreate?: boolean;
    handleClickCreate?: (value: string) => void;
}

export function InputTextSearch({ value, label, error, leftIcon, searchOptions, onSelect, disabled, className, placeholder, hasCreate, handleClickCreate, ...props }: InputTextSearchProps) {

    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isUserTyping, setIsUserTyping] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleSearchOptionChange = (option: Option) => {
        setSelectedOption(option);
        setSearchText(option.value);
        setShowOptions(false);
        setIsUserTyping(false);
        onSelect?.(option);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        setIsUserTyping(true);
        setShowOptions(true);
    }

    const handleInputFocus = () => {
        setIsUserTyping(false);
        setShowOptions(true);
    }

    const handleCreateOption = () => {
        const newOption: Option = {
            key: '',
            value: searchText
        };
        setSelectedOption(newOption);
        setShowOptions(false);
        setIsUserTyping(false);
        handleClickCreate?.(searchText);
    }

    const filteredOptions = isUserTyping 
        ? searchOptions?.filter(option => 
            option.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .includes(searchText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        ) || []
        : searchOptions || [];

    const exactMatch = searchOptions?.some(option => 
        option.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 
        searchText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );

    const showCreateOption = hasCreate && searchText.trim() !== '' && !exactMatch;

    const hasError = error && error.length > 0;

    // Add this useEffect after your state declarations
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showOptions && containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowOptions(false);
            }
        };

        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showOptions]);
    
    return (
        <div ref={containerRef} className={styles.container}>
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
            value={searchText || (isUserTyping ? '' : value)}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={disabled}
            placeholder={placeholder}
            {...props}
        />
        <div className={styles.rightIcon}>
            <ChevronDown size={18} color={'var(--color-text-muted)'} style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)'}} />
        </div>
        {showOptions && (filteredOptions.length > 0 || showCreateOption) && (
            <div className={styles.searchOptionsContainer}>
                <div className={styles.searchOptions}>
                    {filteredOptions.map((option) => (
                        <div className={styles.option} key={option.key} onClick={() => handleSearchOptionChange(option)}>
                            {option.value}
                            {
                                option.warningOnRight && (
                                    <span className={styles.warningOnRight}>
                                        <AlertCircle size={16}/>
                                        {option.warningOnRight}
                                    </span>
                                )
                            }
                        </div>
                    ))}
                    {showCreateOption && (
                        <div className={`${styles.option} ${styles.optionCreate}`} onClick={handleCreateOption}>
                            Criar +{searchText}
                        </div>
                    )}
                </div>
            </div>
        )}
        {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
} 