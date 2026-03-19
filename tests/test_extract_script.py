"""Tests for the CLI extract_rules.py script."""

import subprocess
import sys


def test_help_flag():
    result = subprocess.run(
        [sys.executable, "scripts/extract_rules.py", "--help"],
        capture_output=True, text=True,
        cwd="/Users/anapaulaperci/.claude/skills/contract-rules",
    )
    assert result.returncode == 0
    assert "--input" in result.stdout
    assert "--company" in result.stdout
    assert "--type" in result.stdout


def test_missing_input_file():
    result = subprocess.run(
        [sys.executable, "scripts/extract_rules.py", "--input", "/tmp/nonexistent_contract.txt"],
        capture_output=True, text=True,
        cwd="/Users/anapaulaperci/.claude/skills/contract-rules",
    )
    assert result.returncode == 1
    assert "not found" in result.stderr.lower() or "not found" in result.stdout.lower()


def test_missing_api_key(tmp_path):
    contract = tmp_path / "test_contract.txt"
    contract.write_text("This is a test contract with SLA terms.")

    result = subprocess.run(
        [sys.executable, "scripts/extract_rules.py", "--input", str(contract)],
        capture_output=True, text=True,
        env={"PATH": "/usr/bin:/bin", "HOME": str(tmp_path)},
        cwd="/Users/anapaulaperci/.claude/skills/contract-rules",
    )
    assert result.returncode == 1
    assert "ANTHROPIC_API_KEY" in result.stdout or "ANTHROPIC_API_KEY" in result.stderr
