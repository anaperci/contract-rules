# Exemplos de Respostas

Guia prático com 5 cenários reais mostrando como aplicar as regras extraídas.

---

## Exemplo 1 — Regra alta (sem exceção)

**Pergunta do cliente:**
> "Quero cancelar e pedir reembolso, comprei há 5 dias."

**Regra aplicável:** [R002] — refund · alta
- Reembolso integral garantido em até 7 dias corridos após a compra.

**Resposta do agente:**
"De acordo com nossa política [R002], você tem direito ao reembolso integral, pois a solicitação está dentro do prazo de 7 dias corridos. Vou iniciar o processo agora — o valor será devolvido ao método de pagamento original em até 5 dias úteis."

---

## Exemplo 2 — Regra média (com exceção documentada)

**Pergunta do cliente:**
> "Vocês prometeram responder em 4h e já faz 6h sem nenhuma resposta."

**Regra aplicável:** [R005] — sla · media
- Primeiro atendimento em até 4 horas úteis para chamados de prioridade média.

**Resposta do agente:**
"Você tem razão. Conforme nossa política [R005], o prazo de primeira resposta para chamados de prioridade média é de 4 horas úteis, e esse prazo foi excedido. Peço desculpas pelo atraso. Estou priorizando seu chamado agora e registrando a ocorrência para que o desvio seja documentado internamente. Posso ajudá-lo com sua questão?"

---

## Exemplo 3 — Escalação por ausência de cobertura

**Pergunta do cliente:**
> "Posso transferir meu contrato para outra pessoa?"

**Regra aplicável:** Nenhuma regra cobre transferência de titularidade.

**Resposta do agente:**
"Essa é uma boa pergunta. No entanto, nossa política atual não possui uma regra específica sobre transferência de titularidade de contrato. Vou encaminhar sua solicitação para um especialista que poderá analisar seu caso diretamente. Você receberá um retorno em até 24 horas."

---

## Exemplo 4 — SLA com prazo exato

**Pergunta do cliente:**
> "Qual o prazo para vocês resolverem meu chamado crítico?"

**Regra aplicável:** [R007] — sla · alta
- Chamados críticos (P1) devem ser resolvidos em até 4 horas úteis. Equipe de plantão acionada automaticamente.

**Resposta do agente:**
"Conforme nossa política [R007], chamados críticos (P1) têm prazo de resolução de 4 horas úteis. A equipe de plantão já foi acionada automaticamente quando seu chamado foi classificado como crítico. Caso o prazo seja excedido, medidas compensatórias previstas em contrato são aplicadas automaticamente."

---

## Exemplo 5 — Cancelamento com multa rescisória

**Pergunta do cliente:**
> "Quero cancelar o contrato agora, ainda tenho 3 meses pela frente."

**Regra aplicável:** [R010] — cancellation · alta
- Cancelamento antecipado incide multa de 30% sobre o valor restante do contrato. Aviso prévio de 30 dias obrigatório.

**Resposta do agente:**
"Entendido. De acordo com nossa política [R010], o cancelamento antecipado requer aviso prévio de 30 dias e incide multa de 30% sobre o valor restante do contrato. No seu caso, com 3 meses restantes, a multa seria calculada sobre esses 3 meses. Deseja que eu calcule o valor exato e formalize a solicitação, ou prefere discutir alternativas antes?"
