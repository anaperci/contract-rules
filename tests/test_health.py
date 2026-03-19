"""Tests for health and basic API endpoints."""

import pytest


@pytest.mark.anyio
async def test_health_returns_ok(client):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "ok"
    assert "timestamp" in data


@pytest.mark.anyio
async def test_stats_returns_structure(client):
    resp = await client.get("/api/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert "total_rules" in data
    assert "by_priority" in data
    assert "by_category" in data
    assert "populated" in data
    assert isinstance(data["by_priority"], dict)


@pytest.mark.anyio
async def test_stats_empty_when_no_rules(client):
    resp = await client.get("/api/stats")
    data = resp.json()
    assert data["total_rules"] == 0
    assert data["populated"] is False


@pytest.mark.anyio
async def test_extractions_empty_initially(client):
    resp = await client.get("/api/extractions")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert isinstance(data["items"], list)
