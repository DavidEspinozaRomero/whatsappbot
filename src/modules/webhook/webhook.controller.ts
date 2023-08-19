import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { SendMessageDto, SendMessageToContactDto } from './dto';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  // @Post()
  // create(@Body() createWebhookDto: CreateWebhookDto) {
  //   return this.webhookService.create(createWebhookDto);
  // }

  @Post('send-message')
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.webhookService.sendMessage(sendMessageDto);
  }

  @Post('send-message-contact')
  sendMessageToContact(
    @Body() sendMessageToContactDto: SendMessageToContactDto
  ) {
    return this.webhookService.sendMessageToContact(sendMessageToContactDto);
  }

  // @Get()
  // findAll() {
  //   return this.webhookService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.webhookService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebhookDto: UpdateWebhookDto) {
  //   return this.webhookService.update(+id, updateWebhookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.webhookService.remove(+id);
  // }
}
