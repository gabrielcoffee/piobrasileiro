'use client'

import React, { useEffect, useState } from 'react';
import styles from './styles/AddUserMealModal.module.css';
import { queryApi } from '@/lib/utils';
import { InputTextSearch } from '../ui/InputTextSearch';
import { SimpleDateSelect } from './SimpleDateSelect';


type Option = {
    key: string;
    value: string;
}

interface AddUserMealModalProps {
    formData?: (formData: {
        usuario_id: string;
        data: string;
        almoco_colegio: boolean;
        almoco_levar: boolean;
        janta_colegio: boolean;
    }) => void;
    isEdit?: boolean;
    userMealData?: any;
    date?: string;
}

export default function AddUserMealModal({ formData, isEdit = false, userMealData = null, date = '' }: AddUserMealModalProps) {
    // Form states
    const [userOptions, setUserOptions] = useState<Option[]>([]);
    const [user, setUser] = useState('');
    const [data, setData] = useState(date);
    const [almoco_colegio, setAlmocoColegio] = useState(false);
    const [almoco_levar, setAlmocoLevar] = useState(false);
    const [janta_colegio, setJantaColegio] = useState(false);
    const [mealId, setMealId] = useState('');

    useEffect(() => {
        formData && formData({
            usuario_id: user,
            data: data,
            almoco_colegio: almoco_colegio,
            almoco_levar: almoco_levar,
            janta_colegio: janta_colegio,
        });
    }, [user, data, almoco_colegio, almoco_levar, janta_colegio]);

    const fetchUserIdAndNames = async () => {
        const result = await queryApi('GET', '/admin/users');
        if (result.success) {
            const users = result.data.map((user: any) => ({
                key: user.user_id,
                value: user.nome_completo
            }));

            // Sort users by name
            users.sort((a: any, b: any) => a.value.localeCompare(b.value));

            setUserOptions(users);
        }
    }

    useEffect(() => {
        fetchUserIdAndNames();
    }, []);

    useEffect(() => {
        console.log('userMealData');
        console.log(userMealData);
        if (userMealData) {
            setUser(userMealData.usuario_id);
            setData(userMealData.data);
            setAlmocoColegio(userMealData.almoco_colegio);
            setAlmocoLevar(userMealData.almoco_levar);
            setJantaColegio(userMealData.janta_colegio);
            setMealId(userMealData.id);
        }
    }, [userMealData]);

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                {/* Anfitrião */}
                <div className={styles.inputGroup}>
                    <InputTextSearch
                        label="*Nome"
                        value={userOptions.find((option) => option.key === user)?.value || ''}
                        onSelect={(option: Option) => setUser(option.key)}
                        searchOptions={userOptions}
                        placeholder="Selecione um usuário"
                        disabled={isEdit}
                        style={{ opacity: isEdit ? 0.5 : 1 }}
                    />

                    <SimpleDateSelect
                        selectedDate={new Date(date) || undefined}
                        onDateChange={(date) => setData(date?.toISOString())}
                        disabled={isEdit}
                    />
                </div>

                {/* Almoço Section */}
                <div className={styles.mealSection}>
                    <div className={styles.mealHeader}>
                        <h3 className={styles.mealTitle}>Almoço (11h - 14h)</h3>
                        <div className={styles.toggleContainer}>
                            <span className={styles.toggleText}>
                                {almoco_colegio ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${almoco_colegio ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setAlmocoColegio(!almoco_colegio)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!almoco_colegio ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="school"
                                checked={!almoco_levar}
                                onChange={() => setAlmocoLevar(false)}
                                disabled={!almoco_colegio}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>

                        <label className={`${styles.radioOption} ${!almoco_colegio ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="lunch"
                                value="takeaway"
                                checked={almoco_levar}
                                onChange={() => setAlmocoLevar(true)}
                                disabled={!almoco_colegio}
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
                                {janta_colegio ? 'SIM' : 'NÃO'}
                            </span>
                            <button
                                className={`${styles.toggle} ${janta_colegio ? styles.toggleOn : styles.toggleOff}`}
                                onClick={() => setJantaColegio(!janta_colegio)}
                            >
                                <div className={styles.toggleCircle} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.optionsContainer}>
                        <label className={`${styles.radioOption} ${!janta_colegio ? styles.disabled : ''}`}>
                            <input
                                type="radio"
                                name="dinner"
                                value="school"
                                defaultChecked={true}
                                disabled={!janta_colegio}
                                className={styles.radioInput}
                            />
                            <span className={styles.radioCircle} />
                            <span className={styles.radioLabel}>No Colégio PIO</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
