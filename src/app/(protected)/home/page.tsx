'use client'

import { Bed, LucideSalad, PencilLine } from "lucide-react";
import { PageTitle } from "@/components/home/PageTitle";
import { WeekInfo } from "@/components/home/WeekInfoCard";
import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loading } from "@/components/ui/Loading";
import { queryApi, getCurrentWeekInfo } from "@/lib/utils";
import { ShowDateSection } from "@/components/home/ShowDateSection";
import { Button } from "@/components/ui/Button";
import Card from "@/components/desktop/Card";

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

        <>
        {/* MOBILE VERSION  */}


        <div className={styles.mobileContainer}>

            <ShowDateSection/>

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


        {/* DESKTOP VERSION BELOW */}


        <div className={styles.desktopContainer}>

            <Card>

                <div className={styles.desktopImageUser}>
                    <img className={styles.desktopBgImage} src='/adminbg.webp' alt='Imagem de fundo' height={182}  />
                    <div className={styles.imageOverlay} />
                    <span className={styles.imageText}>Um pedaço do Brasil<br/>no coração de Roma.</span>
                </div>

                <ShowDateSection/>

                <div className={styles.section}>

                    <div className={styles.sectionTitle}>

                        <PageTitle
                            icon={<LucideSalad size={30}/>}
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
                    </div>

                    <div className={styles.sectionButtons}>

                        <div className={styles.containerButtons}>
                            { isBooked ? (
                                <Button className={styles.button} href="/refeicoes" variant="full-white" iconLeft={<PencilLine/>}>
                                    Alterar marcações
                                </Button>
                            ) : (
                                <Button className={styles.button} href="/refeicoes" variant="full" iconLeft={<LucideSalad/>}>
                                    Marcar refeições
                                </Button>
                            )}
                        </div>
                    </div>

                    
                </div>

                <div className={styles.section}>

                    <div className={styles.sectionTitle}>
                        <PageTitle
                            icon={<Bed size={30}/>}
                            title="Hospedagem"
                            text={
                                <span>
                                    Você pode fazer solicitações de hospedagem para seus convidados. Posteriormente, confirmaremos a disponibilidade.
                                </span>
                            }
                        />
                    </div>

                    <div className={styles.sectionButtons}>
                        <div className={styles.containerButtons}>
                            <Button href="/hospedagem" variant="full" iconLeft={<Bed/>}>
                                Solicitar hospedagem
                            </Button>
                        </div>
                    </div>
                    
                </div>
            </Card>
        </div>
        </>
    )
}