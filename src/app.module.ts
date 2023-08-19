import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { CommonModule } from './modules/common/common.module';
// import { BotWebwhatsapModule } from './modules/bot-webwhatsap/bot-webwhatsap.module';
// import { BotwsModule } from './modules/botws/botws.module';
import { MessagesModule } from './modules/messages/messages.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { MailerCustomService } from './services';
import { PaymentsModule } from './modules/payments/payments.module';
import { WebhookModule } from './modules/webhook/webhook.module';
import { AuthModule, ContactsModule } from './modules';
import { ErrorsModule } from './modules/errors/errors.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FilesModule } from './modules/files/files.module';
import { MediaModule } from './modules/media/media.module';
import { GroupsModule } from './modules/groups/groups.module';

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
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     ignoreTLS: true,
    //     secure: true,
    //     auth: {
    //       user: process.env.EMAIL,
    //       pass: process.env.EMAILPASS,
    //     },
    //   },
    //   // defaults: {
    //   //   from: '"No Reply" <no-reply@localhost>',
    //   // },
    //   // template: {
    //   //   dir: __dirname + '/templates',
    //   //   adapter: new PugAdapter(),
    //   //   options: {
    //   //     strict: true,
    //   //   },
    //   // },
    // }),
    // BotWebwhatsapModule,
    // BotwsModule,
    // PaymentsModule,
    AuthModule,
    SeedModule,
    CommonModule,
    MessagesModule,
    ContactsModule,
    WebhookModule,
    ErrorsModule,
    AnalyticsModule,
    FilesModule,
    MediaModule,
    GroupsModule,
  ],
  controllers: [],
  // providers: [MailerCustomService],
})
export class AppModule {}
