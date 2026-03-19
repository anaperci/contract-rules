# contract-rules

Skill para Claude Code que transforma contratos e documentos de regras de negócio em instruções estruturadas que agentes de IA aplicam em centrais de atendimento.

Segue o padrão Agent Skills (`SKILL.md`) compatível com Claude Code, Cursor, Windsurf e outros.

## Instalação

```bash
# Clonar ou copiar a pasta
cp -r contract-rules ~/.claude/skills/

# Instalar dependência do script
pip install anthropic
```

## Como usar — extrair regras de um contrato

```bash
# Básico
python scripts/extract_rules.py --input meu_contrato.txt

# Com opções
python scripts/extract_rules.py \
  --input contrato_sla.txt \
  --company "NexIA Lab" \
  --type suporte

# Ver ajuda
python scripts/extract_rules.py --help
```

## Como usar — no Claude Code

```
# Invocação manual
/contract-rules

# O Claude também carrega automaticamente quando detecta perguntas
# sobre políticas, reembolsos, SLA ou regras contratuais
```

## Atualizar as regras (novo contrato)

```bash
# Substituir o contrato e rodar novamente
python scripts/extract_rules.py --input novo_contrato.txt --company "Empresa"
# O arquivo references/rules_schema.md é sobrescrito automaticamente
```

## Estrutura dos arquivos

```
contract-rules/
├── SKILL.md                        # Definição da skill (lida pelo Claude)
├── scripts/
│   └── extract_rules.py            # Script de extração via Claude API
├── references/
│   ├── rules_schema.md             # Regras extraídas (auto-gerado)
│   ├── priority_guide.md           # Guia de classificação de prioridade
│   └── response_examples.md        # Exemplos de respostas usando regras
├── assets/
│   └── skill_template.md           # Template para skills derivadas
└── README.md                       # Este arquivo
```

| Arquivo | Função |
|---------|--------|
| `SKILL.md` | Instruções que o Claude carrega automaticamente. Define comportamento, fluxo de decisão e gatilhos de escalação. |
| `scripts/extract_rules.py` | Lê um contrato, chama a API do Claude para extrair regras estruturadas e salva em `rules_schema.md`. |
| `references/rules_schema.md` | Arquivo auto-gerado com todas as regras extraídas. Consultado pelo agente em cada interação. |
| `references/priority_guide.md` | Guia para revisão manual de prioridades (alta/média/baixa). |
| `references/response_examples.md` | 5 exemplos completos de pergunta/resposta aplicando regras. |
| `assets/skill_template.md` | Template para criar skills derivadas para outros contratos. |

## Variáveis de ambiente

```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

## Compatibilidade

| Ferramenta | Suporte |
|------------|---------|
| Claude Code | `SKILL.md` carregado automaticamente |
| Cursor | Copiar conteúdo para `.cursorrules` ou `.mdc` |
| Windsurf | Copiar conteúdo para `.windsurfrules` |
| Codex CLI | Referenciar `SKILL.md` no prompt |
| Gemini CLI | Referenciar `SKILL.md` no prompt |

## Licença

MIT
