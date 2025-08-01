import React, { useState } from 'react';
import { LucidePlug, LucidePlus, Salad } from 'lucide-react';
import styles from './styles/MealCard.module.css';
import { Button } from '../ui/Button';

interface MealCardProps {
    date?: string;
    dayName?: string;
    lunch?: boolean;
    dinner?: boolean;
    option?: 'school' | 'takeaway';
}

export default function MealCard({ 
    date = "07/04", 
    dayName = "SEGUNDA-FEIRA, 07/04/2025",
    lunch = false,
    dinner = false,
    option = 'school',
}: MealCardProps) {
    const [lunchConfirmed, setLunchConfirmed] = useState(lunch);
    const [dinnerConfirmed, setDinnerConfirmed] = useState(dinner);
    const [lunchOption, setLunchOption] = useState(option);

    const isAnyMealConfirmed = lunchConfirmed || dinnerConfirmed;

    return (
        <div className={styles.container}>
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
                                onClick={() => setLunchConfirmed(!lunchConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="school"
                                checked={lunchOption === 'school'}
                                onChange={() => setLunchOption('school')}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>

                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="takeaway"
                                checked={lunchOption === 'takeaway'}
                                onChange={() => setLunchOption('takeaway')}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>Para levar</span>
                        </label>
                    </div>
                    {lunchConfirmed && lunchOption === 'school' && (
                        <Button className={styles.addGuestButton} variant="full">Adicionar convidado</Button>
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
                                onClick={() => setDinnerConfirmed(!dinnerConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!dinnerConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="dinner"
                                value="school"
                                checked={true}
                                disabled={!dinnerConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}