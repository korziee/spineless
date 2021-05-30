import { Module } from "@nestjs/common";
import { DevController } from "./DevController";

@Module({
  imports: [],
  controllers: [DevController],
})
export class DevModule {}
