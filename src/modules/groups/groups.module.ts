import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group, GroupManagement } from './entities';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService],
  imports: [TypeOrmModule.forFeature([Group, GroupManagement])],
  exports: [TypeOrmModule],
})
export class GroupsModule {}
