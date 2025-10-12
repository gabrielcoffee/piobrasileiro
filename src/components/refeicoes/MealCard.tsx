import React, { useState, useEffect } from 'react';
import { LucidePlug, LucidePlus, Salad, UserCheck } from 'lucide-react';
import styles from './styles/MealCard.module.css';
import { Button } from '../ui/Button';
import GuestModal from './GuestModal';
import ConvidadosList from './ConvidadosList';
import Modal from '../admin/Modal';

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
    const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
    const [showConvidadosModal, setShowConvidadosModal] = useState(false);
    const isAnyMealConfirmed = lunch || dinner;

    const handleRemoveConvidado = (guestMealId: string) => {
        if (onRemoveGuest) {
            onRemoveGuest(guestMealId);
        }
    };

    // Atualiza estado local e notifica componente pai
    const updateLunch = (newValue: boolean) => {
        onUpdate?.({ lunch: newValue, takeOut: takeOut });
    };

    const updateDinner = (newValue: boolean) => {
        onUpdate?.({ dinner: newValue });
    };

    const updateTakeOut = (newValue: boolean) => {
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
                        <div className={styles.titleTextContainer}>
                            <h2 className={styles.cardTitle}>Refeições do dia {date}</h2>
                            <h2 className={styles.cardSubtitle}>{dayName.split(',')[0]}</h2>  
                        </div>
                    </div>
                </div>

                {/* Lunch Section */}
                <div className={styles.mealSection}>

                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (13h - 14h)</h3>

                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {lunch ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${lunch ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => {blocked ? null : updateLunch(!lunch)}}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!lunch ? styles.disabled : ''}`}>
                            <input
                                id={`lunch-school-${id}`}
                                type="radio"
                                name={`lunch-${id}`}
                                value="school"
                                checked={!takeOut}
                                onChange={() => {blocked ? null : updateTakeOut(false)}}
                                disabled={!lunch}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>

                        <label className={`${styles.radioOption} ${!lunch ? styles.disabled : ''}`}>
                            <input
                                id={`lunch-takeaway-${id}`}
                                type="radio"
                                name={`lunch-${id}`}
                                value="takeaway"
                                checked={takeOut}
                                onChange={() => {blocked ? null : updateTakeOut(true)}}
                                disabled={!lunch}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>Para levar</span>
                        </label>
                    </div>

                    {guestMeals.length > 0 && (
                        <div className={styles.convidadosListContainer}>
                            <ConvidadosList guestMeals={guestMeals} onRemove={handleRemoveConvidado} />
                        </div>
                    )}

                    {lunch && (
                        <div className={styles.addGuestButtonContainer}>
                            <Button available={!takeOut} onClick={() => takeOut ? undefined : setIsGuestModalOpen(true)} className={styles.addGuestButton} variant="full">Adicionar convidado</Button>

                            {guestMeals.length > 0 && (
                                <span className={styles.addGuestButtonText} onClick={() => setShowConvidadosModal(true)} ><UserCheck size={16} />Ver Convidados</span>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.divider}/>

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
                                {dinner ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${dinner ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => {blocked ? null : updateDinner(!dinner)}}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!dinner ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name={`dinner-${id}`}
                                value="school"
                                defaultChecked={true}
                                disabled={!dinner}
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

            {showConvidadosModal && (
                <Modal
                    title="Convidados"
                    isOpen={showConvidadosModal} 
                    onClose={() => setShowConvidadosModal(false)}
                    buttons={
                        <>
                            <Button variant="soft-red" onClick={() => setShowConvidadosModal(false)}>Fechar</Button>
                        </>
                    }
                >
                    <ConvidadosList guestMeals={guestMeals} onRemove={handleRemoveConvidado} />
                </Modal>
            )}
        </div>
    );
}