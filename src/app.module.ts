import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { CommonModule } from './modules/common/common.module';
// import { BotWebwhatsapModule } from './modules/bot-webwhatsap/bot-webwhatsap.module';
// import { BotwsModule } from './modules/botws/botws.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerCustomService } from './services';
import { PaymentsModule } from './modules/payments/payments.module';

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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAILPASS,
        },
      },
      // defaults: {
      //   from: '"No Reply" <no-reply@localhost>',
      // },
      // template: {
      //   dir: __dirname + '/templates',
      //   adapter: new PugAdapter(),
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    AuthModule,
    SeedModule,
    CommonModule,
    // BotWebwhatsapModule,
    // BotwsModule,
    MessagesModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [MailerCustomService],
})
export class AppModule {}
