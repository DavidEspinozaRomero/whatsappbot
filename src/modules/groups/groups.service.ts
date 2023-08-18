import { Injectable } from '@nestjs/common';
import {
  CreateGroupDto,
  UpdateGroupDto,
  CreateGroupManagementDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group, GroupManagement } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupManagement)
    private readonly groupManagementRepository: Repository<GroupManagement>
  ) {}
  async createGroup(createGroupDto: CreateGroupDto) {
    const { description, groupMembers, groupName, id } = createGroupDto;
    try {
      const newGroup = this.groupRepository.create({
        description,
        groupName,
        id,
        ...groupMembers,
      });

      await this.groupRepository.save(newGroup);
      return newGroup;
    } catch (err) {
      console.log(err);
    }
  }
  async createGroupManagement(
    createGroupManagementDto: CreateGroupManagementDto
  ) {
    const { role, status, permissions } = createGroupManagementDto;
    try {
      const newGroupManagement = this.groupManagementRepository.create({
        role,
        status,
        permissions,
      });

      await this.groupManagementRepository.save(newGroupManagement);
      return newGroupManagement;
    } catch (err) {
      console.log(err);
    }
  }

  findAll() {
    return `This action returns all groups`;
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    return `This action updates a #${id} group`;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }
}
