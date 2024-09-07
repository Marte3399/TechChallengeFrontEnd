# .......Development Stage.......
FROM node:20-alpine as development
# Define o diretorio do container
WORKDIR /app
# Copiar os arquivos necessarios para iniciar uma aplicacao nodejs
COPY package.json package-lock.json ./
# Instala dependencias
RUN npm install
RUN npm install -g ts-node
# Copia arquivos locais para o container
COPY . .
# Build da app
RUN npm run build

