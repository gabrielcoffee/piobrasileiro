import React from 'react';
import styles from './page.module.css';

export default function GestaoDeReservasPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Gestão de Reservas</h1>
            <p>Gerencie todas as reservas de hospedagem.</p>
        </div>
    );
}
