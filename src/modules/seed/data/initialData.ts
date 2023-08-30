import { CreateUserDto } from 'src/modules/auth/dto';
// import { CreateMessageDto } from 'src/modules/messages';
// import { Category, TypeCategory } from 'src/modules/messages/entities';
// import { CreateCategoryDTO } from 'src/modules/messages/dto/create-category.dto';

const Users: CreateUserDto[] = [
  { email: 'test1@gmail.com', password: 'Asdf1234.', username: 'testuser1' },
  { email: 'test2@gmail.com', password: 'Asdf1234.', username: 'testuser2' },
];

// const Categories: CreateCategoryDTO[] = [
//   { description: TypeCategory.default },
//   { description: TypeCategory.bussiness },
//   { description: TypeCategory.family },
//   { description: TypeCategory.friend },
//   { description: TypeCategory.informative },
// ];

// const Messages: CreateMessageDto[] = [
//   {
//     answer: 'hola',
//     keywords: ['Hola! Bienvenido'],
//     category: 2,
//     startTime: '08:00',
//     endTime: '20:00',
//   },
//   {
//     answer: 'precio',
//     keywords: ['el precio es de 5.00$'],
//     category: 1,
//     startTime: '06:00',
//     endTime: '18:00',
//   },
//   {
//     answer: 'como estas',
//     keywords: ['Hola! Todo bien gracias y tu como estas?'],
//     category: 3,
//     startTime: '10:00',
//     endTime: '22:00',
//   },
//   {
//     answer: '',
//     keywords: ['Hola! atendemos de 8Am a 8Pm'],
//     category: 2,
//     startTime: '20:00',
//     endTime: '8:00',
//   },
// ];

export const initialData = {
  users: Users,
  // categories: Categories,
  // messages: Messages,
};
