import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { Category } from './category.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Response } from 'src/modules/responses/entities/response.entity';

@Entity('messages')
export class Message {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  message_id: number;

  // @Column('text', { array: true, default: [] })
  // keywords: string[];

  @Column('text')
  content: string;

  @Column('text')
  send_at: string;

  @ManyToOne(() => Contact, (contact) => contact.message)
  contact: Contact;

  @OneToOne(() => Response)
  @JoinColumn()
  response: Response;
  // @Column('text')
  // startTime: string;

  // @Column('text')
  // endTime: string;
  //#endregion Columns

  //#region Relations
  // @ManyToOne(() => User, (user) => user.message)
  // user: User;

  // @ManyToOne(() => TypeMessage, type => type.description)
  // type: TypeMessage;

  // @ManyToOne(() => Category, (category) => category.description)
  // category: Category;
  // contactos
  //#endregion Relations

  //#region Methods
  //#endregion Methods
  //
}
