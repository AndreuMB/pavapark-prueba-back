import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
