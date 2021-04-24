import { NestFactory } from '@nestjs/core';
import { AtmModule } from './atm.module';

async function bootstrap() {
  const app = await NestFactory.create(AtmModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
