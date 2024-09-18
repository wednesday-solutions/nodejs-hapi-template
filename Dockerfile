FROM node:20
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
ARG APP_PATH
# RUN mkdir -p /app-build
# ADD . /app-build
# WORKDIR /app-build

RUN mkdir -p ${APP_PATH}
ADD . ${APP_PATH}
WORKDIR ${APP_PATH}

RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile
RUN yarn
RUN yarn build:$BUILD_NAME

FROM node:20-alpine
ARG ENVIRONMENT_NAME
ARG BUILD_NAME
ARG APP_PATH

WORKDIR ${APP_PATH}
RUN mkdir -p ${APP_PATH}/dist

RUN apk add yarn
RUN yarn global add sequelize@6.28.0 sequelize-cli@6.2.0 nyc@15.1.0
RUN yarn add shelljs@0.8.5 dotenv@10.0.0 mysql2@2.3.3
RUN apk add --no-cache dumb-init
ADD scripts/migrate-and-run.sh ${APP_PATH}/
ADD package.json ${APP_PATH}/
ADD . ./
COPY --from=0 ${APP_PATH}/dist ${APP_PATH}/dist

ENTRYPOINT ["dumb-init", "--"]
STOPSIGNAL SIGINT

CMD ["sh", "./migrate-and-run.sh"]
EXPOSE 9000
