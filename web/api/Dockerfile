###############################################################################
# Base stage
###############################################################################
FROM python:3.13-slim-bookworm AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

###############################################################################
# Rust + maturin builder
###############################################################################
FROM base AS rust-builder

# Install Rust toolchain + build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential pkg-config && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | \
    sh -s -- -y --default-toolchain nightly --profile minimal && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:$PATH"

# Install maturin
RUN pip install --no-cache-dir maturin

# Copy Rust crate source
COPY csp-solver/ /build/csp-solver/

# Build the native csp_solver module
WORKDIR /build/csp-solver
RUN maturin build --release --features py --out /build/wheels

###############################################################################
# UV installer
###############################################################################
FROM base AS uv-installer

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never

###############################################################################
# Development
###############################################################################
FROM uv-installer AS development

COPY web/api/pyproject.toml web/api/uv.lock* ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project

COPY web/api/ .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Install the Rust native module into the uv venv
COPY --from=rust-builder /build/wheels/*.whl /tmp/wheels/
RUN uv pip install --python .venv/bin/python /tmp/wheels/*.whl && rm -rf /tmp/wheels

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.api.main:app", \
     "--host", "0.0.0.0", "--port", "8000", "--reload"]

###############################################################################
# Production
###############################################################################
FROM uv-installer AS production

RUN groupadd -r app && useradd -r -g app app

COPY web/api/pyproject.toml web/api/uv.lock* ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project

COPY web/api/ .
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Install the Rust native module into the uv venv
COPY --from=rust-builder /build/wheels/*.whl /tmp/wheels/
RUN uv pip install --python .venv/bin/python /tmp/wheels/*.whl && rm -rf /tmp/wheels

ENV PATH="/app/.venv/bin:$PATH"

USER app

EXPOSE 8000

CMD ["uvicorn", "app.api.main:app", \
     "--host", "0.0.0.0", "--port", "8000", \
     "--workers", "4", "--proxy-headers", \
     "--forwarded-allow-ips", "*"]
