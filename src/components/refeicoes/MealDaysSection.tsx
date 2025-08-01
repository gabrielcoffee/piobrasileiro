import styles from './styles/MealDaysSection.module.css';

export function MealDaysSection() {
    const today = new Date();

    const getMondayDate = () => {
        const monday = new Date(today);
        const weekDay = today.getDay();
        monday.setDate(today.getDate() - weekDay + 1);

        return monday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' });
    }

    const getSundayDate = () => {
        const sunday = new Date(today);
        const weekDay = today.getDay();
        sunday.setDate(today.getDate() - weekDay + 7);

        return sunday.toLocaleDateString('pt-BR', { day: 'numeric', month: 'numeric' });
    }

    function getWeekRangeText() {
        const monday = getMondayDate();
        const sunday = getSundayDate();

        const isSameMonth: boolean = monday.split('/')[1] === sunday.split('/')[1];

        if (isSameMonth) {
            return <span>Refeições dos dias <strong>{monday.split('/')[0]}</strong> a <strong>{sunday}</strong></span>
        } else {
            return <span>Refeições dos dias <strong>{monday}</strong> a <strong>{sunday}</strong></span>
        }
    }

    return (
        <div className={styles.container}>
            <span className={styles.dateText}>
                {getWeekRangeText()}
            </span>
        </div>
    );
} 