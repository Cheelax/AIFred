# Utiliser une image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers `package.json` et `package-lock.json` (ou `yarn.lock`)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application
RUN npm run build

# Installer serve pour servir l'application en production
RUN npm install -g serve

# Commande pour démarrer l'application
CMD ["serve", "-s", "build", "-l", "3000"]