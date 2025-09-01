import styles from './styles/ShowDateSection.module.css';

export function ShowDateSection() {
  const currentDate = new Date();
  const weekday = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' });
  const date = currentDate.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className={styles.container}>
        <span className={styles.dateText}>
            {weekday.charAt(0).toUpperCase() + weekday.slice(1)}, <strong>{date}</strong>
        </span>
    </div>
  );
} 