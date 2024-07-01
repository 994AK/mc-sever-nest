import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('YuHua接口文档')
    .setDescription('API调用方法')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4556);
}
bootstrap();
