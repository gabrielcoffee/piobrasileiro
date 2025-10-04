 'use client'

import styles from "./page.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/Loading";
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { getCurrentWeekInfo, queryApi } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Plus, Printer } from "lucide-react";
import MiniCard from "@/components/admin/MiniCard";
import { generateReportPDFLib } from "@/lib/reportUtils";

export default function HomePage() {
    const { isLoading } = useAuth();

    const [weekStart, setWeekStart] = useState(new Date());
    const [weekEnd, setWeekEnd] = useState(new Date());
    const [dashboardData, setDashboardData] = useState<any>(null);

    const [selectedDate, setSelectedDate] = useState<string>('');
    const [fullWeek, setFullWeek] = useState<boolean>(true);

    if (isLoading) {
        return <Loading/>
    }

    const fetchDashboardData = async () => {
        const result = await queryApi('GET', '/admin/dashboard');

        if (result.success) {
            console.log(result.data);
            setDashboardData(result.data);
        } else {
            console.error('Erro ao buscar dados:', result.error);
        }
    }


    const handleGenerateReport = async () => {

        if (dashboardData?.weekTotals?.totalMeals === 0) {
            return;
        }

        const result = await queryApi('GET', '/admin/dashboard/report');

        if (result.success) {
            const { weekInfo, notesInfo } = result.data;
            generateReportPDFLib('print', weekInfo, notesInfo);
        } else {
            console.error('Erro ao buscar dados:', result.error);
        }
    }

    const getWeekDates = () => {
        const weekDates = [];
        const startDate = new Date(weekStart);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            weekDates.push(date);
        }
        return weekDates;
    }

    const currentWeekDaysButtons = () => {
        // Generate dates for the selected week
        const weekDates = getWeekDates();

        const weekDayButtons = weekDates.map((date: Date, index: number) => {
            const dateString = date.toISOString().split('T')[0];
            
            return (
                <button 
                    key={index} 
                    className={`${styles.dayButton} ${selectedDate === dateString  && !fullWeek ? styles.selected : ""}`}
                
                    onClick={() => {
                        setSelectedDate(dateString);
                        fetchDashboardData();
                        setFullWeek(false);
                    }}
                >
                    <span>{date.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()}</span>
                </button>
            )
        })

        return [
            <button  
                key="fullWeek"
                className={`${styles.dayButton} ${fullWeek ? styles.selected : ""}`}
                onClick={() => {
                    setFullWeek(true);
                    fetchDashboardData();
                }}
            >
                <span>SEMANA INTEIRA</span>
            </button>,
            ...weekDayButtons
        ]
    }

    useEffect(() => {
        const currentWeekInfo = getCurrentWeekInfo();
        setWeekStart(currentWeekInfo.monday);
        setWeekEnd(currentWeekInfo.sunday);
        setFullWeek(true);
        fetchDashboardData();
    }, []);

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Início" breadcrumb={["Início", "Informações"]} />

                <div className={styles.weekInfo}>
                    <span>
                        Semana {weekStart.toLocaleDateString( 'pt-BR', { day: '2-digit', month: '2-digit' } )} a {weekEnd.toLocaleDateString( 'pt-BR', { day: '2-digit', month: '2-digit' } )}
                    </span>

                    <div className={styles.weekInfoButtons}>
                        <Button variant="full-white" iconRight={<ArrowRight />}
                        href="/admin/calendario"
                        >
                            Ver calendário
                        </Button>
                    </div>
                </div>

                <div className={styles.weekDaysButtons}>
                    <span>Filtre por:</span>
                    <div className={styles.weekList}>
                        {currentWeekDaysButtons()}
                    </div>
                </div>
    
                <div className={styles.dashboard}>
                    {fullWeek ? (
                        <>
                            <div className={styles.dashboardRow}>
                                <MiniCard color="green" value={dashboardData?.weekTotals?.almocoColegioCount} title="Almoço no Colégio Pio" />
                                <MiniCard color="green" value={dashboardData?.weekTotals?.almocoLevarCount} title="Almoço para Levar" />
                                <MiniCard color="green" value={dashboardData?.weekTotals?.jantaColegioCount} title="Jantares" />
                            </div>
                            <div></div>
                            <div className={styles.dashboardRow}>
                                <MiniCard color="yellow" value={dashboardData?.totalMoradores} title="Moradores" />
                                <MiniCard color="yellow" value={dashboardData?.weekTotals?.convidadosCount} title="Visitantes" />
                                <MiniCard color="yellow" value={dashboardData?.hospedesCount} title="Hóspedes" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.dashboardRow}>
                                <MiniCard color="green" value={dashboardData?.dailyStats?.find((data: any) => data.day === selectedDate)?.almocoColegioCount} title="Almoço no Colégio Pio" />
                                <MiniCard color="green" value={dashboardData?.dailyStats?.find((data: any) => data.day === selectedDate)?.almocoLevarCount} title="Almoço para Levar" />
                                <MiniCard color="green" value={dashboardData?.dailyStats?.find((data: any) => data.day === selectedDate)?.jantaColegioCount} title="Jantares" />
                            </div>
                            <div></div>
                            <div className={styles.dashboardRow}>
                                <MiniCard color="yellow" value={dashboardData?.totalMoradores} title="Moradores" />
                                <MiniCard color="yellow" value={dashboardData?.dailyStats?.find((data: any) => data.day === selectedDate)?.convidadosCount} title="Visitantes" />
                                <MiniCard color="yellow" value={dashboardData?.dailyStats?.find((data: any) => data.day === selectedDate)?.hospedesCount} title="Hóspedes" />
                            </div>
                        </>
                    )}

                    <div></div>
                    <span className={styles.dashboardTitle}>Acessos rápidos</span>
                    <div className={styles.dashboardRow}>
                        <MiniCard color="white" value={dashboardData?.weekTotals?.totalMeals} title="Total de refeições da semana" 
                        button={<Button onClick={() => handleGenerateReport()} variant="full-white" iconLeft={<Printer/>}>Gerar relatório</Button>} />
                        <MiniCard color="white" value={dashboardData?.availableRooms} title="Quartos disponíveis na semana"
                        button={<Button href="/admin/reservas" variant="full-white" iconLeft={<Plus/>}>Nova reserva</Button>} />
                    </div>
                </div>
            </Card>
        </div>
    )
}