import {Injectable, Inject, OnModuleInit} from "@nestjs/common";
import Knex from "knex";
import {IConfig, Config} from "../config/config";

export interface IDatabaseService {
  getConnection(): Knex;
}

@Injectable()
export class DatabaseService implements IDatabaseService, OnModuleInit {
  private db: Knex;

  constructor(@Inject(Config) private _config: IConfig) {
  }

  public onModuleInit(): void {
    this.db = Knex({
      client: 'mysql',
      connection: {
        host: this._config.dbHost,
        user: this._config.dbUser,
        password: this._config.dbPassword,
        port: this._config.dbPort,
        database: this._config.dbDatabase,
        charset: 'utf8mb4'
      },
      pool: { min: 2, max: 15 }
    });
  }

  public getConnection(): Knex {
    return this.db;
  }
}
