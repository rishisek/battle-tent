FROM node:latest

WORKDIR /home/battle-server

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY server/ .
COPY tsconfig.json .

ENTRYPOINT ["yarn", "start:prod"]
