<img align="left" src="https://github.com/wednesday-solutions/nodejs-hapi-template/blob/main/nodejs_hapi_template_github.svg" width="480" height="560" />

<div>
  <a href="https://www.wednesday.is?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" align="left" style="margin-left: 0;">
    <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f5879492fafecdb3e5b0e75_wednesday_logo.svg">
  </a>
  <p>
    <h1 align="left">Node Hapi Template
    </h1>
  </p>

  <p>
An enterprise Hapi template application built using Nodejs showcasing - Testing Strategies, DB seeding & migrations, integration with an ORM, containerization using Docker, REST Apis, a middleware for authorization, redis caching, rate limited endpoints, paginated endpoints, and directory based routing
  </p>

---

  <p>
    <h4>
      Expert teams of digital product strategists, developers, and designers.
    </h4>
  </p>

  <div>
    <a href="https://www.wednesday.is/contact-us?utm_source=gthb&utm_medium=repo&utm_campaign=serverless" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88b9005f9ed382fb2a5_button_get_in_touch.svg" width="121" height="34">
    </a>
    <a href="https://github.com/wednesday-solutions/" target="_blank">
      <img src="https://uploads-ssl.webflow.com/5ee36ce1473112550f1e1739/5f6ae88bb1958c3253756c39_button_follow_on_github.svg" width="168" height="34">
    </a>
  </div>

---

<span>We’re always looking for people who value their work, so come and join us. <a href="https://www.wednesday.is/hiring">We are hiring!</a></span>

</div>

![Nodejs Hapi Template](https://github.com/wednesday-solutions/node-js-hapi-template/workflows/Nodejs%20Hapi%20Template/badge.svg)

<div>
<img src='./badges/badge-statements.svg' height="20"/>
<img src='./badges/badge-branches.svg' height="20"/>
</div>
<div>
<img src='./badges/badge-lines.svg'  height="20"/>
<img src='./badges/badge-functions.svg' height="20"/>
</div>

---

## Out of the box support for

-   Dockerization
-   Authorization middleware
-   Redis Cache
-   Rate Limited endpoints
-   Paginated endpoints
-   Swagger UI
-   Support for directory based routing
-   Simplified support for migrations and seeders using sequelize
-   DAO layer for all database interactions
-   Tests using jest

## Setup and Configuration.

### Pre-requisites

-   node
-   docker
-   docker-compose
-   mysql
-   redis

### Installation

-   Install dependencies using npm

    -   `npm install`

### Setup

-   Run `./scripts/setup-local.sh`
-   This will seed the data in mysql and run the server.

### Auto Generate models from database

-   Automatically generate bare sequelize models from your database.
    `https://github.com/sequelize/sequelize-auto`

Example:
`sequelize-auto -o "./models" -d temp_dev -h localhost -u root -p 3306 -x password -e mysql`

### Sequelize

[Sequelize](https://sequelize.readthedocs.io/en/latest/) is a promise-based ORM for Node.js. It supports the dialects PostgreSQL, MySQL, SQLite and MSSQL and features solid transaction support, relations, read replication and more.

Install Sequelize:

-   `npm install -g sequelize-cli`

Full documentation: https://sequelize.readthedocs.io/en/latest/

### MySQL Setup

Install MySQL

-   `brew install mysql`

-   This helps in accessing the database(`temp_dev`)

`ALTER USER '@root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`;

To Access mysql

-   `mysql -uroot -p`
-   This will ask for password and the altered password is `password`

-   Start Server
    `mysql.server start`

-   Stop Server
    `mysql.server stop`
    
### redis Setup

Install
 
- `brew install redis`

Start

- `brew services start redis`

Stop

- `brew services stop redis`


### Migrations

With migrations you can transfer your existing database into another state and vice-versa.

**Setting up Sequelize Migrations for a initial database**

Steps

1. Create a `resources` folder
2. Create individual `.sql` files for each table and add it sequentially, by prefixing by 01,02 & so on.
3. Each file should contain the proper sql syntax.
4. Point the migration files to `/resources/v1`
5. Run `npx sequlize db:migrate`

**Structure with example**

```
    /
        migrations/
            20191014145811-initial-migration.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
```

**Database State Changes**

1. Create a migration file that prefixes with the timestamp add it in the `/migrations` folder. Ex: `20191014145811-alter-student.js`
2. Add the .sql file in the `/resources/v2`
3. Point the new migration file to `/resources/v2`
4. Run `npx sequlize db:migarte --name migartions/20191014145811-alter-student.js`

**Structure**

```
    /
        migrations/
            20191015143811-initial-migration.js
            20191014145811-alter-student.js
        resources/
            v1/
                01_create_school.sql
                02_create_student.sql
            v2/
                03_alter_student.sql

```
