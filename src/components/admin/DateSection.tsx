import { Calendar, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import styles from './styles/DateSection.module.css';
import { useState, useEffect } from 'react';
import { getCurrentWeekInfo } from '@/lib/utils';

interface DateSectionProps {
    selectedWeekStart?: Date;
    selectedWeekEnd?: Date;
    onWeekChange?: (weekStart: Date, weekEnd: Date) => void;
    cantChangeWeek?: boolean;
}

export function DateSection({ selectedWeekStart, selectedWeekEnd, onWeekChange, cantChangeWeek = false }: DateSectionProps) {

    const [showMiniCalendar, setShowMiniCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [curWeekStart, setCurWeekStart] = useState<Date>(new Date());
    const [curWeekEnd, setCurWeekEnd] = useState<Date>(new Date());
    
    // Temporary selection state for calendar
    const [tempWeekStart, setTempWeekStart] = useState<Date>(new Date());
    const [tempWeekEnd, setTempWeekEnd] = useState<Date>(new Date());

    // Calculate the start of the current week (Monday) - using same logic as utils.ts
    const getWeekStart = (date: Date): Date => {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Days to go back to Monday
        
        const monday = new Date(date);
        monday.setDate(date.getDate() - daysToMonday);
        return monday;
    };

    // Calculate the end of the current week (Sunday)
    const getWeekEnd = (weekStart: Date): Date => {
        const sunday = new Date(weekStart);
        sunday.setDate(weekStart.getDate() + 6);
        return sunday;
    };

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
    const isCurrentMonth = (date: Date, targetMonth: number) => {
        return date.getMonth() === targetMonth;
    };

    // Check if a date is in the selected week
    const isInSelectedWeek = (date: Date) => {
        // Reset time components to compare only dates
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startOnly = new Date(effectiveWeekStart.getFullYear(), effectiveWeekStart.getMonth(), effectiveWeekStart.getDate());
        const endOnly = new Date(effectiveWeekEnd.getFullYear(), effectiveWeekEnd.getMonth(), effectiveWeekEnd.getDate());
        
        return dateOnly >= startOnly && dateOnly <= endOnly;
    };

    // Check if a date is the start or end of the selected week
    const isWeekBoundary = (date: Date) => {
        // Reset time components to compare only dates
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startOnly = new Date(effectiveWeekStart.getFullYear(), effectiveWeekStart.getMonth(), effectiveWeekStart.getDate());
        const endOnly = new Date(effectiveWeekEnd.getFullYear(), effectiveWeekEnd.getMonth(), effectiveWeekEnd.getDate());
        
        return dateOnly.getTime() === startOnly.getTime() || dateOnly.getTime() === endOnly.getTime();
    };

    // Handle date click in calendar
    const handleDateClick = (date: Date) => {
        const weekStart = getWeekStart(date);
        const weekEnd = getWeekEnd(weekStart);
        setTempWeekStart(weekStart);
        setTempWeekEnd(weekEnd);
    };

    // Handle confirm button click
    const handleConfirm = () => {
        setCurWeekStart(tempWeekStart);
        setCurWeekEnd(tempWeekEnd);
        setCurrentMonth(tempWeekStart);
        setShowMiniCalendar(false);
        onWeekChange?.(tempWeekStart, tempWeekEnd);
    };

    // Navigate months (both months move together)
    const goToPreviousMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() - 1);
        setCurrentMonth(newMonth);
    };

    const goToNextMonth = () => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(newMonth.getMonth() + 1);
        setCurrentMonth(newMonth);
    };

    // Navigate to previous week
    const goToPreviousWeek = () => {
        const newWeekStart = new Date(curWeekStart);
        newWeekStart.setDate(newWeekStart.getDate() - 7);
        const newWeekEnd = new Date(newWeekStart);
        newWeekEnd.setDate(newWeekEnd.getDate() + 6);
        
        setCurWeekStart(newWeekStart);
        setCurWeekEnd(newWeekEnd);
        
        // Update current month for calendar display
        setCurrentMonth(newWeekStart);
        
        // Notify parent component
        onWeekChange?.(newWeekStart, newWeekEnd);
    };

    // Navigate to next week
    const goToNextWeek = () => {
        const newWeekStart = new Date(curWeekStart);
        newWeekStart.setDate(newWeekStart.getDate() + 7);
        const newWeekEnd = new Date(newWeekStart);
        newWeekEnd.setDate(newWeekEnd.getDate() + 6);
        
        setCurWeekStart(newWeekStart);
        setCurWeekEnd(newWeekEnd);
        
        // Update current month for calendar display
        setCurrentMonth(newWeekStart);
        
        // Notify parent component
        onWeekChange?.(newWeekStart, newWeekEnd);
    };

    // Initialize with current week
    useEffect(() => {
        const now = new Date();
        const weekStart = getWeekStart(now);
        const weekEnd = getWeekEnd(weekStart);
        
        setCurWeekStart(weekStart);
        setCurWeekEnd(weekEnd);
        setCurrentMonth(weekStart);
        
        // Initialize temporary selection with current week
        setTempWeekStart(weekStart);
        setTempWeekEnd(weekEnd);
        
        // Notify parent component of initial week
        onWeekChange?.(weekStart, weekEnd);
    }, []);

    // Update local state when props change
    useEffect(() => {
        if (selectedWeekStart && selectedWeekEnd) {
            setCurWeekStart(selectedWeekStart);
            setCurWeekEnd(selectedWeekEnd);
            setCurrentMonth(selectedWeekStart);
            setTempWeekStart(selectedWeekStart);
            setTempWeekEnd(selectedWeekEnd);
        }
    }, [selectedWeekStart, selectedWeekEnd]);

    // Update temporary selection when calendar opens
    useEffect(() => {
        if (showMiniCalendar) {
            setTempWeekStart(curWeekStart);
            setTempWeekEnd(curWeekEnd);
        }
    }, [showMiniCalendar, curWeekStart, curWeekEnd]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMiniCalendar) {
                const calendar = document.querySelector(`.${styles.miniCalendar}`);
                if (calendar && !calendar.contains(event.target as Node)) {
                    setShowMiniCalendar(false);
                }
            }
        };
    
        if (showMiniCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMiniCalendar]);

    // Generate dates for left and right months
    const leftMonthDates = generateCalendarDates(currentMonth.getFullYear(), currentMonth.getMonth());
    const rightMonthDates = generateCalendarDates(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

    // Ensure temporary selection is always in sync with current week
    const effectiveWeekStart = showMiniCalendar ? tempWeekStart : curWeekStart;
    const effectiveWeekEnd = showMiniCalendar ? tempWeekEnd : curWeekEnd;

    return (
        <div className={styles.container}>

            <div className={styles.dateBox}>
                <button 
                    className={styles.weekLeftArrow}
                    onClick={goToPreviousWeek}
                >
                    <ChevronLeft size={20} />
                </button>

                <Button  
                variant="gray"
                iconLeft={<Calendar />}
                onClick={() => setShowMiniCalendar(!showMiniCalendar)}
                className={styles.dateButton}
                >
                    <span className={styles.dateButtonText}>
                        {curWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        {' a '}
                        {curWeekEnd.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    </span>
                </Button>

                <button 
                    className={styles.weekRightArrow}
                    onClick={goToNextWeek}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {showMiniCalendar && (
                <div className={styles.miniCalendar}>
                    <div className={styles.monthsContainer}>
                        {/* Left Month */}
                        <div className={styles.monthBlock}>
                            <div className={styles.header}>
                                <button className={styles.leftMonthArrow} onClick={goToPreviousMonth}>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className={styles.month}>
                                    {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className={styles.weekDaysContainer}>
                                <div className={styles.weekDay}>SEG</div>
                                <div className={styles.weekDay}>TER</div>
                                <div className={styles.weekDay}>QUA</div>
                                <div className={styles.weekDay}>QUI</div>
                                <div className={styles.weekDay}>SEX</div>
                                <div className={styles.weekDay}>SAB</div>
                                <div className={styles.weekDay}>DOM</div>
                            </div>
                            <div className={styles.daysContainer}>
                                {leftMonthDates.map((date, index) => (
                                    <div
                                        key={`left-${index}`}
                                        className={`${styles.day} ${
                                            !isCurrentMonth(date, currentMonth.getMonth()) 
                                                ? styles.adjacentMonth 
                                                : ''
                                        } ${
                                            isInSelectedWeek(date) 
                                                ? isWeekBoundary(date) 
                                                    ? styles.weekBoundary 
                                                    : styles.weekMiddle 
                                                : ''
                                        }`}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Month */}
                        <div className={styles.monthBlock}>
                            <div className={styles.header}>
                                <span className={styles.month}>
                                    {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </span>
                                <button className={styles.rightMonthArrow} onClick={goToNextMonth}>
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className={styles.weekDaysContainer}>
                                <div className={styles.weekDay}>SEG</div>
                                <div className={styles.weekDay}>TER</div>
                                <div className={styles.weekDay}>QUA</div>
                                <div className={styles.weekDay}>QUI</div>
                                <div className={styles.weekDay}>SEX</div>
                                <div className={styles.weekDay}>SAB</div>
                                <div className={styles.weekDay}>DOM</div>
                            </div>
                            <div className={styles.daysContainer}>
                                {rightMonthDates.map((date, index) => (
                                    <div
                                        key={`right-${index}`}
                                        className={`${styles.day} ${
                                            !isCurrentMonth(date, currentMonth.getMonth() + 1) 
                                                ? styles.adjacentMonth 
                                                : ''
                                        } ${
                                            isInSelectedWeek(date) 
                                                ? isWeekBoundary(date) 
                                                    ? styles.weekBoundary 
                                                    : styles.weekMiddle 
                                                : ''
                                        }`}
                                        onClick={() => handleDateClick(date)}
                                    >
                                        {date.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>

                        <Button
                            variant="full-white"
                            iconLeft={<RotateCcw />}
                            onClick={() => {
                                setShowMiniCalendar(false);
                                setCurrentMonth(new Date());
                                setCurWeekStart(getWeekStart(new Date()));
                                setCurWeekEnd(getWeekEnd(getWeekStart(new Date())));
                                setTempWeekStart(getWeekStart(new Date()));
                                setTempWeekEnd(getWeekEnd(getWeekStart(new Date())));
                                onWeekChange?.(getWeekStart(new Date()), getWeekEnd(getWeekStart(new Date())));
                            }}
                        >
                            Semana Atual
                        </Button>


                        <Button
                            variant="full"
                            iconLeft={<Check />}
                            onClick={handleConfirm}
                        >
                            Confirmar
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
} 