#!/bin/bash

yarn install
yarn build
docker-compose stop
docker-compose rm -f
sleep 3
docker-compose up -d
sleep 10

cd packages/server
docker-compose exec mysql mysql --user=root --password=Password1 -e 'DROP DATABASE IF EXISTS monorepoTemplate; CREATE DATABASE monorepoTemplate;'
sleep 1
npx knex migrate:latest
npx knex seed:run
cd ../../