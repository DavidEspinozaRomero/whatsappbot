import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { TypeMessage } from './typeMessage.entity';

@Entity('messages')
export class Message {
  //#region Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    default: null,
  })
  query: string;

  @Column('text')
  message: string;

  @Column('text', {
    default: 'default',
  })
  category: string;

  // @Column('bool', {
  //   default: false,
  // })
  // type: boolean;

  @Column('timestamp with time zone', {
    default: null,
  })
  date: string;
  //#endregion Columns

  //#region Relations
  @ManyToOne(() => User, (user) => user.message)
  user: User;

  @ManyToOne(() => TypeMessage, {
    cascade: true,
    eager: true,
  })
  type: TypeMessage;

  // contactos
  //#endregion Relations

  //#region Methods
  //#endregion Methods
  //
}
