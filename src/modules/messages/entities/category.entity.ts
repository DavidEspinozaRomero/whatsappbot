import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity('categories')
export class Category {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text', { unique: true })
  description: TypeCategory;
  //#endregion Columns

  //#region Relations
  // @OneToMany(() => Message, (message) => message.category)
  // message: Message;
  //#endregion Relations

  //#region Methods
  //#endregion Methods
}

export const enum TypeCategory {
  default = 'default',
  family = 'family',
  friend = 'friend',
  bussiness = 'bussiness',
  informative = 'informative',
}
