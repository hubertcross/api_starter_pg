# api_starter_pg
example of RESTful API using the 'world' example database in postgres

In this project we're using the pg package to connect to a postgres database.

Project structure from outter to inner

services      - router.js holds all the routes with calls to controllers, we also manage db connection pools, security in this folder among other things
controllers   - receives parameters from the router and calls the appropriate function in the model/db_api
db_apis       - models go here. it's where SQL queries are constructed based on context passed from controller
