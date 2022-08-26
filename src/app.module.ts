import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [AuthModule, SeedModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
