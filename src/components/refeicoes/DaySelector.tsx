import { CheckCheck, CircleX, X } from "lucide-react";
import styles from "./styles/DaySelector.module.css";
import { useState } from "react";

export default function DaySelector() {

    const [haveSelected, setHaveSelected] = useState(false);

    /* Dias da semana estarão com fundo cinza se já tiverem passado */ 
    const today = new Date();
    const dayOfWeek = today.getDay();

    const daysOfWeek = [
        { num: 0, name: "SEG", passed: dayOfWeek >= 0 },
        { num: 1, name: "TER", passed: dayOfWeek >= 1 },
        { num: 2, name: "QUA", passed: dayOfWeek >= 2 },
        { num: 3, name: "QUI", passed: dayOfWeek >= 3 },
        { num: 4, name: "SEX", passed: dayOfWeek >= 4 },
        { num: 5, name: "SAB", passed: dayOfWeek >= 5 },
        { num: 6, name: "DOM", passed: dayOfWeek >= 6 },
    ]

    return (
        <div className={styles.container}>
            <div className={styles.textAndButtonContainer}>
                <span className={styles.daySelectorText}>Por favor, selecione suas refeições até <strong>hoje às 19h00.</strong></span>
                <button 
                className={`${styles.checkButton} ${haveSelected ? styles.selected : ""}`} 
                onClick={() => setHaveSelected(!haveSelected)}
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
                {daysOfWeek.map((day) => {
                    return (
                        <button key={day.name} className={`${styles.dayButton} ${day.passed ? styles.passed : ""}`}>
                            <span>{day.name}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}