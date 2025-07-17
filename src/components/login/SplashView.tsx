'use client'
import { ArrowRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import Title from "../Title";
import { useState, useEffect, useRef } from "react";

type SplashViewProps = {
    onEnterClick: () => void;
}

export default function SplashView({onEnterClick}: SplashViewProps) {
    const [textIndex, setTextIndex] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = () => {
        // Limpa timer anterior se existir
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        
        // Cria novo timer
        timerRef.current = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % texts.length);
        }, 4000);
    };

    const handleNextText = () => {
        // Avança manualmente
        setTextIndex((prev) => (prev + 1) % texts.length);
        // Reinicia o timer
        startTimer();
    };

    // Auto-avança o texto a cada 4 segundos
    useEffect(() => {
        startTimer();
        
        // Cleanup quando componente desmonta
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
        <div style={styles.container}>
            <div onClick={handleNextText} style={styles.clickablePanel}>
                <img style={styles.backgroundImage} src={"/lines.png"} alt="background" />
                <img style={styles.logo} src={"/brasao.png"} alt="brasao" />
            </div>

            <div style={styles.contentContainer}>
                {/* Indicador de progresso */}
                <div style={styles.progressContainer}>
                    <div style={{
                        ...styles.progressBarBase,
                        backgroundColor: textIndex == 0 ? '#1e293b' : '#d1d5db'
                    }}></div>
                    <div style={{
                        ...styles.progressBarBase,
                        backgroundColor: textIndex == 1 ? '#1e293b' : '#d1d5db'
                    }}></div>
                    <div style={{
                        ...styles.progressBarBase,
                        backgroundColor: textIndex == 2 ? '#1e293b' : '#d1d5db'
                    }}></div>
                </div>
                
                <Title>
                    {texts[textIndex]}
                </Title>

                <Button onClick={onEnterClick} style={styles.button} iconRight={<ArrowRightIcon/>}>
                    <span style={styles.buttonText}>Entrar</span>
                </Button>
            </div>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100vh',
        marginLeft: '30px',
        marginRight: '30px',
        paddingTop: '15vh',
        paddingBottom: '10vh',
    },
    backgroundImage: {
        position: 'absolute' as const,
        zIndex: 1,
    },
    logo: {
        width: '75%',
        position: 'relative' as const,
        zIndex: 2,
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '16px',
        width: '100%',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
        marginBottom: '96px',
    },
    progressContainer: {
        display: 'flex',
        gap: '4px',
        width: '100%',
    },
    progressBarBase: {
        height: '4px',
        flex: '1',
        borderRadius: '9999px',
        transition: 'background-color 0.3s ease',
    },
    buttonText: {
        fontWeight: 'bold',
        fontSize: '18px',
    },
    button: {
        marginTop: '16px',
    },
    clickablePanel: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative' as const,
    }
}