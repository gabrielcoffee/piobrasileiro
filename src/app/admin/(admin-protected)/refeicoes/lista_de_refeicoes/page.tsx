import React from 'react';
import styles from './page.module.css';

export default function ListaDeRefeicoesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Lista de Refeições</h1>
            <p>Gerencie a lista de refeições disponíveis.</p>
        </div>
    );
}
