"use client"
import Login from "@/components/login/Login";
import Splash from "@/components/login/Splash"
import ForgotPassword from "@/components/login/ForgotPassword"
import { useEffect, useState } from "react"
import styles from "./page.module.css"
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/Loading";

type ViewType = 'splash' | 'login' | 'forgotPassword' | 'verifyEmail';

export default function LoginPage() {

    const [view, setView] = useState<ViewType>('splash');

    const handleViewChange = (newView: ViewType) => {
        setView(newView);
    }

    return (
        <div className={styles.container}>
            <div className={styles.mobileContainer}>
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
            <div className={styles.desktopContainer}>
                <div className={styles.lateralImage}>
                    <Splash onEnterClick={() => handleViewChange('login')}/>
                </div>

                <div className={styles.contentWrapper}>
                    <div className={styles.content}>
                        {(view === 'login' || view === 'splash') && (
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
        </div>
    )
}

