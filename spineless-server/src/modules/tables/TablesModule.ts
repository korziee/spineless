import { Module } from "@nestjs/common";
import { TablesController } from "./TablesController";
import {TablesService} from "./TablesService";

@Module({
  imports: [],
  providers: [TablesService],
  exports: [TablesService],
  controllers: [TablesController],
})
export class TablesModule {}
