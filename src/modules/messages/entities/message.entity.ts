import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { User } from '../../auth/entities/user.entity';
// import { Category } from './category.entity';
import { Contact } from '../../contacts/entities/contact.entity';
import { Response } from 'src/modules/responses/entities/response.entity';

@Entity('messages')
export class Message {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: number;

  // @Column('text', { array: true, default: [] })
  // keywords: string[];

  @Column('text')
  content: string;

  @Column('bool')
  hasMedia: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  send_at: Date;


  // @Column('text')
  // startTime: string;

  // @Column('text')
  // endTime: string;
  //#endregion Columns

  //#region Relations
  @ManyToOne(() => Contact, (contact) => contact.message)
  contact: Contact;

  @OneToOne(() => Response)
  @JoinColumn()
  response: Response;

  // @ManyToOne(() => User, (user) => user.message)
  // user: User;

  //#endregion Relations

  //#region Methods
  //#endregion Methods
  
}
