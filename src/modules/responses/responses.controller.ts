import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import {
  CreatePredefinedResponseDto,
  UpdatePredefinedResponseDto,
} from './dto';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post('predefined')
  createPredefined(
    @Body() createPredefinedResponseDto: CreatePredefinedResponseDto
  ) {
    return this.responsesService.createPredefinedResponse(
      createPredefinedResponseDto
    );
  }

  @Get('predefined')
  findAllPredefined() {
    return this.responsesService.findAllPredefinedResponse();
  }

  @Get('predefined:id')
  findOnePredefined(@Param('id') id: string) {
    return this.responsesService.findOnePredefinedResponseById(+id);
  }

  @Patch('predefined:id')
  updatePredefined(
    @Param('id') id: string,
    @Body() updatePredefinedResponseDto: UpdatePredefinedResponseDto
  ) {
    return this.responsesService.updatePredefinedResponse(
      +id,
      updatePredefinedResponseDto
    );
  }

  @Delete('predefined:id')
  removePredefined(@Param('id') id: string) {
    return this.responsesService.removePredefinedResponse(+id);
  }

  // @Post()
  // create(@Body() createResponseDto: CreateResponseDto) {
  //   return this.responsesService.create(createResponseDto);
  // }

  // @Get()
  // findAll() {
  //   return this.responsesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.responsesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateResponseDto: UpdateResponseDto) {
  //   return this.responsesService.update(+id, updateResponseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.responsesService.remove(+id);
  // }
}
