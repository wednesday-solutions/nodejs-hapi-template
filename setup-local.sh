
#!/bin/sh +x +e

# start msql
mysql.server start

# Access and drop the database
mysql -uroot -ppassword -D spot_dev -e "DROP DATABASE spot_sos_dev"

# Create, Migrate & Seed the database.
npx sequelize db:create && npx sequelize db:migrate && npx sequelize db:seed:all

# Start
npm start