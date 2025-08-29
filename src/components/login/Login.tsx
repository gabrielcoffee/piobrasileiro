'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputPassword } from "@/components/ui/InputPassword";
import { Checkbox } from "@/components/ui/Checkbox";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/Login.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "../ui/Loading";

interface LoginProps {
    onForgotPasswordClick: () => void;
    onBackClick: () => void;
}

export default function Login({onForgotPasswordClick, onBackClick}: LoginProps) {

    // Variables for the login page
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [emailWrong, setEmailWrong] = useState(false);
    const [passwordWrong, setPasswordWrong] = useState(false);

    // Authentication and database request
    const { isAuthenticated, isLoading, login, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            if (user?.role === 'admin') {
                router.push('/admin/home')
            } else {
                router.push('/home');
            }
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return <Loading />;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            router.push('/home');
        } else {
            setEmailWrong(true);
            setPasswordWrong(true);
        }
    };
    
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
                <h1 className={styles.title}>Seja bem vindo!</h1>
                <p className={styles.subtitle}>Log In</p>
            </div>

            <span className={styles.instruction}>Informe seus dados para entrar:</span>

            <InputText
                type="email"
                label="E-mail:"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailWrong ? "E-mail incorreto" : ""}
            />

            <InputPassword
                label="Senha:"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordWrong ? "Senha incorreta" : ""}
            />

            <Checkbox
                label="Lembrar meus dados"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
            />

            <div className={styles.buttonContainer}>
                <Button available={(email && password) ? true : false} variant="full" onClick={handleLogin} iconRight={<ArrowRightIcon/>}>
                    Entrar
                </Button>

                <Button variant="text" className={styles.forgotPassword} onClick={onForgotPasswordClick}>
                    Esqueceu sua senha?
                </Button>
            </div>
            
        </div>
    )
}