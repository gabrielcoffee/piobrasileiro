import React from 'react';
import styles from './styles/Checkbox.module.css';

interface CheckboxProps extends React.ComponentProps<"input"> {
  label?: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        className={`${styles.checkbox} ${className || ''}`}
        {...props}
      />
      {label && <label className={styles.label}>{label}</label>}
    </div>
  );
} 