import React from 'react';
import { UserCheck, Trash } from 'lucide-react';
import styles from './styles/ConvidadosList.module.css';

interface ConvidadosListProps {
    guestMeals: any[];
    onRemove: (guestMealId: string) => void;
}

export default function ConvidadosList({ guestMeals, onRemove }: ConvidadosListProps) {
    
    return (
        <div className={styles.convidadosList}>
            {guestMeals.map((guestMeal, index) => (

                <div key={guestMeal.id || index} className={styles.convidadoItem}>
                    <UserCheck size={16} className={styles.icon} />
                    <span>Convidado(a) {guestMeal.convidado_nome}</span>
                    <button onClick={() => onRemove(guestMeal.id)} className={styles.removeButton}>
                        <Trash size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};
