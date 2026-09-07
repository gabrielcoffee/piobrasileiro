# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [Unreleased]

### Added

- Comunicados page (`/admin/comunicados`, new "Comunicados" item in the admin
  menu). Admin picks an e-mail type (Aviso with free subject + message,
  Lembrete de refeições, Boas-vindas), the recipients (all active users or a
  selection from the users table), previews the rendered e-mail and sends it
  after a confirmation modal. A second card lists the send history with a
  per-recipient detail modal. Backend: `POST /admin/emails/preview`,
  `POST /admin/emails/send`, `GET /admin/emails/history`.
- `InputTextBox` accepts `maxLength` (default stays 250); `Modal` accepts
  `wide` for a larger desktop panel.

- Search input by nome on the Solicitações page (`/admin/solicitacoes`),
  desktop and mobile. Reuses the shared `SearchSection` + `Table` `searchKey`
  pattern (accent + case-insensitive substring match), same as Hóspedes.
