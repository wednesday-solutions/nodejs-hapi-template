FROM node:14
ARG BUILD_ENV
ARG BUILD_NAME
RUN mkdir -p /app-build
ADD . /app-build
WORKDIR /app-build
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile
RUN yarn
RUN yarn build:$BUILD_NAME

FROM node:14-alpine
ARG BUILD_ENV
ARG BUILD_NAME
RUN apk add yarn
RUN yarn global add sequelize@6.28.0 sequelize-cli@6.2.0
RUN yarn add shelljs@0.8.5 dotenv@10.0.0 mysql2@2.3.3
ADD scripts/migrate-and-run.sh /
ADD package.json /
ADD . /
COPY --from=0 /app-build/dist ./dist


CMD ["sh", "./migrate-and-run.sh"]
EXPOSE 9000