"use client"
import Login from "@/components/login/Login";
import Splash from "@/components/login/Splash"
import ForgotPassword from "@/components/login/ForgotPassword"
import { useState } from "react"
import styles from "./page.module.css"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/Loading";

type ViewType = 'splash' | 'login' | 'forgotPassword';

export default function LoginPage() {

    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const [view, setView] = useState<ViewType>('splash');

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
    }

    if (isLoading) {
        return <Loading />;
    }

    if (!isLoading && isAuthenticated) {
        router.push('/home');
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

