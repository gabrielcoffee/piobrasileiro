import { Button } from "../ui/Button"
import styles from "./styles/SaveFooterAdmin.module.css"
import { Plus } from "lucide-react";
import { useViewportHeight } from "@/hooks/useViewportHeight";

interface SaveFooterAdminProps {
    buttonText: string;
    iconLeft?: React.ReactNode;
    executeFunction: () => void;
}

export default function SaveFooterAdmin({buttonText, iconLeft = <Plus size={24} />, executeFunction}: SaveFooterAdminProps) {
    useViewportHeight();

    return (
        <div className={styles.container}>
            <Button variant="full" onClick={() => executeFunction()} iconLeft={iconLeft}>{buttonText}</Button>
        </div>
    )
}