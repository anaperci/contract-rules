"""Shared fixtures for contract-rules API tests."""

import os
import pytest
from httpx import ASGITransport, AsyncClient

# Ensure test env
os.environ.setdefault("ANTHROPIC_API_KEY", "sk-ant-test-fake-key")

from api.server import app  # noqa: E402


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
