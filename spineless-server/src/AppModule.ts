import { Module } from "@nestjs/common";
import { HealthCheckModule } from "./modules/healthCheck/HealthCheckModule";

@Module({
  imports: [HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
