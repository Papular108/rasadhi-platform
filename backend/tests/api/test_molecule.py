"""Tests for the POST /api/molecule/analyze and /analyze-batch endpoints."""

import pytest

ASPIRIN = "CC(=O)Oc1ccccc1C(=O)O"
CAFFEINE = "Cn1cnc2c1c(=O)n(C)c(=O)n2C"
IBUPROFEN = "CC(C)Cc1ccc(cc1)C(C)C(=O)O"
ANALYZE_URL = "/api/molecule/analyze"
BATCH_URL = "/api/molecule/analyze-batch"


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


# ---------------------------------------------------------------------------
# POST /api/molecule/analyze-batch
# ---------------------------------------------------------------------------


def test_batch_all_valid_returns_full_results(client):
    """Two valid molecules → 200, both succeed with a result and no error."""
    resp = client.post(
        BATCH_URL,
        json={
            "molecules": [
                {"smiles": ASPIRIN, "name": "Aspirin"},
                {"smiles": CAFFEINE, "name": "Caffeine"},
            ]
        },
    )
    assert resp.status_code == 200

    body = resp.json()
    assert body["total"] == 2
    assert body["succeeded"] == 2
    assert body["failed"] == 0
    for item in body["items"]:
        assert item["success"] is True
        assert item["result"] is not None
        assert item["error"] is None


def test_batch_partial_failure_does_not_fail_the_request(client):
    """A malformed SMILES among valid ones fails only its own item (still 200).

    This is the central design requirement: aspirin and caffeine still return
    full analyses; the bad entry returns success=false with an error naming the
    offending SMILES.
    """
    resp = client.post(
        BATCH_URL,
        json={
            "molecules": [
                {"smiles": ASPIRIN, "name": "Aspirin"},
                {"smiles": "not_a_molecule"},
                {"smiles": CAFFEINE, "name": "Caffeine"},
            ]
        },
    )
    assert resp.status_code == 200

    body = resp.json()
    assert body["total"] == 3
    assert body["succeeded"] == 2
    assert body["failed"] == 1

    aspirin_item, bad_item, caffeine_item = body["items"]

    assert aspirin_item["success"] is True
    assert aspirin_item["result"] is not None

    assert caffeine_item["success"] is True
    assert caffeine_item["result"] is not None

    assert bad_item["success"] is False
    assert bad_item["result"] is None
    assert bad_item["error"] is not None
    assert "not_a_molecule" in bad_item["error"]


def test_batch_preserves_input_order_and_indexes(client):
    """Items come back in submission order with sequential indexes 0, 1, 2."""
    submitted = [ASPIRIN, CAFFEINE, IBUPROFEN]
    resp = client.post(
        BATCH_URL,
        json={"molecules": [{"smiles": s} for s in submitted]},
    )
    assert resp.status_code == 200

    items = resp.json()["items"]
    assert [item["index"] for item in items] == [0, 1, 2]
    assert [item["input_smiles"] for item in items] == submitted


def test_batch_echoes_names_including_null(client):
    """Names are echoed per item, and an unnamed entry echoes a null name."""
    resp = client.post(
        BATCH_URL,
        json={
            "molecules": [
                {"smiles": ASPIRIN, "name": "Aspirin"},
                {"smiles": CAFFEINE},
            ]
        },
    )
    assert resp.status_code == 200

    items = resp.json()["items"]
    assert items[0]["name"] == "Aspirin"
    assert items[1]["name"] is None


def test_batch_empty_list_returns_422(client):
    """An empty molecules list violates min_length → 422."""
    resp = client.post(BATCH_URL, json={"molecules": []})
    assert resp.status_code == 422


def test_batch_over_fifty_returns_422(client):
    """51 molecules violates max_length → 422."""
    resp = client.post(
        BATCH_URL,
        json={"molecules": [{"smiles": ASPIRIN} for _ in range(51)]},
    )
    assert resp.status_code == 422


def test_batch_single_molecule_works(client):
    """A batch of one is valid and reports total 1."""
    resp = client.post(BATCH_URL, json={"molecules": [{"smiles": ASPIRIN}]})
    assert resp.status_code == 200

    body = resp.json()
    assert body["total"] == 1
    assert body["succeeded"] == 1
    assert body["failed"] == 0
    assert body["items"][0]["result"] is not None
