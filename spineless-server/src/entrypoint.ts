import { NestFactory } from "@nestjs/core";
import { AppModule } from "./AppModule";

// this file is only used for development, see lambda/api.ts for the production bootstrapper

async function bootstrapApiServer() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  console.log("Starting server on port 3000");
  await app.listen(3000);
}

bootstrapApiServer().catch(console.error);
