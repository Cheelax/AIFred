#!/bin/sh

# Afficher les variables d'environnement pour débogage
echo "Environment variables:"
printenv

# Vérifier le chemin de pipenv et flask
echo "pipenv path:"
which pipenv

echo "flask path:"
which flask

# Afficher le contenu du répertoire actuel pour vérifier la présence des fichiers attendus
echo "Current directory content:"
# ls -al

# Afficher les informations sur pipenv et flask installés
echo "pipenv version:"
pipenv --version

echo "flask version (if available):"
pipenv run flask --version

echo "CHECKPOINT"
flask --help
flask
echo "CHECKPOINT2"

pipenv run inv dev
# Initialiser la base de données avec Flask
echo "Initializing the database with Flask."
pipenv run flask --app web.app init-db

# Continuer avec d'autres commandes si nécessaire
exec "$@"
