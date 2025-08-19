import { CheckCheck, CircleX, X } from "lucide-react";
import styles from "./styles/DaySelector.module.css";
import { useState, useEffect } from "react";

interface MealDay {
    date: string;
    displayDate: string;
    dayName: string;
    lunch: boolean;
    dinner: boolean;
    takeOut: boolean;
    dayIndex: number;
    isPast: boolean;
}

interface DaySelectorProps {
    mealsList: MealDay[];
    onDaySelect: (dayIndex: number) => void;
    onMarkAllMeals: (markAsTrue: boolean) => void;
}

export default function DaySelector({ mealsList, onDaySelect, onMarkAllMeals }: DaySelectorProps) {

    const [haveSelected, setHaveSelected] = useState(false);

    // Sincroniza o estado do botão com as seleções atuais das refeições (apenas dias futuros)
    useEffect(() => {
        if (mealsList.length > 0) {
            const futureMeals = mealsList.filter(meal => !meal.isPast);
            if (futureMeals.length > 0) {
                const allFutureMealsSelected = futureMeals.every(meal => meal.lunch && meal.dinner);
                setHaveSelected(allFutureMealsSelected);
            } else {
                setHaveSelected(false);
            }
        }
    }, [mealsList]);

    /* Dias da semana estarão com fundo cinza se já tiverem passado */ 
    const today = new Date();
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const isAfterCutoff = currentHour > 19 || (currentHour === 19 && currentMinute >= 0);

    // Dias da semana em ordem (segunda a domingo)
    const daysOfWeek = [
        { num: 0, name: "SEG", dayOfWeek: 1 },
        { num: 1, name: "TER", dayOfWeek: 2 },
        { num: 2, name: "QUA", dayOfWeek: 3 },
        { num: 3, name: "QUI", dayOfWeek: 4 },
        { num: 4, name: "SEX", dayOfWeek: 5 },
        { num: 5, name: "SAB", dayOfWeek: 6 },
        { num: 6, name: "DOM", dayOfWeek: 0 },
    ]

    const handleDayClick = (dayIndex: number) => {
        // Encontra o dia correspondente na mealsList
        const selectedDay = mealsList.find(meal => meal.dayIndex === dayIndex);
        if (selectedDay && !selectedDay.isPast) {
            onDaySelect(dayIndex);
        }
    };

    const handleMarkAllClick = () => {
        const newState = !haveSelected;
        setHaveSelected(newState);
        onMarkAllMeals(newState);
    };

    return (
        <div className={styles.container}>
            <div className={styles.textAndButtonContainer}>
                <span className={styles.daySelectorText}>Por favor, selecione suas refeições até <strong>hoje às 19h00.</strong></span>
                <button 
                className={`${styles.checkButton} ${haveSelected ? styles.selected : ""}`} 
                onClick={handleMarkAllClick}
                >

                    {haveSelected ? (   
                        <span className={styles.checkButtonText}>
                            <CircleX color="red"/> Desmarcar todas
                        </span>
                    ) : (
                        <span className={styles.checkButtonText}>
                            <CheckCheck color="var(--color-primary)"/> Marcar todas
                        </span>
                    )}

                    
                </button>
            </div>
            <div className={styles.daysContainer}>
                {daysOfWeek.map((day, index) => {
                    const mealDay = mealsList.find(meal => meal.dayIndex === index);
                    const isPast = mealDay ? mealDay.isPast : false;
                    
                    return (
                        <button 
                            key={day.name} 
                            className={`${styles.dayButton} ${isPast ? styles.passed : ""}`}
                            onClick={() => handleDayClick(index)}
                            disabled={isPast}
                        >
                            <span>{day.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}