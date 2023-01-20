import { CreateUserDto } from 'src/modules/auth/dto';
import { Category, TypeCategory } from 'src/modules/messages/entities';
import { CreateCategoryDTO } from 'src/modules/messages/entities/create-category.dto';

const Users: CreateUserDto[] = [
  { email: 'test1@gmail.com', password: 'Asdf1234.', username: 'testuser1' },
  { email: 'test2@gmail.com', password: 'Asdf1234.', username: 'testuser2' },
];

const Categories: CreateCategoryDTO[] = [
    { description: TypeCategory.default },
    { description: TypeCategory.bussiness },
    { description: TypeCategory.family },
    { description: TypeCategory.friend },
    { description: TypeCategory.informative },
];

export const initialData = {
  users: Users,
  categories: Categories,
};
