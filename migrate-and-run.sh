#!/bin/bash
set -a . ".env$ENVIRONMENT_NAME" set +a
sleep 10
npx sequelize db:drop
npx sequelize db:create
npx sequelize db:migrate

for file in seeders/*
do
   :
   ./node_modules/.bin/sequelize db:seed --seed $file
done

yarn start