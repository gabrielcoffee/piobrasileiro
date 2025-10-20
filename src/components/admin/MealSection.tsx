'use client'

import React from 'react';
import styles from './styles/AddUserMealModal.module.css';

interface MealSectionProps {
    almoco_colegio: boolean;
    almoco_levar: boolean;
    janta_colegio: boolean;
    onAlmocoColegioChange: (value: boolean) => void;
    onAlmocoLevarChange: (value: boolean) => void;
    onJantaColegioChange: (value: boolean) => void;
    hasTakeoutOption?: boolean;
}

export default function MealSection({
    almoco_colegio,
    almoco_levar,
    janta_colegio,
    onAlmocoColegioChange,
    onAlmocoLevarChange,
    onJantaColegioChange,
    hasTakeoutOption = true
}: MealSectionProps) {
    return (
        <div className={styles.mealSection}>
            <div className={styles.mealHeader}>
                <h3 className={styles.mealTitle}>Almoço (13h - 14h)</h3>
                <div className={styles.toggleContainer}>
                    <span className={styles.toggleText}>
                        {almoco_colegio ? 'SIM' : 'NÃO'}
                    </span>
                    <button
                        className={`${styles.toggle} ${almoco_colegio ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => onAlmocoColegioChange(!almoco_colegio)}
                    >
                        <div className={styles.toggleCircle} />
                    </button>
                </div>
            </div>

            {hasTakeoutOption && (
                <div className={styles.optionsContainer}>
                    <label className={`${styles.radioOption} ${!almoco_colegio ? styles.disabled : ''}`}>
                        <input
                            type="radio"
                            name="lunch"
                            value="school"
                            checked={!almoco_levar}
                            onChange={() => onAlmocoLevarChange(false)}
                            disabled={!almoco_colegio}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCircle} />
                        <span className={styles.radioLabel}>No Colégio PIO</span>
                    </label>

                    <label className={`${styles.radioOption} ${!almoco_colegio ? styles.disabled : ''}`}>
                        <input
                            type="radio"
                            name="lunch"
                            value="takeaway"
                            checked={almoco_levar}
                            onChange={() => onAlmocoLevarChange(true)}
                            disabled={!almoco_colegio}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCircle} />
                        <span className={styles.radioLabel}>Para levar</span>
                    </label>
                </div>
            )}

            {/* Jantar Section */}
            <div className={styles.mealHeader}>
                <h3 className={styles.mealTitle}>Jantar (19h30 - 20h30)</h3>
                <div className={styles.toggleContainer}>
                    <span className={styles.toggleText}>
                        {janta_colegio ? 'SIM' : 'NÃO'}
                    </span>
                    <button
                        className={`${styles.toggle} ${janta_colegio ? styles.toggleOn : styles.toggleOff}`}
                        onClick={() => onJantaColegioChange(!janta_colegio)}
                    >
                        <div className={styles.toggleCircle} />
                    </button>
                </div>
            </div>

            {hasTakeoutOption && (
                <div className={styles.optionsContainer}>
                    <label className={`${styles.radioOption} ${!janta_colegio ? styles.disabled : ''}`}>
                        <input
                            type="radio"
                            name="dinner"
                            value="school"
                            defaultChecked={true}
                            disabled={!janta_colegio}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCircle} />
                        <span className={styles.radioLabel}>No Colégio PIO</span>
                    </label>
                </div>
            )}
        </div>
    );
}
