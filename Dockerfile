FROM node:14
ARG ENVIRONMENT_NAME
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
RUN mkdir -p /app-build
ADD . /app-build
WORKDIR /app-build
RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn --frozen-lockfile
RUN yarn
RUN yarn build:env

FROM node:14-alpine
ARG ENVIRONMENT_NAME
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
RUN apk add yarn
RUN yarn global add sequelize@6.6.5 sequelize-cli@6.2.0 mysql2
RUN yarn add shelljs dotenv
ADD scripts/migrate-and-run.sh /
ADD package.json /
ADD . /
COPY --from=0 /app-build/dist ./dist


CMD ["sh", "./migrate-and-run.sh"]
EXPOSE 9000