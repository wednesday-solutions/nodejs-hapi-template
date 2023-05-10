#!/bin/sh
set -a . ".env$BUILD_ENV" set +a
# create the db for local builds
sleep 30

echo $BUILD_ENV

if [ "$BUILD_NAME" == "local" ]
then
    npx sequelize db:drop
    npx sequelize db:create
fi

# run migrations
npx sequelize db:migrate

# seed data for local builds
if [ "$BUILD_NAME" == "local" ]
then
    for file in seeders/*
    do
        :
        ./node_modules/.bin/sequelize db:seed --seed $file
    done
fi

yarn start