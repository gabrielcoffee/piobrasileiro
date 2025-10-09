'use client'

import React, { useEffect, useState } from 'react';
import { InputText } from '../ui/InputText';
import { InputTextBox } from '../ui/InputTextBox';
import styles from './styles/AddGuestAdminModal.module.css';
import { queryApi } from '@/lib/utils';
import { InputTextSearch } from '../ui/InputTextSearch';
import { SimpleDateSelect } from './SimpleDateSelect';
import { Button } from '../ui/Button';
import { Trash2, UserPlus } from 'lucide-react';

type Option = {
    key: string;
    value: string;
    warningOnRight?: string;
}

interface AddBookingModalProps {
    bookingDataChange?: (bookingData: {
        id: string;
        anfitriao_id: string;
        hospede_id: string;
        novo_hospede_nome?: string;
        data_chegada: string;
        data_saida: string;
        quarto_id: string;
        almoco: boolean;
        janta: boolean;
        observacoes: string;
    }) => void;
    isEdit?: boolean;
    bookingData?: {
        id: string;
        anfitriao_id: string;
        hospede_id: string;
        novo_hospede_nome?: string;
        data_chegada: string;
        data_saida: string;
        quarto_id: string;
        almoco: boolean;
        janta: boolean;
        observacoes: string;

    };
}

export default function AddBookingModal({ bookingDataChange, isEdit = false, bookingData }: AddBookingModalProps) {
    // Form states
    const [anfitriaoOptions, setAnfitriaoOptions] = useState<Option[]>([]);
    const [hospedeOptions, setHospedeOptions] = useState<Option[]>([]);
    const [quartoOptions, setQuartoOptions] = useState<Option[]>([]);
    const [anfitriao, setAnfitriao] = useState('');
    const [hospede, setHospede] = useState('');
    const [quarto, setQuarto] = useState('');
    const [dataChegada, setDataChegada] = useState(bookingData?.data_chegada || new Date().toISOString());
    const [dataSaida, setDataSaida] = useState(bookingData?.data_saida || new Date().toISOString());
    const [almoco, setAlmoco] = useState(false);
    const [janta, setJanta] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [bookingId, setBookingId] = useState('');
    const [roomData, setRoomData] = useState<any[]>([]);
    const [newHospedeName, setNewHospedeName] = useState('');
    
    useEffect(() => {
        if (bookingDataChange) {
            bookingDataChange({
                id: bookingId,
                anfitriao_id: anfitriao,
                hospede_id: hospede,
                novo_hospede_nome: newHospedeName,
                data_chegada: dataChegada,
                data_saida: dataSaida,
                quarto_id: quarto,
                almoco: almoco,
                janta: janta,
                observacoes: observacoes,
            });
        }
    }, [anfitriao, hospede, quarto, dataChegada, dataSaida, almoco, janta, observacoes, bookingDataChange]);

    const fetchUserAnfitriaoIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const users = result.data.map((user: { user_id: string; nome_completo: string }) => ({
                key: user.user_id,
                value: user.nome_completo
            }));
            users.sort((a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value));
            setAnfitriaoOptions(users);
        }
    }

    const fetchHospedesIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/guests');
        if (result.success) {

            const hospedes = result.data.map((guest: any) => ({
                key: guest.id,
                value: guest.nome
            }));

            setHospedeOptions(hospedes);
        }
    }

    const fetchQuartosIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/room-occupation');

        if (result.success) {
            setRoomData(result.data);
            defineRoomOptions(result.data);
        }
    }

    const defineRoomOptions = async (rooms: any[]) => {
        const roomsOptions = rooms.map((room: any) => {

            const arrival = dataChegada.split('T')[0];
            const departure = dataSaida.split('T')[0];

            const overlapCount = room.ocupacoes.filter((ocupacao: any) => {
                return (arrival <= ocupacao.data_saida && departure >= ocupacao.data_chegada)
                ||
                    (arrival >= ocupacao.data_chegada && departure <= ocupacao.data_saida);
            }).length;

            const isOccupied = overlapCount >= room.capacidade;

            return {
                key: room.quarto_id,
                value: `${room.numero} - (${overlapCount}/${room.capacidade})`,
                warningOnRight: isOccupied ? 'Ocupado neste período' : ''
            }
        });

        roomsOptions.sort((a: { value: string }, b: { value: string }) => a.value.localeCompare(b.value));
        setQuartoOptions(roomsOptions);
    }

    useEffect(() => {
        if (roomData) {
            defineRoomOptions(roomData);
        }
    }, [dataChegada, dataSaida]);


    useEffect(() => {
        fetchUserAnfitriaoIdAndNames();
        fetchHospedesIdAndNames();
        fetchQuartosIdAndNames();
    }, []);

    useEffect(() => {
        if (bookingData && bookingData.id && isEdit) {
            setAnfitriao(bookingData.anfitriao_id || '');
            setHospede(bookingData.hospede_id || '');
            setQuarto(bookingData.quarto_id || '');
            setDataChegada(bookingData.data_chegada || '');
            setDataSaida(bookingData.data_saida || '');
            setAlmoco(bookingData.almoco || false);
            setJanta(bookingData.janta || false);
            setObservacoes(bookingData.observacoes || '');
            setBookingId(bookingData.id || '');
        }
    }, [bookingData, isEdit]);

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {/* Anfitrião */}
                <div className={styles.inputGroup}>
                    <InputTextSearch
                        label="*Anfitrião"
                        value={anfitriaoOptions.find((option) => option.key === anfitriao)?.value || ''}
                        onSelect={(option: Option) => setAnfitriao(option.key)}
                        searchOptions={anfitriaoOptions}
                        placeholder="Selecione"
                    />

                    <div className={styles.inputGroupHospede}>
                        {
                            isEdit ? (
                                <InputTextSearch
                                label="*Nome do hóspede"
                                value={hospedeOptions.find((option) => option.key === hospede)?.value || ''}
                                onSelect={(option: Option) => setHospede(option.key)}
                                searchOptions={hospedeOptions}
                                placeholder="Selecione"
                            />
                            ) : (
                                <InputTextSearch
                                hasCreate={true}
                                handleClickCreate={(value: string) => {
                                    setNewHospedeName(value);
                                }}
                                label="*Nome do hóspede"
                                value={hospedeOptions.find((option) => option.key === hospede)?.value || ''}
                                onSelect={(option: Option) => setHospede(option.key)}
                                searchOptions={hospedeOptions}
                                placeholder="Selecione"
                            />
                            )
                        }

                    </div>

                    <SimpleDateSelect
                        label="*Data de chegada"
                        cantBeBeforeToday={true}
                        selectedDate={dataChegada ? new Date(dataChegada.split('T')[0] + 'T00:00:00') : new Date()}
                        onDateChange={(date) => setDataChegada(date?.toISOString())}
                    />

                    <SimpleDateSelect
                        label="*Data de saída"
                        cantBeBeforeToday={true}
                        selectedDate={dataSaida ? new Date(dataSaida.split('T')[0] + 'T00:00:00') : new Date()}
                        onDateChange={(date) => setDataSaida(date?.toISOString())}
                    />

                    <InputTextSearch
                        label="*Quarto - (capacidade)"
                        value={
                            quartoOptions.find((option) => option.key === quarto)?.value || ''
                        }
                        onSelect={(option: Option) => setQuarto(option.key)}
                        searchOptions={quartoOptions}
                        placeholder="Selecione"
                    />


                {/* MEALS Section */}

                <div className={styles.mealSection}>
                <span className={styles.mealSectionTitle}>*Incluir refeições?</span>

                    {/* Almoço Section */}
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (11h - 14h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {almoco ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${almoco ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setAlmoco(!almoco)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    {/* Jantar Section */}
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Jantar (17h - 20h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {janta ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${janta ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setJanta(!janta)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>
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
