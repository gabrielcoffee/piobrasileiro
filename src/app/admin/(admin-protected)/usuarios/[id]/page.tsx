'use client';
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { SquareArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

export default function UsuarioPage() {    
    const { id } = useParams();

    console.log(id);

    return (
        <div>
            <Card>
                <CardHeader title={<span><SquareArrowLeft size={20} /> Voltar para lista</span>} breadcrumb={["Início", "Usuários", "Usuário"]} />
            </Card>
        </div>
    )
}