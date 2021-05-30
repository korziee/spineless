import { Controller, Get, HttpException } from "@nestjs/common";

@Controller({
  path: "/hc",
})
export class HealthCheckController {
  @Get("/")
  public async healthCheck() {
    return {
      ok: true
    };
  }
}
