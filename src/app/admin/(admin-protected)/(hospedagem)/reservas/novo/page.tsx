'use client';
import Card from "@/components/desktop/Card";
import CardHeader from "@/components/desktop/CardHeader";
import { Check, SquareArrowLeft, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "../[id]/page.module.css";
import Link from "next/link";
import { queryApi, toYMD } from "@/lib/utils";
import { useEffect, useState } from "react";
import { InputText } from "@/components/ui/InputText";
import { InputTextBox } from "@/components/ui/InputTextBox";
import { InputTextSearch } from "@/components/ui/InputTextSearch";
import { DropdownInput } from "@/components/ui/DropdownInput";
import { SimpleDateSelect } from "@/components/admin/SimpleDateSelect";
import { Button } from "@/components/ui/Button";
import MealSection from "@/components/admin/MealSection";
import { useToast } from "@/contexts/ToastContext";

type Option = { key: string; value: string };

export default function NovaReservaGrupoPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [hospedes, setHospedes] = useState<{ nome: string; idade: string }[]>([{ nome: '', idade: '' }]);
    const [anfitriao, setAnfitriao] = useState('');
    const [quarto, setQuarto] = useState('');
    const [dataChegada, setDataChegada] = useState<string>(toYMD(new Date()));
    const [dataSaida, setDataSaida] = useState<string>(toYMD(new Date()));
    const [almoco, setAlmoco] = useState(false);
    const [janta, setJanta] = useState(false);
    const [cafe, setCafe] = useState(false);
    const [formaPagamento, setFormaPagamento] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [anfitriaoOptions, setAnfitriaoOptions] = useState<Option[]>([]);
    const [quartoOptions, setQuartoOptions] = useState<Option[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const fetchAnfitrioes = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            setAnfitriaoOptions(result.data
                .map((u: any) => ({ key: u.user_id, value: u.nome_completo }))
                .sort((a: any, b: any) => a.value.localeCompare(b.value)));
        }
    };
    const fetchQuartos = async () => {
        const result = await queryApi('GET', '/admin/room-occupation');
        if (result.success) {
            setQuartoOptions(result.data
                .map((r: any) => ({ key: r.quarto_id, value: `${r.numero} - (cap. ${r.capacidade})` }))
                .sort((a: any, b: any) => a.value.localeCompare(b.value)));
        }
    };
    useEffect(() => { fetchAnfitrioes(); fetchQuartos(); }, []);

    const setHospedeField = (i: number, f: 'nome' | 'idade', v: string) =>
        setHospedes(prev => prev.map((h, idx) => idx === i ? { ...h, [f]: v } : h));
    const addHospede = () => setHospedes(prev => [...prev, { nome: '', idade: '' }]);
    const removeHospede = (i: number) => setHospedes(prev => prev.filter((_, idx) => idx !== i));

    const salvar = async () => {
        const hospedesPayload = hospedes
            .map(h => ({ nome: h.nome.trim(), idade: h.idade ? parseInt(h.idade, 10) : null }))
            .filter(h => h.nome);
        if (!anfitriao || !quarto) { showToast('Preencha anfitrião e quarto', 'error'); return; }
        if (hospedesPayload.length === 0) { showToast('Informe ao menos um hóspede', 'error'); return; }
        setIsSaving(true);
        const result = await queryApi('POST', '/admin/accommodations/group', {
            anfitriao_id: anfitriao,
            quarto_id: quarto,
            data_chegada: dataChegada,
            data_saida: dataSaida,
            almoco,
            janta,
            cafe,
            forma_pagamento: formaPagamento || null,
            observacoes: observacoes || null,
            hospedes: hospedesPayload,
        });
        setIsSaving(false);
        if (result.success) {
            showToast('Reserva em grupo criada', 'success');
            router.push('/admin/reservas');
        } else {
            showToast('Ops! Algo deu errado. Tente novamente.', 'error');
        }
    };

    return (
        <div>
            <Card>
                <CardHeader
                    title={
                        <Link href="/admin/reservas" className={styles.backLink}>
                            <SquareArrowLeft size={20} /> Voltar para reservas
                        </Link>
                    }
                    breadcrumb={["Início", "Hospedagem", "Gestão de reservas"]}
                />

                <div className={styles.profileCard}>
                    <span className={styles.Data}>Nova reserva em grupo</span>

                    <div className={styles.userDataSection}>
                        <div className={styles.leftDataSection}>
                            <InputTextSearch
                                label="*Anfitrião"
                                value={anfitriaoOptions.find(o => o.key === anfitriao)?.value || ''}
                                onSelect={(o: Option) => setAnfitriao(o.key)}
                                searchOptions={anfitriaoOptions}
                                placeholder="Selecione"
                            />
                            <InputTextSearch
                                label="*Quarto"
                                value={quartoOptions.find(o => o.key === quarto)?.value || ''}
                                onSelect={(o: Option) => setQuarto(o.key)}
                                searchOptions={quartoOptions}
                                placeholder="Selecione"
                            />
                            <SimpleDateSelect
                                label="*Data de chegada"
                                cantBeBeforeToday={true}
                                selectedDate={dataChegada ? new Date(dataChegada.split('T')[0] + 'T00:00:00') : new Date()}
                                onDateChange={(d: any) => setDataChegada(toYMD(d))}
                            />
                            <SimpleDateSelect
                                label="*Data de saída"
                                cantBeBeforeToday={true}
                                selectedDate={dataSaida ? new Date(dataSaida.split('T')[0] + 'T00:00:00') : new Date()}
                                onDateChange={(d: any) => setDataSaida(toYMD(d))}
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

                            <span className={styles.mealTitle}>Informações extras</span>
                            <Button
                                variant={cafe ? 'full' : 'full-white'}
                                onClick={() => setCafe(v => !v)}
                            >
                                {cafe ? 'Com café da manhã' : 'Sem café da manhã'}
                            </Button>
                            <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', opacity: 0.6, margin: 0 }}>
                                * Apenas para visualização
                            </p>
                            <DropdownInput
                                label="Forma de pagamento"
                                value={formaPagamento}
                                onChange={(value) => setFormaPagamento(value)}
                                options={[
                                    { key: 'wise', value: 'Transferência via app Wise' },
                                    { key: 'dinheiro', value: 'Dinheiro em espécie' },
                                ]}
                                placeholder="Selecione"
                            />
                            <InputTextBox
                                label="Observações sobre restrição alimentar"
                                placeholder="Digite aqui as observações"
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />
                        </div>
                    </div>

                    <span className={styles.Data}>Hóspedes</span>
                    <div className={styles.hospedesList}>
                        {hospedes.map((h, i) => (
                            <div key={i} className={styles.hospedeRow}>
                                <InputText label="Nome" value={h.nome}
                                    onChange={(e) => setHospedeField(i, 'nome', e.target.value.slice(0, 100))}
                                    placeholder="Nome completo" />
                                <InputText label="Idade" value={h.idade}
                                    onChange={(e) => setHospedeField(i, 'idade', e.target.value.replace(/\D/g, '').slice(0, 3))}
                                    placeholder="Idade" />
                                {hospedes.length > 1 && (
                                    <Trash2 size={20} className={styles.removeHospede} onClick={() => removeHospede(i)} />
                                )}
                            </div>
                        ))}
                        <Button variant="full-white" iconLeft={<UserPlus size={18} />} onClick={addHospede}>Adicionar hóspede</Button>
                    </div>

                    <div className={styles.userDataSaveButton}>
                        <Button iconLeft={<Check size={20} />} onClick={salvar}>
                            {isSaving ? 'Salvando...' : 'Criar reserva'}
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
