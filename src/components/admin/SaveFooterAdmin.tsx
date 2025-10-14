import { Button } from "../ui/Button"
import styles from "./styles/SaveFooterAdmin.module.css"
import { Plus } from "lucide-react";

interface SaveFooterAdminProps {
    buttonText: string;
    executeFunction: () => void;
}

export default function SaveFooterAdmin({buttonText, executeFunction}: SaveFooterAdminProps) {

    return (
        <div className={styles.container}>
            <Button variant="full" onClick={() => executeFunction()} iconLeft={<Plus size={24} />}>{buttonText}</Button>
        </div>
    )
}