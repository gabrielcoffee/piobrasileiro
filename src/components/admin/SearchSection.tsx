'use client'

import { Search } from "lucide-react";
import { InputText } from "../ui/InputText";
import styles from "./styles/SearchSection.module.css";
import { useEffect, useState } from "react";
import { DateSection } from "./DateSection";

interface SearchSectionProps {
    searchPlaceholder?: string;
    dateSection: React.ReactNode;
    buttons: React.ReactNode[];
    searchText?: string;
    setSearchText?: (text: string) => void;
    shrinkSearch?: boolean;
    showSearchInput?: boolean;
}

export default function SearchSection({ showSearchInput = true, searchPlaceholder, dateSection, buttons, searchText, setSearchText, shrinkSearch = false }: SearchSectionProps) {

    const [search, setSearch] = useState(searchText || '');

    useEffect(() => {
        setSearchText?.(search);
    }, [search]);
    
    return (
        <div className={`${styles.container} ${shrinkSearch ? styles.containerShrunk : ''}`}>

                
            {showSearchInput && (
                <div className={`${styles.inputContainer} ${shrinkSearch ? styles.shrink : ''}`}>
                    {!shrinkSearch && (
                        <div className={styles.leftIcon}>
                            <Search size={20} />
                        </div>
                    )}
                    <div className={styles.leftIconDesktop}>
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`${styles.inputSearch} ${shrinkSearch ? styles.shrinkInput : ''}`}
                    />
                </div>
            )}


            <div className={styles.buttons}>
                {dateSection && (
                    <div className={styles.dateSection}>
                        {dateSection}
                    </div>
                )}
                {buttons && buttons.length > 0 && buttons.map((button, index) => (
                    button
                ))}
            </div>

        </div>
    )
}