"""Tests for rules CRUD and parsing."""

import pytest
from pathlib import Path
from unittest.mock import patch

SAMPLE_RULES_MD = """# Rules Schema — test-company-rules

**Company:** Test Corp
**Type:** suporte
**Version:** 1.0
**Extracted:** 2026-03-19T00:00:00Z
**Summary:** Test rules for unit testing
**Total rules:** 3

---

## Rules

### [R001] — refund · alta
**Rule:** Issue full refund within 7 calendar days of purchase
**Conditions:** Customer requests refund within 7 days
**Exceptions:** Digital products are non-refundable

### [R002] — sla · media
**Rule:** First response within 4 business hours for medium priority
**Conditions:** Ticket classified as medium priority
**Exceptions:** None

### [R003] — cancellation · baixa
**Rule:** Recommend self-service portal for cancellation requests
**Conditions:** Customer wants to cancel subscription
**Exceptions:** None
"""


@pytest.fixture
def populated_rules(tmp_path):
    """Write sample rules to a temp file and patch RULES_FILE."""
    rules_file = tmp_path / "rules_schema.md"
    rules_file.write_text(SAMPLE_RULES_MD, encoding="utf-8")
    return rules_file


@pytest.mark.anyio
async def test_get_rules_empty(client):
    resp = await client.get("/api/rules")
    assert resp.status_code == 200
    data = resp.json()
    assert "rules" in data
    assert "total" in data


@pytest.mark.anyio
async def test_get_rules_populated(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.get("/api/rules")
        data = resp.json()
        assert data["populated"] is True
        assert data["total"] == 3
        assert data["rules"][0]["id"] == "R001"
        assert data["rules"][0]["priority"] == "alta"
        assert data["rules"][0]["category"] == "refund"


@pytest.mark.anyio
async def test_get_rules_filter_by_priority(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.get("/api/rules?priority=alta")
        data = resp.json()
        assert data["total"] == 1
        assert data["rules"][0]["id"] == "R001"


@pytest.mark.anyio
async def test_get_rules_filter_by_category(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.get("/api/rules?category=sla")
        data = resp.json()
        assert data["total"] == 1
        assert data["rules"][0]["id"] == "R002"


@pytest.mark.anyio
async def test_stats_with_populated_rules(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.get("/api/stats")
        data = resp.json()
        assert data["populated"] is True
        assert data["total_rules"] == 3
        assert data["by_priority"]["alta"] == 1
        assert data["by_priority"]["media"] == 1
        assert data["by_priority"]["baixa"] == 1
        assert data["by_category"]["refund"] == 1


@pytest.mark.anyio
async def test_update_rule(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.put("/api/rules/R001", json={
            "category": "refund",
            "priority": "media",
            "rule": "Issue refund within 14 days",
            "conditions": "Customer requests within 14 days",
            "exceptions": "None",
        })
        assert resp.status_code == 200

        # Verify the update persisted
        resp2 = await client.get("/api/rules?category=refund")
        data = resp2.json()
        assert data["rules"][0]["priority"] == "media"
        assert "14 days" in data["rules"][0]["rule"]


@pytest.mark.anyio
async def test_update_rule_not_found(client, populated_rules):
    with patch("api.server.RULES_FILE", populated_rules):
        resp = await client.put("/api/rules/R999", json={
            "category": "other",
            "priority": "baixa",
            "rule": "Nonexistent",
            "conditions": "N/A",
        })
        assert resp.status_code == 404
