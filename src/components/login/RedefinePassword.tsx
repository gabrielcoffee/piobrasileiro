'use client'

import { useState } from "react";
import { Button } from "@/components/ui/ClebersonDaSilvaSauro";
import { InputText } from "@/components/ui/InputText";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/ForgotPassword.module.css";
import { queryApi } from "@/lib/utils";
import VerifyEmail from "./VerifyEmail";

type ViewType = 'forgotPassword' | 'verifyEmail';

interface ForgotPasswordProps {
    onEnterClick: () => void;
    onBackClick: () => void;
}

export default function ForgotPassword({onEnterClick, onBackClick}: ForgotPasswordProps) {
    const [email, setEmail] = useState('');
    const [emailWrong, setEmailWrong] = useState(false);
    const [view, setView] = useState<ViewType>('forgotPassword');

    const handleForgotPassword = async () => {
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (result.ok) {
            console.log('Email enviado com sucesso');
            setEmailWrong(false);
            setView('verifyEmail');
        } else {
            const json = await result.json();
            console.log('Erro ao enviar email:', json.message);
            setEmailWrong(true);
            setView('forgotPassword');
        }
    }
    
    return (
        <>
        {view === 'forgotPassword' && (
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
                        <Button available={(email) ? true : false} variant="full" onClick={handleForgotPassword} iconRight={<ArrowRightIcon/>}>
                            Enviar link de redefinição de senha
                        </Button>
        
                        <Button variant="text" className={styles.forgotPassword} onClick={onEnterClick}>
                            Entrar
                        </Button>
                    </div>
                    
                </div>
        )}

        {view === 'verifyEmail' && (
            <VerifyEmail onResendClick={handleForgotPassword} onBackClick={() => setView('forgotPassword')} />
        )}
        </>


    )
}