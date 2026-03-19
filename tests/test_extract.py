"""Tests for extraction endpoint (mocked Claude API)."""

import pytest
from unittest.mock import patch, MagicMock
from io import BytesIO


@pytest.mark.anyio
async def test_extract_rejects_empty_file(client):
    resp = await client.post("/api/extract", files={
        "file": ("empty.txt", BytesIO(b""), "text/plain"),
    }, data={"company": "Test", "central_type": "geral"})
    assert resp.status_code == 400


@pytest.mark.anyio
async def test_extract_requires_api_key(client):
    with patch.dict("os.environ", {"ANTHROPIC_API_KEY": ""}):
        resp = await client.post("/api/extract", files={
            "file": ("contract.txt", BytesIO(b"Some contract text"), "text/plain"),
        }, data={"company": "Test", "central_type": "suporte"})
        assert resp.status_code == 400
        assert "ANTHROPIC_API_KEY" in resp.json()["detail"]


@pytest.mark.anyio
async def test_test_endpoint_requires_populated_rules(client):
    resp = await client.post("/api/test", json={
        "question": "Quero cancelar meu plano",
    })
    assert resp.status_code == 400
    assert "regra" in resp.json()["detail"].lower() or "Nenhuma" in resp.json()["detail"]
