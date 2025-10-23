import React from 'react';
import styles from './styles/LoadingIcon.module.css';

export function LoadingIcon() {
    return (
        <div className={styles.container}>
            <div className={styles.spinner}></div>
        </div>
    );
}