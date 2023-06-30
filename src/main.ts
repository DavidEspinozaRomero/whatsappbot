import { ValidationPipe } from '@nestjs/common';
// import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// const corsOptions: CorsOptions;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
