'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/ForgotPassword.module.css";
import { queryApi } from "@/lib/utils";

interface ForgotPasswordProps {
    onBackClick: () => void;
    onResendClick: () => void;
}

export default function VerifyEmail({onBackClick, onResendClick}: ForgotPasswordProps) {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        const timer = setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);
    
    return (
        <div className={styles.container}>
            <Button
                className={styles.backButton}
                iconLeft={<ArrowLeftIcon/>}
                variant="text"
                align="left"
                onClick={onBackClick}
            >
                Voltar
            </Button>

            <div className={styles.logoContainer}>
                <img src="/brasao.png" alt="brasao" className={styles.logo} />
            </div>

            <div className={styles.titleSubtitle}>
                <h1 className={styles.title}>Esqueceu sua senha?</h1>
                <p className={styles.subtitle}>Quase lá!</p>
            </div>

            <span className={styles.instruction}>
                Verifique sua carixa de entrada principal e sua caixa de spam. <br/><br/>
                Seu link de recuperação de senha deve chegar em alguns minutos.
            </span>

            <div className={styles.buttonContainer}>
                {seconds > 0 ? (
                    <Button variant="full-white">
                        Tentar novamente após {seconds}s
                    </Button>
                ) : (
                    <Button variant="full" onClick={() => {setSeconds(30); onResendClick()}} iconRight={<ArrowRightIcon/>}>
                        Enviar link novamente
                    </Button>
                )}
            </div>
            
        </div>
    )
}