import {Controller, Get, Inject} from "@nestjs/common";
import {TablesService} from "./TablesService";

@Controller({
  path: "/:namespace",
})
export class TablesController {
  public constructor(
    @Inject(TablesService) private _tablesService: TablesService
  ) {}

  @Get("/_meta")
  public async meta() {
    return {
      hello: "world"
    };
  }
}
