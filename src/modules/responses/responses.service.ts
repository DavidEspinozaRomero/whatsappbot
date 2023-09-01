import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
  CreatePredefinedResponseDto,
  UpdatePredefinedResponseDto,
} from './dto';
import { PredefinedResponse } from './entities';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectRepository(PredefinedResponse)
    private readonly predefinedResponseRepository: Repository<PredefinedResponse>
  ) {}
  // region variables
  // endregion variables

  // region methods
  async createPredefinedResponse(
    createPredefinedResponseDto: CreatePredefinedResponseDto
  ) {
    const { content, state } = createPredefinedResponseDto;
    try {
      const newPredefinedResponse = this.predefinedResponseRepository.create({
        content,
        state,
      });
      await this.predefinedResponseRepository.save(newPredefinedResponse);
      return newPredefinedResponse;
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

  async findOnePredefinedResponseByType(state: string) {
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
  async findAllPredefinedResponseByType(state: string) {
    try {
      const predefinedResponse = await this.predefinedResponseRepository.findBy(
        {
          state,
          isActive: true,
        }
      );
      return predefinedResponse;
    } catch (err) {
      console.log(err);
    }
  }
  async findOnePredefinedResponse(id: number) {
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

  async updatePredefinedResponse(
    id: number,
    updatePredefinedResponseDto: UpdatePredefinedResponseDto
  ) {
    const { content, state } = updatePredefinedResponseDto;
    const predefinedResponse = await this.findOnePredefinedResponse(id);
    try {
      const newPredefinedResponse =
        await this.predefinedResponseRepository.preload({
          ...predefinedResponse,
          content,
          state,
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
