import { Module } from "@nestjs/common";
import { Config, loadConfig } from "./config";

export const staticConfig = loadConfig();

@Module({
  providers: [
    {
      provide: Config,
      useValue: staticConfig,
    },
  ],
  exports: [Config],
})
export class ConfigModule {}
