import React from 'react';
import styles from './styles/Checkbox.module.css';

interface CheckboxProps extends React.ComponentProps<"input"> {
  label?: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <div className={styles.container}>
      <input
        id={props.id}
        type="checkbox"
        className={`${styles.checkbox} ${className || ''}`}
        {...props}
      />
      {label && <label htmlFor={props.id} className={styles.label}>{label}</label>}
    </div>
  );
} 