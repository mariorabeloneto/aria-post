# ◈ ARIA — Agente de Reconhecimento e Identificação de Alvos

Ferramenta de prospeção B2B da **POST – Soluções Digitais** (Vila Nova de Gaia, Portugal).

Dado um perfil de empresa (ICP), a ARIA pesquisa empresas reais em Portugal, analisa lacunas digitais, gera mensagens de abordagem personalizadas (WhatsApp + Email) e guarda os leads automaticamente no Airtable.

---

## Como funciona

```
Utilizador descreve o ICP
    ↓
ARIA faz web_search e analisa presença digital
    ↓
Gera leads com score, diagnóstico e mensagens
    ↓
Guarda automaticamente no Airtable
```

---

## Serviços da POST

- Gestão de Redes Sociais
- Meta Ads (Facebook / Instagram)
- Google Ads
- Google My Business
- **Modelos IA Voxel** — campanhas com modelos geradas por IA (moda, joias, calçado, fitness, suplementos)

---

## Estrutura do repositório

```
aria-post/
├── README.md
├── .gitignore
├── docs/
│   ├── project-instructions.md   # Instruções completas para o Project Claude
│   └── airtable-schema.md        # Schema completo da tabela Leads_ARIA
├── src/
│   ├── widget/
│   │   └── aria-widget.html      # Widget para Claude.ai (recomendado)
│   ├── artifact/
│   │   └── aria-claude.jsx       # Artifact React para Claude.ai
│   └── standalone/
│       └── ARIA-POST.html        # Versão standalone (requer API keys)
└── CHANGELOG.md
```

---

## Versões disponíveis

### ✅ Widget Claude.ai (`src/widget/aria-widget.html`)
**Recomendada.** Corre dentro do Claude.ai sem API keys nem configurações.
- Interface de pesquisa envia query via `sendPrompt`
- Claude faz a pesquisa e guarda no Airtable via MCP nativo
- Zero configuração para o utilizador

### ⚡ Artifact React (`src/artifact/aria-claude.jsx`)
Interface completa com cards, modais WhatsApp/Email, histórico.
Requer que o utilizador cole o conteúdo no chat do Claude.ai como artifact.
- A pesquisa funciona automaticamente (autenticação do Claude.ai)
- O save usa sendPrompt → Claude guarda via MCP

### 🖥️ Standalone (`src/standalone/ARIA-POST.html`)
Versão independente para browser, sem Claude.ai.
Requer duas API keys configuradas uma vez (guardadas no localStorage):
- **Anthropic API Key** — para pesquisa web
- **Airtable Personal Access Token** — para guardar leads

---

## Airtable

**Base ID:** `appzFXTQP9Rki4rMF`  
**Tabela:** `Leads_ARIA` (`tblnsFNCKnYdpAFwq`)

Ver [`docs/airtable-schema.md`](docs/airtable-schema.md) para o schema completo.

---

## Score dos leads

| Score | Label | Critério |
|-------|-------|----------|
| 8–10 | 🔴 HOT | Grandes lacunas digitais + negócio claramente ativo |
| 5–7 | 🟡 WARM | Lacunas moderadas ou negócio menos claro |
| 1–4 | 🔵 COLD | Poucas lacunas ou negócio de difícil abordagem |

---

## Oportunidades detectadas

`Meta Ads` · `Google Ads` · `Google My Business` · `Gestão de Redes Sociais` · `Website` · `Modelos IA Voxel`

O tag **✦ VOXEL** aparece automaticamente em leads de moda, joias, calçado, fitness e suplementos.

---

## Pipeline no Airtable

`Novo` → `Contactado` → `Em Negociação` → `Cliente` · `Descartado`

---

## Desenvolvido com

- [Claude.ai](https://claude.ai) — pesquisa web + geração de leads
- [Airtable](https://airtable.com) — base de dados de leads
- [Anthropic API](https://anthropic.com) — modelo claude-sonnet-4-20250514

---

*POST – Soluções Digitais © 2026*
