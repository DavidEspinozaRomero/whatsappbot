import {
  Column,
  Entity,
  // JoinColumn,
  // ManyToOne,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// import { Contact } from '../../contacts/entities/contact.entity';
// import { User } from '../../auth/entities/user.entity';

@Entity('scheduledMessages')
export class ScheduledMessage {
  //#region Columns
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  content: string;

  @Column('bool', { default: false })
  frecuency: boolean; // frequency [Single, Continuous]

  @Column('text', { default: 'n/a' })
  type: string; // (e.g., notification, reminder)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  scheduledTime: Date; // (Date and time when the message should be sent)

  @Column('bool', { default: true })
  isActive: boolean;

  // @Column('bool')
  // hasMedia: boolean;
  // @Column('text')
  // mediaId: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // createdAt: Date;
  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // updatedAt: Date;

  // @Column('text', { array: true })
  // recipient: string[]; // (contactsID)
  @Column('text')
  recipient: string; // (contactID)

  //#endregion Columns

  //#region Relations
  // createdBy (User ID who scheduled the message)
  // @ManyToOne(() => User, (user) => user.id)
  // contact: User;

  // @OneToOne(() => Response)
  // @JoinColumn()
  // response: Response;

  // @ManyToOne(() => User, (user) => user.message)
  // user: User;

  //#endregion Relations

  //#region Methods
  //#endregion Methods
}
