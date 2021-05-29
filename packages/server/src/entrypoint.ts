import { NestFactory } from "@nestjs/core";
import { SerializerInterceptor } from "./interceptors/SerializerInterceptor";
import { AppModule } from "./AppModule";

async function bootstrapApiServer() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api/v1");
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.enableCors();
  await app.listen(process.env.PORT);
}

bootstrapApiServer().catch(console.error);
