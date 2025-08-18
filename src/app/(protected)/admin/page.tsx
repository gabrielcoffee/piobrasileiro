"use client"
import Login from "@/components/login/Login";
import ForgotPassword from "@/components/login/ForgotPassword"
import { useState } from "react"
import styles from "./page.module.css"

type ViewType = 'login' | 'forgotPassword';

export default function LoginPage() {

    const [view, setView] = useState<ViewType>('login');

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
    }

    return (
        <div className={styles.container}>

            <img className={styles.lateralImage} src="/adminbg.webp" alt="Admin Background" />

            <div className={styles.contentWrapper}>
                <div className={styles.content}>
                    {view === 'login' && (
                        <Login 
                            onForgotPasswordClick={() => handleViewChange('forgotPassword')}
                            onBackClick={() => handleViewChange('login')}
                        />
                    )}
                    
                    {view === 'forgotPassword' && (
                        <ForgotPassword 
                            onEnterClick={() => handleViewChange('login')}
                            onBackClick={() => handleViewChange('login')}
                        />
                    )}  
                </div>
            </div>
        </div>
    )
}

