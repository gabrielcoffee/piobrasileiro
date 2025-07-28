"use client"

import { PageTitle } from "@/components/home/PageTitle";
import { Header } from "@/components/general/Header";
import { Footer } from "@/components/general/Footer";
import { Bed } from "lucide-react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function HospedagemPage() {

    function handleExternalLink() {
        window.open('https://www.google.com', '_blank');
    }

    return (
        <div className={styles.container}>
            <Header/>
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

            <Footer/>
        </div>
    )
}