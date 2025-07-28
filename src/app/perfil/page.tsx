"use client"
import { Header } from "@/components/general/Header";
import { Footer } from "@/components/general/Footer";
import { PageTitle } from "@/components/home/PageTitle";
import { UserRound } from "lucide-react";
import { InputText } from "@/components/ui/InputText";
import { Button } from "@/components/ui/Button";
import ImageSelector from "@/components/profile/ImageSelector";

import styles from "./page.module.css";

export default function PerfilPage() {

    function handlePasswordButton() {
        console.log("Password button clicked");
    }

    function handleImageChange(file: File) {
        console.log("Image changed:", file);
        // Here you would typically upload the file to your server
        // and update the user's profile image
    }

    return (
        <div className={styles.container}>
            <Header/>
                <div className={styles.section}>
                    <PageTitle
                        icon={<UserRound size={24} />}
                        title="Perfil"
                        text={<></>}
                    />
                </div>
                
                <div className={styles.inputsContainer}>

                    <ImageSelector 
                        onImageChange={handleImageChange}
                    />

                    <InputText 
                        className={styles.input}
                        label="Nome Completo:" 
                        value={"Ricardo Nogueira da Silva"} 
                        placeholder="Insira seu nome completo" 
                    />

                    <InputText
                        className={styles.input}
                        label="E-mail:"
                        disabled={true}
                        value={"ricardonogueira@gmail.com"}
                        placeholder="Insira seu email"
                    />
                </div>

                <Button className={styles.passwordButton} onClick={handlePasswordButton} variant="text">
                    Alterar senha
                </Button>
            <Footer/>
        </div>
    )
}