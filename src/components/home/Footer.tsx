import React from 'react';
import { Home, LucideSalad, Bed, User } from 'lucide-react';
import styles from './styles/Footer.module.css';

interface FooterProps {
  activeTab?: 'home' | 'refeicoes' | 'hospedagem' | 'perfil';
}

export function Footer({ activeTab = 'home' }: FooterProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'refeicoes', label: 'Refeições', icon: LucideSalad },
    { id: 'hospedagem', label: 'Hospedagem', icon: Bed },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];

  return (
    <footer className={styles.footer}>
        <div className={styles.tabContainer}>

            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                    <button 
                    key={tab.id}
                    className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
                    >
                        <IconComponent size={20} className={styles.tabIcon} />
                        <span className={styles.tabLabel}>{tab.label}</span>
                    </button>
                );
            })}

        </div>
    </footer>
  );
} 