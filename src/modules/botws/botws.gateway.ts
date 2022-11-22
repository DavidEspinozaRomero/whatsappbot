import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';

import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { BotwsService } from './botws.service';
import { JwtPayload } from '../auth/strategies/jwt.strategy';

@WebSocketGateway({ cors: true, namespace: '/' })
export class BotwsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly botwsService: BotwsService,
    private readonly jwtService: JwtService // private readonly messagesService: MessagesService
  ) {}

  @WebSocketServer() wss: Server;
  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authorization;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.botwsService.registerClient(client, payload.id);
    } catch (error) {
      console.log(error);

      client.disconnect();
      return;
    }
  }

  handleDisconnect(client: any) {
    this.botwsService.removeClient(client);
    console.log('Cliente desconectado:', client.id);
  }

  // async handleConnection(client: Socket, ...args: any[]) {
  //   const token = client.handshake.headers.authorization as string;
  //   let payload: JwtPayload;
  //   try {
  //     payload = this.jwtService.verify(token);
  //     await this.botwsService.registerClient(client, payload.id);
  //   } catch (error) {
  //     client.disconnect();
  //     return;
  //   }

  //   console.log(payload);

  //   // console.log('Cliente conectado:', client.id);
  //   // console.log({ conectados: this.botwsService.getClientsConected() });

  //   this.wss.emit(
  //     'clients-updated',
  //     this.botwsService.getClientsConected(),
  //   );
  // }

  // handleDisconnect(client: Socket) {
  //   this.botwsService.removeClient(client.id);
  //   // console.log('Cliente desconectado:', client.id);
  // }

  // @SubscribeMessage('message-from-client')
  // // @Auth()
  // // @GetUser() user: User
  // onMessageFromClient(client: Socket, payload: any) {
  //   console.log(client.id, payload);

  //   //solo al cliente
  //   // client.emit('message-from-server', {
  //   //   fullName: 'soy yo',
  //   //   message: payload.message,
  //   // });

  //   //a todos menos al cliente
  //   // client.broadcast.emit('message-from-server', {
  //   //   fullName: this.botwsService.getUserFullName(client.id),
  //   //   message: payload.message,
  //   // });

  //   //a todos
  //   this.wss.emit('message-from-server', {
  //     fullName: this.botwsService.getUserFullName(client.id),
  //     message: payload.message,
  //   });
  // }
}
