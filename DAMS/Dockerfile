FROM python:3.11-slim

WORKDIR /app

# Build arguments
ARG DJANGO_JWT_KEY
ARG DJANGO_ALLOWED_HOSTS
ARG DJANGO_USER_SERVICE
ARG DJANGO_BASE_URL
ARG DEBUG
ARG DJANGO_CELERY_BROKER_URL
ARG DATABASE_URL
ARG DJANGO_ENV

# Environment vars
ENV DJANGO_JWT_KEY=${DJANGO_JWT_KEY}
ENV DJANGO_ALLOWED_HOSTS=${DJANGO_ALLOWED_HOSTS}
ENV DJANGO_USER_SERVICE=${DJANGO_USER_SERVICE}
ENV DJANGO_BASE_URL=${DJANGO_BASE_URL}
ENV DEBUG=${DEBUG}
ENV DJANGO_CELERY_BROKER_URL=${DJANGO_CELERY_BROKER_URL}
ENV DATABASE_URL=${DATABASE_URL}
ENV DJANGO_ENV=${DJANGO_ENV}
ENV PYTHONUNBUFFERED=1

# System dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libglib2.0-0 libsm6 libxrender1 libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker caching
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Preload the convnext_tiny model from timm so it's cached in image
RUN python -c "import timm; timm.create_model('convnext_tiny', pretrained=True)"

# Copy the project source code
COPY . .

# Expose port
EXPOSE 8000

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Entrypoint
CMD ["sh", "start.sh"]
