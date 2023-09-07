import { Injectable } from '@nestjs/common';
import {
  CreateGroupDto,
  CreateGroupManagementDto,
  UpdateGroupManagementDto,
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
        groupMembers,
      });

      await this.groupRepository.save(newGroup);
      return newGroup;
    } catch (err) {
      console.log(err);
    }
  }
  async createGroupManagement(
    createGroupManagementDto: CreateGroupManagementDto,
    group: Group
  ) {
    const { role, status, permissions } = createGroupManagementDto;
    try {
      const newGroupManagement = this.groupManagementRepository.create({
        role,
        status,
        permissions,
        lastSeen: new Date(),
        group,
      });

      await this.groupManagementRepository.save(newGroupManagement);
      return newGroupManagement;
    } catch (err) {
      console.log(err);
    }
  }

  findAllGroups() {
    // TODO: by user
    return `This action returns all groups`;
  }

  async findOneGroup(id: number) {
    try {
      const group = await this.groupRepository.findOneBy({ id });
      return group;
    } catch (err) {
      console.log(err);
    }
  }
  async findOneGroupManagement(id: number) {
    try {
      const group = await this.groupManagementRepository.findOneBy({ id });
      return group;
    } catch (err) {
      console.log(err);
    }
  }

  async updateGroupManagement(
    id: number,
    updateGroupManagementDto: UpdateGroupManagementDto
  ) {
    const { status } = updateGroupManagementDto;
    const groupManagement = this.groupManagementRepository.findOneBy({ id });
    try {
      const newGroupManagement = await this.groupManagementRepository.preload({
        ...groupManagement,
        lastSeen: new Date(),
        status,
      });
      await this.groupManagementRepository.save(newGroupManagement);
      return newGroupManagement;
    } catch (err) {
      console.log(err);
    }
  }
  // update(id: number, updateGroupDto: UpdateGroupDto) {
  //   return `This action updates a #${id} group`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} group`;
  // }
}
