import React from 'react';
import styles from './page.module.css';

export default function CalendarioPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Calendário de Refeições</h1>
            <p>Visualize e gerencie o calendário de refeições.</p>
        </div>
    );
}
