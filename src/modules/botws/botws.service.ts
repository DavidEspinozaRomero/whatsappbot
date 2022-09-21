import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class BotwsService {
  private conectedClients: ConectedClients = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

 async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('user not found');
    if (!user.isActive) throw new Error('user not active');
    this.checkUserConnection(user)
    this.conectedClients[client.id] = { socket: client, user };
  }

  removeClient(clientId: string) {
    delete this.conectedClients[clientId];
  }

  getClientsConected(): string[] {
    return Object.keys(this.conectedClients);
  }

  getUserFullName(socketId: string) {
    return this.conectedClients[socketId].user.fullName;
  }

  checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.conectedClients)) {
      const conectedClient = this.conectedClients[clientId];

      if (conectedClient.user.id === user.id) {
        conectedClient.socket.disconnect();
        break
      }
    }
  }
}

interface ConectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    // mobile?: boolean;
    // descktop?: boolean;
  };
}