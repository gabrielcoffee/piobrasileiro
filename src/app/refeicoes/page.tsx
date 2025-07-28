'use client'

import { Header } from "@/components/general/Header";
import { Footer } from "@/components/general/Footer";
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
            <Header/>

            <MealDaysSection/>

            <DaySelector/>

            <MealCard/>

            <Divider/>

            <Footer/>
        </div>
    )
}