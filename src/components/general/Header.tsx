import React, { useEffect, useState } from 'react';
import { Menu, Bell, ChevronDown, UserCircle, LogOut, User } from 'lucide-react';

import styles from './styles/Header.module.css';
import { SideMenu } from './SideMenu';
import NotificationMenu from './NotificationMenu';
import { useAuth } from '@/contexts/AuthContext';
import { SideMenuAdmin } from '../admin/SideMenuAdmin';
import { SideMenuAdminDesktop } from '../admin/SideMenuAdminDesktop';
import { usePathname, useRouter } from 'next/navigation';
import { queryApi } from '@/lib/utils';
import NotificationMenuAdmin from './NotificationMenuAdminDesktop';
import NotificationMenuAdminDesktop from './NotificationMenuAdminDesktop';
import Link from 'next/link';

interface Notification {
    id: number;
    date: string;
    time: string;
    title: string;
    message: string;
    read: boolean;
}

interface HeaderProps {
    setSideBarExpanded?: (expanded: boolean) => void;
}

export function Header({ setSideBarExpanded = (expanded: boolean) => void 0}: HeaderProps) {

    const { user, logout } = useAuth();

    const [avatar, setAvatar] = useState('');
    const [isDesktop, setIsDesktop] = useState(false);
    const [showNotificationMenu, setShowNotificationMenu] = useState(false);
    const [desktopShowNotificationMenu, setDesktopShowNotificationMenu] = useState(false);

    const [sideMenuOpen, setSideMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const pathname = usePathname();

    const [notificationsCount, setNotificationsCount] = useState(0);

    const fetchNotificationsCount = async () => {
        const result = await queryApi('GET', '/admin/requests/notifications');
        if (result.success) {
            setNotificationsCount(result.data);
        }
    }

    // make timer to fetch notifications count every 10 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            fetchNotificationsCount();
        }, 10000);
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        fetchNotificationsCount();
    }, []);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            
            // Close notification menu if clicking outside
            if (desktopShowNotificationMenu && !target.closest('.notification-container')) {
                setDesktopShowNotificationMenu(false);
            }
            
            // Close profile dropdown if clicking outside
            if (profileDropdownOpen && !target.closest('.profileDropdown')) {
                setProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [desktopShowNotificationMenu, profileDropdownOpen]);
    
    const toggleSideMenu = () => {
        setSideMenuOpen(!sideMenuOpen);
    };

    const closeSideMenu = () => {
        setSideMenuOpen(false);
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

    const toggleDesktopNotificationMenu = () => {
        setDesktopShowNotificationMenu(!desktopShowNotificationMenu);
    };

    return (
        <>
            {/* Desktop Side Menu - Always visible on desktop */}
            {isDesktop && pathname.startsWith('/admin') && (
                <SideMenuAdminDesktop set={setSideBarExpanded} />
            )}

            <div className={styles.mobileHeader}>
            <header className={styles.header}>
                <button className={styles.menuButton} onClick={toggleSideMenu}>
                <Menu size={24} />
                </button>
                
                <button className={styles.notificationButton} onClick={() => setShowNotificationMenu(true)}>
                <Bell size={24} />
                </button>
            </header>

            {/* Show the side menu */}
            {!isDesktop && pathname.startsWith('/admin') ? (
                <SideMenuAdmin isOpen={sideMenuOpen} onClose={closeSideMenu} />
            ) : !isDesktop ? (
                <SideMenu isOpen={sideMenuOpen} onClose={closeSideMenu} />
            ) : null}
            
            {!isDesktop && !pathname.startsWith('/admin') ? (
                <NotificationMenu isOpen={showNotificationMenu} onClose={() => setShowNotificationMenu(false)} />
            ) : null}

            </div>
            <div className={styles.desktopHeader}>
                <div className={styles.leftSide}>
                    <img src="/brasao.png" alt="Logo" width={100} height={100} />
                    <span className={styles.logoText}>PONTIFÍCIO COLÉGIO PIO BRASILEIRO</span>
                </div>

                <div className={styles.rightSide}>

                    {/* NOTIFICATIONS */}
                    <div className="notification-container">
                        <button className={styles.notificationButton} onClick={() => toggleDesktopNotificationMenu()}>
                            <Bell size={20} />
                            {notificationsCount > 0 &&
                                <div className={styles.notificationCount}>{notificationsCount}</div>
                            }

                            <Link href="/admin/solicitacoes">
                                {desktopShowNotificationMenu && (
                                    <NotificationMenuAdminDesktop />
                                )}
                            </Link>
                        </button>
                    </div>

                    {/* PROFILE */}
                    <div className={`${styles.profileDropdown} profileDropdown`}>
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