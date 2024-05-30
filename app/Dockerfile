# # Utiliser une image de base Python officielle
# FROM python:3.10-slim

# # Définir le répertoire de travail
# WORKDIR /app

# # Copier les fichiers Pipfile et Pipfile.lock (s'ils existent) dans le répertoire de travail
# COPY Pipfile /app/


# # Installer Pipenv
# RUN pip install pipenv

# # Installer les dépendances sans utiliser l'option --deploy pour générer Pipfile.lock
# RUN pipenv install --deploy

# # Copier le reste des fichiers de l'application dans le répertoire de travail
# COPY . /app

# # Exposer le port de l'application (à adapter selon votre application)
# EXPOSE 5000

# # Commande pour initialiser la base de données
# RUN pipenv run flask --app app.web init-db

# # Commande par défaut pour démarrer l'application
# CMD ["pipenv", "run", "inv", "dev"]

# syntax=docker/dockerfile:1






# # Utiliser une image de base Python officielle
# FROM python:3.10-slim

# # Définir le répertoire de travail
# WORKDIR /app

# # Copier les fichiers de dépendances
# COPY requirements.txt /app/

# # Installer les dépendances
# RUN pip install --no-cache-dir -r requirements.txt

# # Copier le reste des fichiers de l'application dans le répertoire de travail
# COPY . /app

# # Exposer le port de l'application (à adapter selon votre application)
# EXPOSE 5000

# # Initialiser la base de données
# RUN python -m flask --app web.app init-db

# # Commande par défaut pour démarrer l'application
# CMD ["python", "-m", "flask", "--app", "web.app", "run", "--host=0.0.0.0"]


# Utiliser une image de base Python officielle
FROM python:3.10-slim

RUN apt-get update && apt-get install -y redis-server && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY requirements.txt /app/

# Installer les dépendances
RUN python -m venv /ve \
    && /ve/bin/pip install --no-cache-dir -r requirements.txt \
    && /ve/bin/pip install pinecone-client \
    && /ve/bin/pip list
# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . /app



# Initialiser la base de données en utilisant explicitement le chemin vers flask
# RUN /ve/bin/pip -m flask init-db
# CMD ["/ve/bin/pip", "-m", "flask", "init-db"]
# Exposer le port de l'application (à adapter selon votre application)
EXPOSE 8000


ENV FLASK_APP=web.app
# Démarrer Redis, le serveur Python et le worker
CMD ["sh", "-c", "redis-server & /ve/bin/inv dev & /ve/bin/inv devworker & tail -f /dev/null"]
