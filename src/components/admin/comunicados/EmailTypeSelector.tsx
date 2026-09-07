'use client';

import styles from './styles/EmailTypeSelector.module.css';
import { EMAIL_TYPES, EmailType } from './emailTypes';

interface EmailTypeSelectorProps {
    value: EmailType;
    onChange: (type: EmailType) => void;
    disabled?: boolean;
}

export default function EmailTypeSelector({ value, onChange, disabled = false }: EmailTypeSelectorProps) {
    return (
        <div className={styles.grid} role="radiogroup" aria-label="Tipo de e-mail">
            {EMAIL_TYPES.map((spec) => {
                const Icon = spec.icon;
                const selected = spec.id === value;
                return (
                    <button
                        key={spec.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        disabled={disabled}
                        className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
                        onClick={() => onChange(spec.id)}
                    >
                        <span className={styles.iconWrapper}>
                            <Icon size={22} />
                        </span>
                        <span className={styles.text}>
                            <span className={styles.title}>{spec.title}</span>
                            <span className={styles.description}>{spec.description}</span>
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
