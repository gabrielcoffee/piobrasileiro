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
import { queryApi, getCurrentWeekInfo } from "@/lib/utils";

export default function HomePage() {
    const { isLoading } = useAuth();
    const [isBooked, setIsBooked] = useState(false);

    const fetchWeekMeals = async () => {
        const result = await queryApi('GET', '/user/weekmeals');

        if (result.success) {
            if (result.data.userMeals.length > 0) {
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