import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

// this file is only used for development, see lambda/api.ts for the production bootstrapper

async function bootstrapApiServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrapApiServer().catch(console.error);
