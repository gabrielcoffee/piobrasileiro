'use client'

import { useState } from "react";
import { Button } from "@/components/ui/ClebersonDaSilvaSauro";
import { InputText } from "@/components/ui/InputText";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/ForgotPassword.module.css";
import { queryApi } from "@/lib/utils";
import VerifyEmail from "./VerifyEmail";

interface ForgotPasswordProps {
    onBackClick: () => void;
}

export default function SuccessfullyRedefined({onBackClick}: ForgotPasswordProps) {
    
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
                <p className={styles.subtitle}>Senha redefinida com sucesso!</p>
            </div>

            <span className={styles.instruction}>Sua nova senha já está válida.<br></br>Entre com seu e-mail e senha nova para acessar a plataforma.</span>


            <div className={styles.buttonContainer}>
                <Button variant="full" className={styles.forgotPassword} onClick={onBackClick}>
                    Entrar
                </Button>
            </div>
            
        </div>
    )
}