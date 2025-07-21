import React from 'react';
import { Home, LucideSalad, Bed, User, X } from 'lucide-react';
import styles from './styles/SideMenu.module.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/home' },
    { id: 'refeicoes', label: 'Refeições', icon: LucideSalad, href: '/refeicoes' },
    { id: 'hospedagem', label: 'Hospedagem', icon: Bed, href: '/hospedagem' },
    { id: 'perfil', label: 'Perfil', icon: User, href: '/perfil' },
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
              <a 
                key={item.id}
                href={item.href}
                className={styles.menuItem}
                onClick={onClose}
              >
                <IconComponent size={20} className={styles.menuIcon} />
                <span className={styles.menuLabel}>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
} 