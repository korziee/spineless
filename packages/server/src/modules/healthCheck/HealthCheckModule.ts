import { Module } from "@nestjs/common";
import { HealthCheckController } from "./HealthCheckController";

@Module({
  imports: [],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
