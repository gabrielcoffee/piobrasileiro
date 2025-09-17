'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { ArrowLeftIcon, CheckCheck, Lock, X } from "lucide-react";
import styles from "../../app/reset-password/page.module.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const nome_completo = searchParams.get("nome_completo");
    const email = searchParams.get("email");

    const router = useRouter();
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);

    const [lengthRequirement, setLengthRequirement] = useState(false);
    const [uppercaseRequirement, setUppercaseRequirement] = useState(false);
    const [lowercaseRequirement, setLowercaseRequirement] = useState(false);
    const [numberRequirement, setNumberRequirement] = useState(false);
    const [nameRequirement, setNameRequirement] = useState(false);
    const [emailRequirement, setEmailRequirement] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState(false);

    const handleResetPassword = async () => {

        if (!passwordRequirements) {
            console.log('Senha inválida');
            return;
        }

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token,
                newPassword: confirmPassword
            })
        });

        if (result.ok) {
            console.log('Senha redefinida com sucesso');
            router.push('/login');
        } else {
            console.log('Erro ao redefinir senha');
        }
    }

    useEffect(() => {

        if (password.length >= 8) {
            setLengthRequirement(true);
        } else {
            setLengthRequirement(false);
        }
        
        if (password.match(/[A-Z]/)) {
            setUppercaseRequirement(true);
        } else {
            setUppercaseRequirement(false);
        }
        
        if (password.match(/[a-z]/)) {
            setLowercaseRequirement(true);
        } else {
            setLowercaseRequirement(false);
        }
        
        if (password.match(/[0-9]/)) {
            setNumberRequirement(true);
        } else {
            setNumberRequirement(false);
        }

        if (!password.includes(nome_completo as string)) {
            setNameRequirement(true);
        } else {
            setNameRequirement(false);
        }
        
        if (!password.includes(email as string)) {
            setEmailRequirement(true);
        } else {
            setEmailRequirement(false);
        }
        
        if (lengthRequirement && uppercaseRequirement && lowercaseRequirement && numberRequirement && nameRequirement && emailRequirement && password === confirmPassword) {
            setPasswordRequirements(true);
        } else {
            setPasswordRequirements(false);
        }
        
        if (password !== confirmPassword && confirmPassword.length >= 8) {
            setIsConfirmPasswordValid(false);
        } else {
            setIsConfirmPasswordValid(true);
        }
    }, [password, confirmPassword]);
    
    return (
        <div className={styles.outerContainer}>
        <div className={styles.container}>

            <Button
                className={styles.backButton}
                iconLeft={<ArrowLeftIcon/>}
                variant="text"
                align="left"
                onClick={() => router.push('/login')}
            >
                Voltar
            </Button>

            <div className={styles.logoContainer}>
                <img src="/brasao.png" alt="brasao" className={styles.logo} />
            </div>

            <div className={styles.titleSubtitle}>
                <h1 className={styles.title}>Redefina sua senha</h1>
            </div>

            <InputText
                type="password"
                label="Senha:"
                placeholder="Insira sua nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <InputText
                type="password"
                label="Confirmar senha:"
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span className={styles.errorText}>{isConfirmPasswordValid ? "" : "As senhas não estão iguais"}</span>

            <div className={styles.buttonContainer}>
                <Button available={passwordRequirements && isConfirmPasswordValid ? true : false} variant="full" onClick={handleResetPassword} iconRight={<Lock/>}>
                    Redefinir senha
                </Button>
            </div>

            <span><strong>Sua senha deve conter:</strong></span>
            <ul className={styles.passwordRequirementsList}>
                <li>{lengthRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 8 caracteres </li>
                <li>{uppercaseRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 letra maiúscula </li>
                <li>{lowercaseRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 letra minúscula </li>
                <li>{numberRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Pelo menos 1 número </li>
                <li>{nameRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Não deve conter seu nome </li>
                <li>{emailRequirement ? <CheckCheck size={16} color="var(--color-primary)" /> : <X size={16} color="var(--color-error)" />}Não deve conter seu email </li>
            </ul>
        </div>
        </div>
    )
}
