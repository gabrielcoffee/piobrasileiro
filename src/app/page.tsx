'use client'

import { Button } from "@/components/ui/Button";
import { Bed, LucideSalad } from "lucide-react";
import { Header } from "@/components/general/Header";
import { DateSection } from "@/components/home/DateSection";
import { PageTitle } from "@/components/home/PageTitle";
import { WeekInfo } from "@/components/home/WeekInfoCard";
import { Footer } from "@/components/general/Footer";
import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className={styles.container}>
            <Header/>

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
                    curWeek={14}
                    from={new Date('2025-04-07')}
                    to={new Date('2025-04-13')}
                    isBooked={false}
                />

                <Button href="/refeicoes" variant="full" iconLeft={<LucideSalad/>}>
                    Marcar refeições
                </Button>
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

            <Footer/>
        </div>
    )
}