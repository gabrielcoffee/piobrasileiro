import React, { useState, useEffect } from 'react';
import { LucidePlug, LucidePlus, Salad } from 'lucide-react';
import styles from './styles/MealCard.module.css';
import { Button } from '../ui/Button';
import GuestModal from './GuestModal';

interface MealCardProps {
    id?: string;
    date?: string;
    dayName?: string;
    lunch?: boolean;
    dinner?: boolean;
    takeOut?: boolean;
    onUpdate?: (updates: { lunch?: boolean; dinner?: boolean; takeOut?: boolean }) => void;
}

export default function MealCard({ 
    id,
    date = "07/04",
    dayName = "Segunda-feira, 07/04/2025",
    lunch = false,
    dinner = false,
    takeOut = false,
    onUpdate
}: MealCardProps) {
    const [lunchConfirmed, setLunchConfirmed] = useState(lunch);
    const [dinnerConfirmed, setDinnerConfirmed] = useState(dinner);
    const [takeOutOption, setTakeOutOption] = useState(takeOut);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const isAnyMealConfirmed = lunchConfirmed || dinnerConfirmed;

    // Sincroniza o estado local com as props quando elas mudam
    useEffect(() => {
        setLunchConfirmed(lunch);
    }, [lunch]);

    useEffect(() => {
        setDinnerConfirmed(dinner);
    }, [dinner]);

    useEffect(() => {
        setTakeOutOption(takeOut);
    }, [takeOut]);

    // Atualiza estado local e notifica componente pai
    const updateLunch = (newValue: boolean) => {
        setLunchConfirmed(newValue);
        onUpdate?.({ lunch: newValue, takeOut: takeOutOption });
    };

    const updateDinner = (newValue: boolean) => {
        setDinnerConfirmed(newValue);
        onUpdate?.({ dinner: newValue });
    };

    const updateTakeOut = (newValue: boolean) => {
        setTakeOutOption(newValue);
        onUpdate?.({ takeOut: newValue });
    };

    return (
        <div className={styles.container} id={id}>
            {/* Date Header */}
            <div className={styles.dateHeader}>
                <span className={styles.dateText}>{dayName}</span>
            </div>

            {/* Meal Card */}
            <div className={`${styles.mealCard} ${isAnyMealConfirmed ? styles.mealCardEnabled : ''}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.titleContainer}>
                        <Salad size={24} className={styles.saladIcon} />
                        <h2 className={styles.cardTitle}>Refeições do dia {date}</h2>
                    </div>
                </div>

                {/* Lunch Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (11h - 14h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {lunchConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${lunchConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => updateLunch(!lunchConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name={`lunch-${id}`}
                                value="school"
                                checked={!takeOutOption}
                                onChange={() => updateTakeOut(false)}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>

                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name={`lunch-${id}`}
                                value="takeaway"
                                checked={takeOutOption}
                                onChange={() => updateTakeOut(true)}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>Para levar</span>
                        </label>
                    </div>
                    {lunchConfirmed && !takeOutOption && (
                        <Button onClick={() => setIsGuestModalOpen(true)} className={styles.addGuestButton} variant="full">Adicionar convidado</Button>
                    )}
                </div>

                <div className={styles.divider} />

                {/* Dinner Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Jantar (17h - 20h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {dinnerConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${dinnerConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => updateDinner(!dinnerConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!dinnerConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name={`dinner-${id}`}
                                value="school"
                                defaultChecked={true}
                                disabled={!dinnerConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>
                    </div>
                </div>
            </div>

            {isGuestModalOpen && (
                <GuestModal date={dayName} isOpen={isGuestModalOpen} onClose={() => setIsGuestModalOpen(false)} />
            )}
        </div>
    );
}