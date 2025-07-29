# PIO Brasileiro

Sistema de gerenciamento de refeições para o Colégio PIO, desenvolvido para facilitar o agendamento e controle de refeições dos alunos e funcionários.

## Sobre o Projeto

O PIO Brasileiro é uma aplicação web moderna que permite aos usuários:
- Agendar refeições (almoço e jantar) para diferentes dias da semana
- Gerenciar perfis de usuário
- Visualizar notificações sobre prazos de agendamento
- Selecionar opções de refeição (no colégio ou para levar)
- Adicionar convidados às refeições

## Tecnologias Utilizadas

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança do código
- **React** - Biblioteca para construção de interfaces
- **CSS Modules** - Estilização modular e escopada
- **Lucide React** - Biblioteca de ícones

### Desenvolvimento
- **ESLint** - Linting e formatação de código
- **PostCSS** - Processamento de CSS

### Estrutura do Projeto
```
src/
├── app/                 # Páginas da aplicação (App Router)
├── components/          # Componentes reutilizáveis
│   ├── home/           # Componentes da página inicial
│   ├── refeicoes/      # Componentes de refeições
│   ├── profile/        # Componentes de perfil
│   └── ui/             # Componentes de interface
└── lib/                # Utilitários e configurações
```

## Funcionalidades Principais

### Sistema de Refeições
- Agendamento de almoço e jantar
- Seleção de local (Colégio PIO ou para levar)
- Adição de convidados
- Controle de prazos de agendamento

### Perfil do Usuário
- Visualização e edição de informações pessoais
- Upload de foto de perfil
- Alteração de senha

### Notificações
- Sistema de notificações em tempo real
- Alertas sobre prazos de agendamento
- Histórico de notificações

## Estrutura de Componentes

O projeto utiliza uma arquitetura modular com componentes reutilizáveis:

- **Header** - Cabeçalho com navegação e notificações
- **Footer** - Rodapé com menu de navegação
- **MealCard** - Card para agendamento de refeições
- **ImageSelector** - Seletor de imagem de perfil
- **NotificationMenu** - Menu de notificações

## Variáveis CSS Globais

O projeto utiliza um sistema de design consistente com variáveis CSS globais para cores, espaçamentos e bordas, garantindo uniformidade visual em toda a aplicação.
