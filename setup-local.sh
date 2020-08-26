
#!/bin/bash
set -x 
# Create, Migrate & Seed the database.
export ENVIRONMENT_NAME=local
npx sequelize db:drop
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all 

# Start
npm run start:local