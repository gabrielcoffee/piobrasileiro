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


interface AddHospedeModalProps {
    setHospedeData: (data: any) => void;
    hospedeData?: any;
    isEdit?: boolean;
}


export default function AddHospedeModal({ setHospedeData, hospedeData, isEdit = false }: AddHospedeModalProps) {

    const [id, setId] = useState(hospedeData?.id || '');
    const [nome, setNome] = useState(hospedeData?.nome || '');
    const [genero, setGenero] = useState(hospedeData?.genero || '');
    const [tipoDocumento, setTipoDocumento] = useState(hospedeData?.tipoDocumento || '');
    const [numDocumento, setNumDocumento] = useState(hospedeData?.numDocumento || '');
    const [funcao, setFuncao] = useState(hospedeData?.funcao || '');
    const [origem, setOrigem] = useState(hospedeData?.origem || '');
    const [observacoes, setObservacoes] = useState(hospedeData?.observacoes || '');

    const generoOptions = [
        { key: "m", value: "Masculino" },
        { key: "f", value: "Feminino" },
        { key: "o", value: "Outro" }
    ]

    const documentoOptions = [
        { key: "cpf", value: "CPF" },
        { key: "id_internacional", value: "ID Internacional" },
    ]

    // Atualiza os dados do hospede quando o usuário preenche o formulário
    // e envia para o componente pai
    useEffect(() => {
        if (setHospedeData) {
            setHospedeData({ id, nome, genero, tipoDocumento, numDocumento, funcao, origem, observacoes });
        }
    }, [id, nome, genero, tipoDocumento, numDocumento, funcao, origem, observacoes, setHospedeData]);

    // Carrega os dados do hospede quando o modal é aberto
    // e o usuário clica no botão de editar
    useEffect(() => {
        if (hospedeData && isEdit) {
            console.log(hospedeData)
            setId(hospedeData.id || '');
            setNome(hospedeData.nome || '');
            setGenero(hospedeData.genero || '');
            setTipoDocumento(hospedeData.tipo_documento || '');
            setNumDocumento(hospedeData.num_documento || '');
            setFuncao(hospedeData.funcao || '');
            setOrigem(hospedeData.origem || '');
            setObservacoes(hospedeData.observacoes || '');
        }
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
            
                <InputText
                    label="*Nome"
                    placeholder="Informe o nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />  

                <InputTextSearch
                    label="*Gênero"
                    placeholder="Selecione"
                    value={generoOptions.find(option => option.key == genero)?.value || ''}
                    onSelect={(e) => setGenero(e.key)}
                    searchOptions={generoOptions}
                />

                <InputTextSearch
                    label="*Tipo de documento"
                    placeholder="Selecione"
                    value={documentoOptions.find(option => option.key == tipoDocumento)?.value || ''}
                    onSelect={(e) => setTipoDocumento(e.key)}
                    searchOptions={documentoOptions}
                />

                <InputText
                    label="*Número do documento"
                    placeholder="Informe o número do documento"
                    disabled={!tipoDocumento}
                    value={numDocumento.length > 11 ? numDocumento.slice(0, 11) : numDocumento}
                    onChange={(e) => setNumDocumento(e.target.value.length > 11 ? e.target.value.slice(0, 11) : e.target.value)}
                />

                <InputText
                    label="*Função"
                    placeholder="Informe a função ou grau de parentesco"
                    value={funcao}
                    onChange={(e) => setFuncao(e.target.value)}
                />

                <InputText
                    label="*Origem"
                    placeholder="De onde vem?"
                    value={origem}
                    onChange={(e) => setOrigem(e.target.value)}
                />

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
