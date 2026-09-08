# Changelog — ARIA

## [1.0.0] — 2026-04-22

### Arquitectura
- Fluxo estável: Widget HTML → `sendPrompt` → Claude pesquisa + guarda via MCP Airtable

### Funcionalidades
- Pesquisa web de empresas reais em Portugal com análise de lacunas digitais
- Score 1–10 por lead (HOT / WARM / COLD)
- Diagnóstico de presença digital (website, Instagram, Facebook, GMB)
- Mensagem de abertura WhatsApp personalizada por empresa
- Mensagem de email com assunto e corpo (PT-PT formal)
- Tag automático **✦ VOXEL** para leads de moda, calçado, fitness, suplementos
- Oportunidades: Meta Ads, Google Ads, GMB, Redes Sociais, Website, Modelos IA Voxel
- Histórico de pesquisas na sessão
- Save automático no Airtable via MCP do Claude

### Infra Airtable
- Base `appzFXTQP9Rki4rMF`, tabela `Leads_ARIA`
- 20 campos incluindo email_subject, email_body, abertura_email
- Pipeline: Novo → Contactado → Em Negociação → Cliente / Descartado

### Lições aprendidas
- `sendPrompt` só funciona em widgets HTML (`show_widget`), não em artifacts `.jsx`
- Artifacts `.jsx` têm autenticação automática da API Anthropic mas sem `sendPrompt`
- MCP Airtable funciona nativamente do lado do Claude — não precisa de tokens no cliente
- System prompt em inglês produz JSON mais fiável do que em português
