import { AlarmClock, KeyRound, Megaphone } from 'lucide-react';

export type EmailType = 'aviso' | 'lembrete' | 'boas_vindas';

export const SUBJECT_MAX = 120;
export const MESSAGE_MAX = 2000;

export interface EmailTypeSpec {
    id: EmailType;
    title: string;
    description: string;
    icon: typeof Megaphone;
    /** Set when the type can never go to "todos os usuários". */
    selectOnly?: boolean;
    /** Extra warning shown in the confirm modal. */
    warning?: string;
}

export const EMAIL_TYPES: EmailTypeSpec[] = [
    {
        id: 'aviso',
        title: 'Aviso',
        description: 'Escreva um assunto e uma mensagem livre. Ideal para comunicados gerais.',
        icon: Megaphone,
    },
    {
        id: 'lembrete',
        title: 'Lembrete de refeições',
        description: 'O mesmo lembrete enviado aos domingos: agendar as refeições da semana até às 19h.',
        icon: AlarmClock,
    },
    {
        id: 'boas_vindas',
        title: 'Boas-vindas',
        description: 'Credenciais de acesso com a senha padrão. Apenas para usuários selecionados.',
        icon: KeyRound,
        selectOnly: true,
        warning: 'Este e-mail contém a senha padrão de acesso. Envie apenas para usuários recém-cadastrados que ainda não entraram no sistema.',
    },
];

export const EMAIL_TYPE_LABEL: Record<EmailType, string> = {
    aviso: 'Aviso',
    lembrete: 'Lembrete de refeições',
    boas_vindas: 'Boas-vindas',
};
