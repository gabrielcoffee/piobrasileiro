'use client'

import { Search } from "lucide-react";
import { InputText } from "../ui/InputText";
import styles from "./styles/SearchSection.module.css";
import { useState } from "react";
import { DateSection } from "./DateSection";

interface SearchSectionProps {
    searchPlaceholder: string;
    dateSection: React.ReactNode;
    buttons: React.ReactNode[];
}

export default function SearchSection({ searchPlaceholder, dateSection, buttons }: SearchSectionProps) {

    const [search, setSearch] = useState("");
    
    return (
        <div className={styles.container}>

                
            <div className={styles.inputContainer}>
                <div className={styles.leftIcon}>
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.inputSearch}
                />
            </div>


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