"""Tests for health check endpoints."""


def test_health_check(client):
    """Health endpoint should return status=healthy."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint(client):
    """Root endpoint should return service info."""
    response = client.get("/api")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Rasadhi Platform API"
    assert data["version"] == "0.1.0"
