import { Module } from "@nestjs/common";
import { HealthCheckModule } from "./modules/healthCheck/HealthCheckModule";
import {TablesModule} from "./modules/tables/TablesModule";

@Module({
  imports: [HealthCheckModule, TablesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
