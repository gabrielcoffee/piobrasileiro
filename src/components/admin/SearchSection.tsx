'use client'

import { Search } from "lucide-react";
import { InputText } from "../ui/InputText";
import styles from "./styles/SearchSection.module.css";
import { useState } from "react";

interface SearchSectionProps {
    searchPlaceholder: string;
    dateSection: boolean;
    buttons: React.ReactNode[];
}

export default function SearchSection({ searchPlaceholder, dateSection, buttons }: SearchSectionProps) {

    const [search, setSearch] = useState("");
    
    return (
        <div className={styles.container}>

                
            <div className={styles.inputContainer}>
                <div className={styles.leftIcon}>
                    <Search />
                </div>
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.input}
                />
            </div>


            <div className={styles.buttons}>
                {dateSection && (
                    <div className={styles.dateSection}>
                        <Date />
                    </div>
                )}
                {buttons && buttons.length > 0 && buttons.map((button, index) => (
                    button
                ))}
            </div>

        </div>
    )
}