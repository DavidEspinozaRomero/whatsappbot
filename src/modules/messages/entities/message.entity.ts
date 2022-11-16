import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Category } from './category.entity';

@Entity('messages')
export class Message {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('text')
  query: string;

  @Column('text')
  answer: string;

  @Column('text')
  startTime: string;
  
  @Column('text')
  endTime: string;
  //#endregion Columns

  //#region Relations
  @ManyToOne(() => User, (user) => user.message)
  user: User;

  // @ManyToOne(() => TypeMessage, type => type.description)
  // type: TypeMessage;
  
  @ManyToOne(() => Category, category => category.description)
  category: Category;
  // contactos
  //#endregion Relations

  //#region Methods
  //#endregion Methods
  //
}
