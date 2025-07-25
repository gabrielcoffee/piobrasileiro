import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';

import styles from './styles/Header.module.css';
import { SideMenu } from './SideMenu';
import NotificationMenu from './NotificationMenu';

export function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  
  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  const toggleNotificationMenu = () => {
    setNotificationMenuOpen(!notificationMenuOpen);
  };

  const closeNotificationMenu = () => {
    setNotificationMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <button className={styles.menuButton} onClick={toggleSideMenu}>
          <Menu size={24} />
        </button>
        
        <button className={styles.notificationButton} onClick={toggleNotificationMenu}>
          <Bell size={24} />
        </button>
      </header>

      <SideMenu isOpen={sideMenuOpen} onClose={closeSideMenu} />

      <NotificationMenu isOpen={notificationMenuOpen} onClose={closeNotificationMenu} />
    </>
  );
} 