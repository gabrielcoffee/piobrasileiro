import { Button } from "../ui/Button"
import styles from "./styles/SaveFooterAdmin.module.css"
import { Plus } from "lucide-react";

interface SaveFooterAdminProps {
    buttonText: string;
    iconLeft?: React.ReactNode;
    executeFunction: () => void;
}

export default function SaveFooterAdmin({buttonText, iconLeft = <Plus size={24} />, executeFunction}: SaveFooterAdminProps) {

    return (
        <div className={styles.container}>
            <Button variant="full" onClick={() => executeFunction()} iconLeft={iconLeft}>{buttonText}</Button>
        </div>
    )
}