import { Module } from "@nestjs/common";
import { DatabaseService } from "./DatabaseService";
import {ConfigModule} from "../config/ConfigModule";

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
