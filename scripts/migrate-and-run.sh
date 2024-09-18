#!/bin/sh
set -a . ".env$ENVIRONMENT_NAME" set +a
# create the db for local builds

# Function to handle SIGINT signal
handle_int() {
    echo "SIGINT received, forwarding to child process..."
    kill -INT "$child" 2>/dev/null
    echo "Waiting for child process to exit..."
    wait "$child"
    echo "Child process exited. Waiting for NYC coverage data to be fully written..."
    sleep 10  # Wait for 50 seconds
    echo "Exiting after delay..."
    exit 0
}

# Trap SIGINT signal
trap 'handle_int' INT TERM

sleep 30

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

yarn start &

child=$!
echo "Started yarn with PID $child"

# Wait for child process to finish
wait "$child"
