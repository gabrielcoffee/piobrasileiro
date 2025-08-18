'use client'

import { Divider } from "@/components/ui/Divider";
import styles from "./page.module.css";
import { MealDaysSection } from "@/components/refeicoes/MealDaysSection";
import DaySelector from "@/components/refeicoes/DaySelector";
import MealCard from "@/components/refeicoes/MealCard";

const mealsPlaceholder = [
    { 
        id: 1,

    }
]

export default function RefeicoesPage() {
    return (
        <div className={styles.container}>

            <MealDaysSection/>

            <DaySelector/>

            <MealCard/>

            <Divider/>
        </div>
    )
}