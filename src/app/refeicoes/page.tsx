'use client'

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Divider } from "@/components/home/Divider";
import styles from "./page.module.css";
import { MealDaysSection } from "@/components/refeicoes/MealDaysSection";

export default function RefeicoesPage() {
    return (
        <div className={styles.container}>
            <Header/>

            <MealDaysSection/>

            <Divider/>

            <Footer/>
        </div>
    )
}