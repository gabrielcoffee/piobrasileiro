import React from 'react';
import styles from './page.module.css';

export default function SolicitacoesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Solicitações</h1>
            <p>Gerencie as solicitações de hospedagem.</p>
        </div>
    );
}
