
#!/bin/bash
set -x 
# Create, Migrate & Seed the database.
yarn
export ENVIRONMENT_NAME=local
npx sequelize db:drop
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all 

# Start
yarn start:local