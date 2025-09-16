"use client"

import { PageTitle } from "@/components/home/PageTitle";
import { Bed } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function HospedagemPage() {

    function handleExternalLink() {
        window.open('https://www.piobrasileiro.com/hospedagem/', '_blank');
    }

    return (
        <div className={styles.container}>
                <div className={styles.section}>
                    <PageTitle
                        icon={<Bed/>}
                        title="Hospedagem"
                        text={
                            <span>
                                Você pode fazer solicitações de hospedagem para seus convidados. Posteriormente, confirmaremos a disponibilidade.
                            </span>
                        }
                    />

                    <Button onClick={handleExternalLink} variant="full" iconLeft={<Bed/>}>
                        Solicitar hospedagem
                    </Button>
                </div>
        </div>
    )
}