import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import styles from './styles/Header.module.css';
import { SideMenu } from './SideMenu';

export function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSideMenu}>
          <Menu size={24} />
        </button>
        
        <button className={styles.notificationButton}>
          <Bell size={24} />
        </button>
      </header>

      <SideMenu isOpen={sideMenuOpen} onClose={closeSideMenu} />
    </>
  );
} 