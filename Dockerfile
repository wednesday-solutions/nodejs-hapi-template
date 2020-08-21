FROM node:13-alpine

RUN mkdir -p /app

ADD . /app

WORKDIR /app

RUN apk update &&\
    apk add git

RUN yarn

RUN chmod +x wait-for.sh

EXPOSE 9000