#!/usr/bin/env python3
"""Extract business rules from contracts using Claude API.

Reads a contract file (.txt or .md) and extracts structured business rules
that AI agents can apply in customer service interactions.

Usage:
    python scripts/extract_rules.py --input contract.txt --company "Company" --type suporte
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

EXTRACTION_PROMPT = """You are a business rules extraction specialist. Analyze the provided contract or policy document and extract all business rules that a customer service AI agent must follow.

Return ONLY valid JSON with no markdown, no backticks, no preamble:
{
  "skill_name": "descriptive-kebab-case-name",
  "company": "company name or unknown",
  "central_type": "suporte|vendas|financeiro|saude|juridico|geral",
  "version": "1.0",
  "extracted_at": "ISO 8601 datetime",
  "summary": "One sentence describing what this skill covers",
  "rules": [
    {
      "id": "R001",
      "category": "refund|sla|cancellation|access|pricing|support|penalty|other",
      "rule": "Clear imperative statement. Start with a verb. Be specific.",
      "priority": "alta|media|baixa",
      "conditions": "Describe when this rule applies",
      "exceptions": "Known exceptions, or null if none"
    }
  ],
  "total_rules": 0
}

Priority classification:
- alta: legal deadlines, financial penalties, hard cutoffs, SLA breach consequences
- media: standard service terms, access tiers, response time targets
- baixa: preferred channels, soft recommendations, non-binding defaults"""


def parse_args():
    parser = argparse.ArgumentParser(
        description="Extract business rules from contracts using Claude API.",
        epilog="Example: python scripts/extract_rules.py --input contract.txt --company 'NexIA Lab' --type suporte",
    )
    parser.add_argument(
        "--input",
        required=True,
        help="Path to the contract file (.txt or .md)",
    )
    parser.add_argument(
        "--company",
        default=None,
        help="Company name (optional, auto-detected from contract if omitted)",
    )
    parser.add_argument(
        "--type",
        choices=["suporte", "vendas", "financeiro", "saude", "juridico", "geral"],
        default="geral",
        help="Type of service center (default: geral)",
    )
    return parser.parse_args()


def validate_env():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is not set.")
        print("Set it with: export ANTHROPIC_API_KEY=sk-ant-...")
        sys.exit(1)
    return api_key


def validate_input(input_path: str) -> str:
    path = Path(input_path)
    if not path.exists():
        print(f"Error: File not found: {input_path}")
        sys.exit(1)
    if not path.is_file():
        print(f"Error: Path is not a file: {input_path}")
        sys.exit(1)
    if path.suffix.lower() not in (".txt", ".md"):
        print(f"Warning: Expected .txt or .md file, got {path.suffix}. Proceeding anyway.")
    content = path.read_text(encoding="utf-8")
    if not content.strip():
        print(f"Error: File is empty: {input_path}")
        sys.exit(1)
    return content


def call_claude(api_key: str, contract_text: str, company: Optional[str], central_type: str) -> dict:
    try:
        import anthropic
    except ImportError:
        print("Error: 'anthropic' package is not installed.")
        print("Install it with: pip install anthropic")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    user_msg = f"Contract/policy document to analyze:\n\n{contract_text}"
    if company:
        user_msg += f"\n\nCompany name: {company}"
    user_msg += f"\nService center type: {central_type}"
    user_msg += f"\nCurrent datetime: {datetime.now(timezone.utc).isoformat()}"

    print("Calling Claude API to extract rules...")

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=8192,
        messages=[{"role": "user", "content": user_msg}],
        system=EXTRACTION_PROMPT,
    )

    raw = message.content[0].text.strip()

    # Remove markdown fences if the model wraps them
    if raw.startswith("```"):
        lines = raw.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        raw = "\n".join(lines)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"Error: Failed to parse API response as JSON: {e}")
        print(f"Raw response:\n{raw[:500]}")
        sys.exit(1)

    return data


def generate_rules_md(data: dict) -> str:
    lines = [
        f"# Rules Schema — {data.get('skill_name', 'unknown')}",
        "",
        f"**Company:** {data.get('company', 'unknown')}  ",
        f"**Type:** {data.get('central_type', 'geral')}  ",
        f"**Version:** {data.get('version', '1.0')}  ",
        f"**Extracted:** {data.get('extracted_at', 'unknown')}  ",
        f"**Summary:** {data.get('summary', '')}  ",
        f"**Total rules:** {data.get('total_rules', len(data.get('rules', [])))}",
        "",
        "---",
        "",
        "## Rules",
        "",
    ]

    for rule in data.get("rules", []):
        rid = rule.get("id", "R???")
        cat = rule.get("category", "other")
        prio = rule.get("priority", "media")
        lines.append(f"### [{rid}] — {cat} · {prio}")
        lines.append(f"**Rule:** {rule.get('rule', '')}")
        lines.append(f"**Conditions:** {rule.get('conditions', 'N/A')}")
        exceptions = rule.get("exceptions") or "None"
        lines.append(f"**Exceptions:** {exceptions}")
        lines.append("")

    return "\n".join(lines)


def print_summary(data: dict):
    rules = data.get("rules", [])
    alta = sum(1 for r in rules if r.get("priority") == "alta")
    media = sum(1 for r in rules if r.get("priority") == "media")
    baixa = sum(1 for r in rules if r.get("priority") == "baixa")

    print("")
    print("=" * 50)
    print(f"  Skill:    {data.get('skill_name', 'unknown')}")
    print(f"  Company:  {data.get('company', 'unknown')}")
    print(f"  Type:     {data.get('central_type', 'geral')}")
    print(f"  Total:    {len(rules)} rules")
    print(f"  Alta:     {alta}")
    print(f"  Media:    {media}")
    print(f"  Baixa:    {baixa}")
    print("=" * 50)
    print("")


def main():
    args = parse_args()
    api_key = validate_env()
    contract_text = validate_input(args.input)

    data = call_claude(api_key, contract_text, args.company, args.type)

    md_content = generate_rules_md(data)

    # Write to references/rules_schema.md relative to skill root
    script_dir = Path(__file__).resolve().parent
    skill_root = script_dir.parent
    output_path = skill_root / "references" / "rules_schema.md"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(md_content, encoding="utf-8")

    print(f"Rules saved to: {output_path}")
    print_summary(data)


if __name__ == "__main__":
    main()
