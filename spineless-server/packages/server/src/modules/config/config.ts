import * as _ from "lodash";

export interface IConfig {
  redisUrl: string;

  dbHost: string;
  dbUser: string;
  dbPassword: string;
  dbDatabase: string;
  dbPort: number;
}
const stringConfigVars: string[] = [
  "REDIS_URL",
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_DATABASE",
];
const numberConfigVars: string[] = ["PORT", "DB_PORT"];
const booleanConfigVars: string[] = [];

export const Config = Symbol("Config");

// merged with process.env before loading config
const configDefaults: { [key: string]: string } = {
  // MY_EXAMPLE_ENV: ""
};

export function loadConfig(): IConfig {
  const envVars = { ...configDefaults, ...process.env };
  const config: any = {};

  stringConfigVars.forEach((configKey) => {
    const strVal = envVars[configKey];
    if (strVal === undefined) {
      throw new Error(`Environment variable '${configKey}' missing`);
    }

    const camelCaseKey = _.camelCase(configKey);
    config[camelCaseKey] = strVal;
  });

  numberConfigVars.forEach((configKey) => {
    const strVal = envVars[configKey];
    if (strVal === undefined) {
      throw new Error(`Environment variable '${configKey}' missing`);
    }

    const numVal = parseInt(strVal, 10);
    if (Number.isNaN(numVal)) {
      throw new Error(
        `Environment variable '${configKey}' not a valid integer`
      );
    }

    const camelCaseKey = _.camelCase(configKey);
    config[camelCaseKey] = numVal;
  });

  booleanConfigVars.forEach((configKey) => {
    const strVal = envVars[configKey];
    if (strVal === undefined) {
      throw new Error(`Environment variable '${configKey}' missing`);
    }

    const camelCaseKey = _.camelCase(configKey);
    if (strVal === "true") {
      config[camelCaseKey] = true;
      return;
    }
    if (strVal === "false") {
      config[camelCaseKey] = false;
      return;
    }

    throw new Error(`Environment variable '${configKey}' not true/false`);
  });

  return config as IConfig;
}
