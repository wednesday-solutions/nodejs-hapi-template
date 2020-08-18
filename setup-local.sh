
#!/bin/sh +x +e

# start msql
# mysql.server start

# Access and drop the database
mysql -uroot -ppassword -D temp_dev -e "DROP DATABASE temp_dev"

# Create, Migrate & Seed the database.
echo "**************************npx sequelize db:create**************************" && ENV=development npx sequelize db:create && echo "**************************npx sequelize db:migrate**************************" && ENV=development npx sequelize db:migrate && echo "**************************npx sequelize db:seed:all**************************" && ENV=development npx sequelize db:seed:all 

# Start
ENV=development npm start