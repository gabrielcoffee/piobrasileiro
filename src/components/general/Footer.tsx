import React from 'react';
import { Home, LucideSalad, Bed, UserRound } from 'lucide-react';
import styles from './styles/Footer.module.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function Footer() {

    const pathname = usePathname();

    
    const tabs = [
        { id: 'home', href: '/home', label: 'Home', icon: Home },
        { id: 'refeicoes', href: '/refeicoes', label: 'Refeições', icon: LucideSalad },
        { id: 'hospedagem', href: '/hospedagem', label: 'Hospedagem', icon: Bed },
        { id: 'perfil', href: '/perfil', label: 'Perfil', icon: UserRound },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.tabContainer}>

                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    
                    return (
                        <Link
                        key={tab.id}
                        href={tab.href}
                        className={`
                            ${styles.tab} 
                            ${pathname === tab.href ? styles.tabActive : ''}`}
                        >
                            <IconComponent size={24} className={`${styles.tabIcon} ${pathname === tab.href ? styles.tabIconActive : ''}`} />
                            <span className={styles.tabLabel}>{tab.label}</span>
                        </Link>
                    );
                })}

            </div>
        </footer>
    );
} 