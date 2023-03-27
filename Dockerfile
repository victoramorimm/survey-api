FROM node:19
WORKDIR /usr/src/curso-node-api
COPY ./package.json .
RUN npm install --only=prod