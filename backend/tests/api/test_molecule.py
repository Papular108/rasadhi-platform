"""Tests for the POST /api/molecule/analyze endpoint."""

import pytest

ASPIRIN = "CC(=O)Oc1ccccc1C(=O)O"
ANALYZE_URL = "/api/molecule/analyze"


def test_analyze_valid_smiles_returns_200_with_real_values(client):
    """A valid SMILES returns 200 with chemically correct values."""
    resp = client.post(ANALYZE_URL, json={"smiles": ASPIRIN, "name": "Aspirin"})
    assert resp.status_code == 200

    body = resp.json()
    assert body["properties"]["MW"] == pytest.approx(180.16, abs=0.01)
    assert body["properties"]["HBD"] == 1
    assert isinstance(body["canonical_smiles"], str)
    assert body["canonical_smiles"]  # non-empty
    assert body["druglikeness"]["lipinski"]["passed"] is True


def test_analyze_aspirin_brenk_alert_matches(client):
    """Aspirin trips a Brenk structural alert with a named pattern."""
    resp = client.post(ANALYZE_URL, json={"smiles": ASPIRIN})
    assert resp.status_code == 200

    brenk = resp.json()["alerts"]["brenk"]
    assert brenk["matched"] is True
    assert isinstance(brenk["description"], str)
    assert brenk["description"]  # non-empty


def test_analyze_invalid_smiles_returns_400(client):
    """An unparseable SMILES returns 400 with a detail field."""
    resp = client.post(ANALYZE_URL, json={"smiles": "not_a_molecule"})
    assert resp.status_code == 400
    assert "detail" in resp.json()


def test_analyze_empty_smiles_returns_422(client):
    """An empty SMILES is rejected by Pydantic validation before the route."""
    resp = client.post(ANALYZE_URL, json={"smiles": ""})
    assert resp.status_code == 422


def test_analyze_missing_smiles_field_returns_422(client):
    """Omitting the required smiles field is a schema violation (422)."""
    resp = client.post(ANALYZE_URL, json={"name": "Aspirin"})
    assert resp.status_code == 422


def test_analyze_echoes_name_when_provided(client):
    """The optional name is echoed back in the response when provided."""
    resp = client.post(ANALYZE_URL, json={"smiles": ASPIRIN, "name": "Aspirin"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Aspirin"


def test_analyze_name_is_none_when_omitted(client):
    """The name field is None in the response when the request omits it."""
    resp = client.post(ANALYZE_URL, json={"smiles": ASPIRIN})
    assert resp.status_code == 200
    assert resp.json()["name"] is None
