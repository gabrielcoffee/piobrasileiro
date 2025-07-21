import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './styles/InputPassword.module.css';

interface InputPasswordProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string;
  error?: string;
}

export function InputPassword({ label, error, className, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.container}>
      {label && (
        <label className={`${styles.label} ${error ? styles.labelError : ''}`}>
          {label}
        </label>
      )}
      <div className={styles.inputContainer}>
        <input
          type={showPassword ? "text" : "password"}
          className={`${styles.input} ${className || ''}`}
          {...props}
        />
        <button
          type="button"
          className={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
} 