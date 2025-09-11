'use client'

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, Lock, Unlock } from 'lucide-react';
import styles from './styles/Calendar.module.css';
import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { queryApi } from '@/lib/utils';

export function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [blockDates, setBlockDates] = useState<string[]>([]);

    // Generate calendar dates for a given month
    const generateCalendarDates = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        
        // Adjust to start from Monday (1) instead of Sunday (0)
        const dayOfWeek = firstDay.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate.setDate(startDate.getDate() - daysToSubtract);
        
        const dates = [];
        for (let i = 0; i < 35; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            dates.push(currentDate);
        }

        return dates;
    };

    // Check if a date is in the current month
    const isInCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    // Handle date click in calendar
    const handleDateClick = (date: string) => {
        if (selectedDates.includes(date)) {
            setSelectedDates(selectedDates.filter(d => d !== date));
        } else {
            setSelectedDates([...selectedDates, date]);
        }
    };

    const moveMonth = (value: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + value);
        setCurrentMonth(newMonth);
    };

    const fetchBlockedDates = async () => {
        const result = await queryApi('GET', '/admin/blocked-dates');
        if (result.success) {
            const dates = result.data.map((date: any) => date.data.split('T')[0]);
            setBlockDates(dates);
        }
        else {
            console.log('Erro ao buscar datas bloqueadas');
        }
    }

    const handleBlockDates = () => {
        setBlockDates(selectedDates);
        setSelectedDates([]);
    }

    const handleSaveUnblockDates = async () => {
        const result = await queryApi('DELETE', '/admin/unblock-dates', {
            datas: selectedDates
        });

        if (result.success) {
            console.log('Datas desbloqueadas salvas com sucesso');
            setBlockDates(blockDates.filter(date => !selectedDates.includes(date)));
            setSelectedDates([]);
            fetchBlockedDates();
        }
        else {
            console.log('Erro ao salvar datas desbloqueadas');
        }
    }

    const handleSaveBlockDates = async () => {
        const result = await queryApi('POST', '/admin/blocked-dates', {
            datas: blockDates
        });

        if (result.success) {
            console.log('Datas bloqueadas salvas com sucesso');
            fetchBlockedDates();
            setBlockDates([]);
            setSelectedDates([]);
        } else {
            console.log('Erro ao salvar datas bloqueadas');
        }
    };

    // Initialize with current week
    useEffect(() => {
        const now = new Date();
        setCurrentMonth(now);
        fetchBlockedDates();
    }, []);


    // Generate dates for left and right months
    const monthDates = generateCalendarDates(currentMonth.getFullYear(), currentMonth.getMonth());

    return (
        <div className={styles.container}>

            <div className={styles.calendar}>
                <div className={styles.monthsContainer}>
                    {/* Month Calendar */}
                    <div className={styles.monthBlock}>

                        <div className={styles.headerContainer}>
                            <div className={styles.monthSelector}>
                                <button className={styles.leftMonthArrow} onClick={() => moveMonth(-1)}>
                                    <ChevronLeft size={32} />
                                </button>
                                <span className={styles.month}>
                                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + new Date(currentMonth.getFullYear(), currentMonth.getMonth()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).slice(1)}
                                </span>
                                <button className={styles.rightMonthArrow} onClick={() => moveMonth(1)}>
                                    <ChevronRight size={32} />
                                </button>
                            </div>

                            <div className={styles.blockDatesContainer}>
                                <Button style={{ color: 'var(--color-primary)'}} variant="full-white" iconLeft={<Unlock />} onClick={handleSaveUnblockDates}>
                                    Liberar datas
                                </Button>
                                <Button style={{ color: 'var(--color-error)', borderColor: 'var(--color-error)' }} variant="full-white" iconLeft={<Lock />} onClick={handleBlockDates}>
                                    Bloquear datas
                                </Button>
                            </div>
                        </div>

                        {/* Week Days */}
                        <div className={styles.weekDaysContainer}>
                            <div className={styles.weekDay}>SEGUNDA</div>
                            <div className={styles.weekDay}>TERÇA</div>
                            <div className={styles.weekDay}>QUARTA</div>
                            <div className={styles.weekDay}>QUINTA</div>
                            <div className={styles.weekDay}>SEXTA</div>
                            <div className={styles.weekDay}>SÁBADO</div>
                            <div className={styles.weekDay}>DOMINGO</div>
                        </div>

                        {/* Days */}
                        <div className={styles.daysContainer}>
                            {monthDates.map((date, index) => (
                                <div
                                    key={`right-${index}`}
                                    className={`
                                        ${styles.day}
                                    ${
                                        !isInCurrentMonth(date) 
                                            ? styles.adjacentMonth 
                                            : ''
                                    } ${
                                        blockDates.includes(date.toISOString().split('T')[0]) ? styles.selectedBlockDate : ''
                                    } ${
                                        selectedDates.includes(date.toISOString().split('T')[0]) ? styles.selectedDate : ''
                                    }
                                    `}
                                    onClick={() => handleDateClick(date.toISOString().split('T')[0])}
                                >
                                    {date.getDate()}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.confirmContainer}>
                <Button variant="full" iconLeft={<Lock size={20} />} onClick={handleSaveBlockDates}>
                    Salvar Bloqueios
                </Button>
            </div>
        </div>
    );
} 