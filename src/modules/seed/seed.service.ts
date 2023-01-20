import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { MessagesService } from '../messages/messages.service';

import { initialData } from './data/initialData';

@Injectable()
export class SeedService {
  constructor(
    private authService: AuthService,
    private messagesService: MessagesService
  ) {}

  async init() {
    await this.#insertCategories();
    await this.#insertUsers();
    return { message: 'init seed ejecuted 1' };
  }

  async #insertUsers() {
    const seedUsers = initialData.users;
    seedUsers.forEach((user) => {
      this.authService.create(user);
    });
    return { message: 'insertUsers seed ejecuted' };
  }

  async #insertCategories() {
    const seedCategories = initialData.categories;
    seedCategories.forEach((category) => {
      const { description } = category;
      this.messagesService.addCategory(description);
    });
    return { message: 'insertCategories seed ejecuted' };
  }
}
