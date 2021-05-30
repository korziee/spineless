import {config as loadEnvConfig} from 'dotenv';
import {loadConfig} from "./dist/modules/config/config";

loadEnvConfig();
const config = loadConfig();

const dbConfig = {
    client: 'mysql',
    connection: {
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        port: config.dbPort,
        database: config.dbDatabase,
        charset: 'utf8mb4'
    }
};

export = dbConfig;
