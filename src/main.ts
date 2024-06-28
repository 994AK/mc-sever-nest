import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const databaseUrl = configService.get<string>('DATABASE_URL');
  console.log(`Connecting to database: ${databaseUrl}`);

  await app.listen(3000);
}
bootstrap();
