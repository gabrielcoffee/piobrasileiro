import styles from "./styles/MealCard.module.css";

export default function MealCard() {
    return (
        <div className={styles.container}>
            <div className={styles.mealCard}>
                <h1>Refeição</h1>
            </div>
        </div>
    )
}