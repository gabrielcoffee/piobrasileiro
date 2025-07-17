"use client"
import LoginView from "@/components/login/LoginView";
import SplashView from "@/components/login/SplashView"
import ForgotPasswordView from "@/components/login/ForgotPasswordView"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { useState } from "react"

type ViewType = 'splash' | 'login' | 'forgotPassword';

export default function Login() {

    const [view, setView] = useState<ViewType>('splash');

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
    }

    return (
        <div>
            {view === 'splash' && (
                <SplashView onEnterClick={() => handleViewChange('login')}/>
            )}

            {view === 'login' && (
                <LoginView/>
            )}
            
            {view === 'forgotPassword' && (
                <ForgotPasswordView 
                    onBackToLogin={() => handleViewChange('login')}
                    onBackToSplash={() => handleViewChange('splash')}
                />
            )}            
        </div>
    )
}

