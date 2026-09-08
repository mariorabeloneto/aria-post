# Schema Airtable — Leads_ARIA

**Base ID:** `appzFXTQP9Rki4rMF`  
**Tabela:** `Leads_ARIA`  
**Table ID:** `tblnsFNCKnYdpAFwq`

---

## Campos

| Nome | Field ID | Tipo | Notas |
|------|----------|------|-------|
| nome | `fldDxkA5WHm7ayQfC` | singleLineText | Nome da empresa |
| setor | `fldAubDvGgiQnPvGG` | singleLineText | Setor de actividade |
| localizacao | `fldvIkHlMqKdQkHsl` | singleLineText | Cidade, Região |
| score | `fldoLOWqmX8qWA6OC` | number | 1–10 |
| score_label | `fldJIZVwUJ9AQsa2I` | singleSelect | HOT / WARM / COLD |
| diagnostico | `fldWmpiCSI54iD70i` | multilineText | Lacunas digitais identificadas |
| oportunidades | `flduPpndSnTqpZ5HY` | multipleSelects | Ver valores válidos abaixo |
| abertura_whatsapp | `fldYe0pyop8tTcz6A` | multilineText | Mensagem de abertura WA |
| abertura_email | `fld7MZ4k8DDD3gJJi` | multilineText | Email completo (assunto + corpo) |
| email_subject | `fldUOVS6KFLEH5j3E` | singleLineText | Assunto do email |
| email_body | `fldYUYG51WOvXlbCL` | multilineText | Corpo do email (sem saudação/assinatura) |
| telefone | `fldvbi4ZvCjfBSSuU` | phoneNumber | |
| website | `fldNwl19KJZPFrvRV` | url | |
| instagram | `fldOWQqUhN0gO1C9O` | singleLineText | @handle |
| facebook | `fld61CuGDkI63JRNh` | url | |
| google_maps | `fldXQ9Qj9NNSXyeX9` | url | |
| email | `fldx0MZk1YAS9zFNd` | email | |
| pesquisa_origem | `fldSmXIpGnNtbqrFH` | singleLineText | Query original usada na pesquisa |
| data_captura | `fldkjPyOQi0clXp8C` | dateTime | ISO 8601, timezone Europe/Lisbon |
| estado | `flde8K2X5X3g2vesA` | singleSelect | Ver pipeline abaixo |

---

## Valores válidos — oportunidades

```
"Meta Ads"
"Google Ads"
"Google My Business"
"Gestão de Redes Sociais"
"Website"
"Modelos IA Voxel"
```

## Valores válidos — score_label

```
"HOT"   → score 8–10
"WARM"  → score 5–7
"COLD"  → score 1–4
```

## Valores válidos — estado (pipeline)

```
"Novo"
"Contactado"
"Em Negociação"
"Cliente"
"Descartado"
```

---

## Exemplo de record (JSON para API)

```json
{
  "fields": {
    "fldDxkA5WHm7ayQfC": "Guarda Roupa",
    "fldAubDvGgiQnPvGG": "Moda Feminina",
    "fldvIkHlMqKdQkHsl": "Vila Nova de Gaia",
    "fldoLOWqmX8qWA6OC": 8,
    "fldJIZVwUJ9AQsa2I": "HOT",
    "fldWmpiCSI54iD70i": "Facebook com 2.643 seguidoras mas apenas 1 interação — página abandonada. Sem website, Instagram ou Google My Business.",
    "flduPpndSnTqpZ5HY": ["Meta Ads", "Gestão de Redes Sociais", "Google My Business", "Modelos IA Voxel"],
    "fldYe0pyop8tTcz6A": "Olá! Vi a página do Guarda Roupa no Facebook — têm 2.600 seguidoras mas quase zero interação...",
    "fld7MZ4k8DDD3gJJi": "Assunto: ...\n\nCorpo: ...",
    "fld61CuGDkI63JRNh": "https://www.facebook.com/guardaroupa.pt",
    "fldSmXIpGnNtbqrFH": "lojas de roupa em gaia sem presença digital",
    "fldkjPyOQi0clXp8C": "2026-04-22T00:00:00.000Z",
    "flde8K2X5X3g2vesA": "Novo"
  },
  "typecast": true
}
```
