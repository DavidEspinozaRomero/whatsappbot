import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity('type_messages')
export class TypeMessage {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  description: string;
  //#endregion Columns

  //#region Relations
  @OneToMany(() => Message, (message) => message.type, {
    onDelete: 'CASCADE',
  })
  message: Message;

  // contactos
  //#endregion Relations

  //#region Methods
  //#endregion Methods
}
