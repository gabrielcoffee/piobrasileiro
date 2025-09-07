import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/ClebersonDaSilvaSauroNew';
import styles from './styles/SimpleDateSelect.module.css';
import { useState, useEffect } from 'react';

interface SimpleDateSelectProps {
    selectedDate?: Date;
    onDateChange?: (date: Date) => void;
    disabled?: boolean;
}

export function SimpleDateSelect({ selectedDate, onDateChange, disabled }: SimpleDateSelectProps) {
    const [showMiniCalendar, setShowMiniCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

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
    const handleDateClick = (date: Date) => {
        setShowMiniCalendar(false);
        onDateChange?.(date);
    };

    const moveMonth = (value: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + value);
        setCurrentMonth(newMonth);
    };

    // Initialize with current week
    useEffect(() => {
        const now = new Date();
        setCurrentMonth(now);
        onDateChange?.(now);
    }, []);


    // Generate dates for left and right months
    const monthDates = generateCalendarDates(currentMonth.getFullYear(), currentMonth.getMonth());

    return (
        <div className={styles.container}>

            <div className={styles.dateBox}>

                <span className={styles.dateLabel}>*Data</span>
                <Button  
                disabled={disabled}
                variant="full-white"
                style={{ width: '100%', height: '37px', justifyContent: 'flex-start', fontSize: '0.875rem', color: selectedDate ? 'var(--color-text)' : 'var(--color-text-muted)' }}
                iconLeft={<Calendar />}
                onClick={() => !disabled && setShowMiniCalendar(!showMiniCalendar)}
                className={styles.dateButton}
                >
                    <span className={styles.dateButtonText}>
                        {selectedDate ? selectedDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Selecione uma data'}
                    </span>
                </Button>
            </div>

            {showMiniCalendar && (
                <div className={styles.miniCalendar}>
                    <div className={styles.monthsContainer}>
                        {/* Month Calendar */}
                        <div className={styles.monthBlock}>

                            <div className={styles.header}>
                                <button className={styles.leftMonthArrow} onClick={() => moveMonth(-1)}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className={styles.month}>
                                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth()).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </span>
                                <button className={styles.rightMonthArrow} onClick={() => moveMonth(1)}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Week Days */}
                            <div className={styles.weekDaysContainer}>
                                <div className={styles.weekDay}>SEG</div>
                                <div className={styles.weekDay}>TER</div>
                                <div className={styles.weekDay}>QUA</div>
                                <div className={styles.weekDay}>QUI</div>
                                <div className={styles.weekDay}>SEX</div>
                                <div className={styles.weekDay}>SAB</div>
                                <div className={styles.weekDay}>DOM</div>
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
                                            date.toISOString() === selectedDate?.toISOString() ? styles.selectedDate : ''
                                        }`}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 