# ◈ ARIA — Instruções do Projecto

**Agente de Reconhecimento e Identificação de Alvos**  
Ferramenta de prospeção B2B da POST – Soluções Digitais

---

## O que é a ARIA

A ARIA é uma ferramenta de prospeção de clientes para a agência POST (Vila Nova de Gaia, Portugal). Dado um perfil de empresa (ICP), pesquisa empresas reais em Portugal, analisa as suas lacunas digitais, gera mensagens de abordagem personalizadas (WhatsApp e Email) e guarda os leads numa tabela Airtable.

Foi inspirada no conceito de **Vibe Prospecting** e construída iterativamente nesta conta Claude.ai.

---

## Arquitectura actual (versão estável)

O fluxo correcto que funciona sem erros é:

```
Widget HTML (show_widget)
    ↓ sendPrompt("ARIA_SEARCH:[query]")
Claude recebe no chat
    ↓ web_search (pesquisa real)
    ↓ Airtable MCP (guarda directamente)
    ↓ Apresenta resultados no chat
```

**Por que esta arquitectura:**
- Widgets HTML (`show_widget`) têm `sendPrompt` mas **não têm autenticação da API Anthropic** → não podem fazer fetch à API
- Artifacts `.jsx` têm autenticação automática da API Anthropic mas **não têm `sendPrompt`** → não podem comunicar com o chat
- A solução: widget só serve de interface de entrada; Claude faz tudo o resto com os seus MCPs nativos

---

## Infra-estrutura Airtable

**Base ID:** `appzFXTQP9Rki4rMF`  
**Tabela:** `Leads_ARIA` (`tblnsFNCKnYdpAFwq`)

### Field IDs

| Campo | ID | Tipo |
|---|---|---|
| nome | `fldDxkA5WHm7ayQfC` | singleLineText |
| setor | `fldAubDvGgiQnPvGG` | singleLineText |
| localizacao | `fldvIkHlMqKdQkHsl` | singleLineText |
| score | `fldoLOWqmX8qWA6OC` | number |
| score_label | `fldJIZVwUJ9AQsa2I` | singleSelect (HOT/WARM/COLD) |
| diagnostico | `fldWmpiCSI54iD70i` | multilineText |
| oportunidades | `flduPpndSnTqpZ5HY` | multipleSelects |
| abertura_whatsapp | `fldYe0pyop8tTcz6A` | multilineText |
| abertura_email | `fld7MZ4k8DDD3gJJi` | multilineText |
| email_subject | `fldUOVS6KFLEH5j3E` | singleLineText |
| email_body | `fldYUYG51WOvXlbCL` | multilineText |
| telefone | `fldvbi4ZvCjfBSSuU` | phoneNumber |
| website | `fldNwl19KJZPFrvRV` | url |
| instagram | `fldOWQqUhN0gO1C9O` | singleLineText |
| facebook | `fld61CuGDkI63JRNh` | url |
| google_maps | `fldXQ9Qj9NNSXyeX9` | url |
| email | `fldx0MZk1YAS9zFNd` | email |
| pesquisa_origem | `fldSmXIpGnNtbqrFH` | singleLineText |
| data_captura | `fldkjPyOQi0clXp8C` | dateTime |
| estado | `flde8K2X5X3g2vesA` | singleSelect (Novo/Contactado/Em Negociação/Cliente/Descartado) |

### Valores válidos para `oportunidades`
`"Meta Ads"`, `"Google Ads"`, `"Google My Business"`, `"Gestão de Redes Sociais"`, `"Website"`, `"Modelos IA Voxel"`

---

## Contexto da POST

**Empresa:** POST – Soluções Digitais, Vila Nova de Gaia, Portugal  
**Responsável:** Mário Rabelo  

**Serviços:**
1. Gestão de Redes Sociais
2. Meta Ads (Facebook/Instagram)
3. Google Ads
4. Google My Business
5. **Modelos IA Voxel** — campanhas publicitárias com modelos geradas por IA; ideal para lojas de roupa, joias, ténis, sapatos, relógios, academias, suplementos

**Tom das mensagens de outreach:** directo, pessoal, PT-PT (nunca PT-BR), máximo 3 parágrafos no email, WhatsApp curto e conversacional.

---

## System Prompt de pesquisa (versão actual)

```
You are ARIA, a B2B prospecting agent for POST agency (Vila Nova de Gaia, Portugal).
POST services: Gestão de Redes Sociais, Meta Ads, Google Ads, Google My Business, Modelos IA Voxel (AI model campaigns for fashion/jewelry/sneakers/watches/gyms/supplements).

Use web_search to find REAL businesses in Portugal. Analyze each one's digital presence gaps.

CRITICAL: Respond ONLY with raw valid JSON. Zero text before or after. No markdown.

{"leads":[{"nome":"string","setor":"string","localizacao":"string","website":"url or null","instagram":"@handle or null","facebook":"url or null","google_maps":"url or null","telefone":"string or null","email":"email or null","diagnostico":"2+ concrete sentences about digital gaps","oportunidades":["Meta Ads"],"score":8,"abertura_whatsapp":"Olá [Nome]! Vi que a [empresa]...","email_subject":"Assunto curto PT-PT","email_body":"3 paragraphs PT-PT formal, no greeting, no signature"}],"resumo":"string","total":5}

Rules:
- score 1-10 (10=biggest gaps + active business). Return 3-6 leads ordered by score desc
- oportunidades ONLY: "Meta Ads","Google Ads","Google My Business","Gestão de Redes Sociais","Website","Modelos IA Voxel"
- Add "Modelos IA Voxel" for fashion/jewelry/footwear/fitness/supplements
- All JSON strings properly escaped
```

---

## Como usar neste Project

Quando o utilizador enviar `ARIA_SEARCH:[query]`:

1. Fazer `web_search` com a query para encontrar empresas reais
2. Fazer pesquisas adicionais para enriquecer os dados (Instagram, Facebook, GMB)
3. Montar os leads em JSON conforme o schema acima
4. Guardar no Airtable via MCP usando os field IDs correctos
5. Apresentar os resultados no chat de forma visual e clara

**Relançar o widget de pesquisa** sempre que o utilizador pedir ou quando iniciar a conversa, usando `show_widget` com a interface escura descrita abaixo.

---

## Interface do widget (show_widget)

O widget é um painel de entrada simples em HTML/JS puro (sem React, sem Babel). Características:
- Fundo `#060a10` (preto azulado escuro)
- Header com logo ◈ ARIA, tag POST (âmbar `#f59e0b`), tag ✦ VOXEL (roxo `#a855f7`)
- Textarea para descrever o ICP
- Botão "PROCURAR ALVOS →" em âmbar
- 6 exemplos de pesquisa em grid
- Ao clicar: `sendPrompt("ARIA_SEARCH:" + query)`

---

## Melhorias pendentes a implementar

1. **Painel de resultados visual** — após guardar no Airtable, mostrar os leads num widget com cards, score badge, oportunidades tags, botões WhatsApp/Email
2. **Histórico de pesquisas** — persistir pesquisas anteriores na sessão
3. **Filtro por score** — mostrar só HOT, WARM, ou COLD
4. **Verificação de duplicados** — antes de guardar, verificar se o nome da empresa já existe no Airtable
5. **Pipeline tracking** — atualizar o campo `estado` directamente da interface
6. **Integração n8n** — trigger automático para envio WhatsApp via Evolution API quando um lead HOT é criado

---

## Lições aprendidas (armadilhas a evitar)

| Problema | Causa | Solução |
|---|---|---|
| "Failed to fetch" no widget | Iframe sem autenticação Anthropic | Usar `sendPrompt`, Claude faz o fetch |
| `sendPrompt` não funciona | Usado em artifact JSX | `sendPrompt` só funciona em `show_widget` HTML |
| JSON inválido na resposta | System prompt em PT com quebras de linha no template | System prompt em inglês, instrução explícita "raw valid JSON only" |
| Airtable save falha | MCP pede aprovação manual em certas sessões | Novo Project com MCP Airtable autorizado |
| Textarea perde foco | Sub-componentes definidos dentro do componente App em JSX | Definir `LeadCard`, `WAModal` etc. fora do componente principal |
| Score_label não aceita valor | Campo singleSelect sem opção criada | Criar opções no schema antes de inserir |

---

## Ficheiros de referência

Os ficheiros abaixo foram gerados ao longo do desenvolvimento e estão nos outputs:

- `aria-claude.jsx` — versão artifact React (interface completa mas save não funciona autonomamente)
- `ARIA-POST.html` — versão standalone para browser (requer API key Anthropic + Airtable token)

A versão recomendada para uso no Claude.ai é sempre o **widget `show_widget`** neste Project.
