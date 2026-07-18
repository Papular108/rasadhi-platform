# Rasadhi Platform Backend

FastAPI backend for the Rasadhi Platform — a cheminformatics API serving preprocessing, analysis, and modeling capabilities.

## Status

Alpha — scaffold only, no functional endpoints yet.

## Architecture

- **FastAPI** — modern async web framework
- **Pydantic** — request/response validation
- **rasadhi_core** — pure scientific library (installed separately)

## Local development

Create environment:

```bash
conda create -n rasadhi-api python=3.11
conda activate rasadhi-api
pip install -e ".[dev]"
```

Install rasadhi_core in editable mode (from sibling directory):

```bash
pip install -e ../../rasadhi_core
```

Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive API documentation.

## Testing

```bash
pytest
```

## Deployment

Deployed to Railway via the `railway.json` configuration. Environment
variables are managed via Railway's dashboard.

## Project structure

```
backend/
├── app/
│   ├── main.py              FastAPI entry point
│   ├── api/routes/          Endpoint implementations
│   ├── core/                Configuration, security, logging
│   ├── models/              Pydantic request/response models
│   ├── services/            Business logic wrappers
│   └── db/                  Database session management
├── tests/                   Pytest suite
└── scripts/                 Utility scripts
```
