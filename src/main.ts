import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置CORS选项
  app.enableCors({
    origin: '*', // 允许所有来源
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许所有HTTP方法
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(4556);
}
bootstrap();
