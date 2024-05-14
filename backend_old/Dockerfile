# Utiliser une image de base Python
FROM python:3.8-slim

# Install git
RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install chromadb
# RUN pip install tiktoken -vvv
# Copier le reste des fichiers
COPY . .

# Commande pour démarrer l'application
CMD ["python", "./alfred.py"]