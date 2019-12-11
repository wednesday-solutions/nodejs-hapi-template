
#!/bin/sh +x +e

# start msql
mysql.server start

# Access and drop the database
mysql -uroot -ppassword -D temp_dev -e "DROP DATABASE temp_dev"

# Create, Migrate & Seed the database.
npx sequelize db:create && npx sequelize db:migrate && npx sequelize db:seed:all

# Start
npm start