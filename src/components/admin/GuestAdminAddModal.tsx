'use client'

import React, { useEffect, useState } from 'react';
import { InputText } from '../ui/InputText';
import { InputTextBox } from '../ui/InputTextBox';
import styles from './styles/GuestAdminAddModal.module.css';
import { DropdownInput } from '../ui/DropdownInput';
import { queryApi } from '@/lib/utils';

interface GuestAdminAddModalProps {
    formData?: (formData: any) => void;
}

export default function GuestAdminAddModal({ formData }: GuestAdminAddModalProps) {
    // Form states
    const [anfitriaoOptions, setAnfitriaoOptions] = useState([]);
    const [anfitriao, setAnfitriao] = useState('');
    const [data, setData] = useState('');
    const [nome, setNome] = useState('');
    const [funcao, setFuncao] = useState('');
    const [origem, setOrigem] = useState('');
    const [observacoes, setObservacoes] = useState('');

    // Meal states
    const [lunchConfirmed, setLunchConfirmed] = useState(false);
    const [dinnerConfirmed, setDinnerConfirmed] = useState(false);
    const [takeOutOption, setTakeOutOption] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        anfitriao: '',
        data: '',
        nome: '',
        funcao: '',
        origem: ''
    });

    const validateForm = () => {
        const newErrors = {
            anfitriao: '',
            data: '',
            nome: '',
            funcao: '',
            origem: ''
        };

        if (!anfitriao.trim()) {
            newErrors.anfitriao = 'Anfitrião é obrigatório';
        }
        if (!data.trim()) {
            newErrors.data = 'Data é obrigatória';
        }
        if (!nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        }
        if (!funcao.trim()) {
            newErrors.funcao = 'Função é obrigatória';
        }
        if (!origem.trim()) {
            newErrors.origem = 'Origem é obrigatória';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    useEffect(() => {
        formData && formData({
            anfitriao,
            data,
            nome,
            funcao,
            origem,
            observacoes,
            lunchConfirmed,
            dinnerConfirmed,
            takeOutOption
        });
    }, [anfitriao, data, nome, funcao, origem, observacoes, lunchConfirmed, dinnerConfirmed, takeOutOption]);

    const fetchUserIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const users = result.data.map((user: any) => ({
                key: user.user_id,
                value: user.nome_completo
            }));
            setAnfitriaoOptions(users);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {/* Anfitrião */}
                <div className={styles.inputGroup}>
                    <DropdownInput
                        label="Anfitrião"
                        value={anfitriao}
                        onChange={(value) => setAnfitriao(value)}
                        options={anfitriaoOptions}
                        placeholder="Selecione"
                    />
                </div>

                {/* Data */}
                <div className={styles.inputGroup}>
                    <InputText
                        label="*Data"
                        placeholder="Selecione a data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        error={errors.data}
                    />
                </div>

                {/* Nome */}
                <div className={styles.inputGroup}>
                    <InputText
                        label="*Nome"
                        placeholder="Insira o nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        error={errors.nome}
                    />
                </div>

                {/* Função */}
                <div className={styles.inputGroup}>
                    <InputText
                        label="*Função"
                        placeholder="Insira a função ou grau de parentesco"
                        value={funcao}
                        onChange={(e) => setFuncao(e.target.value)}
                        error={errors.funcao}
                    />
                </div>

                {/* Origem */}
                <div className={styles.inputGroup}>
                    <InputText
                        label="*Origem"
                        placeholder="De onde vem?"
                        value={origem}
                        onChange={(e) => setOrigem(e.target.value)}
                        error={errors.origem}
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
                </div>

                {/* Jantar Section */}
                <div className={styles.mealSection}>
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


            </div>
        </div>
    );
}
