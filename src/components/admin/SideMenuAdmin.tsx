import React, { useState } from 'react';
import { Home, LucideSalad, Bed, X, UserRound, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './styles/SideMenuAdmin.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenuAdmin({ isOpen, onClose }: SideMenuProps) {

    const pathname = usePathname();
    const { logout } = useAuth();
    const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
    
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
        { id: 'logout', label: 'Sair', icon: LogOut, href: '/' },
    ];

    const toggleSubmenu = (menuId: string) => {
        setExpandedMenus(prev => 
            prev.includes(menuId) 
                ? prev.filter(id => id !== menuId)
                : [...prev, menuId]
        );
    };

    const isSubmenuExpanded = (menuId: string) => expandedMenus.includes(menuId);

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
                        className={`${styles.menuItem} ${styles.dropdownButton} ${isActive ? styles.active : ''}`}
                        onClick={() => toggleSubmenu(item.id)}
                    >
                        <IconComponent size={24}/>
                        <span className={styles.menuLabel}>{item.label}</span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    
                    {isExpanded && (
                        <div className={styles.submenu}>
                            {item.submenu.map((subItem: any) => (
                                <Link
                                    key={subItem.id}
                                    href={subItem.href}
                                    className={`${styles.submenuItem} ${subItem.href === pathname ? styles.active : ''}`}
                                    onClick={onClose}
                                >
                                    <span className={styles.submenuLabel}>{subItem.label}</span>
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
                    <span className={styles.menuLabel}>{item.label}</span>
                </button>
            );
        }

        return (
            <Link 
                key={item.id}
                href={item.href || '#'}
                className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                onClick={onClose}
            >
                <IconComponent size={24}/>
                <span className={styles.menuLabel}>{item.label}</span>
            </Link>
        );
    };

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
                {menuItems.map(renderMenuItem)}
            </nav>
        </div>
        </>
    );
} 