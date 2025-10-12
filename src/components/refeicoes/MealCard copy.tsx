import React, { useState, useEffect } from 'react';
import { LucidePlug, LucidePlus, Salad } from 'lucide-react';
import styles from './styles/MealCard.module.css';
import { Button } from '../ui/Button';
import GuestModal from './GuestModal';
import ConvidadosList from './ConvidadosList';
import { isDateSaturdaySunday } from '@/lib/utils';

interface MealCardProps {
    id?: string;
    date?: string;
    dayName?: string;
    lunch?: boolean;
    dinner?: boolean;
    takeOut?: boolean;
    guestMeals?: any[];
    onUpdate?: (updates: { lunch?: boolean; dinner?: boolean; takeOut?: boolean }) => void;
    onRemoveGuest?: (guestMealId: string) => void;
    onGuestAdded?: () => void;
    style?: React.CSSProperties;
    blocked?: boolean;
}

export default function MealCard({ 
    id,
    date = "07/04",
    dayName = "Segunda-feira, 07/04/2025",
    lunch = false,
    dinner = false,
    takeOut = false,
    guestMeals = [],
    onUpdate,
    onRemoveGuest,
    onGuestAdded,
    style,
    blocked,
}: MealCardProps) {
    const [lunchConfirmed, setLunchConfirmed] = useState(lunch);
    const [dinnerConfirmed, setDinnerConfirmed] = useState(dinner);
    const [takeOutOption, setTakeOutOption] = useState(takeOut);
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const isAnyMealConfirmed = lunchConfirmed || dinnerConfirmed;

    const handleRemoveConvidado = (guestMealId: string) => {
        if (onRemoveGuest) {
            onRemoveGuest(guestMealId);
        }
    };

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
        <div className={styles.container} id={id} style={style}>
            {/* Date Header */}
            <div className={`${styles.dateHeader} ${blocked ? styles.blocked : ''}`}>
                <span className={`${styles.dateText} ${blocked ? styles.blockedTxt : ''}`}>{dayName} {blocked ? '(Data Bloqueada)' : ''}</span>
            </div>

            {/* Meal Card */}
            <div className={`${styles.mealCard} ${isAnyMealConfirmed ? styles.mealCardEnabled : ''} ${blocked ? styles.mealCardBlocked : ''}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.titleContainer}>
                        <Salad size={24} className={styles.saladIcon} />
                        <h2 className={styles.cardTitle}>Refeições do dia {date}</h2>
                    </div>
                </div>

                {/* Lunch Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (13h - 14h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {lunchConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${lunchConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => {blocked ? null : updateLunch(!lunchConfirmed)}}
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
                                onChange={() => {blocked ? null : updateTakeOut(false)}}
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
                                onChange={() => {blocked ? null : updateTakeOut(true)}}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>Para levar</span>
                        </label>
                    </div>

                    {/* Convidados List - só mostra se há convidados */}
                    {guestMeals.length > 0 && (
                        <ConvidadosList guestMeals={guestMeals} onRemove={handleRemoveConvidado} />
                    )}

                    {lunchConfirmed && !takeOutOption && (
                        <Button onClick={() => setIsGuestModalOpen(true)} className={styles.addGuestButton} variant="full">Adicionar convidado</Button>
                    )}
                </div>

                <div className={styles.divider} />

                {/* Dinner Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>
                            Jantar {
                            dayName.includes('SÁBADO') || dayName.includes('DOMINGO') ?
                                '(19h - 20h)' 
                            :
                                '(19h30 - 20h30)'
                            }
                        </h3>

                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {dinnerConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${dinnerConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => {blocked ? null : updateDinner(!dinnerConfirmed)}}
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
                <GuestModal 
                    date={dayName} 
                    isOpen={isGuestModalOpen} 
                    onClose={() => setIsGuestModalOpen(false)}
                    onGuestAdded={onGuestAdded}
                />
            )}
        </div>
    );
}