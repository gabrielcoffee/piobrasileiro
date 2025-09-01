import React, { useEffect, useState } from 'react';
import { Menu, Bell, ChevronDown, UserCircle, LogOut, User } from 'lucide-react';

import styles from './styles/Header.module.css';
import { SideMenu } from './SideMenu';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '@/contexts/AuthContext';
import { SideMenuAdmin } from '../admin/SideMenuAdmin';
import { SideMenuAdminDesktop } from '../admin/SideMenuAdminDesktop';
import { usePathname, useRouter } from 'next/navigation';


export function Header() {

    const { user, logout } = useAuth();

    const [avatar, setAvatar] = useState('');
    const [isDesktop, setIsDesktop] = useState(false);

    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        if (user?.avatar) {
            const bufferData = user.avatar;
            const base64String = Buffer.from(bufferData).toString('base64');
            setAvatar(base64String);
        }
    }, [user]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);
    
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

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const closeProfileDropdown = () => {
        setProfileDropdownOpen(false);
    };

    const router = useRouter();

    const handleProfileClick = () => {
        if (pathname.startsWith('/admin')) {
            router.push('/admin/perfil');
        } else {
            router.push('/perfil');
        }
        closeProfileDropdown();
    };

    const handleLogoutClick = () => {
        logout();
        closeProfileDropdown();
    };

    return (
        <>f
            {/* Desktop Side Menu - Always visible on desktop */}
            {isDesktop && pathname.startsWith('/admin') && (
                <SideMenuAdminDesktop />
            )}

            <div className={styles.mobileHeader}>
            <header className={styles.header}>
                <button className={styles.menuButton} onClick={toggleSideMenu}>
                <Menu size={24} />
                </button>
                
                <button className={styles.notificationButton} onClick={toggleNotificationMenu}>
                <Bell size={24} />
                </button>
            </header>

            {/* Show the side menu */}
            {!isDesktop && pathname.startsWith('/admin') ? (
                <SideMenuAdmin isOpen={sideMenuOpen} onClose={closeSideMenu} />
            ) : !isDesktop ? (
                <SideMenu isOpen={sideMenuOpen} onClose={closeSideMenu} />
            ) : null}
            

            <NotificationMenu isOpen={notificationMenuOpen} onClose={closeNotificationMenu} />

            </div>
            <div className={styles.desktopHeader}>
                <div className={styles.leftSide}>
                    <img src="/brasao.png" alt="Logo" width={100} height={100} />
                    <span className={styles.logoText}>PONTIFÍCIO COLÉGIO PIO BRASILEIRO</span>
                </div>

                <div className={styles.rightSide}>
                    <button className={styles.notificationButton}>
                        <Bell size={20} />
                    </button>

                    <div className={styles.profileDropdown}>
                        <button className={styles.profileButton} onClick={toggleProfileDropdown}>
                            <img
                                src={avatar ? `data:image/jpeg;base64,${avatar}` : "/user.png"}
                                alt="Profile"
                                className={styles.profileImage}
                            />
                            <span className={styles.profileName}>{user?.fullname}</span>
                            <ChevronDown size={20} />
                        </button>

                        {profileDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <button className={styles.dropdownItem} onClick={handleProfileClick}>
                                    <User size={16} />
                                    Meu perfil
                                </button>
                                <button className={styles.dropdownItem} onClick={handleLogoutClick}>
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
} 