
# Utiliser une image de base officielle de Python
FROM python:3.10-slim



RUN pip install invoke

# Installer pipenv et les dépendances
RUN pip install pipenv && pipenv lock && pipenv install --system --deploy

# RUN pipenv run pip list | grep Flask
# Copier le reste de l'application
# COPY . .
COPY ./ ./

# Exposer le port utilisé par Flask (8000)
EXPOSE 8000

#CMD ["python", "-m", "flask", "--app", "web.app", "init-db"]
# RUN /ve/bin/python -m flask --app web.app init-db
ENV FLASK_APP=web.app

RUN chmod +x ./entrypoint.sh
RUN ls -la
ENTRYPOINT ["./entrypoint.sh"]

# Démarrer Redis, le serveur Python et le worker
# CMD ["sh", "-c", "redis-server & /ve/bin/inv dev & /ve/bin/inv devworker & tail -f /dev/null"]

# # Définir la commande pour lancer l'application
# CMD ["inv", "dev"]
