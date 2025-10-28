'use client'

import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import { MealDaysSection } from "@/components/refeicoes/MealDaysSection";
import DaySelector from "@/components/refeicoes/DaySelector";
import MealCard from "@/components/refeicoes/MealCard";
import { queryApi, getCurrentWeekInfoRegular, getCurrentWeekInfo } from "@/lib/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import SaveFooter from "@/components/refeicoes/SaveFooter";
import { ArrowLeft, CalendarIcon, CheckCheck, CircleCheck, CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/contexts/ToastContext";
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { Button } from "@/components/ui/Button";
import { DateSection } from "@/components/admin/DateSection";
import { Calendar } from "@/components/admin/Calendar";

interface MealDay {
    date: string;           // "2025-08-18" (formato do banco)
    displayDate: string;    // "18/08" (formato de exibição)
    dayName: string;        // "Segunda-feira, 18/08/2025"
    lunch: boolean;         // almoco_colegio
    dinner: boolean;        // janta_colegio
    takeOut: boolean;       // almoco_levar
    dayIndex: number;       // índice para identificação
    isPast: boolean;        // passou das 19h00 de hoje
    blocked: boolean;       // data bloqueada
}

export default function RefeicoesPage() {

    const [isMobile, setIsMobile] = useState(false);

    const router = useRouter();
    const { showToast } = useToast();

    const [meals, setMeals] = useState<any[] | null>(null);
    const [guestMeals, setGuestMeals] = useState<any[] | null>(null);
    const [guestMealList, setGuestMealList] = useState<any[][]>([]);
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [haveSelected, setHaveSelected] = useState(false);

    const [mealsList, setMealsList] = useState<MealDay[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
    const [selectedWeekEnd, setSelectedWeekEnd] = useState<Date | null>(null);

    const hasChangesRef = useRef(hasChanges);
    const mealsListRef = useRef(mealsList);

    const fetchWeekMeals = async () => {
        const result = await queryApi('GET', '/user/weekmeals');

        if (result.success) {
            setBlockedDates(result.data.blockedDates);

            if (result.data.userMeals && result.data.userMeals.length > 0) {
                setMeals(result.data.userMeals);
            } else {
                setMeals([]);
            }
        } else {
            console.error('Erro ao buscar refeições:', result.error);
            setMeals([]); 
            setBlockedDates([]);
        }
    }

    const fetchGuestMeals = async () => {
        const result = await queryApi('GET', '/user/guestmeals');

        if (result.success) {
            if (result.data.guestMeals && result.data.guestMeals.length > 0) {
                setGuestMeals(result.data.guestMeals);
            } else {
                setGuestMeals([]);
            }
        } else {
            console.error('Erro ao buscar convidados:', result.error);
        }
    }   

    // Esta função cria a lista de refeições apenas para dias futuros (incluindo hoje se antes das 19h00)
    const createMealList = useCallback(() => {
        
        const weekInfo = getCurrentWeekInfoRegular();
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const isAfterCutoffToday = currentHour > 19 || (currentHour === 19 && currentMinute >= 0);

        const mealList: MealDay[] = [];
        let dayIndex = 0;

        // Para cada dia da semana (segunda a domingo)
        weekInfo.weekDates.forEach((date, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); // "18/08"
            const dayName = date.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'numeric', 
                year: 'numeric' 
            }).toUpperCase();

            // Verifica se o dia já passou das 19h00 para hoje
            const isToday = date.toDateString() === today.toDateString();
            const isTomorrow = date.toDateString() === tomorrow.toDateString();
            const isPast = isToday ? true : isTomorrow ? (isAfterCutoffToday ? true : false) : date < today;

            // Procura por refeicoes que possuem a mesma data no banco (meals)
            const existingMeal = meals?.find((meal: any) => {
                const normalizedMealDate = meal.data.split('T')[0];
                return normalizedMealDate === dateStr;
            });

            const isBlocked = blockedDates.includes(dateStr);

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
                    isPast,
                    blocked: isBlocked || false
                });
            } else {
                // Cria placeholder para dia sem dados
                mealList.push({
                    date: dateStr,
                    displayDate,
                    dayName,
                    lunch: false,
                    dinner: false,
                    takeOut: false,
                    dayIndex,
                    isPast,
                    blocked: isBlocked || false
                });
            }
            dayIndex++;
        });


        setMealsList(mealList);
    }, [meals]);

    const createGuestMealList = useCallback(() => {
        const weekInfo = getCurrentWeekInfoRegular();
        
        // Inicializa array com 7 arrays vazios (um para cada dia da semana)
        const guestMealsByDay: any[][] = [[], [], [], [], [], [], [], []];

        guestMeals?.forEach((guestMeal: any) => {
            // Normaliza a data do guestMeal
            const normalizedGuestDate = guestMeal.data.split('T')[0];
            
            // Encontra qual dia da semana corresponde a esta data
            weekInfo.weekDates.forEach((date, dayIndex) => {
                const dateStr = date.toISOString().split('T')[0];
                
                if (normalizedGuestDate === dateStr) {
                    // Adiciona a meal completa ao dia correspondente
                    guestMealsByDay[dayIndex].push(guestMeal);
                }
            });
        });

        setGuestMealList(guestMealsByDay);
    }, [guestMeals]);

    // Core save function (extracted for reuse; handles the API call without setting state)
    const doSave = async (meals: MealDay[]) => {
        if (!meals.length) return;

        // Save the user meals
        try {
            const mealsToSave = meals.map(meal => ({
                data: meal.date,
                almoco_colegio: meal.lunch || false,
                almoco_levar: meal.takeOut || false,
                janta_colegio: meal.dinner || false,
            }));

            const result = await queryApi('POST', '/user/weekmeals', { meals: mealsToSave });

            if (result.success) {
                showToast('Refeições salvas com sucesso!', 'success');
                router.push('/home');
                console.log('Refeições salvas com sucesso');
            } else {
                showToast('Erro ao salvar refeições', 'error');
                console.error('Erro ao salvar refeições:', result.error);
            }
        } catch (error) {
            showToast('Erro ao salvar refeições', 'error');
            console.error('Erro ao salvar refeições:', error);
        }
    };

    // Updated saveMeals for auto-save (calls doSave and resets hasChanges)
    const saveMeals = useCallback(async () => {
        await doSave(mealsList);
        setHasChanges(false);
    }, [mealsList]);

    // Atualiza uma refeição específica
    const updateMeal = (dayIndex: number, updates: Partial<MealDay>) => {
        // Find the meal by dayIndex
        const mealIndex = mealsList.findIndex(
            meal => meal.dayIndex === dayIndex
        );
        
        if (mealIndex === -1) return; // Meal not found
        
        // Create a copy of the meals list
        const newMealsList = [...mealsList];
        
        // Update the specific meal
        newMealsList[mealIndex] = {
            ...newMealsList[mealIndex],
            ...updates
        };
        
        setMealsList(newMealsList);
        setHasChanges(true);
    };

    // Marca ou desmarca todas as refeições (almoço e jantar) apenas para dias futuros
    const markAllMeals = (markAsTrue: boolean) => {

        setHaveSelected(markAsTrue);
        
        // Create a copy of the meals list
        const newMealsList = [...mealsList];
        
        // Update only future meals
        newMealsList.forEach((meal, index) => {
            if (!meal.isPast) {
                newMealsList[index] = {
                    ...meal,
                    lunch: meal.blocked ? meal.lunch : markAsTrue,
                    dinner: meal.blocked ? meal.dinner : markAsTrue,
                    // Não altera o takeOut
                };
            }
        });

        setMealsList(newMealsList);
        setHasChanges(true);
        
        if (markAsTrue) {
            showToast('Todas as refeições marcadas com sucesso', 'success');
        } else {
            showToast('Todas as refeições desmarcadas com sucesso', 'success');
        }
    };

    // Função para deletar convidado
    const removeGuestMeal = async (guestMealId: string) => {
        try {
            const result = await queryApi('DELETE', `/user/guestmeals/${guestMealId}`);
            
            if (result.success) {
                // Remove do estado local
                setGuestMeals(prevGuestMeals => 
                    prevGuestMeals ? prevGuestMeals.filter((meal: any) => meal.id !== guestMealId) : null
                );

                showToast('Convidado removido com sucesso', 'success');

                console.log('Convidado removido com sucesso');
            } else {
                console.error('Erro ao remover convidado:', result.error);
            }
        } catch (error) {
            console.error('Erro ao remover convidado:', error);
        }
    };

    // USE EFFECTS UPDATES

    // Auto-save com debounce de 1.5 segundos (desativado // versão antiga)
    /*
    useEffect(() => {
        if (hasChanges) {
            const timer = setTimeout(() => {
                saveMeals();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [hasChanges, mealsList]);
    */
    useEffect(() => {
        const weekInfo = getCurrentWeekInfo();
        setSelectedWeekStart(weekInfo.monday);
        setSelectedWeekEnd(weekInfo.sunday);
    }, []);

       // Sync refs with state
    useEffect(() => {
        hasChangesRef.current = hasChanges;
    }, [hasChanges]);

    useEffect(() => {
        mealsListRef.current = mealsList;
    }, [mealsList]);

    useEffect(() => {
        fetchWeekMeals();
        fetchGuestMeals();
    }, []);

    useEffect(() => {
        if (meals !== null) {
            createMealList();
        }
    }, [meals, createMealList]);

    useEffect(() => {
        if (guestMeals !== null) {
            createGuestMealList();
        }
    }, [guestMeals, createGuestMealList]);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
    }, [window.innerWidth]);

    return (
        <>
        {isMobile ? (
        <div className={styles.mobileContainer}>
            <div className={styles.gobackHeader}>
                <ArrowLeft size={24} onClick={() => router.push('/home')} />
            </div>
            <div className={styles.container}>
                <MealDaysSection/>

                <DaySelector 
                    mealsList={mealsList}
                    onDaySelect={(dayIndex: number) => {
                        dayIndex = dayIndex + 1;
                        const mealCard = document.getElementById(`meal-card-${dayIndex}`);
                        if (mealCard) {
                            mealCard.scrollIntoView({ behavior: 'smooth' });
                        }
                    }}
                />

                {mealsList.map((meal, index) => (
                    <MealCard 
                        key={meal.dayIndex}
                        id={`meal-card-${meal.dayIndex}`}
                        date={meal.displayDate}
                        dayName={meal.dayName}
                        blocked={meal.blocked}
                        lunch={meal.lunch}
                        dinner={meal.dinner}
                        takeOut={meal.takeOut}
                        guestMeals={guestMealList[meal.dayIndex] || []}
                        onUpdate={(updates) => updateMeal(meal.dayIndex, updates)}
                        onRemoveGuest={removeGuestMeal}
                        onGuestAdded={fetchGuestMeals}
                        style={{ display: meal.isPast ? 'none' : 'block' }}
                    />
                ))}
                <Divider/>
            </div>

            <SaveFooter hasChanges={hasChanges} onMarkAllMeals={markAllMeals} onSaveAndSend={saveMeals} />
        </div>

        ) : (

        <div className={styles.desktopContainer}>

            <Card>
                <CardHeader title="Refeições" breadcrumb={["Início", "Refeições"]} />

                <div className={styles.headerSection}>
                    <span className={styles.headerText}>Por favor, selecione suas refeições até <strong>hoje às 19h00.</strong></span>
                    <div className={styles.buttonsContainer}> 

                        <Button  
                            variant="gray"
                            iconLeft={<CalendarIcon size={20} />}
                            onClick={() => {}}
                            className={styles.dateButton}
                            >
                                <span className={styles.dateButtonText}>
                                    {selectedWeekStart?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    {' a '}
                                    {selectedWeekEnd?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                </span>
                        </Button>

                        <SaveFooter hasChanges={hasChanges} onMarkAllMeals={markAllMeals} onSaveAndSend={saveMeals} />
                    </div>
                </div>

                <div className={styles.mealsListContainer}>
                    {mealsList.map((meal, index) => (
                        <MealCard
                            key={meal.dayIndex}
                            id={`meal-card-${meal.dayIndex}`}
                            date={meal.displayDate}
                            dayName={meal.dayName}
                            blocked={meal.blocked}
                            lunch={meal.lunch}
                            dinner={meal.dinner}
                            takeOut={meal.takeOut}
                            guestMeals={guestMealList[meal.dayIndex] || []}
                            onUpdate={(updates) => updateMeal(meal.dayIndex, updates)}
                            onRemoveGuest={removeGuestMeal}
                            onGuestAdded={fetchGuestMeals}
                            style={{ display: meal.isPast ? 'none' : 'block' }}
                        />
                    ))}
                </div>
            </Card>
        </div>
        )}
        </>
    );
}