import React from 'react';
import styles from './page.module.css';

export default function HospedesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Hóspedes</h1>
            <p>Gerencie os hóspedes e suas informações.</p>
        </div>
    );
}
