import { Module } from "@nestjs/common";
import { ConfigModule } from "./modules/config/ConfigModule";
import { DevModule } from "./modules/dev/DevModule";
import { HealthCheckModule } from "./modules/healthCheck/HealthCheckModule";
import { DatabaseModule } from "./modules/database/DatabaseModule";

@Module({
  imports: [ConfigModule, HealthCheckModule, DevModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
