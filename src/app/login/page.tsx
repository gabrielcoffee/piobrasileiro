"use client"
import Login from "@/components/login/Login";
import Splash from "@/components/login/Splash"
import ForgotPassword from "@/components/login/ForgotPassword"
import { Button } from "@/components/ui/Button"
import { ArrowRightIcon } from "lucide-react"
import { useState } from "react"
import styles from "./page.module.css"

type ViewType = 'splash' | 'login' | 'forgotPassword';

export default function LoginPage() {

    const [view, setView] = useState<ViewType>('splash');

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
    }

    return (
        <div className={styles.container}>
            {view === 'splash' && (
                <Splash onEnterClick={() => handleViewChange('login')}/>
            )}

            {view === 'login' && (
                <Login 
                    onForgotPasswordClick={() => handleViewChange('forgotPassword')}
                    onBackClick={() => handleViewChange('splash')}
                />
            )}
            
            {view === 'forgotPassword' && (
                <ForgotPassword 
                    onEnterClick={() => handleViewChange('login')}
                    onBackClick={() => handleViewChange('login')}
                />
            )}            
        </div>
    )
}

