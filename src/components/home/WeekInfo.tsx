import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './styles/WeekInfo.module.css';

interface WeekInfoProps {
  curWeek: number;
  from: Date;
  to: Date;
  isBooked: boolean;
}

export function WeekInfo({ curWeek, from, to, isBooked }: WeekInfoProps) {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
    };

    const dateDay = (date: Date) => {
        // simpler way
        return date.toLocaleDateString('pt-BR', { day: 'numeric' });
    }

    return (
        <div className={styles.container}>
            <div className={styles.weekCard}>
                <div className={styles.weekHeader}>
                    <span className={styles.weekTitle}>Semana {curWeek}</span>
                    <span className={styles.dateRange}>
                        {dateDay(from)} a {formatDate(to)}
                    </span>
                </div>
                
                {!isBooked && (
                <div className={styles.warning}>
                    <AlertCircle size={24} className={styles.warningIcon} />
                    <div className={styles.warningText}>
                        <span className={styles.warningTitle}>Suas refeições ainda não estão agendadas.</span>
                        <span className={styles.warningSubtext}>Agende até domingo às 19h.</span>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
} 