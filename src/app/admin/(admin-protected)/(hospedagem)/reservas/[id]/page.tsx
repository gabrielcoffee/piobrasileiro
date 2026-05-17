'use client';
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { Check, SquareArrowLeft, Trash2, UserPlus, AlertCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import Link from "next/link";
import { queryApi, getDateString } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InputText } from "@/components/ui/InputText";
import { InputTextSearch } from "@/components/ui/InputTextSearch";
import { Button } from "@/components/ui/Button";
import MealSection from "@/components/admin/MealSection";
import { useToast } from "@/contexts/ToastContext";

type Option = { key: string; value: string; warningOnRight?: string };

const REFEICOES_LABEL: Record<string, string> = {
    apenas_cafe: 'Apenas café da manhã',
    cafe_almoco: 'Café da manhã + almoço',
    cafe_janta: 'Café da manhã + jantar',
    cafe_almoco_janta: 'Café da manhã + almoço + jantar',
    decidir_depois: 'Irei decidir depois',
};
const PAGAMENTO_LABEL: Record<string, string> = {
    wise: 'Transferência via app Wise',
    dinheiro: 'Dinheiro em espécie',
};

export default function ReservaPage() {
    const { id } = useParams();
    const router = useRouter();
    const { showToast } = useToast();

    const [preReserva, setPreReserva] = useState<any>(null);
    const [hospedes, setHospedes] = useState<{ nome: string; idade: string }[]>([]);
    const [anfitriao, setAnfitriao] = useState('');
    const [quarto, setQuarto] = useState('');
    const [almoco, setAlmoco] = useState(false);
    const [janta, setJanta] = useState(false);
    const [anfitriaoOptions, setAnfitriaoOptions] = useState<Option[]>([]);
    const [quartoOptions, setQuartoOptions] = useState<Option[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const isNaoValidada = preReserva?.status === 'nao_validada';

    const fetchPreReserva = async () => {
        const result = await queryApi('GET', `/admin/pre-reservas/${id}`);
        if (result.success) {
            const pr = result.data.data;
            setPreReserva(pr);
            setHospedes((pr.hospedes || []).map((h: any) => ({
                nome: h.nome || '',
                idade: h.idade != null ? String(h.idade) : '',
            })));
        } else {
            console.log('Erro ao buscar pré-reserva', result.error);
        }
    };

    const fetchAnfitrioes = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const opts = result.data
                .map((u: any) => ({ key: u.user_id, value: u.nome_completo }))
                .sort((a: any, b: any) => a.value.localeCompare(b.value));
            setAnfitriaoOptions(opts);
        }
    };

    const fetchQuartos = async () => {
        const result = await queryApi('GET', '/admin/room-occupation');
        if (result.success) {
            const opts = result.data
                .map((room: any) => ({
                    key: room.quarto_id,
                    value: `${room.numero} - (cap. ${room.capacidade})`,
                }))
                .sort((a: any, b: any) => a.value.localeCompare(b.value));
            setQuartoOptions(opts);
        }
    };

    useEffect(() => {
        fetchPreReserva();
        fetchAnfitrioes();
        fetchQuartos();
    }, []);

    const setHospedeField = (i: number, field: 'nome' | 'idade', value: string) => {
        setHospedes(prev => prev.map((h, idx) => idx === i ? { ...h, [field]: value } : h));
    };
    const addHospede = () => setHospedes(prev => [...prev, { nome: '', idade: '' }]);
    const removeHospede = (i: number) => setHospedes(prev => prev.filter((_, idx) => idx !== i));

    const validar = async () => {
        if (!quarto || !anfitriao) {
            setShowErrors(true);
            showToast('Preencha quarto e anfitrião para validar', 'error');
            return;
        }
        const hospedesPayload = hospedes
            .map(h => ({ nome: h.nome.trim(), idade: h.idade ? parseInt(h.idade, 10) : null }))
            .filter(h => h.nome);
        if (hospedesPayload.length === 0) {
            showToast('Informe ao menos um hóspede', 'error');
            return;
        }
        setIsSaving(true);
        const result = await queryApi('POST', `/admin/pre-reservas/${id}/validate`, {
            quarto_id: quarto,
            anfitriao_id: anfitriao,
            almoco,
            janta,
            hospedes: hospedesPayload,
        });
        setIsSaving(false);
        if (result.success) {
            showToast('Reserva validada com sucesso', 'success');
            router.push('/admin/validacao-reservas');
        } else if (result.message?.includes('já validada')) {
            showToast('Pré-reserva já validada', 'error');
        } else {
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        }
    };

    const readOnlyField = (label: string, value: string) => (
        <div className={styles.roField}>
            <span className={styles.roLabel}>{label}</span>
            <span className={styles.roValue}>{value || '—'}</span>
        </div>
    );

    return (
        <div>
            <Card>
                <CardHeader
                    title={
                        <Link href="/admin/validacao-reservas" className={styles.backLink}>
                            <SquareArrowLeft size={20} /> Voltar para validação
                        </Link>
                    }
                    breadcrumb={["Início", "Hospedagem", "Validação de reservas"]}
                />

                {isNaoValidada && (
                    <div className={styles.banner}>
                        <AlertCircle size={20} />
                        Reserva não validada — preencha quarto e anfitrião abaixo para validar.
                    </div>
                )}

                <div className={styles.profileCard}>
                    <span className={styles.Data}>Dados da solicitação</span>

                    <div className={styles.roGrid}>
                        {readOnlyField('Solicitante', preReserva?.nome_solicitante ?? '')}
                        {readOnlyField('E-mail', preReserva?.email ?? '')}
                        {readOnlyField('Data de entrada', preReserva ? getDateString(preReserva.data_entrada) : '')}
                        {readOnlyField('Data de saída', preReserva ? getDateString(preReserva.data_saida) : '')}
                        {readOnlyField('Horário de chegada', preReserva?.horario_chegada ?? '')}
                        {readOnlyField('Preferência de refeições', REFEICOES_LABEL[preReserva?.refeicoes] ?? '')}
                        {readOnlyField('Forma de pagamento', PAGAMENTO_LABEL[preReserva?.forma_pagamento] ?? '')}
                        {readOnlyField('Restrição alimentar / comorbidade', preReserva?.restricao_alimentar ?? '')}
                        {readOnlyField('Observação', preReserva?.observacao ?? '')}
                    </div>

                    <span className={styles.Data}>Hóspedes</span>
                    <div className={styles.hospedesList}>
                        {hospedes.map((h, i) => (
                            <div key={i} className={styles.hospedeRow}>
                                <InputText
                                    label="Nome"
                                    value={h.nome}
                                    onChange={(e) => setHospedeField(i, 'nome', e.target.value.slice(0, 100))}
                                    placeholder="Nome completo"
                                />
                                <InputText
                                    label="Idade"
                                    value={h.idade}
                                    onChange={(e) => setHospedeField(i, 'idade', e.target.value.replace(/\D/g, '').slice(0, 3))}
                                    placeholder="Idade"
                                />
                                <Trash2 size={20} className={styles.removeHospede} onClick={() => removeHospede(i)} />
                            </div>
                        ))}
                        <Button variant="full-white" iconLeft={<UserPlus size={18} />} onClick={addHospede}>Adicionar hóspede</Button>
                    </div>

                    <span className={styles.Data}>Validação</span>
                    <div className={styles.userDataSection}>
                        <div className={styles.leftDataSection}>
                            <InputTextSearch
                                label="*Anfitrião"
                                value={anfitriaoOptions.find(o => o.key === anfitriao)?.value || ''}
                                onSelect={(o: Option) => setAnfitriao(o.key)}
                                searchOptions={anfitriaoOptions}
                                placeholder="Selecione"
                                error={showErrors && !anfitriao ? 'Campo necessário para validação' : ''}
                            />
                            <InputTextSearch
                                label="*Quarto"
                                value={quartoOptions.find(o => o.key === quarto)?.value || ''}
                                onSelect={(o: Option) => setQuarto(o.key)}
                                searchOptions={quartoOptions}
                                placeholder="Selecione"
                                error={showErrors && !quarto ? 'Campo necessário para validação' : ''}
                            />
                        </div>
                        <div className={styles.rightDataSection}>
                            <span className={styles.mealTitle}>Incluir refeições?</span>
                            <MealSection
                                almoco_colegio={almoco}
                                almoco_levar={false}
                                janta_colegio={janta}
                                onAlmocoColegioChange={setAlmoco}
                                onAlmocoLevarChange={() => {}}
                                onJantaColegioChange={setJanta}
                                hasTakeoutOption={false}
                            />
                        </div>
                    </div>

                    <div className={styles.userDataSaveButton}>
                        <Button
                            iconLeft={<Check size={20} />}
                            available={isNaoValidada}
                            onClick={validar}
                        >
                            {isSaving ? 'Validando...' : 'Validar reserva'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
