import React from 'react';
import styles from './styles/InputText.module.css';

interface InputTextProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
}

export function InputText({ label, error, className, ...props }: InputTextProps) {
  return (
    <div className={styles.container}>
      {label && (
        <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
          {label}
        </label>
      )}
      <input
        className={`${styles.input} ${className || ''}`}
        {...props}
      />
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
} 