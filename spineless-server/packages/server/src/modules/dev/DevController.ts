import { Controller, Get } from "@nestjs/common";

@Controller("dev")
export class DevController {
  public constructor() {}

  @Get("/example-data")
  public async exampleData() {
    return [];
  }
}
