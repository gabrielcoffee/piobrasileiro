'use client'

import React, { useEffect, useState } from 'react';
import { InputText } from '../ui/InputText';
import { InputTextBox } from '../ui/InputTextBox';
import styles from './styles/AddGuestAdminModal.module.css';
import { queryApi } from '@/lib/utils';
import { InputTextSearch } from '../ui/InputTextSearch';
import { SimpleDateSelect } from './SimpleDateSelect';
import { Button } from '../ui/Button';
import { Trash, Trash2 } from 'lucide-react';

type Option = {
    key: string;
    value: string;
}

interface AddGuestAdminModalProps {
    formData?: (formData: {
        anfitriao_id: string;
        data: string;
        nome: string;
        funcao: string;
        origem: string;
        almoco_colegio: boolean;
        almoco_levar: boolean;
        janta_colegio: boolean;
        observacoes: string;
    }) => void;
    isEdit?: boolean;
    guestMealData?: any;
    onDeleteGuest?: () => void;
    date?: string;
}

export default function AddGuestAdminModal({ formData, isEdit = false, guestMealData = null, onDeleteGuest = () => {}, date = '' }: AddGuestAdminModalProps) {
    // Form states
    const [anfitriaoOptions, setAnfitriaoOptions] = useState<Option[]>([]);
    const [anfitriao, setAnfitriao] = useState('');
    const [data, setData] = useState(date);
    const [nome, setNome] = useState('');
    const [funcao, setFuncao] = useState('');
    const [origem, setOrigem] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [mealId, setMealId] = useState('');

    const [dataError, setDataError] = useState('');
    const [nomeError, setNomeError] = useState('');
    const [funcaoError, setFuncaoError] = useState('');
    const [origemError, setOrigemError] = useState('');

    // Meal states
    const [lunchConfirmed, setLunchConfirmed] = useState(false);
    const [dinnerConfirmed, setDinnerConfirmed] = useState(false);
    const [takeOutOption, setTakeOutOption] = useState(false);

    const validateForm = () => {
        if (!data) {
            setDataError("Data é obrigatória");
        }
        if (!nome.trim()) {
            setNomeError("Nome é obrigatório");
        }
        if (!funcao.trim()) {
            setFuncaoError("Função é obrigatória");
        }
        if (!origem.trim()) {
            setOrigemError("Origem é obrigatória");
        }
    }

    useEffect(() => {
        formData && formData({
            anfitriao_id: anfitriao,
            data,
            nome,
            funcao,
            origem,
            observacoes,
            almoco_colegio: lunchConfirmed,
            almoco_levar: takeOutOption,
            janta_colegio: dinnerConfirmed,
        });
    }, [anfitriao, data, nome, funcao, origem, observacoes, lunchConfirmed, dinnerConfirmed, takeOutOption]);

    const fetchUserIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const users = result.data.map((user: any) => ({
                key: user.user_id,
                value: user.nome_completo
            }));

            // Sort users by name
            users.sort((a: any, b: any) => a.value.localeCompare(b.value));

            setAnfitriaoOptions(users);
        }
    }

    useEffect(() => {
        fetchUserIdAndNames();
    }, []);

    useEffect(() => {
        if (guestMealData) {
            setAnfitriao(guestMealData.anfitriao_id);
            setData(guestMealData.data);
            setNome(guestMealData.nome);
            setFuncao(guestMealData.funcao);
            setOrigem(guestMealData.origem);
            setObservacoes(guestMealData.observacoes);
            setLunchConfirmed(guestMealData.almoco_colegio);
            setTakeOutOption(guestMealData.almoco_levar);
            setDinnerConfirmed(guestMealData.janta_colegio);
            setMealId(guestMealData.id);
        }
    }, [guestMealData]);

    const handleDeleteGuest = async() => {

        if (!mealId) {
            console.log('Refeicao sem id');
            return;
        }

        const result = await queryApi('DELETE', `/admin/guestmeals/${mealId}`);
        if (result.success) {
            console.log('Convidado e refeicao deletados com sucesso');
            onDeleteGuest();
        } else {
            console.log('Erro ao deletar refeicao e convidado no banco');
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {/* Anfitrião */}
                <div className={styles.inputGroup}>
                    <InputTextSearch
                        label="Anfitrião"
                        value={anfitriaoOptions.find((option) => option.key === anfitriao)?.value || ''}
                        onSelect={(option: Option) => setAnfitriao(option.key)}
                        searchOptions={anfitriaoOptions}
                        placeholder="Selecione um anfitrião"
                    />

                    <SimpleDateSelect
                        selectedDate={data ? new Date(data) : undefined}
                        onDateChange={(date) => setData(date?.toISOString())}
                    />

                    <InputText
                        disabled={isEdit}
                        label="*Nome"
                        placeholder="Insira o nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        error={nomeError}
                    />

                    <InputText
                        disabled={isEdit}
                        label="*Função"
                        placeholder="Insira a função ou grau de parentesco"
                        value={funcao}
                        onChange={(e) => setFuncao(e.target.value)}
                        error={funcaoError}
                    />

                    <InputText
                        disabled={isEdit}
                        label="*Origem"
                        placeholder="De onde vem?"
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                        error={origemError}
                    />
                </div>

                {/* Almoço Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (11h - 14h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {lunchConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${lunchConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setLunchConfirmed(!lunchConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="school"
                                checked={!takeOutOption}
                                onChange={() => setTakeOutOption(false)}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>

                        <label className={`${styles.radioOption} ${!lunchConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="takeaway"
                                checked={takeOutOption}
                                onChange={() => setTakeOutOption(true)}
                                disabled={!lunchConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>Para levar</span>
                        </label>
                    </div>

                {/* Jantar Section */}
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Jantar (17h - 20h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {dinnerConfirmed ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${dinnerConfirmed ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setDinnerConfirmed(!dinnerConfirmed)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!dinnerConfirmed ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="dinner"
                                value="school"
                                defaultChecked={true}
                                disabled={!dinnerConfirmed}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>
                    </div>
                </div>

                {/* Observações */}
                <div className={`${styles.inputGroup} ${styles.observacoesGroup}`}>
                    <InputTextBox
                        label="Observações sobre restrição alimentar"
                        placeholder="Digite aqui as observações"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                    />
                </div>

                {isEdit && (
                    <div className={styles.inputGroup}>
                        <Button variant="text" iconLeft={<Trash2 size={20} />} className={styles.deleteGuestButton} onClick={() => handleDeleteGuest()}>Excluir convidado</Button>
                    </div>
                )}


            </div>
        </div>
    );
}
