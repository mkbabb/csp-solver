###############################################################################
# Base stage
###############################################################################
FROM python:3.13-slim-bookworm AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

###############################################################################
# UV installer
###############################################################################
FROM base AS uv-installer

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never

###############################################################################
# Dependencies
###############################################################################
FROM uv-installer AS dependencies

COPY pyproject.toml uv.lock* ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project

###############################################################################
# Development
###############################################################################
FROM uv-installer AS development

COPY pyproject.toml uv.lock* ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

COPY . .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "csp_solver.api.main:app", \
     "--host", "0.0.0.0", "--port", "8000", "--reload"]

###############################################################################
# Production
###############################################################################
FROM base AS production

RUN groupadd -r app && useradd -r -g app app

COPY --from=dependencies /app/.venv /app/.venv
COPY . .

ENV PATH="/app/.venv/bin:$PATH"

USER app

EXPOSE 8000

CMD ["uvicorn", "csp_solver.api.main:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "4", "--proxy-headers", \
     "--forwarded-allow-ips", "*"]
