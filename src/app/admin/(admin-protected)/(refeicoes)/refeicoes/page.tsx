'use client'

import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Card from '@/components/desktop/Card';
import CardHeader from '@/components/desktop/CardHeader';
import Table from '@/components/admin/Table';
import SearchSection from '@/components/admin/SearchSection';
import { PencilLine, Plus, Printer, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { convertBufferToBase64, getCurrentWeekInfo, getDateString, queryApi } from '@/lib/utils';
import { DateSection } from '@/components/admin/DateSection';

export default function ListaDeRefeicoesPage() {

    const [refeicoes, setRefeicoes] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [dayInfo, setDayInfo] = useState<any>(null);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date>(new Date());
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date>(new Date());

    const getDayInfo = () => {
        // Convert selectedDate to DD/MM/YYYY format for comparison with refeicoes.data
        const dateMeals = refeicoes.filter((refeicao: any) => refeicao.data === selectedDate);

        setDayInfo({
            totalAlmoco : dateMeals.filter((refeicao: any) => refeicao.almoco === 'No Colégio Pio' || refeicao.almoco === 'Para Levar').length || 0 ,
            totalAlmocoLevar : dateMeals.filter((refeicao: any) => refeicao.almoco === 'Para Levar').length || 0 ,
            totalAlmocoColegio : dateMeals.filter((refeicao: any) => refeicao.almoco === 'No Colégio Pio').length || 0 ,
            totalJanta : dateMeals.filter((refeicao: any) => refeicao.jantar === 'No Colégio Pio').length || 0 ,
        });
    }

    // Initialize with current week
    useEffect(() => {
        const now = new Date();
        const currentWeekInfo = getCurrentWeekInfo();
        setSelectedWeekStart(currentWeekInfo.monday);
        setSelectedWeekEnd(currentWeekInfo.sunday);
        setSelectedWeek(now);
        setSelectedDate(now.toISOString().split('T')[0]); // Current day for current week
        fetchRefeicoes();
    }, []);

    // Update dayInfo when refeicoes or selectedDate changes
    useEffect(() => {
        getDayInfo();
    }, [refeicoes, selectedDate,]);

    const editar = (id: string) => {
        return;
    }

    const acoes = (id: string) => {
        return (
            <div className={styles.acoes}>
                <PencilLine size={20} onClick={() => editar(id)} style={{color: 'var(--color-primary)', cursor: 'pointer'}} />
            </div>
        )
    }

    function getAlmocoText(almoco_colegio: boolean, almoco_levar: boolean) {
        if (almoco_colegio) {
            if (almoco_levar) {
                return 'Para Levar';
            } else {
                return 'No Colégio Pio';
            }
        } else {
            return <X style={{color: 'var(--color-error)'}} />
        }
    }

    function getTipoUsuarioText(tipo_pessoa: string) {
        if (tipo_pessoa === 'usuario') {
            return 'Comum';
        } else if (tipo_pessoa === 'hospede') {
            return 'Hóspede';
        } else if (tipo_pessoa === 'convidado') {
            return 'Convidado';
        }
        return 'Comum';
    }

    const fetchRefeicoes = async () => {
        const result = await queryApi('GET', '/admin/meals');

        if (result.success) {

            // Map the meals to be shown on the table
            const meals = result.data.meals.map((meal: any) => {
                const avatar = meal.avatar_image_data ? convertBufferToBase64(meal.avatar_image_data) : '/user.png';

                return {
                    ...meal,
                    nome: <span className={styles.nomeCompleto}><img src={avatar} alt="Avatar" className={styles.avatar} />{meal.nome} </span>,
                    almoco: getAlmocoText(meal.almoco_colegio, meal.almoco_levar),
                    tipo_usuario: getTipoUsuarioText(meal.tipo_pessoa),
                    jantar: meal.janta_colegio ? 'No Colégio Pio' : <X style={{color: 'var(--color-error)'}} />,
                    data: meal.data.split('T')[0],
                    acao: acoes(meal.id),
                }
          
            });

            setRefeicoes(meals);
        } else {
            console.log('Erro ao buscar refeicoes');
        }
    }

    // Handle week change from DateSection
    const handleWeekChange = (weekStart: Date, weekEnd: Date) => {
        setSelectedWeekStart(weekStart);
        setSelectedWeekEnd(weekEnd);
        
        const now = new Date();
        const currentWeekStart = getCurrentWeekInfo().monday;
        
        // If it's the current week, select today's date
        if (weekStart.getTime() === currentWeekStart.getTime()) {
            setSelectedDate(now.toISOString().split('T')[0]);
        } else {
            // For past or future weeks, select Monday (first day)
            setSelectedDate(weekStart.toISOString().split('T')[0]);
        }
    };

    const currentWeekDays = () => {
        // Generate dates for the selected week
        const weekDates = [];
        const startDate = new Date(selectedWeekStart);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            weekDates.push(date);
        }

        const weekDayButtons = weekDates.map((date: Date, index: number) => {
            const dateString = date.toISOString().split('T')[0];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const isPast = date < today;

            const isSelected = dateString === selectedDate;
            
            return (
                <div 
                    key={index} 
                    className={`${styles.daySelector} ${isPast ? styles.passed : ""} ${isSelected ? styles.selected : ""}`}
                    onClick={() => {setSelectedDate(dateString); getDayInfo();}}
                >
                    <button 
                        className={styles.dayButton}
                    >
                        <span>{date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()}</span>
                        <span>{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                    </button>
                </div>
            )
        })

        return weekDayButtons;
    }

    return (
        <div className={styles.container}>
            <Card>
                <CardHeader title="Lista de usuários" breadcrumb={["Início", "Refeições"]} />

                <SearchSection
                    searchPlaceholder="Pesquise por nome"
                    dateSection={(
                    <DateSection
                        selectedWeekStart={selectedWeekStart}
                        selectedWeekEnd={selectedWeekEnd}
                        onWeekChange={handleWeekChange}
                    />
                    )}
                    buttons={[
                        <Button key="report" variant="full-white" iconLeft={<Printer size={20} />}>Gerar Relatório</Button>,
                        <Button key="new_booking" variant="full" iconLeft={<Plus size={20} />}>Novo agendamento</Button>
                    ]}
                />
                
                <div className={styles.dateHeader}>
                    {dayInfo && (
                    <div className={styles.dayInfoTotal}>
                        <div className={styles.curDate}>
                            <span className={styles.curDateText}>
                                Nº de refeições: <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long'}).charAt(0).toUpperCase() 
                                    + new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long'}).slice(1)}

                                , {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                </strong>
                            </span>
                        </div>

                        <div className={styles.dayInfo}>
                            <div className={styles.almoco}>
                                <span className={styles.bigNum}>{dayInfo.totalAlmoco}</span>
                                <span>almoços</span>
                            </div>
                            <div className={styles.almocoOpcoes}>
                                <span><strong>{dayInfo.totalAlmocoColegio}</strong> No Colégio PIO</span>
                                <span><strong>{dayInfo.totalAlmocoLevar}</strong> Para Levar</span>
                            </div>
                            <div className={styles.totalJanta}>
                                <span className={styles.bigNum}>{dayInfo.totalJanta}</span>
                                <span>jantares</span>
                            </div>
                        </div>
                       
                    </div>
                    )}

                    <div className={styles.daySelector}>
                        {currentWeekDays()}
                    </div>
                </div>

                <Table
                    headerItems={[
                        { key: "nome", label: "Nome" },
                        { key: "tipo_usuario", label: "Tipo de usuário" },
                        { key: "funcao", label: "Função" },
                        { key: "almoco", label: "Almoço" },
                        { key: "jantar", label: "Jantar" },
                        { key: "data", label: "Data" },
                        { key: "acao", label: "Ação" },
                    ]}
                    rowItems={refeicoes.filter((refeicao: any) => {
                        return refeicao.data === selectedDate;
                    })}
                    itemsPerPage={7}
                    hasSelector={true}
                />
                
            </Card>
        </div>
    );
}
