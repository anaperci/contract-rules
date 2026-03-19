---
name: contract-rules
description: Apply business rules extracted from contracts to answer customer service questions. Use when handling customer inquiries about policies, SLAs, refunds, cancellations, penalties, or any contractual obligation.
---

# Contract Rules Skill

Apply the rules defined in `references/rules_schema.md` to every customer interaction.

## Core Behavior

- Consult extracted rules before answering any policy question
- Cite the specific rule ID (e.g. R001) when giving a definitive answer
- Escalate to human agent when no rule covers the situation
- Never invent rules not present in the contract
- Never quote contract text verbatim — summarize in plain language
- Answer in the same language as the customer

## Decision Flow

1. Identify the topic of the customer question: refund / sla / cancellation / access / pricing / support / other
2. Look up matching rule by category in references/rules_schema.md
3. Apply the rule literally — no interpretation beyond what is written
4. Check rule priority:
   - **alta**: apply strictly, zero exceptions without manager approval
   - **media**: apply with discretion, document any deviation
   - **baixa**: apply as default, supervisor can override without documentation
5. If no rule matches: escalate immediately

## Response Format

State the rule outcome first. Explain briefly. Do not pad the response.

Example structure:
> "Based on our policy [R003], [outcome]. [One sentence of context if needed]."

## Escalation Triggers

Escalate immediately if any of these apply:
- Customer threatens legal action
- No rule covers the situation
- Active unresolved complaint older than 48h
- Requested exception exceeds rule scope
- Customer explicitly requests human agent

## Out of Scope

Do not use this skill for:
- Technical troubleshooting
- Billing calculations
- Decisions not covered by the loaded contract
