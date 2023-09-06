import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  CreateMenuDto,
  CreatePredefinedResponseDto,
  UpdatePredefinedResponseDto,
} from './dto';
import { Action, Menu, PredefinedResponse } from './entities';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(PredefinedResponse)
    private readonly predefinedResponseRepository: Repository<PredefinedResponse>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>
  ) {}
  // region variables
  // endregion variables

  // region methods
  async createPredefinedResponse(
    createPredefinedResponseDto: CreatePredefinedResponseDto
  ) {
    const { content, idAction, state } = createPredefinedResponseDto;

    try {
      const action = await this.actionRepository.findOneBy({ id: idAction });
      const newPredefinedResponse = this.predefinedResponseRepository.create({
        content,
        state,
        actionType: action,
      });
      await this.predefinedResponseRepository.save(newPredefinedResponse);
      return newPredefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }
  async createMenu(createMenuDto: CreateMenuDto) {
    const { order, content, idPredefinedResponse } = createMenuDto;
    try {
      const predefined = await this.findOnePredefinedResponseById(
        idPredefinedResponse
      );
      const newMenu = this.menuRepository.create({
        order,
        content,
        idPredefinedResponse: predefined,
      });
      await this.menuRepository.save(newMenu);
      return newMenu;
    } catch (err) {
      console.log(err);
    }
  }

  async findAllPredefinedResponse() {
    // TODO: by user
    try {
      const predefinedResponses =
        await this.predefinedResponseRepository.find();
      return predefinedResponses;
    } catch (err) {
      console.log(err);
    }
  }
  async findOnePredefinedResponseById(id: number) {
    try {
      const predefinedResponse =
        await this.predefinedResponseRepository.findOneBy({
          id,
        });
      return predefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }
  async findOnePredefinedResponseByState(state: string) {
    try {
      const predefinedResponse =
        await this.predefinedResponseRepository.findOneBy({
          state,
          isActive: true,
        });
      return predefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }
  async findAllPredefinedResponseByAction(idAction: number) {
    try {
      const action = await this.actionRepository.findOneBy({ id: idAction });
      const predefinedResponse = await this.predefinedResponseRepository.findBy(
        {
          actionType: action,
          isActive: true,
        }
      );
      return predefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }

  async findMenu() {
    try {
      const menu = await this.menuRepository.find();
      return menu;
    } catch (err) {
      console.log(err);
    }
  }
  async updatePredefinedResponse(
    id: number,
    updatePredefinedResponseDto: UpdatePredefinedResponseDto
  ) {
    const { content, idAction, state } = updatePredefinedResponseDto;
    try {
      const action = await this.actionRepository.findOneBy({ id: idAction });
      const predefinedResponse = await this.findOnePredefinedResponseById(id);
      const newPredefinedResponse =
        await this.predefinedResponseRepository.preload({
          ...predefinedResponse,
          state,
          content,
          actionType: action,
          updatedAt: new Date(),
        });
      await this.predefinedResponseRepository.save(newPredefinedResponse);
      return newPredefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }

  async removePredefinedResponse(id: number) {
    try {
      const { affected } = await this.predefinedResponseRepository.delete(id);
      if (affected) return `predefined response whit id:${id} removed`;
      return `predefined response whit id:${id} not found`;
    } catch (err) {
      console.log(err);
    }
  }

  // create(createResponseDto: CreateResponseDto) {
  //   return 'This action adds a new response';
  // }

  // findAll() {
  //   return `This action returns all responses`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} response`;
  // }

  // update(id: number, updateResponseDto: UpdateResponseDto) {
  //   return `This action updates a #${id} response`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} response`;
  // }
  // endregion methods
}
