'use client'

import { Button } from "@/components/ui/Button";
import { Bed, LucideSalad, PencilLine } from "lucide-react";
import { DateSection } from "@/components/home/DateSection";
import { PageTitle } from "@/components/home/PageTitle";
import { WeekInfo } from "@/components/home/WeekInfoCard";
import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { getApiData } from "@/lib/utils";

export default function HomePage() {
    const { isLoading, user } = useAuth();
    const [isBooked, setIsBooked] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const getCurrentWeekInfo = () => {

        // Getting Week number
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, );
        const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);

        const dayOfWeek = now.getDay(); // 0 até 6
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        // Getting sunday and monday date
        const monday = new Date(now);
        monday.setDate(now.getDate() - daysToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        return {
            weekNumber,
            monday,
            sunday
        }
    }

    const fetchWeekMeals = async () => {
        const result = await getApiData('/user/weekmeals');

        if (result.success) {
            if (result.data.meals.length > 0) {
                setIsBooked(true);
            } else {
                setIsBooked(false);
            }
        } else {
            setIsBooked(false);
        }
    }

    useEffect(() => {
        fetchWeekMeals();
    }, []);

    const weekInfo = getCurrentWeekInfo();

    if (isLoading) {
        return <Loading/>
    }

    return (
        <div className={styles.container}>

            <DateSection/>

            <div className={styles.section}>
                <PageTitle
                    icon={<LucideSalad/>}
                    title="Refeições"
                    text={
                        <span>
                            Atualize sua presença nas refeições e contribua para uma cozinha mais organizada!
                        </span>
                    }
                />

                <WeekInfo
                    curWeek={weekInfo.weekNumber}
                    from={weekInfo.monday}
                    to={weekInfo.sunday}
                    isBooked={isBooked}
                />

                { isBooked ? (
                    <Button href="/refeicoes" variant="full-white" iconLeft={<PencilLine/>}>
                        Alterar marcações
                    </Button>
                ) : (
                    <Button href="/refeicoes" variant="full" iconLeft={<LucideSalad/>}>
                        Marcar refeições
                    </Button>
                )}
                
            </div>

            <Divider/>

            <div className={styles.section}>
                <PageTitle
                    icon={<Bed/>}
                    title="Hospedagem"
                    text={
                        <span>
                            Você pode fazer solicitações de hospedagem para seus convidados. Posteriormente, confirmaremos a disponibilidade.
                        </span>
                    }
                />

                <Button href="/hospedagem" variant="full" iconLeft={<Bed/>}>
                    Solicitar hospedagem
                </Button>
            </div>
        </div>
    )
}