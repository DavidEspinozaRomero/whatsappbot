import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { CommonModule } from './modules/common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BotWebwhatsapModule } from './modules/bot-webwhatsap/bot-webwhatsap.module';
import { BotwsModule } from './modules/botws/botws.module';
import { MessagesModule } from './modules/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE == 'prod',
      extra: {
        ssl: process.env.STAGE == 'prod' ? { rejectUnauthorized: false } : null,
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    SeedModule,
    CommonModule,
    BotWebwhatsapModule,
    BotwsModule,
    MessagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
