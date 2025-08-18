'use client'

import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import { MealDaysSection } from "@/components/refeicoes/MealDaysSection";
import DaySelector from "@/components/refeicoes/DaySelector";
import MealCard from "@/components/refeicoes/MealCard";
import { useAuth } from "@/contexts/AuthContext";
import { queryApi, getCurrentWeekInfo } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

interface MealDay {
    date: string;           // "2025-08-18" (formato do banco)
    displayDate: string;    // "18/08" (formato de exibição)
    dayName: string;        // "Segunda-feira, 18/08/2025"
    lunch: boolean;         // almoco_colegio
    dinner: boolean;        // janta_colegio
    takeOut: boolean;       // almoco_levar
    dayIndex: number;       // índice para identificação
    isPast: boolean;        // passou das 19h00 de hoje
}

export default function RefeicoesPage() {

    const [meals, setMeals] = useState<any[] | null>(null);
    const [mealsList, setMealsList] = useState<MealDay[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [lastEditTime, setLastEditTime] = useState(0);

    const fetchWeekMeals = async () => {
        const result = await queryApi('GET', '/user/weekmeals');

        if (result.success) {
            if (result.data.meals && result.data.meals.length > 0) {
                setMeals(result.data.meals);
            } else {
                setMeals(null);
            }
        } else {
            setMeals(null);
        }
    }

    // Esta função cria a lista de refeições apenas para dias futuros (incluindo hoje se antes das 19h00)
    const createMealList = useCallback(() => {
        
        const weekInfo = getCurrentWeekInfo();
        const today = new Date();
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const isAfterCutoff = currentHour > 19 || (currentHour === 19 && currentMinute >= 0);

        const mealList: MealDay[] = [];
        let dayIndex = 0;

        // Para cada dia da semana (segunda a domingo)
        weekInfo.weekDates.forEach((date, index) => {
            const dateStr = date.toISOString().split('T')[0]; // "2025-08-18"
            const displayDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); // "18/08"
            let dayName = date.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'numeric', 
                year: 'numeric' 
            }).toUpperCase(); // "SEGUNDA-FEIRA, 18/08/2025"

            // Verifica se o dia já passou das 19h00
            const isToday = date.toDateString() === today.toDateString();
            const isPast = isToday ? isAfterCutoff : date < today;

            // Se não passou das 19h00, adiciona à lista
            if (!isPast) {
                // Procura por dados existentes no banco
                const existingMeal = meals?.find((meal: any) => {
                    // Normaliza a data do banco para comparar corretamente
                    let mealDate = meal.data;
                    
                    // Se a data do banco vier como string ISO, converte para YYYY-MM-DD
                    if (mealDate.includes('T')) {
                        mealDate = new Date(mealDate).toISOString().split('T')[0];
                    }
                    
                    // Se a data do banco vier como Date object, converte para YYYY-MM-DD
                    if (mealDate instanceof Date) {
                        mealDate = mealDate.toISOString().split('T')[0];
                    }
                    
                    const matches = mealDate === dateStr;

                    return matches;
                });

                if (existingMeal) {
                    // Usa dados do banco
                    mealList.push({
                        date: dateStr,
                        displayDate,
                        dayName,
                        lunch: existingMeal.almoco_colegio,
                        dinner: existingMeal.janta_colegio,
                        takeOut: existingMeal.almoco_levar,
                        dayIndex,
                        isPast: false
                    });
                } else {
                    // Cria placeholder para dia futuro sem dados
                    mealList.push({
                        date: dateStr,
                        displayDate,
                        dayName,
                        lunch: false,
                        dinner: false,
                        takeOut: false,
                        dayIndex,
                        isPast: false
                    });
                }
                dayIndex++;
            }
        });


        setMealsList(mealList);
    }, [meals]);

    // Auto-save com debounce de 5 segundos
    useEffect(() => {
        if (hasUnsavedChanges && lastEditTime > 0) {
            const timer = setTimeout(() => {
                saveMeals();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [hasUnsavedChanges, lastEditTime]);

    // Salva refeições no banco
    const saveMeals = async () => {
        if (!mealsList.length) return;

        try {
            // Prepara dados para envio (apenas campos necessários)
            const mealsToSave = mealsList.map(meal => ({
                data: meal.date,
                almoco_colegio: meal.lunch || false,
                almoco_levar: meal.takeOut || false,
                janta_colegio: meal.dinner || false,
            }));

            const result = await queryApi('POST', '/user/weekmeals', { meals: mealsToSave });

            if (result.success) {
                setHasUnsavedChanges(false);
                setLastEditTime(0);
                console.log('Refeições salvas com sucesso');
            } else {
                console.error('Erro ao salvar refeições:', result.error);
            }
        } catch (error) {
            console.error('Erro ao salvar refeições:', error);
        }
    };

    // Atualiza uma refeição específica
    const updateMeal = (dayIndex: number, updates: Partial<MealDay>) => {
        setMealsList(prevMeals => {
            return prevMeals.map(meal => {
                const isTargetDay = meal.dayIndex === dayIndex;
    
                if (isTargetDay) {
                    return {
                        ...meal,
                        ...updates,
                    };
                }
    
                return meal;
            });
        });
    
        setHasUnsavedChanges(true);
        setLastEditTime(Date.now());
    };

    // Marca ou desmarca todas as refeições (almoço e jantar)
    const markAllMeals = (markAsTrue: boolean) => {
        console.log('markAllMeals called with:', markAsTrue);
        console.log('Current mealsList:', mealsList);
        
        setMealsList(prevMeals => {
            const newMeals = prevMeals.map(meal => ({
                ...meal,
                lunch: markAsTrue,
                dinner: markAsTrue,
                // Não altera o takeOut
            }));
            console.log('New mealsList:', newMeals);
            return newMeals;
        });
    
        setHasUnsavedChanges(true);
        setLastEditTime(Date.now());
    };


    // USE EFFECTS

    // Salva quando usuário sai da página
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (hasUnsavedChanges) {
                saveMeals();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            if (hasUnsavedChanges) {
                saveMeals();
            }
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        fetchWeekMeals();
    }, []);

    useEffect(() => {
        if (meals !== null) {
            createMealList();
        }
    }, [meals, createMealList]);

    return (
        <div className={styles.container}>
            <MealDaysSection/>

            <DaySelector 
                mealsList={mealsList}
                onDaySelect={(dayIndex: number) => {
                    // Scroll para o MealCard correspondente
                    const mealCard = document.getElementById(`meal-card-${dayIndex}`);
                    if (mealCard) {
                        mealCard.scrollIntoView({ behavior: 'smooth' });
                    }
                }}
                onMarkAllMeals={markAllMeals}
            />

            {mealsList.map((meal, index) => (
                <MealCard 
                    key={meal.dayIndex}
                    id={`meal-card-${meal.dayIndex}`}
                    date={meal.displayDate}
                    dayName={meal.dayName}
                    lunch={meal.lunch}
                    dinner={meal.dinner}
                    takeOut={meal.takeOut}
                    onUpdate={(updates) => updateMeal(meal.dayIndex, updates)}
                />
            ))}

            <Divider/>
        </div>
    );
}