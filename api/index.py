"""Vercel serverless entrypoint — wraps the FastAPI app."""

from .server import app  # noqa: F401
