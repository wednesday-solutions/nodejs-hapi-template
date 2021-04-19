FROM node:13-alpine

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 9000

CMD ["sh", "./migrate-and-run.sh"]