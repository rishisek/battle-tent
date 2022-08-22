FROM node:latest

WORKDIR /home/battle-server

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY src ./src
COPY tsconfig.json .
COPY .babelrc .

RUN yarn build

EXPOSE 5000

ENTRYPOINT ["yarn", "start:prod"]
