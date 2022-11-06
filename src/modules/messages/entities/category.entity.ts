import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity('categories')
export class Category {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  description: TypeCategory;
  //#endregion Columns

  //#region Relations
  @OneToMany(() => Message, (message) => message.type)
  message: Message;
  //#endregion Relations

  //#region Methods
  //#endregion Methods
}

export const enum TypeCategory {
  default = 'default',
  family = 'family',
  friend = 'friend',
  bussiness = 'bussiness',
  informative = 'informatevo',
}
