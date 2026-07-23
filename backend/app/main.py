"""FastAPI application entry point.

This module wires together configuration, middleware, and route registration.
Actual endpoint implementations live in app/api/routes/.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import molecule

app = FastAPI(
    title="Rasadhi Platform API",
    description="Cheminformatics platform for QSAR preprocessing, analysis, and modeling",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration — will be tightened via environment config later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api")
async def root():
    """API root — returns basic service information."""
    return {
        "name": "Rasadhi Platform API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/api/health")
async def health():
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}


# Feature routers
app.include_router(molecule.router)
