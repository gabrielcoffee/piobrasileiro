'use client'

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import { InputPassword } from "@/components/ui/InputPassword";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import styles from "./styles/Login.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { Loading } from "../ui/Loading";

interface LoginProps {
    onForgotPasswordClick: () => void;
    onBackClick: () => void;
    onAdminLogin?: boolean;
}

export default function Login({onForgotPasswordClick, onBackClick, onAdminLogin = false}: LoginProps) {

    const pathname = usePathname();

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

            if (onAdminLogin) {
                if (user?.role === 'admin') {
                    router.push('/admin/home')
                } else {
                    router.push('/home')
                }
            } else {
                router.push('/home');
            }
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        if (email === '') {
            setEmailWrong(true);
            return;
        }
        if (password === '') {
            setPasswordWrong(true);
            return;
        }
        
        e.preventDefault();

        const jsonResponse = await login(email, password, rememberMe);

        if (jsonResponse === true) {
            router.push('/home');
        } else {
            if (jsonResponse.error === "email_error") {
                setEmailWrong(true);
            }
            if (jsonResponse.error === "password_error") {
                setPasswordWrong(true);
            }
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

            <div className={`${styles.logoContainer} ${!pathname?.includes('/admin') ? styles.logoContainerUser : ''}`}>
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
                onChange={(e) => {setEmail(e.target.value); setEmailWrong(false);}}
                error={emailWrong ? "E-mail incorreto" : ""}
            />

            <InputPassword
                label="Senha:"
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => {setPassword(e.target.value); setPasswordWrong(false);}}
                error={passwordWrong ? "Senha incorreta" : ""}
            />

            <div className={styles.checkboxButton}>
                <input onChange={() => setRememberMe(!rememberMe)} checked={rememberMe} type="checkbox" id="lembrar"/>
                <label htmlFor="lembrar">Lembrar meus dados</label>
            </div>

            <div className={styles.buttonContainer}>
                <Button available={(email && password) ? true : false} variant="full" onClick={handleLogin} iconRight={!isLoading ? <ArrowRightIcon/> : undefined}>
                    {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>

                <Button variant="text" className={styles.forgotPassword} onClick={onForgotPasswordClick}>
                    Esqueceu sua senha?
                </Button>
            </div>
            
        </div>
    )
}