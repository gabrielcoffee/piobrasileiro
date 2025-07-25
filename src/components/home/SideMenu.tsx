import React from 'react';
import { Home, LucideSalad, Bed, X, UserRound, LogOut } from 'lucide-react';
import styles from './styles/SideMenu.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {

    const pathname = usePathname();

    const menuItems = [
        { id: 'home', label: 'Home', icon: Home, href: '/' },
        { id: 'refeicoes', label: 'Refeições', icon: LucideSalad, href: '/refeicoes' },
        { id: 'hospedagem', label: 'Hospedagem', icon: Bed, href: '/hospedagem' },
        { id: 'perfil', label: 'Perfil', icon: UserRound, href: '/perfil' },
        { id: 'logout', label: 'Sair', icon: LogOut, href: '/logout' },
    ];

    return (
        <>
        {/* Overlay */}
        <div 
            className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
            onClick={onClose}
        />
        
        {/* Side Menu */}
        <div className={`${styles.sideMenu} ${isOpen ? styles.sideMenuOpen : ''}`}>
            <div className={styles.header}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={24} />
                </button>
            </div>
            
            <nav className={styles.navigation}>


            {menuItems.map((item) => {
                const IconComponent = item.icon;

                return (
                <Link 
                    key={item.id}
                    href={item.href}
                    className={`
                        ${styles.menuItem}
                        ${item.id === 'logout' ? styles.logoutButton : ''}
                        ${item.href === pathname ? styles.active : ''}
                    `}
                    onClick={onClose}
                >
                    <IconComponent size={24}/>
                    <span className={styles.menuLabel}>{item.label}</span>
                </Link>
                );
            })}
            </nav>
        </div>
        </>
    );
} 