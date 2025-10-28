import React, { useEffect, useState } from 'react';
import { Home, LucideSalad, Bed, UserRound, LogOut, ChevronDown, ChevronUp, SquareArrowLeft, SquareArrowRight } from 'lucide-react';
import styles from './styles/SideMenuAdminDesktop.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { queryApi } from '@/lib/utils';

interface SideMenuAdminDesktopProps {
    set: (isCollapsed: boolean) => void;
}

export function SideMenuAdminDesktop({ set }: SideMenuAdminDesktopProps) {

    const pathname = usePathname();
    const { logout } = useAuth();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);

    const menuItems = [
        { id: 'home', label: 'Início', icon: Home, href: '/admin/home' },
        { id: 'usuarios', label: 'Usuários', icon: UserRound, href: '/admin/usuarios' },
        { id: 'refeicoes', label: 'Refeições', icon: LucideSalad,
            submenu: [
                { id: "lista_de_refeicoes", label: "Lista de refeições", href: "/admin/refeicoes"},
                { id: "calendario", label: "Calendário", href: "/admin/calendario" }
            ]
        },
        { id: 'hospedagem', label: 'Hospedagem', icon: Bed, 
            submenu: [
                { id: "gestao_de_reserva", label: "Gestão de reservas", href: "/admin/reservas"},
                { id: "solicitacoes", label: "Solicitações", href: "/admin/solicitacoes"},
                { id: "hospedes", label: "Hóspedes", href: "/admin/hospedes"},
                { id: "quartos", label: "Quartos", href: "/admin/quartos"}
            ]
        },
        { id: 'logout', label: 'Sair da conta', icon: LogOut, href: '/' },
    ];

    const toggleSubmenu = (menuId: string) => {
        if (isCollapsed) return; // Don't toggle submenu when collapsed
        setExpandedMenus(prev => 
            prev.includes(menuId) 
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const isSubmenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

    const handleMenuClick = (item: any) => {
        if (isCollapsed) {
            // If collapsed, expand the menu
            setIsCollapsed(false);
            set(!false);
            // If item has submenu, expand it too
            if (item.submenu) {
                setExpandedMenus([item.id]);
            }
        } else if (item.submenu) {
            // If expanded and has submenu, toggle submenu
            toggleSubmenu(item.id);
        }
    };

    const fetchNotifications = async () => {

        const result = await queryApi('GET', '/admin/requests/notifications');

        if (result.success) {
            setNotificationsCount(result.data);
        } else {
            setNotificationsCount(0);
        }
    }

    // make timer to fetch notifications count every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            fetchNotifications();
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (pathname.startsWith('/admin/solicitacoes') || pathname.startsWith('/admin/reservas')) {
            fetchNotifications();
        }
    }, [pathname]);

    const renderMenuItem = (item: any) => {
        const IconComponent = item.icon;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = isSubmenuExpanded(item.id);
        const isActive = item.href === pathname || 
            (hasSubmenu && item.submenu.some((sub: any) => sub.href === pathname));

        if (hasSubmenu) {
            return (
                <div key={item.id} className={styles.menuItemContainer}>
                    <button
                        className={`${styles.menuItem} ${isActive && !isExpanded ? styles.activeTopMenu : ''}`}
                        onClick={() => handleMenuClick(item)}
                    >
                        <IconComponent size={24}/>
                        {!isCollapsed && (
                            <div className={styles.menuLabelContainer}>
                                <span className={styles.menuLabel}>{item.label}</span>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        )}
                    </button>
                    
                    {!isCollapsed && isExpanded && (
                        <div className={styles.submenu}>
                            {item.submenu.map((subItem: any) => (
                                <Link
                                    key={subItem.id}
                                    href={subItem.href}
                                    className={`${styles.submenuItem} ${subItem.href === pathname ? styles.active : ''}`}
                                >
                                    <span className={styles.submenuLabel}>
                                        <span>{subItem.id !== 'solicitacoes' && subItem.label}</span>
                                        {subItem.id === 'solicitacoes' && 
                                        <div className={styles.notification}>
                                            <span>{subItem.label}</span> 
                                            {notificationsCount > 0 &&
                                                <div className={styles.notificationCount}>{notificationsCount}
                                                </div>
                                            }
                                        </div>
                                        }
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        // Regular menu item without submenu
        if (item.id === 'logout') {
            return (
                <button
                    key={item.id}
                    className={`${styles.menuItem} ${styles.logoutButton}`}
                    onClick={() => {
                        logout();
                    }}
                >
                    <IconComponent size={24}/>
                    {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
                </button>
            );
        }

        return (
            <Link 
                key={item.id}
                href={item.href || '#'}
                className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                onClick={() => handleMenuClick(item)}
            >
                <IconComponent size={24}/>
                {!isCollapsed && <span className={styles.menuLabel}>{item.label}</span>}
            </Link>
        );
    };

    return (
        <div className={`${styles.sideMenuDesktop} ${isCollapsed ? styles.collapsed : ''}`}>
            
            <nav className={styles.navigation}>


                <button className={styles.toggleButton} onClick={() => {
                    const invert = !isCollapsed;
                    setIsCollapsed(invert);
                    set(!invert);
                }}>
                    {isCollapsed ? <SquareArrowRight size={24} /> : <SquareArrowLeft size={24} />}
                </button>

                {menuItems.map(renderMenuItem)}
            </nav>
        </div>
    );
} 