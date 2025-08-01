'use client'
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Title from "@/components/Title";
import { useState, useEffect, useRef } from "react";
import styles from "./styles/Splash.module.css";

interface SplashProps {
    onEnterClick: () => void;
}

export default function Splash({onEnterClick}: SplashProps) {
    const [textIndex, setTextIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        timerRef.current = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % texts.length);
        }, 4000);
    };

    const handleNextText = () => {
        setTextIndex((prev) => (prev + 1) % texts.length);
        startTimer();
    };

    // Auto-avança o texto a cada 4 segundos
    useEffect(() => {
        startTimer();
        
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const texts = [
        <span>Seu <strong>agendamento de refeições </strong>na palma da mão.</span>,
        <span>Vizualize a <strong>disponibilidade de hospedagem</strong> sempre que quiser.</span>,
        <span>Você <strong>conectado com a sua casa</strong> de onde estiver.</span>,
    ]

    return (
        <div className={styles.container}>
            <div onClick={handleNextText} className={styles.clickablePanel}>
                <img className={styles.backgroundImage} src={"/lines.png"} alt="background" />
                <img className={styles.logo} src={"/brasao.png"} alt="brasao" />
            </div>

            <div className={styles.contentContainer}>
                {/* Indicador de progresso */}
                <div className={styles.progressContainer}>
                    <div className={`${styles.progressBarBase} ${textIndex == 0 ? styles.progressBarActive : styles.progressBarInactive}`}></div>
                    <div className={`${styles.progressBarBase} ${textIndex == 1 ? styles.progressBarActive : styles.progressBarInactive}`}></div>
                    <div className={`${styles.progressBarBase} ${textIndex == 2 ? styles.progressBarActive : styles.progressBarInactive}`}></div>
                </div>
                
                <Title>
                    {texts[textIndex]}
                </Title>

                <Button variant="full" onClick={onEnterClick} className={styles.button} iconRight={<ArrowRightIcon/>}>
                    Entrar
                </Button>
            </div>
        </div>
    )
}