'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputText } from "@/components/ui/InputText";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/ForgotPassword.module.css";

interface ForgotPasswordProps {
    onEnterClick: () => void;
    onBackClick: () => void;
}

export default function ForgotPassword({onEnterClick, onBackClick}: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [emailWrong, setEmailWrong] = useState(false);
    const handleLogin = () => {

    }
    
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
                <p className={styles.subtitle}>Recupere-a aqui!</p>
            </div>

            <span className={styles.instruction}>Insira seu e-mail e você receberá um link para redefinir seua senha</span>

            <InputText
                type="email"
                label="E-mail:"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailWrong ? "E-mail incorreto" : ""}
            />

            <div className={styles.buttonContainer}>
                <Button available={(email) ? true : false} variant="full" onClick={handleLogin} iconRight={<ArrowRightIcon/>}>
                    Enviar link de redefinição de senha
                </Button>

                <Button variant="text" className={styles.forgotPassword} onClick={onEnterClick}>
                    Entrar
                </Button>
            </div>
            
        </div>
    )
}