"""Shared pytest fixtures for backend tests.

Provides FastAPI test client, mock rasadhi_core responses, and test data.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    """FastAPI test client for making test requests."""
    return TestClient(app)
